import styles from './indexNew.less';
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Row, Col, message } from 'antd';
import type { ItemData } from './data';
import PopupAlert from './popupAlert';
import { queryVideo, preview } from '@/services/bigScreen';
import { selectLayer } from '@/services/topManage/index';
import ApngComponent from 'react-apng';
import { queryYaDetail } from '@/services/topManage';
//定义props的类型
interface Props {
  dataConfig: { height?: string; list: ItemData[] };
  refresh?: any;
  callBackUrl: (value: string[], type: string) => void;
  callBackFace: (value: { id: string; name: string }) => void;
  callBackVideoAR: (item: any) => void;
}
declare global {
  interface Window {
    clickPoint_jk: any;
  }
}
let configObj: any = {};
let videoObj: any = {};
let graphicLayerJK: any = null; // 监控点位图层
let graphicLayerRL: any = null; // 人脸图层
// let graphicLayerSpty: any = null; // 视频投影图层

interface RefTypes {
  setAbDate: (flg: any) => void;
  searchLayerTc: () => void;
  getArVideos: (ids: string[]) => void;
  itemShowFlg: (code: string, flg: boolean) => void;
}
const AnbaoCard = React.forwardRef<RefTypes, Props>((props, ref) => {
  const { dataConfig, callBackUrl, callBackFace, callBackVideoAR, refresh } = props;
  const [dataList, setDataList] = useState<ItemData[]>([]);
  // const [videoData, setVideoData] = useState<any[]>([]);
  const [poputData, setPopupData] = useState<any>();
  const [visiableABLL, setVisiableABLL] = useState<boolean>(false);
  const [layerID, setLayerID] = useState<any>([]);
  // const [videoObj, setVideoObj] = useState<any>({});
  const [bigsum, setBigSum] = useState<number>(0);
  // 父组件调用
  const setAbDate = (abObj: any) => {
    if (abObj) {
      let all: number = 0;
      for (const key in abObj) {
        all += abObj[key];
      }
      const list = dataList.map((item: any) => {
        if (item.code === 'ab') {
          item.num = all;
          item.popupContent.data = item.popupContent.data.map((val: any) => {
            val.num = abObj[val.code + 'Num'];
            return val;
          });
        }
        return item;
      });
      setDataList(list);
    }
  };

  const searchVideo = (id: string) => {
    if (!id) {
      console.log('视频id缺失!');
      // message.error('视频id缺失!');
      return;
    }
    if (window.videoShow) {
      callBackVideoAR(videoObj[id]);
      return;
    }
    const { videoType, vvideoId, source } = videoObj[id];
    if (videoType === 'f0f9ed28-133a-4a02-a8c2-a56873106ee3' || videoType === 'dhlw') {
      callBackUrl(vvideoId, '大华');
    } else if (videoType === 'b76a4c09-35a5-4f83-ae4f-315860ad3680') {
      // preview({ data: { cameraIndexCode: vedioID } })
      const platform = source === '1' ? 'ISC' : 'IOT';
      preview({
        data: {
          cameraId: vvideoId,
          platform: platform,
          protocol: 'hls',
          expand: 'transcode=1&videotype=h264',
        },
      })
        .then((res: any) => {
          callBackUrl([res.result.result], '海康');
        })
        .catch((err: any) => {
          // message.error(err.message || err);
          console.log(err.message || err);
        });
      // callBackUrl([videoUrl])
    }
  };
  window.clickPoint_jk = (data: any, type?: string) => {
    if (type === '监控') {
      searchVideo(data);
    } else if (type === '人脸识别') {
      const { vvideoId, vedioName } = videoObj[data];
      callBackFace({
        id: vvideoId,
        name: vedioName,
      });
    }
  };
  // 展示视频投影
  // const showVideo = (data: any) => {
  //   console.log(data);
  //   window.map.addLayer(graphicLayerSpty);
  //   graphicLayerSpty.clear();
  //   const video3D = new mars3d.graphic.Video3D({
  //     type: mars3d.graphic.Video3D.Type.Video,
  //     url: 'http://data.mars3d.cn/file/video/menqian.mp4',
  //     // position: [data.lon, data.lat, parseInt(data.height)],
  //     // cameraPosition: [data.lon, data.lat, parseInt(data.height)],
  //     position: [117.20551, 31.842824, 41.4],
  //     cameraPosition: [117.205457, 31.842984, 63.9],
  //     style: {
  //       fovDegree: 84.3, // 张角(角度值，0-180度)
  //       aspectRatio: 2.6, // 相机视野的宽高比例（垂直张角）
  //       opacity: 0.8,
  //       camera: {
  //         direction: {
  //           x: 0.07331987934745406,
  //           y: -0.31686588753316797,
  //           z: -0.9456321719412325,
  //         },
  //         right: {
  //           x: 0.8826585211077188,
  //           y: 0.46201009007723565,
  //           z: -0.08637483304041443,
  //         },
  //         up: {
  //           x: -0.4642608430704491,
  //           y: 0.8283373020603265,
  //           z: -0.3135588997412374,
  //         },
  //       },
  //     },
  //     showFrustum: true, // 是否显示视椎体框线
  //   });
  //   graphicLayerSpty.addGraphic(video3D);
  // };
  // const reff = useRef<any>(null)
  // 聚合点展示
  const addFeature = (graphicLayer: any, arr: any, type: string, flg?: boolean) => {
    //单击事件
    graphicLayer.on(mars3d.EventType.click, function (event: any) {
      const graphic = event.graphic;
      if (graphic) {
        const { vvideoId, vedioName } = graphic.options.attr;
        if (type === '监控') {
          searchVideo(vvideoId);
        } else if (type === '人脸识别') {
          callBackFace({
            id: vvideoId,
            name: vedioName,
          });
        }
      }
    });
    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i];
      if ((type === '监控' || type === '人脸识别') && item.layerID && flg) {
        continue;
      }
      const position = new mars3d.LatLngPoint(item.lon, item.lat, item.height || 0);
      const iconFun = () => {
        let imgUrl = '';
        if (item.vvideoId?.indexOf('_A') != -1) {
          imgUrl = '/img/mapImg/video_qiangji.svg';
        } else if (item.vvideoId?.indexOf('_B') != -1) {
          imgUrl = '/img/mapImg/video_qiuji.svg';
        } else {
          imgUrl = '/img/mapImg/video_banqiuji.svg';
        }
        return imgUrl;
      };
      const iconNameFun = () => {
        let iconName = '';
        if (item.vvideoId?.indexOf('_A') != -1) {
          iconName = '枪机';
        } else if (item.vvideoId?.indexOf('_B') != -1) {
          iconName = '球机';
        } else {
          iconName = '半球';
        }
        return iconName;
      };
      const defaultIcon = type === '人脸识别' ? '/img/face.png' : iconFun();
      const primitive = new mars3d.graphic.BillboardEntity({
        position: position,
        style: {
          image: item?.iconID?.length > 2 ? item.minioFileUrl : defaultIcon,
          width: 24,
          height: 24,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
          visibleDepth:false
        },
        attr: { ...item, iconName: type === '监控' ? iconNameFun() : '' },
        name: `${item.vvideoId}++${item.vedioName}`,
        id: item.id,
      });
      graphicLayer.addGraphic(primitive);
    }
    graphicLayer.bindTooltip(
      function (event: any) {
        const item = event.graphic?.attr;
        if (!item) {
          return false;
        }
        const innerTooltip = `<div>${item.vedioName}</div>`;
        return innerTooltip;
      },
      {
        direction: 'top',
        offsetY: -30,
      },
    );
    graphicLayer.bindPopup(
      function (event: any) {
        const item = event.graphic?.attr;
        if (item) {
          return;
        }
        let innerPopup =
          '<div class="zyglTp"><div class="tops"><span>列表</span></div><ul class="ulScrollBox">';
        event.id.map((val: any) => {
          const idName = val.name.split('++');
          innerPopup += `<li class="zyLi" onClick="clickPoint_jk('${idName[0]}','${type}')">
                <img src="${val._billboard._image._value}" />
                <span>${idName[1]}</span>
              </li>`;
        });
        innerPopup += '</ul></div>';
        return innerPopup;
      },
      {
        direction: 'top',
        offsetY: -30,
      },
    );
  };

  const activeFun = (item: ItemData) => {
    if (!item.isClick) return;
    const newList = dataList.map((val: ItemData) => {
      if (val.name === item.name) {
        val.isActive = !val.isActive;
        if (item.code === 'ab') {
          setVisiableABLL(val.isActive);
          setPopupData(item.popupContent);
        }
        if (item.code === 'jk') {
          graphicLayerJK.show = val.isActive;
          window.changeLayer();
        }
        if (item.code === 'rl') {
          graphicLayerRL.show = val.isActive;
          window.changeLayer();
        }
      }
      return val;
    });
    setDataList(newList);
  };
  const getArVideos = (layerIDList: string[]) => {
    setLayerID(layerIDList);
    const config = configObj;
    const params = {
      pageNumber: 1,
      pageSize: 99999,
      layerIDList,
      // flag: layerIDList.length === 0 ? '2' : '1',
      polygon: window.polygon,
    };
    const flg: boolean = layerIDList.length === 0;
    const clustering = JSON.parse(window.cjObj.entity || '{}').clustering || {
      enabled: flg,
      pixelRange: 80,
    };
    console.log('winddow.clustering:', clustering);
    queryVideo(params)
      .then((res: any) => {
        if (res.code === 200) {
          const lis = dataList.map((val: ItemData) => {
            if (val.code === 'jk' || val.code === 'rl') {
              val.isActive = false;
            }
            return val;
          });
          setDataList(lis);
          const videoList = res?.data?.rows || [];
          const filterFaceList: any[] = [];
          // const jkList: any[] = [];
          videoObj = {};
          videoList.forEach((item: any) => {
            if (item.category === '0') {
              filterFaceList.push(item);
            }
            // else if (item.category === '1') {
            //   jkList.push(item);
            // }
            videoObj[item.vvideoId] = item;
          });
          window.videoList = videoList;
          // setVideoObj(obj);
          const newList = config.map((item: ItemData) => {
            if (item.code === 'jk') {
              item.num = videoList.length;
            }
            if (item.code === 'rl') {
              item.num = filterFaceList.length;
            }
            return item;
          });
          setDataList(newList);

          if (graphicLayerJK) {
            window.map.removeLayer(graphicLayerJK);
          }
          // 聚合图层点位采集
          graphicLayerJK = new mars3d.layer.GraphicLayer({
            clustering,
            name: '监控点位',
            show: false,
          });
          window.map.addLayer(graphicLayerJK);
          graphicLayerJK.clear();
          addFeature(graphicLayerJK, videoList, '监控', flg);

          if (graphicLayerRL) {
            window.map.removeLayer(graphicLayerRL);
          }
          // 聚合图层点位采集
          graphicLayerRL = new mars3d.layer.GraphicLayer({
            clustering,
            name: '人脸识别',
            show: false,
          });
          window.map.addLayer(graphicLayerRL);
          graphicLayerRL.clear();
          window.filterFaceList = filterFaceList;
          addFeature(graphicLayerRL, filterFaceList, '人脸识别', flg);
        }
      })
      .catch((err: any) => {
        // message.error(err.message || err);
        console.log(err.message || err);
      });
  };

  // 根据场景查询图层
  const searchLayerTc = () => {
    const param = {
      id: window.cjObj.id,
      pageSize: 999,
      pageNumber: 1,
    };
    selectLayer(param).then((res: any) => {
      const ids: string[] = [];
      res.data?.rows.forEach((item: any) => {
        if (item.isDefult === '1') {
          const ent = JSON.parse(item.entity || '{}');
          if (ent.type === '3dtiles' && ent.name.indexOf('倾斜') === -1) {
            ids.push(item.id);
          }
        }
      });
      // mapRef.current.setBgLayer(res)
      getArVideos(ids);
    });
  };
  // 资源搜索专用
  const itemShowFlg = (code: string, flg: boolean) => {
    graphicLayerJK.show = false;
    graphicLayerRL.show = false;
    const newList = dataList.map((val: ItemData) => {
      if (val.code === code) {
        val.isActive = flg;
        if (code === 'jk') {
          graphicLayerJK.show = flg;
        }
        if (code === 'rl') {
          graphicLayerRL.show = flg;
        }
        window.changeLayer();
      }
      return val;
    });
    setDataList(newList);
  };
  //将子组件的方法 暴露给父组件
  useImperativeHandle(ref, () => ({
    setAbDate,
    searchLayerTc,
    getArVideos,
    itemShowFlg,
  }));
  useEffect(() => {
    console.log('模块2刷新了');
    if (dataConfig) {
      configObj = dataConfig?.list.map((item: ItemData) => {
        item.isActive = false;
        return item;
      });
      setDataList(configObj);
      searchLayerTc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataConfig, refresh]);
  // useEffect(() => {
  //   graphicLayerSpty = new mars3d.layer.GraphicLayer({
  //     name: '视频投影图层',
  //   });
  // }, []);

  useEffect(() => {
    const clustering = JSON.parse(window.cjObj.entity || '{}')?.clustering || {
      enabled: true,
      pixelRange: 80,
    };
    console.log('clustering:', clustering);
    if (
      (graphicLayerRL?.show || graphicLayerJK?.show) &&
      layerID?.length === 0 &&
      clustering?.enabled
    ) {
      window.map.on(mars3d.EventType.wheel, function (event: any) {
        const level = event.target.level;
        if (level > 16) {
          graphicLayerRL.clustering = false;
          graphicLayerJK.clustering = false;
        } else {
          graphicLayerRL.clustering = true;
          graphicLayerJK.clustering = true;
        }
      });
    } else {
      window.map.off(mars3d.EventType.wheel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphicLayerRL, graphicLayerJK, layerID]);
  // 获取安保力量总数
  useEffect(() => {
    if (window?.hdObj?.id) {
      const queryObject = { activityId: window?.hdObj?.id, pageNumber: 0, PageSize: 10 } as any;
      queryYaDetail(queryObject)
        .then((res) => {
          const result = res?.data?.rows;
          let bigSum: number = 0;
          result.map((item: any) => {
            const data=JSON.parse(item.entity || '{}')?.info
            const{mjNum,fjNum,baNum,jjNum}=data||0
            // if (item?.name === '民警' || item?.name === '交警' || item?.name === '保安'||item?.name === '辅警') {
              bigSum =Number(mjNum || 0) +Number(fjNum || 0) +Number(baNum || 0) +Number(jjNum || 0) +bigSum;
            // }
          });
          setBigSum(bigSum);
        })
        .catch((err: any) => {
          message.error(err.message);
        });
    }
  }, [window?.hdObj?.id]);
  return (
    <Row gutter={5} className={styles.moduleWrapStyle}>
      <div className={`${styles.itemBox} ${styles.abzy}`}>
        {dataList.length > 0 &&
          dataList.map((item: ItemData) => {
            if (item.show) {
              return (
                <Col
                  key={item.name}
                  span={12}
                  className={`${styles.nthList} ${item.isClick ? styles.isClick : ''}`}
                >
                  <div
                    className={`${styles.item} ${item.isActive ? styles.active : ''}`}
                    onClick={() => activeFun(item)}
                  >
                    <div style={{ width: '49px' }}>
                      <ApngComponent autoPlay src={require(`../image/apng/${item.icon}.png`)} />
                    </div>
                    {/* {item.icon?.indexOf('/') >= 0 ? (
                      <div style={{ width: '49px' }}>
                        <ApngComponent autoPlay src={require(`../image/apng${item.icon}.png`)} />
                      </div>
                    ) : (
                      <div className={styles.iconBox}>
                        <i className={`iconfont icon-${item.icon}`} />
                      </div>
                    )} */}
                    <div className={styles.itemCon}>
                      <div className={styles.name}>{item.name}</div>
                      <div className={styles.numSty}>
                        {item.num} {item.code === 'ab' ? `| ${bigsum}` : ''}
                      </div>
                    </div>
                  </div>
                </Col>
              );
            } else {
              return;
            }
          })}
      </div>
      <PopupAlert visiable={visiableABLL} popupData={poputData} />
    </Row>
  );
});
export default AnbaoCard;
