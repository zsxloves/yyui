import React, { useEffect, useImperativeHandle } from 'react';
import { message } from 'antd';
import { querySolution, queryLngLat } from './service';
let map: any = null;
let leftTreeObj: any = {};
let graphicLayerObj: any = {}; // 摄像机图层
let graphicMn: any = null; // 模拟图层
let graphicGps: any = null; // gps跟踪图层
let graphicGpsModel: any = null; // gps模型图层
let graphicMy: any = null; // 漫游图层
let graphicMycar: any = null; // 漫游车辆图层
let modelNow = false;
let myNow = false; // 漫游
let endIndex: any = 0;
let timer: any = null // 模拟的时间循环
const gpsTimes: any = null // gps时间循环
let timeOutArr: any = []
let myTimeOutArr: any = [] // 漫游时间存储器
let nowMyIndex: any = 0 // 漫游index存储
let myArrTimeLine: any = [] // 漫游速度和时间存储
let selectLayers: any = []
// const aLinePositon: any = {} // 保存线路的坐标可开启漫游
let nowLines: any = [] // 当前点击模拟的路径
let newSpeed: any = [] // 当前模拟速度存储
let newSpeedNum: any = [] // 存储速度节点
// let myType: any = 'dy' // 漫游视角设置
let myType: any = 'gs' // 漫游视角设置
let endNum: any = 0 // 数字最后存储
let oldIndex: any = -2 // 存储旧数据
let newOldIndex: any = -1 // 监听键盘下落时侯
const mars3D = mars3d
const CesiuM = Cesium
let roamLine: any = null
let allVideos: any = [] // 存储所有的视频id信息
// let sjName: any = 'dy' // 开始视角
let sjName: any = 'gs' // 开始视角
// let firstGPSPosition: any = [] // gps导航前一个坐标存储
let nowTimeLatLng: any = [] // 实时经纬度
let contentType: any = '0' // 自动当前选择
interface Props {
    setLeftObj: (arr: any) => void,
    videoSet: (index: any, arr: any, type: any, src?: any) => void
}

interface RefTypes {
    setLine: (arr: any) => void,
    clearAllya: () => void,
    setMndh: () => void,
    setGzxl: (id: any) => void,
    setBgLayer: (val: any) => void,
    setMy: () => void,
    clearLines: () => void,
    changeCar: () => void,
    clearOtherMy: () => void,
    changeType: (val: any) => void
}
const Mars3DMap = React.forwardRef<RefTypes, Props>((props, ref) =>{
    const initmars3D = (mapOptions: any) => {
        const centerPosition = { lat: 30.2349677, lng: 120.2288892, alt: 3000, heading: 0, pitch: -90 };
        const newmapOptions = mars3D.Util.merge(mapOptions, {
          scene: {
            center: centerPosition,
            sceneMode: 3,
            fxaa: true, // 不开启抗锯齿，可视域会闪烁
            globe: {
              depthTestAgainstTerrain: false // 不加无法投射到地形上
            }
          },
        });
    
        //创建三维地球场景
        map = new mars3D.Map('cesiumContainerAb', newmapOptions);
        // console.log(map)
        map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。
        graphicMn = new mars3D.layer.GraphicLayer({
            name: '模拟点位图层',
            zIndex: 100
        });
        map.addLayer(graphicMn)
        graphicGps = new mars3D.layer.GraphicLayer({
            name: 'GPS图层',
            zIndex: 100
        });
        map.addLayer(graphicGps)
        graphicMy = new mars3D.layer.GraphicLayer({
            name: '漫游图层',
            zIndex: 999,
        });
        graphicMycar = new mars3D.layer.GraphicLayer({
            name: '漫游车辆图层',
            zIndex: 9999,
        });
        map.addLayer(graphicMy)
        map.addLayer(graphicMycar)
        graphicGpsModel = new mars3D.layer.GraphicLayer({
            name: 'GPS模型图层',
            zIndex: 108,
        });
        map.addLayer(graphicGpsModel)
    }
    useEffect(() => {
        const mapUrl = '/config/config.json';

        mars3D.Resource.fetchJson({ url: mapUrl }).then((data: any) => {
            initmars3D(data.map3d); // 构建地图
        });
    }, []);
    
    // 加载3d模型
    const loadModel = (entity: any, layerGrap: any) => {
        let rotax = 0;
        let rotay = 0;
        let rotaz = 0;
        if (entity instanceof Array || (entity instanceof Object && Object.keys(entity).length === 0))
        return;
        if (entity?.offset?.pitch) {
        rotax = parseInt(entity.offset.pitch);
        } else {
        rotax = 0;
        }
        if (entity?.offset?.roll) {
        rotay = parseInt(entity.offset.roll);
        } else {
        rotay = 0;
        }
        if (entity?.offset?.heading) {
        rotaz = parseInt(entity.offset.heading);
        } else {
        rotaz = 0;
        }
        const eventTarget = new mars3D.BaseClass();
        try {
            const position = entity.position
            ? entity.position
            : entity.offset
            ? { lng: entity?.offset?.x, lat: entity?.offset?.y, alt: entity?.offset?.z }
            : {}
            if (Object.keys(position).length === 0) {
                console.log('后台模型数据配置错误')
                // message.error('后台模型数据配置错误');
                return ''
            }
            // eslint-disable-next-line no-param-reassign
            layerGrap = new mars3D.layer.TilesetLayer({
                ...entity,
                center: map.getCameraView(),
                position: position,
                rotation: entity.rotation ? entity.rotation : { x: rotax, y: rotay, z: rotaz },
                show: true,
            });
        } catch (e: any) {
            console.log(e);
            console.log('后台数据配置错误')
            // message.error('后台数据配置错误');
        }
            map.addLayer(layerGrap);
            layerGrap.on(mars3D.EventType.load, function (event: any) {
            const dataV = event.tileset;
            const lay = layerGrap;
            eventTarget.fire('tiles3dLayerLoad', { dataV, lay });
        });
        return layerGrap;
    };
    const setBgLayer = (res: any) => {
        const result = res.data.rows
        selectLayers = {}
        if (result.length) {
            result.forEach((item: any) => {
                console.log(item)
                const enetity = JSON.parse(item.entity||"{}")
                if (enetity)
                enetity.id = item.id
                selectLayers[item.id] = ''
                if (enetity.type === '3dtiles' && item.isDefult === '1') {
                    // 模型加载
                    selectLayers[item.id] = loadModel(enetity, selectLayers[item.id])
                } else if (item.isDefult === '1') { // enetity.type === 'xyz' && 
                    // 瓦片图层
                    try {
                        const newEntity = enetity
                        newEntity.show = true
                        const layer = mars3D.LayerUtil.create(newEntity)
                        selectLayers[item.id] = layer
                        map.addLayer(selectLayers[item.id])
                    } catch (e: any) {
                        message.error(e.message || '')
                    } 
                }
            })
        }
    }
    // 设置html添加
    const innerHtml = (info: any, graphic: any) => {
        let innerBindPop = ''
        let innerTooltip = ''
        const topTip = '<div class="safetyinfo">'+
        '<div class="top_line"></div>'+
        '<div class="top_block"></div>'+
        '<div class="left_line"></div>'+
        '<div class="left_block"></div>'+
        '<div class="info_left_line"></div>'+
        '<div class="info_left"></div>'
        innerTooltip += topTip + '<div class="info_content" style="display: block;">';
        innerBindPop += topTip + '<div class="info_close" title="关闭"><span class="info_close_ab">X</span></div>' +
        '<div class="info_content" style="display: block;">';
        if (info && info.length) {
        info.forEach((item: any, index: number) => {
            innerBindPop += `<div class="info_key">${item.first}: <span class="info_value info-policestask">${item.last}</span></div>`
            if (index < 3) {
            innerTooltip += `<div class="info_key">${item.first}: <span class="info_value info-policestask">${item.last}</span></div>`
            }
        })
        }
        const params = {
        id: graphic.options?.attr.data.id
        }
        querySolution(params).then((res: any) => {
        const resultNow = res.data.solutionPersonList
        if (resultNow.length) {
            innerTooltip += `<div class="info_key"><p class="lastTitle small">岗点人员：</p>`+
            `<p class="lastTitle large">`
            innerBindPop += `<div class="info_key"><p class="lastTitle small">岗点人员：</p>`+
            `<p class="lastTitle large">`
            resultNow.forEach((ress: any) => {
            let number = ''
            if (ress.phoneNumber) {
                number = ress.phoneNumber
            }
            const paramP = `<span class="lastSpan" style="color:#fff;background:rgba(255,255,255,0.6);padding:0 4px;margin:10px;">${ress.personName} ${number}</span>`
            innerTooltip += paramP
            innerBindPop += paramP
            })
            innerTooltip += '</p></div></div>'+
                '<div class="info_right_line"></div>'+
                '<div class="info_right"></div>'+
                '<div class="info_bottom"></div>'+
                '<div class="bottom_one"></div>'+
                '<div class="bottom_two"></div>'+
                '<div class="bottom_three"></div>'+
                '<div class="bottom_four"></div>'+
            '</div>';
            innerBindPop += '</p></div></div>'+
            '<div class="info_right_line"></div>'+
            '<div class="info_right"></div>'+
            '<div class="info_bottom"></div>'+
            '<div class="bottom_one"></div>'+
            '<div class="bottom_two"></div>'+
            '<div class="bottom_three"></div>'+
            '<div class="bottom_four"></div>'+
        '</div>';
        } 
        if (resultNow.length || (info && info.length)) {
            // bindPopup
            graphic.bindTooltip(
            function () {
                return innerTooltip;
            },
            {
                direction: 'top',
                offsetY: -20,
                template: false
            },
            );
            // bindPopup
            graphic.bindPopup(
            function () {
                return innerBindPop;
            },
            {
                direction: 'top',
                offsetY: -20,
                template: false
            },
            );
        }
        }).catch(() => {
        if (info && info.length) {
            // bindPopup
            graphic.bindTooltip(
            function () {
                return innerTooltip;
            },
            {
                direction: 'top',
                offsetY: -20,
                template: false
            },
            );
            // bindPopup
            graphic.bindPopup(
            function () {
                return innerBindPop;
            },
            {
                direction: 'top',
                offsetY: -20,
                template: false
            },
            );
        }
        })
    }
    // 提取所有路线摄像机
    const getAllCarmer = (graphics: any, path: any, arr: any) => {
        graphics.eachGraphic((graphic: any) => {
            let isInArea = false
            // console.log(indexs, graphic.options.position)
            const positionOne = graphic.positionShow
            const nowsPotion = new mars3D.LatLngPoint.fromCartesian(positionOne)
            const distanceOne = mars3D.MeasureUtil.getDistance([
                new mars3D.LatLngPoint(path.lng, path.lat, 0),
                new mars3D.LatLngPoint(nowsPotion.lng, nowsPotion.lat, 0),
            ]);
            console.log(distanceOne)
            if (distanceOne > 100) {
                isInArea = false
            } else {
                isInArea = true
            }
            if (isInArea) {
                console.log('11111')
                // console.log(graphic) 
                // if (endIndex < indexs + 1) {
                //     endIndex = indexs + 1
                // }
                const result = graphic.options.attr
                if (result.type === 'dhlw') {
                    arr.dhSrc.push(result.id)
                } else if (result.type === 'HLS') {
                    arr.hkSrc.push(result.id)
                }
                // console.log(result)
            }  
        })
    }
    // 实时定位使用
    const getCarmerGps = (drawGraphic: any, id: any, type: any, name?: any) => {
        const arr: any = {
            hkSrc: [],
            dhSrc: []
        }
        if (name) {
            if (oldIndex === allVideos.length - 1) {
                return
            }
            let index = 0
            let nowIndex = 0
            allVideos.forEach((item: any, indexs: any) => {
                const distanceOne = mars3D.MeasureUtil.getDistance([
                    new mars3D.LatLngPoint(nowTimeLatLng[0], nowTimeLatLng[1], 0),
                    new mars3D.LatLngPoint(item.lon, item.lat, 0),
                ]);
                if (distanceOne < 200) {
                    if (item.videoTypeName === 'dhlw') {
                        arr.dhSrc.push(item.videoId)
                    } else if (item.videoTypeName === 'HLS') {
                        arr.hkSrc.push(item.videoUrl)
                    }
                    if (index < indexs ) {
                        index = indexs
                    }
                    nowIndex++
                }
            })
            // console.log(nowIndex)
            if (nowIndex > 0) {
                // console.log(index, oldIndex)
                if (oldIndex === index) {
                    return
                }
                oldIndex = index
                // debugger
                if (index !== allVideos.length - 1) {
                    const lastVideo = allVideos[index+1]
                    console.log(lastVideo)
                    if (lastVideo.videoTypeName === 'dhlw') {
                        arr.dhSrc.push(lastVideo.videoId)
                    } else if (lastVideo.videoTypeName === 'HLS') {
                        arr.hkSrc.push(lastVideo.videoUrl)
                    }
                }
                console.log(index, arr)
                // if (type === '1') return
                props.videoSet(index, arr, contentType)
            }
        } else {
            graphicLayerObj[id].eachGraphic((graphic: any, indexs: any) => {
                // console.log(indexs, graphic.options.position)
                const positionOne = graphic.positionShow
                const isInArea = drawGraphic.isInPoly(positionOne)
                if (isInArea) {
                    console.log('11111')
                    // console.log(graphic) 
                    if (endIndex < indexs + 1) {
                        endIndex = indexs + 1
                    }
                    const result = graphic.options.attr
                    if (result.type === 'dhlw') {
                        arr.dhSrc.push(result.id)
                    } else if (result.type === 'HLS') {
                        arr.hkSrc.push(result.id)
                    }
                    // console.log(result)
                }  
            })
            if (arr.length) {
                props.videoSet(endIndex, arr, contentType)
            }
        }
    }
    // 开启定时查询圈内摄像机  模拟使用
    const getCarmerIn = (drawGraphic: any, id: any, timeEnd: any, name?: any) => {
        // debugger
        if (timer) {
            clearInterval(timer)
        }
        let time = 0
        timer = setInterval(function() {
            console.log('1')
            if (time >= timeEnd) {
                clearInterval(timer)
            }
            time ++
            // const arr: any = {
            //     hkSrc: [],
            //     dhSrc: []
            // }
            // graphicLayerObj[id].eachGraphic((graphic: any, indexs: any) => {
            //     console.log(indexs, graphic.options.position)
            //     const positionOne = graphic.positionShow
            //     const isInArea = drawGraphic.isInPoly(positionOne)
            //     if (isInArea) {
            //         // console.log(graphic) 
            //         if (endIndex < indexs + 1) {
            //             endIndex = indexs + 1
            //         }
            //         const result = graphic.options.attr
            //         if (result.type === 'dhlw') {
            //             arr.dhSrc.push(result.id)
            //         } else if (result.type === 'HLS') {
            //             arr.hkSrc.push(result.id)
            //         }
            //         // console.log(result)
            //     }
            // })
            // props.videoSet(endIndex, arr)
            if (name) {
                getCarmerGps(drawGraphic, id, contentType, 'yuan')
            } else {
                getCarmerGps(drawGraphic, id, contentType)
            }
        }, 1000)
    }
    const getAllCamerIn = () => {
        const arr: any = {
            hkSrc: [],
            dhSrc: []
        }
        if (allVideos[0].videoTypeName === 'dhlw') {
            arr.dhSrc.push(allVideos[0].videoId)
        } else if (allVideos[0].videoTypeName === 'HLS') {
            arr.hkSrc.push(allVideos[0].videoUrl)
        }
        props.videoSet('', arr, contentType)
        if (timer) {
            clearInterval(timer)
        }
        timer = setInterval(function() {
            getCarmerGps('', '', contentType, 'yuan')
        }, 1000)
    }
    // 添加图标点
    const addPoint = (item: any, layer: any) => {
        // debugger
        map.addLayer(layer)
        let imgSrc = ''
        if (item.cameraType === '1') {
            imgSrc = '/img/mapImg/qjLine.svg';
          } else if (item.cameraType === '2') {
            imgSrc = '/img/mapImg/qqLine.svg';
          } else if (item.cameraType === '3') {
            imgSrc = '/img/mapImg/bqLine.svg';
          } else if (item.cameraType === '4') {
            imgSrc = '/img/mapImg/bqLine.svg';
          } else {
            imgSrc = '/img/mapImg/qjLine.svg';
          }
        const spPoint = new mars3D.graphic.BillboardEntity({
            name: item.videoName,
            position: [item.lon, item.lat, item.height],
            // position: [120.227015, 30.232975, 0],
            style: {
                image: imgSrc,
                scale: 1,
                pixelOffset: new CesiuM.Cartesian2(0, 0), //偏移量
                horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
                verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
                visibleDepth:false
            },
            attr: {
                type: item.videoTypeName,
                id: item.videoId,
                src: item.videoUrl
            }
        });
        layer.addGraphic(spPoint);
        spPoint.bindTooltip(
            function () {
                const innerTooltip = `<div class="xlabTooltip">${item.videoName}</div>`
              return innerTooltip;
            },
            {
              direction: 'top',
              offsetY: -20,
              template: false
            },
          );
    }
    const getPoint = (item: any) => {
        return CesiuM.Cartesian3.fromDegrees(item[0], item[1], item[2])
    }
    // 清除老摄像机
    const clearCamera = () => {
        for (const key in graphicLayerObj) {
            map.removeLayer(graphicLayerObj[key])
        }
        graphicLayerObj = {}
    }
    const addParam = (nowPositions: any, index: any, nowTime: any, speed: any) => {
        const paramOne = {
            path: nowPositions.slice(nowMyIndex,index),
            time: nowTime,
            speed: speed
        }
        nowMyIndex = index
        myArrTimeLine.push(paramOne)
    }
    const changePosition = (nowPositions: any) => {
        console.log(nowPositions, newSpeed, newSpeedNum)
        nowMyIndex = 0
        myArrTimeLine = []
        // const speed = 60;
        let nowTime = 0
        let speed = 60
        let oldSpeed = 60
        const newSpeedNumSet: any = []
        newSpeedNum.forEach((item: any, index: number) => {
            if(index !== (newSpeedNumSet.length - 1)) {
                newSpeedNumSet.push(item)
            }
        })
        const positions = nowPositions.map((items: any, index: any) => {
            if (index !== 0) {
                const distanceOne = mars3D.MeasureUtil.getDistance([
                    new mars3D.LatLngPoint(nowPositions[index-1][0], nowPositions[index-1][1], 0),
                    new mars3D.LatLngPoint(nowPositions[index][0], nowPositions[index][1], 0),
                ]);
                oldSpeed = speed
                newSpeedNum.some((item: any, newIndex: any) => {
                    if (index < item || index === item) {
                        speed = Number(newSpeed[newIndex])
                        return true
                    } else {
                        return false
                    }
                })
                console.log(speed)
                const timeOne = (distanceOne / 1000 / speed) * 60 * 60
                if (index !== 1) {
                    // debugger
                    const distanceTwo = mars3D.MeasureUtil.getDistance([
                        new mars3D.LatLngPoint(nowPositions[index-2][0], nowPositions[index-2][1], 0),
                        new mars3D.LatLngPoint(nowPositions[index-1][0], nowPositions[index-1][1], 0),
                    ]);
                    let timeTwo = 0
                    if (newSpeedNumSet.indexOf(index - 1) === -1) {
                        timeTwo = ((distanceTwo / 1000 / speed) * 60 * 60) * 1000
                        nowTime += timeTwo
                        if (index === nowPositions.length - 1) {
                            addParam(nowPositions, index + 1, nowTime, speed)
                        }
                    } else {
                        timeTwo = ((distanceTwo / 1000 / oldSpeed) * 60 * 60) * 1000
                        nowTime += timeTwo
                        // console.log(nowTime,index)
                        addParam(nowPositions, index, nowTime, oldSpeed)
                    }
                }
                return [items[0], items[1], 0, timeOne, nowTime]
            } else {
                return [items[0], items[1], 0]
            }
        })
        console.log(positions, myArrTimeLine)
        return positions
    }
    // 漫游线路加载
    const myLines = (speed: any,positions: any) => {
        graphicMycar.clear()
        const circleGraphic = new mars3D.graphic.CircleEntity({
            style: {
              radius: 100,
              height: 0,
              color: "#ffff00",
              opacity: 0.3,
              clampToGround: true
            }
        })
        graphicMy.addGraphic(circleGraphic)
        const flydata = {
            name: "贴地表表面漫游",
            speed: speed,
            // positions: event.graphic.options.positions,
            positions: positions,
            model: {
              url: "/qiche.gltf",
              heading: 0,
              minimumPixelSize: 20,
              show: true,
              scale: 0.1
            },
            path: {
              color: "#ffff00",
              width: 3,
              show: true
            },
            camera: {
              type: myType,
              pitch: -30,
              radius: 500
            },
            // circle: {
            //     radius: 100,
            //     height: 0,
            //     color: "#ffff00",
            //     show: true,
            //     opacity: 0.3,
            //     clampToGround: true
            // },
            interpolation: false, // 是否setInterpolationOptions插值
            clockLoop: false, // 是否循环播放
            // offset: 10 // 当clampToGround计算时，可以按需增加偏移高度（单位：米），便于可视
        }
        roamLine = new mars3D.graphic.RoamLine(flydata)
        graphicMycar.addGraphic(roamLine)
                            
        const carContent = '<div class="carPopup">'+
        '<div class="title">车辆</div>'+
        '<div class="attr">车型：小轿车</div>'+
        '<div class="attr">车牌：浙AH8659</div>'+
        '<div class="attr">车速：' + speed +
        ' km</div></div>'
        roamLine.bindPopup(
            function () {
              return carContent;
            },
            {
              direction: 'top',
              offsetY: 0,
              template: false,
              clampToGround: true
            },
        );
        roamLine.start()
        roamLine.on(mars3d.EventType.change, (event: any) => {
            //面板显示相关信息
            nowTimeLatLng = [event.lng, event.lat]
          });
        setTimeout(() => {
            roamLine.openPopup()
        }, 100);
    }
    // 获取多段时间延时加载汽车模型路线

    // 获取线路
    const setLines = (arr: any) => {
        clearCamera()
        if (!arr.length) return
        arr.forEach((item: any) => {
            const entity = JSON.parse(item.entity||"{}")
            const json = entity.GeoJSON;
            leftTreeObj[item.id] = new mars3D.layer.GraphicLayer({
                name: item.name,
                zIndex: 10
            });
            leftTreeObj[item.id + '3dTiles'] = ''
            map.addLayer(leftTreeObj[item.id])
            try {
              const new3dLayer = JSON.parse(entity?.modelTreeData?.data?.entity||"{}")
              new3dLayer.id = entity?.modelTreeData?.data?.id || ''
              leftTreeObj[item.id + '3dTiles'] = loadModel(new3dLayer, leftTreeObj[item.id + '3dTiles'])
            } catch (error) {
              console.log(error)
            }
            const options = {
              clear: true
              // flyTo: true
            }
            if (!json) {
              return
            }
            graphicLayerObj[item.id] =  new mars3D.layer.GraphicLayer();
            if (item?.videoList?.length) {
                allVideos = allVideos.concat(item.videoList)
                item.videoList.forEach((items: any) => {
                    addPoint(items, graphicLayerObj[item.id])
                })
            }
            leftTreeObj[item.id].loadGeoJSON(json, options)
            leftTreeObj[item.id].eachGraphic((graphic: any, graphicIndex: number) => {
                const graphicData = graphic.options?.attr?.data?.entity
                if (graphicData) {
                  const info = JSON.parse(graphicData||"{}").info?.self
                  // if (info && info.length) {
                    innerHtml(info, graphic)
                  // }
                }
                if (leftTreeObj[item.id].options.name !== "线路安保") return
                let graphicPosition = []
                if (graphicIndex === 0 ) {
                    graphicPosition = graphic.options.positions
                } else {
                    graphicPosition = graphic.options.positions.shift()
                }
                // aLinePositon[item.id] = graphic.options.positions
                nowLines = nowLines.concat(graphicPosition)
                console.log(nowLines)
            })
            leftTreeObj[item.id].eachGraphic((graphic: any) => {
                graphic.on(mars3D.EventType.click, function (event: any) {
                    console.log(new mars3D.LatLngPoint.fromCartesian(event.cartesian))
                    // 判断是否为线
                    if (event.graphic.options.type === 'polyline' && leftTreeObj[item.id].options.name === "线路安保") {
                        endIndex = 0
                        if (timer) {
                            clearInterval(timer)
                            console.log(timer)
                        }
                        timeOutArr.forEach((timeItem: any) => {
                            clearTimeout(timeItem)
                        })
                        timeOutArr = []
                        myTimeOutArr.forEach((timeItems: any) => {
                            clearTimeout(timeItems)
                        })
                        myTimeOutArr = []
                        if (modelNow) {
                            props.setLeftObj(item.videoList)
                            graphicMn.clear()
                            const newGraphic = new mars3D.graphic.BillboardEntity({
                                style: {
                                    image: "/img/cj.png",
                                    scale: 2,
                                    clampToGround: true,
                                    // horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                    // verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                                    // scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.1)
                                    visibleDepth:false
                                },
                            })
                            graphicMn.addGraphic(newGraphic)
                            const circleGraphic = new mars3D.graphic.CircleEntity({
                                style: {
                                  radius: 100,
                                  height: 0,
                                  color: "#ffff00",
                                  opacity: 0.3,
                                  clampToGround: true
                                }
                            })
                            graphicMn.addGraphic(circleGraphic)
                            const carContent = `<div class="carPopup">
                            <div class="title">车辆</div>
                            <div class="attr">车型：小轿车</div>
                            <div class="attr">车牌：浙AH8659</div>
                            <div class="attr">车速：60 km</div></div>`
                            newGraphic.bindPopup(
                                function () {
                                  return carContent;
                                },
                                {
                                  direction: 'top',
                                  offsetY: 0,
                                  template: false,
                                  clampToGround: true
                                },
                            );
                            // const nowPositions = event.graphic.options.positions
                            // nowLines = nowPositions
                            const positions = changePosition(nowLines)
                            // 设置动态位置
                            // graphicMn.eachGraphic((graphic) => {
                            //     graphic.addDynamicPosition(getPoint(positions[0])) // 首次出现的位置
                            // })
                            // graphicMn.eachGraphic((graphic) => {
                            //     graphic.addDynamicPosition(getPoint(positions[1]), 3) // 按20秒运动至指定位置
                            // })
                            const lengths = positions.length
                            newGraphic.addDynamicPosition(getPoint(positions[0]))
                            circleGraphic.addDynamicPosition(getPoint(positions[0]))
                            for(let i = 1; i < lengths; i++) {
                                timeOutArr[i - 1] = setTimeout( function () {
                                    newGraphic.addDynamicPosition(getPoint([positions[i][0], positions[i][1], 0]), positions[i][3])
                                    circleGraphic.addDynamicPosition(getPoint([positions[i][0], positions[i][1], 0]), positions[i][3])
                                    getCarmerIn(circleGraphic, item.id, positions[i][3])
                                    newGraphic.openPopup()
                                }, positions[i][4])
                            }
                        } else if (myNow) {
                            oldIndex = -1
                            graphicMy.clear()
                            graphicMycar.clear()
                            props.setLeftObj(item.videoList)
                            const circleGraphic = new mars3D.graphic.CircleEntity({
                                style: {
                                  radius: 100,
                                  height: 0,
                                  color: "#ffff00",
                                  opacity: 0.3,
                                  clampToGround: true
                                }
                            })
                            graphicMy.addGraphic(circleGraphic)
                            // const nowPositions = event.graphic.options.positions

                            // nowLines = nowPositions
                            const positions = changePosition(nowLines)
                            const lengths = positions.length
                            
                            circleGraphic.addDynamicPosition(getPoint(positions[0]))

                            
                            myTimeOutArr = []
                            for(let i = 1; i < lengths; i++) {
                                // eslint-disable-next-line @typescript-eslint/no-loop-func
                                timeOutArr[i - 1] = setTimeout( function () {
                                    circleGraphic.addDynamicPosition(getPoint([positions[i][0], positions[i][1], 0]), positions[i][3])
                                    // getCarmerIn(roamLine, item.id, positions[i][3], 'my')
                                }, positions[i][4])
                            }
                            getAllCamerIn()
                            setTimeout(() => {
                                myArrTimeLine.forEach((nowItem: any, nowIndex: number) => {
                                    if (nowIndex === 0) {
                                        myLines(nowItem.speed, nowItem.path)
                                    } else {
    
                                        myTimeOutArr[nowIndex - 1] = setTimeout( function () {
                                            myLines(nowItem.speed, nowItem.path)
                                        }, myArrTimeLine[nowIndex - 1].time)
                                    }
                                })
                            }, 300)
                        }
                    } 
                })
              })
        })
    }
    const setLine = (arr: any) => {
        nowLines = []
        newSpeed = []
        newSpeedNum = []
        endNum = 0
        arr.forEach((item: any, index: number) => {
            const entity = JSON.parse(item.entity||"{}")
            let indexs = 0
            if (index === 0) {
                indexs = entity?.GeoJSON?.geometry?.coordinates?.length - 1
            } else {
                indexs = entity?.GeoJSON?.geometry?.coordinates?.length
            }
            endNum += indexs
            const speed = entity?.info?.code || 60
            newSpeed.push(speed)
            newSpeedNum.push(endNum)
        })
        setLines(arr)
    }
    // 清除所有预案
    const clearAllya = () => {
        clearCamera()
        for (const key in leftTreeObj) {
            if (key.indexOf("3dTiles") === -1) {
            map.removeLayer(leftTreeObj[key])
            map.removeLayer(leftTreeObj[key + '3dTiles'])
            }
        }
        leftTreeObj = {}
        if (timer) {
            clearInterval(timer)
        }
        timeOutArr.forEach((timeItem: any) => {
            clearTimeout(timeItem)
        })
        timeOutArr = []
        myTimeOutArr.forEach((timeItems: any) => {
            clearTimeout(timeItems)
        })
        myTimeOutArr = []
        graphicMn.clear()
        if (gpsTimes) {
            clearInterval(gpsTimes)
        }
    }
    // 定时获取卡车和铲车的列表数据
    const createPath = (id: any) => {
        console.log('2222')
        // const position = [
        //     [
        //         120.227016,
        //         30.23371,
        //         0
        //     ],
        //     [
        //         120.226299,
        //         30.232002,
        //         0,
        //         12,
        //         0
        //     ],
        //     [
        //         120.22651,
        //         30.23131,
        //         0,
        //         4,
        //         12091
        //     ],
        //     [
        //         120.22739,
        //         30.230147,
        //         0,
        //         9,
        //         16852
        //     ],
        //     [
        //         120.229222,
        //         30.228505,
        //         0,
        //         15,
        //         26107
        //     ],
        //     [
        //         120.229934,
        //         30.229826,
        //         0,
        //         9,
        //         41313
        //     ],
        //     [
        //         120.231233,
        //         30.231922,
        //         0,
        //         15,
        //         51014
        //     ],
        //     [
        //         120.231914,
        //         30.231465,
        //         0,
        //         4,
        //         66845
        //     ],
        //     [
        //         120.23226,
        //         30.231931,
        //         0,
        //         3,
        //         71815
        //     ],
        //     [
        //         120.232897,
        //         30.231433,
        //         0,
        //         4,
        //         75502
        //     ],
        //     [
        //         120.232815,
        //         30.230942,
        //         0,
        //         3,
        //         80452
        //     ],
        //     [
        //         120.231318,
        //         30.22919,
        //         0,
        //         14,
        //         83751
        //     ],
        //     [
        //         120.232375,
        //         30.228658,
        //         0,
        //         7,
        //         98261
        //     ],
        //     [
        //         120.233701,
        //         30.230259,
        //         0,
        //         13,
        //         105317
        //     ],
        //     [
        //         120.233757,
        //         30.230289,
        //         0,
        //         0,
        //         118433
        //     ]
        // ]
        const param = {
            "deviceId": id,
            "pageNumber": 1,
            "pageSize": 1,
        }
        queryLngLat(param).then((res: any) => {
            console.log(res)
            const path = res.data.rows
            graphicGpsModel.eachGraphic((car: any) => {
                //更新车辆的轨迹
                car.updatePath(path, {
                    timeColumn: 'gpstime',
                    getPosition: function (item: any) {
                        return Cesium.Cartesian3.fromDegrees(parseFloat(item.lon), parseFloat(item.lat), 0);
                    },
                });
            })
            const arr: any = {
                hkSrc: [],
                dhSrc: []
            }
            for (const keys in graphicLayerObj) {
                if (graphicLayerObj[keys]) {
                    getAllCarmer(graphicLayerObj[keys], path, arr)
                }
            }
            props.videoSet('', arr, contentType)
        })
    }
    // 获取gps车辆信息
    const getGpsCar = (id: any) => {
        roamLine = new mars3d.graphic.DynamicRoamLine({
            id: '111',
            name: 'gps导航',
            model: {
              clampToGround: true,
              silhouette: false,
              show: true,
              url: "/qiche.gltf",
              scale: 0.1
            },
            shadow: [
              {
                type: "polyline",
                color: 'rgb(40, 40, 255)',
                width: 2,
                clampToGround: true,
                // maxDistance: 500,
                show: true,
              },
            ],
          });
        graphicGpsModel.addGraphic(roamLine);
        const carContent = `<div class="carPopup">
        <div class="title">车辆</div>
        <div class="attr">车型：小轿车</div>
        <div class="attr">车牌：浙AH8659</div>
        <div class="attr">车速：60 km</div></div>`
        roamLine.bindPopup(
            function () {
              return carContent;
            },
            {
              direction: 'top',
              offsetY: 0,
              template: false,
              clampToGround: true
            },
        );
        setInterval(() => {
            createPath(id);
        }, 1000);
        // createPath();
    }
    // 跟踪数据
    const setGzxl = (id: any) => {
        sjName = 'dy'
        modelNow = false
        // clearAllya()
        if (timer) {
            clearInterval(timer)
        }
        timeOutArr.forEach((timeItem: any) => {
            clearTimeout(timeItem)
        })
        timeOutArr = []
        myTimeOutArr.forEach((timeItems: any) => {
            clearTimeout(timeItems)
        })
        myTimeOutArr = []
        graphicMn.clear()
        graphicMy.clear()
        graphicMycar.clear()
        getGpsCar(id)
    }
    // 模拟数据   allTimer
    const setMndh = () => {
        modelNow = true
        graphicMy.clear()
        graphicMycar.clear()
        graphicGps.clear()
    }
    // 开启漫游  模拟
    const setMy = () => {
        sjName = 'dy'
        modelNow = false
        myNow = true
    }
    // 清除线路里的路径
    const clearLines = () => {
        // nowLines = []
        // console.log(nowLines)
        graphicMycar.clear()
    }
    // 切换视角
    const changeCar = () => {
        if (roamLine) {
            let name = ''
            let pich = 0
            let radius = 500
            let heading = 0
            if (sjName === 'dy') {
                name = 'gs'
                pich = 180
                radius = 500
                sjName = 'gs'
                heading = 0
                myType = 'gs'
                roamLine.setCameraOptions({
                    type: name,
                    pitch: pich,
                    radius: radius,
                    heading: heading
                })
            } else {
                name = 'dy'
                pich = -30
                radius = 500
                sjName = 'dy'
                myType = 'dy'
                roamLine.setCameraOptions({
                    type: name,
                    followedZ: 10
                })
            }
            // roamLine.openPopup()
        }
    }
    const clearOtherMy = () => {
        if (timer) {
            clearInterval(timer)
        }
        timeOutArr.forEach((timeItem: any) => {
            clearTimeout(timeItem)
        })
        timeOutArr = []
        graphicGpsModel.clear()
        graphicMn.clear()
    }
    // 切换视频改
    const changeArr = (arr: any, newArr: any) => {
        if (newArr.videoTypeName === 'dhlw') {
            arr.dhSrc.push(newArr.videoId)
        } else if (newArr.videoTypeName === 'HLS') {
            arr.hkSrc.push(newArr.videoUrl)
        }
    }
    // 按键切换视频
    const setSp = (val: any) => {
        const arr: any = {
            hkSrc: [],
            dhSrc: []
        }
        if (contentType === '0') return
        if (newOldIndex === -1) {
            if (oldIndex < 0) {
                newOldIndex = 0
            } else {
                newOldIndex = oldIndex
            }
        }
        if (val === "up") {
            console.log("up")
            if (newOldIndex < 1) return
            const lastVideo = allVideos[newOldIndex]
            const nowVideo = allVideos[newOldIndex - 1]
            changeArr(arr, nowVideo)
            changeArr(arr, lastVideo)
            newOldIndex--
        } else {
            console.log("down")
            if (newOldIndex ===  allVideos.length - 1) return
            const lastVideo = allVideos[newOldIndex + 1]
            const nowVideo = allVideos[newOldIndex]
            changeArr(arr, nowVideo)
            changeArr(arr, lastVideo)
            newOldIndex++
        }
        console.log(oldIndex, arr)
        props.videoSet('', arr, contentType, '1')
    }
    const changeType = (val: any) => {
        if (val === '0') {
            // 自动
            contentType = '0'
        } else {
            // 手动
            contentType = '1'
        }
        if (oldIndex > -2 && oldIndex !== allVideos.length - 1) {
            if (timer) {
                clearInterval(timer)
            }
            timer = setInterval(function() {
                getCarmerGps('', '', contentType, 'yuan')
            }, 1000)
        }
    }
    useEffect(() => {
        return () => {
            if (gpsTimes) {
                clearInterval(gpsTimes);
            }
        };
    },[])
    //将子组件的方法 暴露给父组件
    useImperativeHandle(ref, () => ({
        setLine,
        clearAllya,
        setMndh,
        setGzxl,
        setBgLayer,
        setMy,
        clearLines,
        changeCar,
        clearOtherMy,
        setSp,
        changeType
    }))
    return(
      <div className="allbg">
        <div id="cesiumContainerAb" className="cesiumContainer" />
      </div>
    )
})
export default Mars3DMap;