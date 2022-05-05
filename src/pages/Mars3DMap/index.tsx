/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { history } from 'umi';

import type { FC } from 'react';

import Hls from 'hls.js';

import styles from './style.less';
import VideoPlayer from './components/videoPlayer';
import Yaty from './components/yaty';
import Yjcz from './components/yjcz';
import YjczTc from '../BigScreen/components/dealAlarm';
import Zdqy from './components/zdqy';
import Zgd from './components/zgd';
import Abrz from './components/abrz';
import Yxjk from './components/yxjk';
import 'video.js/dist/video-js.min.css';
import { Drawer, Button, Space, Radio } from 'antd';
// 时间组件
import { DatePicker } from 'antd';
import { Checkbox, Slider, InputNumber, Row, Col } from 'antd';
// 裁剪组件
import Cropper from './components/cropper';
// loading加载
import { Spin } from 'antd';
import { Table, Tooltip } from 'antd';
import { Input } from 'antd';
import { Select } from 'antd';
import { Switch } from 'antd';
import { TreeSelect } from 'antd';
// queryYaDetail
import {
  getModelLayer,
  videoQuery,
  videoDetailQuery,
  addLayerCamera,
  removeCameraDW,
  queryYaJson,
  getDictfindAll,
  querySenceDevice,
  querySencePeople,
  querySenceVideo,
  queryCamera,
  querySolution,
  queryJQNum,
  ryhcOld,
  queryTcty,
  queryYatyDetail,
  queryYaty,
  queryLayerList,
  queryYc,
  queryTreeTc,
  getIcon,
  bySolution,
} from './service';
import { Menu, Dropdown } from 'antd';
import { ryhcOldJSON } from './json';
import { message } from 'antd';
import { Tree } from 'antd';
import { searchVenues } from '@/services/topManage/index';
import { setTreeData, formatDate, findElem } from '@/utils/utilsJS';
// import HouseDetail from './components/houseDetail/houseDetail';
import moment from 'moment';
import { Item } from 'rc-menu';
import { getOrgDetail } from '@/services/bigScreen';

import stopgreen from '@/assest/img/stopgreen.png'
import stopred from '@/assest/img/stopred.png'
import stopyellow from '@/assest/img/stopyellow.png'
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;
let map: any = null;
const leftTreeObj: any = {}; //左侧树图层保存筛选
let graphicLayerOne: any = ''; // 资源点位图层
let graphicLayerTwo: any = ''; // 聚合点位图层 资源搜索
let graphicLayerYxjk: any = ''; //沿线监控图层
let threeLayerSp: any = ''; // 视频模型图层
let graphicLayerTy: any = ''; //预案推演图层
let graphicLayerSjcz: any = ''; //事件处置图层
let graphicLayerRyhc: any = ''; // 重点追踪图层
let rgaphGpsJl: any = ''; //警力图层
let rgaphGpsCl: any = ''; //车辆图层
let rgaphGpsJk: any = ''; //监控图层
let rgaphGpsGd: any = ''; //岗点图层
let graphicGdFz: any = ''; //岗点复制图层
const gdData: any = []; //岗点数据
let rgaphGpsJlTwo: any = ''; //警力图层引导
let rgaphGpsClTwo: any = ''; //车辆图层引导
let rgaphGpsJkTwo: any = ''; //监控图层引导
let graphicLayerQyss: any = {}; //区域疏散图层
let graphicLayerSprh: any = ''; //视频融合图层
let graphicLayerSprhTd: any = ''; //视频贴地融合图层
// let graphicLayerZdqy: any = ''; //重点区域图层
// let graphicLayerZdqymodel: any = ''; //重点区域模型图层
let graphicLayerZgd: any = ''; // 制高点图层
let zdqyTc: any = {}; // 重点区域图层
let zdqyVideo: any = {}; // 重点区域video数组
const yatyObj: any = []; // 预案推演存储数据
let spbdSet = false; // 视频标点选择
let mapSpbd = ''; // 视频标点url
let yjczSet = false; // 应急处置开启
const dataList: any = []; // 存储树
const zdArr: any = {}; //字典id存储
let selectLayers: any = {}; // 下拉选择存储图层
let selectLayerIds: any = []; // 下拉选择存储图层id
const tcFlag: any = false; // 图层的flag
const allData: any = []; //存储右上角图层信息
const allCjTc: any = {}; //刚进来的时候
const rightCheckId = {};
let graphicCGzw: any = ''; //场馆座位图层展示
let showMoreBtn = false; // 显示更多按钮
// let firstBtn = false // 首次加载
let videoElement: any = null; // ar dom
let selectedView: any = null; // 记录当前视频
const mapCgModel: any = {}; // 场馆模型
let showYaOr: any = true; // 预案图层的显隐
const yatytcObj: any = {}; // 预案推演图层存储
let selectedViewZgd: any = null; // 制高点设置
let graphicPoint: any = []; // 存储点位
let sqxKeysArr: string[] = [];
let yxjkRadius: any = 50;
// 限定视角
let cameraHistory: any = '';
let timeOut: any = null;
// 存储下方按钮的状态
let ryheAn = false,
  spbdAn = false,
  zysuAn = false,
  yatyAn = false,
  yjczAn = false,
  zgdAn = false,
  ssAn = false,
  abAn = false,
  yxjkAn = false,
  sprhAn = false,
  zdqyAn = false;
// 存储地图点击坐标
const mars3D = mars3d;
const CesiuM = Cesium;
let graphicLayerXhTcc: any = null; // 湘湖停车场
let xtccLayer: any = null; // 新停车场图层
let graphicLayerXhYc: any = ''; // 湘湖游船
let graphicLayerXhZdlk: any = ''; //湘湖重点路口
const leftTreeLayer: any = {}; // 左侧移动模型图层
const billboardTag: any = {}; //预案点位标记
let clckObj: any = {}; // 车辆冲卡图层
let clckPosition: any = {}; // 车辆冲卡路径position
let graphicClcz: any = ''; // 车辆冲卡图层
let roamLine: any = null;
let tingchechangClick: boolean=false // 停车场暴力点击
//定义props的类型
interface Props {
  showLeftTree?: boolean;
  leftTreeData?: any[];
  clickShowTree: Function;
  showYaYable: Function;
  eventPosition?: { lng: number; lat: number; height: number };
  callBackPoint: (obj?: any) => void;
  setLeftAbNum: Function;
  setHdnum: Function;
  setKey: Function;
  loadModel: Function;
  setTcShow: Function;
  sqxClick: Function;
  setSpSrc: Function;
  changeRight: Function;
  setNewSrc: Function;
  visiableLeft: boolean;
  visiableHeader: string;
  changeYcNum: Function;
  reloadVideo: Function;
}
interface RefTypes {
  goHome: Function;
  setBgLayer: Function;
  getLayers: Function;
  expImageMap: Function;
  clearAllya: Function;
  cutPic: Function;
  setVideo: Function;
  setCheckTree: Function;

  setBigModel: Function;
  removeBigModel: Function;
  setSJ: Function;
  changeYaShow: Function;
  setTl: Function;
  removeAllAn: Function;
  setXhCar: Function;
  serXhYc: Function;
  showXhCar: Function;
  showXhYc: Function;
  getSqx: Function;
  setXhZDLK: Function;
  showXhZdlk: Function;
  changeNormalTc: Function;
  setTreeKey: Function;
  setZdqyTc: Function;
}

declare global {
  interface Window {
    closeZw: any; // 关闭座位
    xzdArr: any; //字点信息
  }
}
const Mars3DMap = React.forwardRef<RefTypes, Props>((props, ref) => {
  const { eventPosition, callBackPoint } = props;
  const [iconshow, setIconshow] = useState<boolean>(false); //图例显示隐藏
  const [leftTree, setLeftTree] = useState<boolean>(false); //预案显示隐藏
  const [activeshow, setActiveshow] = useState<boolean>(false); //活动显示隐藏
  const [stadium, setStadium] = useState<boolean>(false); //场馆显示隐藏
  const [modalData, setModalData] = useState<any>([]); //场馆树
  // 回home
  const goHome = () => {
    const views = JSON.parse(window.cjObj.centerPosition || '{}');
    // const views = { lat: 30.233466, lng: 120.222606, alt: 132, heading: 179, pitch: -56 }
    if (views) {
      if (views.lng) {
        map.centerAt(views);
      } else {
        map.setCameraView(map.getCameraView());
      }
    } else {
      map.setCameraView(map.getCameraView());
    }
  };
  //const houseId: any = useRef(null); //房屋id
  const [checkedKeys, setCheckedKeys] = useState<any>([]);
  const [xhouse, setXhouse] = useState<boolean>(false);
  const setBigModel = (model: any) => {
    map.addLayer(model);
  };
  const removeBigModel = () => {};
  // 右侧地图加载
  const setBgLayer = (res: any, flag: boolean) => {
    map
      .getLayers({
        basemaps: true,
        layers: true,
      })
      .map((item: any) => {
        if (flag) {
          if (item.options.id !== 'baseMap' && item.options.type) {
            map.removeLayer(item);
          }
        }
      });
    const result = res.data.rows;
    selectLayers = {};
    selectLayerIds = [];
    if (result.length) {
      result.forEach((item: any) => {
        console.log(item);
        const enetity = JSON.parse(item.entity || '{}');
        enetity.id = item.id;
        if (enetity.type === '3dtiles' && item.isDefult === '1') {
          // 模型加载
          selectLayers[item.id] = props.loadModel(enetity, selectLayers[item.id]);
          if (selectLayers[item.id]) {
            selectLayerIds.push(item.id);
          }
        } else if (item.isDefult === '1') {
          // enetity.type === 'xyz' &&
          // 瓦片图层
          try {
            const newEntity = enetity;
            newEntity.show = true;
            const layer = mars3d.LayerUtil.create(newEntity);
            selectLayers[item.id] = layer;
            map.addLayer(selectLayers[item.id]);
            selectLayerIds.push(item.id);
          } catch (e: any) {
            console.log(e.message || '');
            // message.error(e.message || '')
          }
        }
      });
    }
    console.log(selectLayerIds);
  };
  const [showLayers, setShowLayers] = useState<boolean>(false);
  const [rightLayers, setRightLayers] = useState<any>([]);
  // 清除默认图层
  const changeNormalTc = (val: any) => {
    if (selectLayers[val] && selectLayers[val].show) {
      selectLayers[val].show = false;
    }
    // console.log(val, selectLayers[val])
  };
  // 右侧图层加载
  const getLayers = (flag: any) => {
    if (flag) {
      setShowLayers(false);
      return;
    }
    setShowLayers(true);
    if (allData.length) {
      return;
    }
    const Ids: any = [];
    const layers = map
      .getLayers({
        basemaps: true,
        layers: true,
      })
      .map((item: any) => {
        // selectLayers[item.options.id] = item
        item.options.pId = item.options.pid;
        item.options.title = item.options.name;
        item.options.key = item.options.id;
        if (item.show) {
          Ids.push(item.options.id);
        }
        return item.options;
      });
    setRightLayers(setTreeData(layers));
    const newIds = [...new Set([...Ids, ...selectLayerIds])];
    setCheckedKeys(newIds);
  };
  const checkRightTree = (checkedKeys: any, e: any) => {
    // console.log(checkedKeys, e)
    setCheckedKeys(checkedKeys);
    map
      .getLayers({
        basemaps: true,
        layers: true,
      })
      .map((item: any) => {
        // const keys = Object.keys(selectLayers)
        if (item.options.id === 'baseMap' || checkedKeys.indexOf(item.options.id) > -1) {
          item.show = true;
        } else {
          item.show = false;
        }
        // return item
      });
  };
  // 左侧预案树更改
  const [leftKeys, setLeftKeys] = useState<any>([]);
  // 设置预案树勾选
  const setCheckTree = (val: any) => {
    setLeftKeys(val);
  };
  const clickLeftTree = () => {
    props.clickShowTree(leftKeys);
  };
  const policeFun = () => {
    const list = Object.keys(billboardTag); //所有勾选预案的id
    let solutionList: any[] = []; //所有勾选预案的点
    let solutionIdList: any[] = []; //id 列表
    const billboard: any = {}; //每个图标所需人数
    list?.forEach((id: any) => {
      solutionList = [...solutionList, ...billboardTag[id]];
    });
    solutionList?.forEach((iter: any) => {
      const { baNum, mjNum, fjNum, jjNum } = iter?.attr?.data?.info || 0;
      billboard[iter?.attr?.data?.id] =
        Number(baNum || 0) + Number(mjNum || 0) + Number(fjNum || 0) + Number(jjNum || 0); //统计billboars 所需人数
      solutionIdList.push(iter?.attr?.data?.id); //统计billboars id
    });
    // 传参最近半小时
    const begin = formatDate(Number(new Date()) - 0.5 * 60 * 60 * 1000);
    const end = formatDate(new Date());
    const queryObject2 = {
      begin,
      end,
      radius: 50,
      solutionIdList,
    } as any;
    bySolution(queryObject2)
      .then((res) => {
        if (res.code == 200 && res?.data?.rows) {
          const resBillboard: any = {};
          res?.data?.rows?.forEach((item: any) => {
            resBillboard[item?.solutionId] = item?.size; //岗位在岗人数
          });
          solutionIdList?.map((id: any) => {
            if (resBillboard[id] || 0 < billboard[id]) {
              solutionList?.map((iter: any) => {
                if (iter?.options?.attr?.data?.id === id)
                  // if (graphic?.options?.attr?.data?.info?.iconLevel === '422260ba-5c8b-11ec-8bb3-0242ac110002') {
                  //   policeArray.push(graphic)
                  // }
                  iter?.startFlicker({ time: null, color: Cesium.Color.RED, maxAlpha: 1 });
              });
            }
          });
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  const checkLeftTree = (checkedKeys: any, e: any) => {
    console.log('dddddsqx:', checkedKeys, e);
    // 调用三圈线大屏信息
    const nodeData = e.node.data;
    const code = JSON.parse(nodeData?.geoJson || '{}')?.features?.filter((item: any) => {
      const properties = item.properties;
      const entity = JSON.parse(properties?.data?.entity || '{}');
      const sqx = entity?.info?.code;
      if (sqx === 'sqx') {
        sqxKeysArr.push(e.node.key);
        sqxKeysArr = [...new Set(sqxKeysArr)];
        return true;
      }
    });
    if (code && code.length) {
      const param = {
        checked: !e.node.checked,
        coordinates: code[0].geometry?.coordinates || [],
      };
      props.sqxClick(param);
    }
    //调取左侧数据
    setLeftKeys(checkedKeys);
    props.setKey(checkedKeys);
    if (checkedKeys.length > 0) {
      const param = {
        idList: checkedKeys,
      };
      queryJQNum(param).then((res: any) => {
        props.setLeftAbNum(res.data);
      });
    } else {
      props.setHdnum();
    }
    const checkNoed = e.checkedNodes;
    const arr: any = [];
    const arrTwo: any = [];
    checkNoed.forEach((item: any, index: number) => {
      if (!item.children) {
        arr.push(item.key);
        arrTwo.push(item);
      }
    });
    if (arrTwo.length) {
      const views = JSON.parse(arrTwo[arrTwo.length - 1]?.data?.entity || '{}')?.view;
      if (views) {
        map.centerAt(views);
      }
    }
    if (arr.length === 0) {
      clearAllya();
      props.reloadVideo()
      window.tlNum++;
    } else {
      const objKeys = Object.keys(leftTreeObj);
      for (const keys in leftTreeObj) {
        if (keys.indexOf('3dTiles') === -1) {
          if (arr.indexOf(keys) > -1) {
            if (!leftTreeObj[keys]) {
              // 调用预案
              addYa(keys);
            }
          } else {
            // 删除预案
            map.removeLayer(leftTreeObj[keys]);
            leftTreeObj[keys] = '';
            if (leftTreeObj[keys + '3dTiles']) {
              props.reloadVideo()
            }
            map.removeLayer(leftTreeObj[keys + '3dTiles']);
            leftTreeObj[keys + '3dTiles'] = '';
            window.tlNum++;
            // 警务统计
            delete billboardTag[keys];
            // policeFun()
          }
        }
      }
      arr.forEach((item: any) => {
        if (objKeys.indexOf(item) === -1) {
          // 调用预案
          addYa(item);
        }
      });
    }
  };
  // 设置html添加
  const innerHtml = (info: any, graphic: any) => {
    let innerBindPop = '';
    let innerTooltip = '';
    const topTip =
      '<div class="safetyinfo">' +
      '<div class="top_line"></div>' +
      '<div class="top_block"></div>' +
      '<div class="left_line"></div>' +
      '<div class="left_block"></div>' +
      '<div class="info_left_line"></div>' +
      '<div class="info_left"></div>';
    innerTooltip += topTip + '<div class="info_content" style="display: block;">';
    innerBindPop +=
      topTip +
      '<div class="info_close" title="关闭"><span class="info_close_ab">X</span></div>' +
      '<div class="info_content" style="display: block;">';
    if (info && info.length) {
      info.forEach((item: any, index: number) => {
        if (!item) return;
        innerBindPop += `<div class="info_key">${item.first}: <span class="info_value info-policestask">${item.last}</span></div>`;
        if (index < 3) {
          innerTooltip += `<div class="info_key">${item.first}: <span class="info_value info-policestask">${item.last}</span></div>`;
        }
      });
    }
    const params = {
      id: graphic.options?.attr.data.id,
    };
    querySolution(params)
      .then((res: any) => {
        const resultNow = res.data.solutionPersonList;
        if (resultNow.length) {
          innerTooltip +=
            `<div class="info_key"><p class="lastTitle small">岗点人员：</p>` +
            `<p class="lastTitle large">`;
          innerBindPop +=
            `<div class="info_key"><p class="lastTitle small">岗点人员：</p>` +
            `<p class="lastTitle large">`;
          resultNow.forEach((ress: any) => {
            let number = '';
            if (ress.phoneNumber) {
              number = ress.phoneNumber;
            }
            const paramP = `<span class="lastSpan" style="color:#fff;background:rgba(255,255,255,0.6);padding:0 4px;margin:10px;">${ress.personName} ${number}</span>`;
            innerTooltip += paramP;
            innerBindPop += paramP;
          });
          innerTooltip +=
            '</p></div></div>' +
            '<div class="info_right_line"></div>' +
            '<div class="info_right"></div>' +
            '<div class="info_bottom"></div>' +
            '<div class="bottom_one"></div>' +
            '<div class="bottom_two"></div>' +
            '<div class="bottom_three"></div>' +
            '<div class="bottom_four"></div>' +
            '</div>';
          innerBindPop +=
            '</p></div></div>' +
            '<div class="info_right_line"></div>' +
            '<div class="info_right"></div>' +
            '<div class="info_bottom"></div>' +
            '<div class="bottom_one"></div>' +
            '<div class="bottom_two"></div>' +
            '<div class="bottom_three"></div>' +
            '<div class="bottom_four"></div>' +
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
              template: false,
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
              template: false,
            },
          );
        }
      })
      .catch(() => {
        if (info && info.length) {
          // bindPopup
          graphic.bindTooltip(
            function () {
              return innerTooltip;
            },
            {
              direction: 'top',
              offsetY: -20,
              template: false,
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
              template: false,
            },
          );
        }
      });
  };
  const download = (url: string, name: string) => {
    const aLink = document.createElement('a');
    document.body.appendChild(aLink);
    aLink.style.display = 'none';
    aLink.href = url;
    aLink.setAttribute('download', name);
    aLink.click();
    document.body.removeChild(aLink);
  };
  // 预案加载
  const addYa = (id: any) => {
    // 查询单个点线面的具体json
    const param = {
      id: id,
    };
    queryYaJson(param).then((res) => {
      // console.log(res)
      const result = res.data.rows;
      if (result.length) {
        const json = result[0].geoJson;
        leftTreeObj[id] = new mars3D.layer.GraphicLayer({
          name: result[0].name,
        });
        // leftTreeObj[id + '3dTiles'] = ''
        map.addLayer(leftTreeObj[id]);
        try {
          const new3dLayer = JSON.parse(
            JSON.parse(result[0]?.entity || '{}')?.modelTreeData?.data?.entity || '{}',
          );
          new3dLayer.id = JSON.parse(result[0]?.entity || '{}')?.modelTreeData?.data?.id || '';
          leftTreeObj[id + '3dTiles'] = props.loadModel(new3dLayer, leftTreeObj[id + '3dTiles']);
          leftTreeObj[id + '3dTiles'].show = showYaOr;
        } catch (error) {
          console.log(error);
        }
        const options = {
          clear: true,
          // flyTo: true
        };
        if (!json) {
          return;
        }
        leftTreeObj[id].loadGeoJSON(json, options);
        leftTreeObj[id].show = showYaOr;
        if (sqxKeysArr.includes(id)) {
          // leftTreeObj[id].on(mars3d.EventType.click, function (event: any) {
          leftTreeObj[id]?.bindContextMenu([
            {
              text: '导出监控列表',
              iconCls: 'fa fa-trash-o',
              show: (event: any) => {
                const graphic = event.graphic;
                if (!graphic || graphic.isDestroy) {
                  return false;
                } else {
                  return true;
                }
              },
              callback: function (e: any) {
                const { positions } = e.graphic.options;
                console.log('sqxKeysArr:', positions);
                if (positions.length > 0) {
                  const polygon = positions.map((it: any) => {
                    return { x: it[0], y: it[1] };
                  });
                  polygon.push(polygon[0]);
                  console.log('polygon:', polygon);
                  const params = {
                    mybatisExportExcelRequest: {
                      exportExcelInfos: [
                        { columnName: 'vedioName', titleName: '名称' },
                        { columnName: 'vvideoId', titleName: '视ID' },
                        { columnName: 'lon', titleName: '经度' },
                        { columnName: 'lat', titleName: '纬度' },
                      ],
                      fileName: '监控列表',
                    },
                    qo: {
                      pageNumber: 1,
                      pageSize: 9999,
                      polygon,
                    },
                  };
                  fetch('/ARBIGdist/api/arLayerVedio/queryAndExport', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: localStorage.getItem('loginId') || '',
                    },
                    body: JSON.stringify(params),
                  })
                    .then((res2) => res2.blob())
                    .then((data) => {
                      const href = window.URL.createObjectURL(data);
                      download(href, '监控列表.xlsx');
                    });
                  return;
                }
              },
            },
          ]);
          // });
        }
        setTl();
        // leftTreeObj[id].bindPopup(function (event: any) {
        //   const item = event.graphic?.attr;
        //   let innerBindPop = ''
        // a = leftTreeObj[id]
        //   if (item) {
        //     const graphicData =item?.data?.entity
        //     if (graphicData) {
        //       const info = JSON.parse(graphicData).info?.self
        //       if (info && info.length) {
        //         const topTip = '<div class="safetyinfo">'+
        //         '<div class="top_line"></div>'+
        //         '<div class="top_block"></div>'+
        //         '<div class="left_line"></div>'+
        //         '<div class="left_block"></div>'+
        //         '<div class="info_left_line"></div>'+
        //         '<div class="info_left"></div>'
        //         innerBindPop += topTip + `<div class="info_close info_close_ab" onclick="closePopup()" title="关闭">X</div>
        //         <div class="info_content" style="display: block;">`;
        //         info.forEach((items: any) => {
        //           innerBindPop += `<div class="info_key">${items.first}: <span class="info_value info-policestask">${items.last}</span></div>`
        //         })
        //         const params = {
        //           id: item?.data?.id
        //         }
        //         querySolution(params).then((res: any) => {
        //           const resultNow = res.data.solutionPersonList
        //           if (resultNow.length) {
        //             innerBindPop += `<div class="info_key"><p class="lastTitle small">岗点人员：</p>`+
        //             `<p class="lastTitle large">`
        //             resultNow.forEach((ress: any) => {
        //               let number = ''
        //               if (ress.phoneNumber) {
        //                 number = ress.phoneNumber
        //               }
        //               const paramP = `<span class="lastSpan" style="color:#fff;background:rgba(255,255,255,0.6);padding:0 4px;margin:10px;">${ress.personName} ${number}</span>`
        //               innerBindPop += paramP
        //             })
        //             innerBindPop += '</p></div></div>'+
        //             '<div class="info_right_line"></div>'+
        //             '<div class="info_right"></div>'+
        //             '<div class="info_bottom"></div>'+
        //             '<div class="bottom_one"></div>'+
        //             '<div class="bottom_two"></div>'+
        //             '<div class="bottom_three"></div>'+
        //             '<div class="bottom_four"></div>'+
        //           '</div>';
        //           }
        //         })
        //       }
        //     }
        //   }
        //   return innerBindPop
        // }, {
        //   direction: 'top',
        //   offsetY: -20,
        //   template: false
        // })

        leftTreeObj[id].eachGraphic((graphic: any) => {
          const graphicData = graphic.options?.attr?.data?.entity;
          if (graphicData) {
            const info = JSON.parse(graphicData || '{}').info?.self;
            // if (info && info.length) {
            innerHtml(info, graphic);
            // }
          }
          graphic.on(mars3D.EventType.click, function (event: any) {
            // 判断是否点击监控
            if (yxjkAn) {
              // 判断是否为线
              if (event.graphic.options.type === 'polyline') {
                const lines = event.graphic.options.positions.map((item: any) => {
                  const param = { x: item[0], y: item[1] };
                  return param;
                });
                const param = {
                  queryObject: {
                    line: lines,
                    // "radius": 50
                    radius: yxjkRadius,
                  },
                };
                queryCamera(param).then((res) => {
                  const data = res.result.page.content.map((item: any) => {
                    const param: any = {};
                    param.iconUrl = item.minioFileUrl || '/img/mapImg/video_qiangji.svg';
                    param.text = item.name;
                    param.lng = item.lon;
                    param.lat = item.lat;
                    param.z = item.height || 0;
                    param.id = item.id;
                    return param;
                  });
                  addFeature(graphicLayerYxjk, data);
                });
              }
            }
          });
        });
        //统计警务
        const billboardArray: any[] = [];
        leftTreeObj[id]?.eachGraphic((graphic: any) => {
          if (graphic?.options?.type === 'billboard') {
            billboardArray?.push(graphic);
          }
        });
        billboardTag[id] = billboardArray;
        policeFun();
      }
    });
    // 左侧树
    // leftTreeLayer = new mars3D.layer.GraphicLayer({
    //   name: '左侧树图层'
    // });
    // map.addLayer(leftTreeLayer)

    // const param = {
    //   "planID": id
    // }
    // queryYaDetail(param).then(res => {
    //   const result = res.data.rows
    //   result.forEach((item: any) => {
    //     const entity = JSON.parse(item.entity)

    //   });
    // })
  };
  // 清除所有区域疏散
  const clearAllqyss = () => {
    for (const key in graphicLayerQyss) {
      map.removeLayer(graphicLayerQyss[key]);
    }
    graphicLayerQyss = {};
  };
  // 清除所有预案
  const clearAllya = () => {
    for (const key in leftTreeObj) {
      if (key.indexOf('3dTiles') === -1) {
        map.removeLayer(leftTreeObj[key]);
        leftTreeObj[key] = '';
        map.removeLayer(leftTreeObj[key + '3dTiles']);
        leftTreeObj[key + '3dTiles'] = '';
      }
    }
  };
  // 根据展示预案显隐
  const changeYaShow = (flag: any) => {
    showYaOr = !flag;
    for (const key in leftTreeObj) {
      if (key.indexOf('3dTiles') === -1) {
        if (leftTreeObj[key]) {
          leftTreeObj[key].show = !flag;
          leftTreeObj[key + '3dTiles'] = !flag;
        }
      }
    }
  };
  // 添加预案面
  // 添加预案文字
  // const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  // const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  // const [treeData, setTreeDataArr] = useState<any>([]);
  // // 视频显隐
  // const [videoShow, setVideoShow] = useState<Boolean>(false)
  // const [layersObj, setLayersObj] = useState<any>({});
  // 中心点设置
  const centerPosition = { lat: 30.2349677, lng: 120.2288892, alt: 3000, heading: 0, pitch: -90 };
  const eventTarget = new mars3D.BaseClass();

  // const newSceneOptions = async () => {
  //   let xcenterPosition: any = JSON.parse(window.cjObj.centerPosition || '{}');
  //   await map.removeThing(cameraHistory);
  //   await map.setSceneOptions({
  //     center: xcenterPosition,
  //     sceneMode: 3,
  //     fxaa: true, // 不开启抗锯齿，可视域会闪烁
  //     globe: { depthTestAgainstTerrain: false }, // 不加无法投射到地形上
  //   });
  //   await setSJ(xcenterPosition);
  // };

  // 截图
  const expImageMap = (flag: any) => {
    if (flag) {
      const views = JSON.parse(window.cjObj.centerPosition || '{}');
      if (views) {
        if (views.lng) {
          setSJ(views);
        } else {
          setSJ(centerPosition);
        }
      } else {
        setSJ(centerPosition);
      }
    } else {
      map.removeThing(cameraHistory);
    }
  };
  const cutPic = () => {
    const option = {
      filename: (window?.cjObj?.name || '') + '截图',
    };
    map.expImage(option);
  };
  const setSJ = (centerPosition: any) => {
    cameraHistory = new mars3D.thing.CameraHistory({
      limit: {
        // 限定视角范围
        position: CesiuM.Cartesian3.fromDegrees(centerPosition.lng, centerPosition.lat, 3500),
        radius: 40000.0,
        debugExtent: false,
      },
      maxCacheCount: 999,
    });
    cameraHistory.on(mars3D.EventType.change, function (event: any) {
      // 触发自定义事件
      const count = event.count;
      eventTarget.fire('changeCamera', { count });
    });
    map.addThing(cameraHistory);
  };
  // 3d模型图层加载
  // let threeLayers: any = []
  // const threeLayersSet = (id:any) => {
  //   const param = {
  //     name: "体育馆",
  //     type: "3dtiles",
  //     url: "http://20.0.6.182/Tiles/aoti/tiyuguan/B1/tileset.json",
  //     maximumScreenSpaceError: 8, // 【重要】数值加大，能让最终成像变模糊
  //     maximumMemoryUsage: 1024, // 【重要】内存分配变小有利于倾斜摄影数据回收，提升性能体验
  //     center: map.getCameraView(),
  //     show: true
  //   }
  //   var id = id
  //   if (!threeLayers.hasOwnProperty(id)) {
  //     const newlayer = new mars3D.layer.TilesetLayer({
  //       // 高亮时的样式
  //       // highlight: {
  //       //   type: mars3D.EventType.click, // 默认为鼠标移入高亮，也可以指定click单击高亮
  //       //   outlineEffect: true, // 采用OutlineEffect方式来高亮
  //       //   color: "#00FF00"
  //       // },
  //       // popup: "all",
  //       flyTo: true,
  //       ...param
  //     })
  //     threeLayers[id] = newlayer
  //     map.addLayer(threeLayers[id])
  //     // 加载完成事件
  //     threeLayers[id].on(mars3D.EventType.load, function (event:any) {
  //       const data = event.tileset
  //       eventTarget.fire("tiles3dLayerLoad", { data, newlayer })
  //     })
  //     console.log(threeLayers)
  //   }
  // }
  // 视频源
  // const [videoSrc, setVideoSrc] = useState<string>("")
  // const addGraphic_a4 = (graphicLayer: { addGraphic: (arg0: any) => void }) => {
  //   let _rotation = Math.random();

  //   const graphic = new mars3D.graphic.CircleEntity({
  //     position: CesiuM.Cartesian3.fromDegrees(121.504242, 31.23805, 27.88),
  //     style: {
  //       radius: 600.0,
  //       //扫描材质
  //       material: mars3D.MaterialUtil.createMaterialProperty(mars3D.MaterialType.CircleScan, {
  //         image: '/img/sm.png',
  //         color: '#FF0000',
  //       }),
  //       stRotation: new CesiuM.CallbackProperty(function () {
  //         _rotation += 0.1;
  //         return _rotation;
  //       }, false),
  //       classificationType: CesiuM.ClassificationType.BOTH,
  //       clampToGround: true, //是否贴地
  //     },
  //   });
  //   graphicLayer.addGraphic(graphic);
  // };

  // 线路绘制
  // const showRoad = (arr: any[], options: any) => {
  //   //创建矢量数据图层
  //   const graphicLayer = new mars3D.layer.GraphicLayer();
  //   map.addLayer(graphicLayer);

  //   const arrPosition = [];
  //   for (let i = 0; i < arr.length; i += 1) {
  //     const item = arr[i];

  //     const position = CesiuM.Cartesian3.fromDegrees(item.x, item.y);
  //     item.position = position;

  //     arrPosition.push(position);

  //     // 创建点
  //     if (item.icon) {
  //       const billboardPrimitive = new mars3D.graphic.BillboardPrimitive({
  //         name: item.name,
  //         position: position,
  //         style: {
  //           image: '/img/' + item.icon,
  //           scale: 0.2,
  //           horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
  //           verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
  //           label: {
  //             text: item.name,
  //             font_size: 17,
  //             font_family: '楷体',
  //             color: CesiuM.Color.WHITE,
  //             outline: true,
  //             outlineColor: CesiuM.Color.BLACK,
  //             outlineWidth: 2,
  //             horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
  //             verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
  //             pixelOffset: new CesiuM.Cartesian2(0, -45),
  //           },
  //         },
  //       });
  //       graphicLayer.addGraphic(billboardPrimitive);

  //       const html = `<div class="mars-load-location">
  //         ${item.continent} - ${item.country} - <i style="color: #00ffff;">${item.name}</i>
  //       </div>`;
  //       billboardPrimitive.bindPopup(html);
  //     }
  //   }

  //   // const positions = mars3D.PolyUtil.getBezierCurve(arrPosition);
  //   // positions.push(arrPosition[arrPosition.length - 1]);

  //   const primitive = new mars3D.graphic.PolylinePrimitive({
  //     positions: arrPosition,
  //     style: {
  //       width: 4,
  //       material: mars3D.MaterialUtil.createMaterial(mars3D.MaterialType.LineFlow, {
  //         image: '/img/position.png',
  //         color: '#ff0000',
  //         repeat: new CesiuM.Cartesian2(10.0, 10),
  //         speed: 5,
  //       }),
  //     },
  //   });

  //   graphicLayer.addGraphic(primitive);

  //   primitive.bindTooltip(options.name);
  // };

  //===========================树控件处理============================
  // let layers = [];

  // const _getNodeConfig = (layer: any) => {
  //   if (layer == null || layer.options.noLayerManage) {
  //     return;
  //   }

  //   const item = layer.options;

  //   if (item.name == '未命名') {
  //     return;
  //   }
  //   const node: any = {
  //     id: layer.id,
  //     pId: layer.pid,
  //     name: layer.name,
  //     uuid: layer.uuid,
  //     icon: () =>
  //       layer.options.icon ? (
  //         <Image
  //           src={layer.options.icon}
  //           style={{ width: '14px', height: '14px' }}
  //           preview={false}
  //         />
  //       ) : (
  //         <SmileOutlined />
  //       ),
  //   };

  //   if (layer.hasEmptyGroup) {
  //     //空数组
  //     node.open = item.open == null ? true : item.open;
  //     const obj = layersObj;
  //     obj[node.uuid] = layer;
  //     setLayersObj(obj);
  //   } else if (layer.hasChildLayer) {
  //     //有子节点的数组
  //     node.open = item.open == null ? true : item.open;
  //     const obj = layersObj;
  //     obj[node.uuid] = layer;
  //     setLayersObj(obj);
  //   } else {
  //     node.checked = layer.isAdded && layer.show;
  //     if (layer.parent) {
  //       node._parentId = layer.parent.uuid;
  //     }
  //     //记录图层
  //     const obj = layersObj;
  //     obj[node.uuid] = layer;
  //     setLayersObj(obj);
  //   }
  //   return node;
  // };

  //更新图层:显示隐藏状态
  // const updateLayerShow = (layer: any, show: any) => {
  //   layer.show = show;
  //   console.log('layerlayerlayer：', layer);
  //   if (show) {
  //     if (!layer.isAdded) {
  //       map.addLayer(layer);
  //     }
  //     layer.flyTo();
  //   } else {
  //     // if (layer.isAdded) {
  //     //   map.removeLayer(layer)
  //     // }
  //   }
  // };

  // const initTree = () => {
  //   const zNodes = [];
  //   layers = map.getLayers({
  //     basemaps: true, //是否取config.json中的basempas
  //     layers: true, //是否取config.json中的layers
  //   });

  //   //遍历出config.json中所有的basempas和layers
  //   for (let i = layers.length - 1; i >= 0; i--) {
  //     const node = _getNodeConfig(layers[i]);

  //     if (node) {
  //       zNodes.push({ ...node, title: node.name, key: node.id });
  //     }
  //   }
  //   console.log('zNodes:', zNodes);
  //   setTreeDataArr(setTreeData(zNodes));
  //   console.log('TreeData:', treeData);
  // };

  // const onCheck = (checkedKeysValue: any, e: any) => {
  //   setCheckedKeys(checkedKeysValue);
  //   const treeNode = e.node;
  //   const layer = layersObj[treeNode.uuid];
  //   console.log('layer:', layersObj, layer, treeNode.pId);

  //   //处理图层显示隐藏
  //   if (treeNode._parentId) {
  //     const parentLayer = layersObj[treeNode._parentId];
  //     console.log('parentLayer：', parentLayer);
  //     if (parentLayer) {
  //       updateLayerShow(parentLayer, !treeNode.checked);
  //     }
  //   } else {
  //     updateLayerShow(layer, !treeNode.checked);
  //   }
  // };

  // const onSelect = (selectedKeysValue: React.Key[], info: any) => {
  //   console.log('onSelect', info);
  //   setSelectedKeys(selectedKeysValue);
  // };

  //
  // const bindGraphicDemo = () => {
  //   //创建矢量数据图层
  //   const graphicLayer = new mars3D.layer.GraphicLayer();
  //   map.addLayer(graphicLayer);

  //   const graphic = new mars3D.graphic.BoxEntity({
  //     position: new mars3D.LatLngPoint(121.489042, 31.178964, 100),
  //     style: {
  //       dimensions: new CesiuM.Cartesian3(200.0, 200.0, 500.0),
  //       fill: true,
  //       color: '#00ff00',
  //       opacity: 0.9,
  //       label: {
  //         text: 'graphic绑定的演示',
  //         font_size: 18,
  //         font_family: '楷体',
  //         color: '#003da6',
  //         outline: true,
  //         outlineColor: '#bfbfbf',
  //         outlineWidth: 2,
  //         horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
  //         verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
  //         pixelOffset: new CesiuM.Cartesian2(0, -50),
  //       },
  //     },
  //   });

  //   graphicLayer.addGraphic(graphic);

  //   //2.在graphic上绑定右键菜单
  //   graphic.bindContextMenu([
  //     {
  //       text: '删除对象[graphic绑定的]',
  //       iconCls: 'fa fa-trash-o',
  //       callback: function (e: any) {
  //         const graphicN = e.graphic;
  //         if (graphicN) {
  //           graphicN.remove();
  //         }
  //       },
  //     },
  //   ]);
  // };

  // 展示图标点
  // const showPoint = () => {
  //   var graphic = new mars3D.graphic.BillboardEntity({
  //     name: "绿色自定义图标",
  //     position: [121.462705, 31.062209, 20],
  //     style: {
  //       image: "img/cj.png",
  //       scale: 1,
  //       pixelOffset: new CesiuM.Cartesian2(0, 0), //偏移量
  //       horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
  //       verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
  //       label: {
  //         //不需要文字时，去掉label配置即可
  //         text: "可以同时支持文字",
  //         font_size: 16,
  //         // height: 30,
  //         // width: 30,
  //         scale: window.setSize(1),
  //         color: "#ffffff",
  //         outline: true,
  //         outlineColor: "#000000",
  //         pixelOffsetY: 0,
  //       },
  //     },
  //   });
  // }
  // 视频点展示
  // const managerEntry = (graphicLayer:any, arr:any) => {
  //   // graphicLayer.bindPopup(function (event:any) {
  //   //   let item = event.graphic?.attr;
  //   //   if (!item) {
  //   //     return false;
  //   //   }
  //   //   var inthtml = `<table style="width: auto;">
  //   //           <tr>
  //   //             <th scope="col" colspan="2" style="text-align:center;font-size:15px;">${item.text} </th>
  //   //           </tr>
  //   //           <tr>
  //   //             <td>省：</td>
  //   //             <td>${item.province}</td>
  //   //           </tr>
  //   //           <tr>
  //   //             <td>市：</td>
  //   //             <td>${item.city}</td>
  //   //           </tr>
  //   //           <tr>
  //   //             <td>县/区：</td>
  //   //             <td>${item.district}</td>
  //   //           </tr>
  //   //           <tr>
  //   //             <td>地址：</td>
  //   //             <td>${item.address}</td>
  //   //           </tr>
  //   //         </table>`;
  //   //   return inthtml;
  //   // })
  //   //单击事件
  //   graphicLayer.on(mars3D.EventType.click, function (event:any) {
  //     console.log("你单击了", event);
  //     // if (map.camera.positionCartographic.height > 90000) {
  //     //   var graphic = event.graphic;
  //     //   var position = graphic.position;
  //     //   map.flyToPoint(position, {
  //     //     radius: 5000, //距离目标点的距离
  //     //     duration: 4,
  //     //     complete: function (e:any) {
  //     //       //飞行完成回调方法
  //     //     },
  //     //   });
  //     // }
  //     setVideoShow(true)
  //     setVideoSrc("https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8")
  //   })
  //   for (var i = 0, len = arr.length; i < 100; i++) {
  //     var item = arr[i];
  //     var position = CesiuM.Cartesian3.fromDegrees(+item.lng, +item.lat, item.z || 0);

  //     var primitive = new mars3D.graphic.BillboardPrimitive({
  //       position: position,
  //       style: {
  //         image: "img/cj.png",
  //         scale: 2,
  //         horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
  //         verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
  //         scaleByDistance: new CesiuM.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
  //         label: {
  //           text: item.text,
  //           font_size: 17,
  //           color: CesiuM.Color.AZURE,
  //           outline: true,
  //           outlineColor: CesiuM.Color.BLACK,
  //           outlineWidth: 2,
  //           horizontalOrigin: CesiuM.HorizontalOrigin.LEFT,
  //           verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
  //           pixelOffset: new CesiuM.Cartesian2(15, 0), //偏移量
  //           distanceDisplayCondition: new CesiuM.DistanceDisplayCondition(0.0, 90000),
  //         },
  //       },
  //       attr: item
  //     });
  //     graphicLayer.addGraphic(primitive);
  //   }
  // }

  const createVideoDom = () => {
    videoElement = mars3d.DomUtil.create('video', '', document.body);
    videoElement.setAttribute('muted', 'muted');
    videoElement.setAttribute('autoplay', 'autoplay');
    videoElement.setAttribute('loop', 'loop');
    videoElement.setAttribute('crossorigin', '');
    videoElement.setAttribute('controls', '');
    videoElement.style.display = 'none';

    const sourceContainer = mars3d.DomUtil.create('source', '', videoElement);
    // sourceContainer.setAttribute("src", "http://data.mars3d.cn/file/video/lukou.mp4")
    // sourceContainer.setAttribute("type", "video/mp4")
  };

  const hlsSet = (url: any) => {
    // 加HLS演示数据
    console.log(url);
    // const hlsUrl = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
    const hlsUrl = url;
    if (/\.m3u8$/.test(hlsUrl)) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          videoElement.play();
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = hlsUrl;
        videoElement.addEventListener('loadedmetadata', function () {
          videoElement.play();
        });
      }
      return true;
    } else {
      return false;
    }
  };
  window.closeZw = () => {
    graphicCGzw.clear();
  };

  //初始化地图
  const initmars3D = (mapOptions: any) => {
    const newmapOptions = mars3D.Util.merge(mapOptions, {
      scene: {
        center: centerPosition,
        sceneMode: 3,
        fxaa: true, // 不开启抗锯齿，可视域会闪烁
        globe: {
          depthTestAgainstTerrain: false, // 不加无法投射到地形上
        },
      },
    });

    //创建三维地球场景
    map = new mars3D.Map('cesiumContainer', newmapOptions);
    map.on(mars3d.EventType.renderError, function (event) {
      window.location.reload();
    });
    map.fixedLight = true; // 固定光照，避免gltf模型随时间存在亮度不一致。
    window.map = map;
    // map = window.map
    window.mapLoad = true;
    const param = {
      queryObject: {
        size: 9999,
        page: 0,
      },
    };
    searchVenues(param).then((res) => {
      const result = res.result?.page?.content || [];
      // TODO
      if (timeOut) {
        clearTimeout(timeOut);
      }
      if (result.length) {
        let endResult: any = {};
        let scenseId = '';
        const query = location.search.split('?');
        if (query.length > 1) {
          query[1].split('&').some((item: any) => {
            if (item.indexOf('param') > -1) {
              scenseId = item.split('=')[1];
              return true;
            } else {
              return false;
            }
          });
          result.some((items: any) => {
            if (items.code === scenseId) {
              endResult = items;
              return true;
            } else {
              return false;
            }
          });
        }
        if (!endResult.id) {
          endResult = result[0];
        }
        const views = JSON.parse(endResult.centerPosition || '{}');
        console.log('cxb1234views', views);
        if (views) {
          if (views.lng) {
            map.centerAt(views);
            // TODO xb
            timeOut = setTimeout(() => {
              setSJ(views);
            }, 10000);
          } else {
            map.setCameraView(map.getCameraView());
            // TODO xb
            timeOut = setTimeout(() => {
              setSJ(centerPosition);
            }, 10000);
          }
        } else {
          map.setCameraView(map.getCameraView());
          // TODO xb
          timeOut = setTimeout(() => {
            setSJ(centerPosition);
          }, 10000);
        }
      } else {
        map.setCameraView(map.getCameraView());
        // TODO xb
        timeOut = setTimeout(() => {
          setSJ(centerPosition);
        }, 10000);
      }
      //创建Graphic图层
      graphicLayerOne = new mars3D.layer.GraphicLayer({
        name: '点位图层',
      });
      //创建制高点图层
      graphicLayerZgd = new mars3D.layer.GraphicLayer({
        name: '制高点图层',
      });
      // map.addLayer(graphicLayerOne)
      graphicLayerYxjk = new mars3D.layer.GraphicLayer({
        name: '沿线监控图层',
        clustering: {
          enabled: true,
          pixelRange: 20,
        },
      });
      // map.addLayer(graphicLayerYxjk)
      // 聚合图层点位采集
      graphicLayerTwo = new mars3D.layer.GraphicLayer({
        //点的聚合配置
        clustering: {
          enabled: true,
          pixelRange: 20,
        },
        //tooltip: '{text}',
        name: '资源搜索图层',
      });
      // map.addLayer(graphicLayerTwo)
      rgaphGpsJl = new mars3D.layer.GraphicLayer({
        clustering: {
          enabled: true,
          pixelRange: 20,
        },
        name: '事件处置警力图层',
        zIndex: 99,
      });
      rgaphGpsCl = new mars3D.layer.GraphicLayer({
        clustering: {
          enabled: true,
          pixelRange: 20,
        },
        name: '事件处置车辆图层',
        zIndex: 98,
      });
      rgaphGpsGd = new mars3D.layer.GraphicLayer({
        clustering: {
          enabled: true,
          pixelRange: 20,
        },
        name: '岗点人员图层',
        zIndex: 97,
      });
      graphicGdFz = new mars3D.layer.GraphicLayer({
        clustering: {
          enabled: true,
          pixelRange: 20,
        },
        name: '所有岗点图层',
        zIndex: 90,
      });
      map.addLayer(graphicGdFz);
      rgaphGpsJk = new mars3D.layer.GraphicLayer({
        clustering: {
          enabled: true,
          pixelRange: 20,
        },
        name: '事件处置监控图层',
        zIndex: 97,
      });
      graphicCGzw = new mars3D.layer.GraphicLayer({
        name: '场馆座位展示图层',
        zIndex: 101,
      });
      graphicLayerTy = new mars3D.layer.DivLayer({
        name: '预案推演',
      });
      // 事件处置图层
      graphicLayerSjcz = new mars3D.layer.GraphicLayer({
        name: '事件处置图层',
        zIndex: 90,
      });
      graphicLayerRyhc = new mars3D.layer.GraphicLayer({
        name: '重点追踪图层',
      });
      // 视频融合
      graphicLayerSprhTd = new mars3D.layer.GraphicLayer({
        name: '视频融合图层',
      });
      graphicClcz = new mars3D.layer.GraphicLayer({
        name: '车辆处置模型图层',
        zIndex: 120,
      });
      // threeLayersSet(1990)
      map.on(mars3D.EventType.click, function (event: any) {
        console.log('单击了地图对象', event);
        console.log(changeXyz(event.cartesian));
        // setXhouse(true);
        // if (event?.layer?.options?.name?.indexOf('房屋') > -1) {
        //   console.log('房屋点击',event?.graphic?.options?.attr?.code);
        //   houseId.current = event?.graphic?.options?.attr?.code;
        //   setXhouse(true);
        //   const primitive = new mars3d.graphic.BoxPrimitive({
        //     position: new mars3d.LatLngPoint(120.199798, 30.211085, 100),
        //     style: {
        //       dimensions: new Cesium.Cartesian3(33.0, 54.0, 120),
        //       color: '#ffff00',
        //       opacity: 0.3,
        //       heading: 60,
        //       // label: { text: "鼠标移入会高亮", pixelOffsetY: -30 },
        //       // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
        //       type: 'click',
        //       highlight: {
        //         opacity: 0.8,
        //       },
        //     },
        //     attr: { remark: '示例4' },
        //   });
        //   map.addLayer(graphicLayerOne);
        //   graphicLayerOne.addGraphic(primitive);
        //   // setXhouse(true);
        //   graphicLayerOne.on(mars3d.EventType.click, function () {
        //     setXhouse(true);
        //   });
        // }
        if (spbdSet) {
          const positions = changeXyz(event.cartesian);
          //绑定监听事件
          map.addLayer(graphicLayerOne);
          setCameraP(positions);
          addPoint(positions);
        }
        if (yjczSet) {
          const positions = changeXyz(event.cartesian);
          getEvent(positions);
          if (!showYjtc) setShowYjtc(true);
        }
        const name = event?.graphic?.attr?.name || '';
        const nameF = name.replace(
          /^(\d+)\/([a-zA-Z]\d+)([a-zA-Z]\d+)\/(\d+)\/(\d+)$/,
          '$1-$2-$3-$4-$5',
        );
        if (name != nameF || name.indexOf('座') > -1) {
          // 弹出弹窗
          // console.log(name, nameF)
          let newName = '';
          map.addLayer(graphicCGzw);
          if (name.indexOf('座') > -1) {
            newName = name;
          } else {
            const infos = nameF.split('-');
            if (infos.length == 5) {
              newName = infos[0] + '层 ' + infos[1] + '区 ' + infos[3] + '排 ' + infos[4] + '座';
            }
          }
          if (graphicCGzw) {
            graphicCGzw.clear();
          }
          const newHtml =
            '<div class="pos-label-box"><div style="font-size: 14px;" class="cluster-close"><span class="closeSpan" onclick="closeZw()">X</span></div> <div class="pos-line-two ">' +
            '</div><div class="pos-label-title">座位信息</div><div class="pos-label-content">' +
            '<p><span>座位：</span><span>' +
            newName +
            '</span></p><p><span>姓名：</span><span>' +
            '张三' +
            '</span></p>' +
            '<p><span>身份证号：</span><span>' +
            '339107************1234' +
            '</span></p><p><span>联系方式：</span><span>' +
            '12345678901' +
            '</span></p><p><span>购票时间：</span><span>' +
            '2022-02-03' +
            '</span></p><p><span>验票时间：</span><span>' +
            '2022-02-13' +
            '</span></p>' +
            '<p><span>入口：</span><span>' +
            '内场西北入口' +
            '</span></p></div></div>';
          const nowPosition = new mars3D.LatLngPoint.fromCartesian(event.cartesian);
          const graphic = new mars3d.graphic.DivGraphic({
            position: [nowPosition.lng, nowPosition.lat, nowPosition.alt],
            style: {
              html: newHtml,
              horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000), // 按视距距离显示
              // scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 200000, 0.2),
              clampToGround: true,
            },
          });
          graphicCGzw.addGraphic(graphic);
        }
      });
      createVideoDom();
    });
  };
  useEffect(() => {
    const mapUrl = '/ARBIGdist/config/config.json';

    mars3D.Resource.fetchJson({ url: mapUrl }).then((data: any) => {
      initmars3D(data.map3d); // 构建地图
    });
    // 查询资源字典
    getDict();
  }, []);
  // 地图下方按钮功能
  const menuBtnskbms = [
    { name: '资源搜索', id: 4, iconName: 'ss', liName: '' },
    { name: '预案推演', id: 7, iconName: 'ya', liName: '' },
    { name: '应急处置', id: 8, iconName: 'yj', liName: '' },
    { name: '制高点分析', id: 10, iconName: 'zgd', liName: '' },
    { name: '重点追踪', id: 1, iconName: 'rl', liName: '' },
    { name: '安保日志', id: 12, iconName: 'ab', liName: '' },
    { name: '重点区域', id: 13, iconName: 'zdb', liName: '' },
  ];
  const menuBtnsNow = [
    // { name: "资源搜索", id: 4, iconName: 'iconfont icon-sousuo', liName: '' },
    { name: '沿线监控', id: 5, iconName: 'xl', liName: '' },
    { name: '线路安保', id: 6, iconName: 'shm', liName: '' },
    { name: '应急处置', id: 8, iconName: 'yj', liName: '' },
    { name: '制高点分析', id: 10, iconName: 'zgd', liName: '' },
    { name: '重点追踪', id: 1, iconName: 'rl', liName: '' },
    { name: '区域疏散', id: 11, iconName: 'fkq', liName: '' },
    { name: '视频AR', id: 3, iconName: 'ya', liName: '' },
    // { name: "视频标点", id: 2, iconName: 'iconfont icon-shipinbiaodian', liName: '' },
    { name: '安保日志', id: 12, iconName: 'ab', liName: '' },
    { name: '重点区域', id: 13, iconName: 'zdb', liName: '' },
  ];
  // const [menuBtns, setMenuBtns] = useState<Array<any>>(menuBtnsNow)
  let menuLisNow = menuBtnsNow.map((item, index) => {
    return (
      <li onClick={() => clickMenu(item)} key={index} className={item.liName}>
        <img src={`/img/imageNew/icon/${item.iconName}.png`} className="iconImg" />
        <img src={`/img/imageNew/icon/${item.iconName}1.png`} className="iconImgActive" />
        <br />
        <span className="iconText">{item.name}</span>
      </li>
    );
  });
  const [menuLis, setMenuLis] = useState<any[]>(menuLisNow);
  useEffect(() => {
    if (props.visiableHeader == 'kbms') {
      const menuLisNow1 = menuBtnskbms.map((item, index) => {
        return (
          <li onClick={() => clickMenu(item)} key={index} className={item.liName}>
            <img src={`/img/imageNew/icon/${item.iconName}.png`} className="iconImg" />
            <img src={`/img/imageNew/icon/${item.iconName}1.png`} className="iconImgActive" />
            <br />
            <span className="iconText">{item.name}</span>
          </li>
        );
      });
      setMenuLis(menuLisNow1);
    }
  }, [props.visiableHeader]);
  const [showMenus, setShowMenus] = useState<boolean>(false);
  const clickMenu = (item: any) => {
    const id = item.id;
    const name = item.liName;
    if (props.visiableHeader == 'kbms') {
      if (name) {
        menuBtnskbms.map((items) => {
          if (items.id === id) {
            items.liName = '';
          } else {
            items.liName = '';
          }
        });
      } else {
        menuBtnskbms.map((items) => {
          if (items.id === id) {
            items.liName = 'active';
          } else {
            items.liName = '';
          }
        });
      }
      menuLisNow = menuBtnskbms.map((item, index) => {
        return (
          <li onClick={() => clickMenu(item)} key={index} className={item.liName}>
            {item.liName ? (
              <img
                src={`/img/imageNew/icon/${item.iconName}1.png`}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <span style={{ display: 'inline-block', width: '100%', height: '100%' }}>
                <img src={`/img/imageNew/icon/${item.iconName}.png`} className="iconImg" />
                <img src={`/img/imageNew/icon/${item.iconName}1.png`} className="iconImgActive" />
              </span>
            )}
            <br />
            <span className="iconText">{item.name}</span>
          </li>
        );
      });
    } else {
      if (name) {
        menuBtnsNow.map((items) => {
          if (items.id === id) {
            items.liName = '';
          } else {
            items.liName = '';
          }
        });
      } else {
        menuBtnsNow.map((items) => {
          if (items.id === id) {
            items.liName = 'active';
          } else {
            items.liName = '';
          }
        });
      }
      menuLisNow = menuBtnsNow.map((item, index) => {
        return (
          <li onClick={() => clickMenu(item)} key={index} className={item.liName}>
            {item.liName ? (
              <img
                src={`/img/imageNew/icon/${item.iconName}1.png`}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <span style={{ display: 'inline-block', width: '100%', height: '100%' }}>
                <img src={`/img/imageNew/icon/${item.iconName}.png`} className="iconImg" />
                <img src={`/img/imageNew/icon/${item.iconName}1.png`} className="iconImgActive" />
              </span>
            )}
            <br />
            <span className="iconText">{item.name}</span>
          </li>
        );
      });
    }
    setMenuLis(menuLisNow);
    switch (id) {
      case 1:
        checkPeople(name);
        break;
      case 2:
        checkVideo(name);
        break;
      case 3:
        checkSprh(name);
        break;
      case 4:
        checkZy(name);
        break;
      case 5:
        checkYxjk(name);
        break;
      case 6:
        checkXlab(name);
        break;
      case 7:
        checkYaty(name);
        break;
      case 8:
        checkYjcz(name);
        break;
      case 10:
        checkZgd(name);
        break;
      case 11:
        checkQyss(name);
        break;
      case 12:
        checkAb(name);
        break;
      case 13:
        checkQy(name);
        break;
      default:
        break;
    }
  };
  // 所有排除
  const removeAllAn = () => {
    if (ryheAn) {
      setHcSpDrawer(false);
      ryheAn = false;
      map.removeLayer(graphicLayerRyhc);
      setpeopleData([]);
      setNext_token('');
      showMoreBtn = false;
      setShowMoreBtns(false);
      setFirstBtn(false);
      setPic('');
      setSimilarity(60);
    }
    if (spbdAn) {
      setSpDrarer(false);
      spbdAn = false;
      if (spbdSet) spbdSet = false;
    }
    if (zysuAn) {
      // setShowZy(false)
      zysuAn = false;
      map.removeLayer(graphicLayerTwo);
      setSearchTopValue('');
      setShowSearchCamera(false);
    }
    if (yatyAn) {
      setShowYaty(false);
      yatyAn = false;
      yatyRef.current.endClick();
      yjRef.current.yaSet();
      map.removeLayer(graphicLayerTy);
      clearAllyaty();
    }
    if (yjczAn) {
      yjczAn = false;
      if (yjczSet) yjczSet = false;
      yjRef.current.handelClick();
      map.removeLayer(graphicLayerSjcz);
      if (rgaphGpsJl) {
        map.removeLayer(rgaphGpsJl);
        map.removeLayer(rgaphGpsCl);
        map.removeLayer(rgaphGpsJk);
        // rgaphGpsJk.off(mars3D.EventType.click, clickLayer(event))
      }
    }
    if (zgdAn) {
      setShowZgd(false);
      zgdAn = false;
      clearArr();
      map.removeLayer(graphicLayerZgd);
    }
    if (ssAn) {
      ssAn = false;
      clearAllqyss();
    }
    if (abAn) {
      abAn = false;
      setShowAbrz(false);
    }
    if (yxjkAn) {
      yxjkAn = false;
      map.removeLayer(graphicLayerYxjk);
      setShowYxjk(false);
    }
    if (sprhAn) {
      sprhAn = false;
      if (selectedView) {
        selectedView.play = false;
      }
      graphicLayerSprhTd.clear();
      selectedView = null;
      graphicLayerSprh.show = false;
      window.videoShow = false;
      map.removeLayer(graphicLayerSprhTd);
      map.setSceneOptions({
        center: JSON.parse(window.cjObj.centerPosition || '{}'),
        sceneMode: 3,
        fxaa: true, // 不开启抗锯齿，可视域会闪烁
        globe: {
          depthTestAgainstTerrain: false, // 不加无法投射到地形上
        },
      });
    }
    if (zdqyAn) {
      zdqyAn = false;
      props.setSpSrc([], null);
      for (const keys in zdqyTc) {
        // 删除预案
        map.removeLayer(zdqyTc[keys]);
      }
      zdqyTc = {};
    }
  };
  // 线路安保
  const checkXlab = (val: any) => {
    if (!val) {
      const id = window.cjObj.id;
      const name = encodeURI(window.cjObj.title);
      // const url = '/ARBIGdist/abLine?id=' + id + '&name=' + name;
      // const url = 'http://41.200.14.143/XSWEB/lineSecurity.html?proj=3&typeId=1442'
      // window.open(url, '_blank')?.focus(); // 设置宽高 为 新页面 大小   _blank 代表新页面展示
      history.push(
        // `/aresource/venueManage/edit?id=${record.id}&current=${current}&pageSize=${pageSize}`,
        `/abLine?id=${id}&name=${name}`,
      );
    }
  };
  // 视频ar
  const checkSprh = (val: any) => {
    if (val) {
      sprhAn = false;
      if (selectedView) {
        selectedView.play = false;
      }
      graphicLayerSprhTd.clear();
      selectedView = null;
      graphicLayerSprh.show = false;
      window.videoShow = false;
      map.removeLayer(graphicLayerSprhTd);
      map.setSceneOptions({
        center: JSON.parse(window.cjObj.centerPosition || '{}'),
        sceneMode: 3,
        fxaa: true, // 不开启抗锯齿，可视域会闪烁
        globe: {
          depthTestAgainstTerrain: false, // 不加无法投射到地形上
        },
      });
    } else {
      removeAllAn();
      sprhAn = true;
      window.videoShow = true;
      map.setSceneOptions({
        center: JSON.parse(window.cjObj.centerPosition || '{}'),
        sceneMode: 3,
        fxaa: true, // 不开启抗锯齿，可视域会闪烁
        globe: {
          depthTestAgainstTerrain: true, // 不加无法投射到地形上
        },
      });
      // 默认视频展示
      showSprh();
      map.addLayer(graphicLayerSprhTd);
    }
  };
  // 沿线监控
  const [showYxjk, setShowYxjk] = useState<any>(false);
  const checkYxjk = (val: any) => {
    if (val) {
      yxjkAn = false;
      setShowYxjk(false);
      map.removeLayer(graphicLayerYxjk);
    } else {
      removeAllAn()
      yxjkAn = true
      props.changeRight(false)
      yxjkRadius = 50
      setShowYxjk(true)
      map.addLayer(graphicLayerYxjk)
      // 默认图标点
    }
  };
  const setYxjkRadius = (val: any) => {
    yxjkRadius = val;
  };
  // 重点追踪
  const checkPeople = (val: any) => {
    if (val) {
      setHcSpDrawer(false);
      ryheAn = false;
      map.removeLayer(graphicLayerRyhc);
      setpeopleData([]);
      setNext_token('');
      showMoreBtn = false;
      setShowMoreBtns(false);
      setFirstBtn(false);
      setHcTime([]);
      setPic('');
      setSimilarity(60);
    } else {
      removeAllAn();
      const endTime = formatDate(new Date(new Date().getTime()));
      const startTime = formatDate(new Date(new Date().getTime() - 60 * 60 * 24 * 1000));
      setDefaultTime([moment(startTime), moment(endTime)]);
      setHcSpDrawer(true);
      ryheAn = true;
      props.changeRight(false);
    }
  };
  // 视频标点
  const checkVideo = (val: any) => {
    if (val) {
      setSpDrarer(false);
      spbdAn = false;
      if (spbdSet) spbdSet = false;
      map.removeLayer(graphicLayerOne);
    } else {
      removeAllAn();

      setSpDrarer(true);
      spbdAn = true;
      getTreeData();
      searchVideo('', '');
    }
  };
  //资源搜索
  const checkZy = (val: any) => {
    if (val) {
      // setShowZy(false)
      zysuAn = true;
      map.removeLayer(graphicLayerTwo);
      setSearchTopValue('');
      setShowSearchCamera(false);
    } else {
      removeAllAn();

      // setShowZy(true)
      zysuAn = true;
      map.addLayer(graphicLayerTwo);
      // 默认监控
      searchTcs('监控点位', '');
    }
  };
  // 预案推演
  const [yatyData, setYatyData] = useState<any>([]);
  const checkYaty = (val: any) => {
    if (val) {
      setShowYaty(false);
      yatyRef.current.endClick();
      map.removeLayer(graphicLayerTy);
      yatyAn = false;
      clearAllyaty();
    } else {
      removeAllAn();
      map.addLayer(graphicLayerTy);
      setShowYaty(true);
      yatyAn = true;
      const outParam = {
        pageSize: 1,
        pageNumber: 1,
        task: '',
        type: '1',
        activityId: window.hdObj.id,
      };
      queryYaty(outParam).then((results: any) => {
        if (results.data.rows.length) {
          const param = {
            plandeducingId: results.data.rows[0].id,
          };
          queryYatyDetail(param).then((res: any) => {
            const result = res.data;
            if (result.totalCount) {
              setYatyData(result.rows);
            } else {
              setYatyData([]);
            }
            yatyRef?.current?.handelClick();
            // yatyRef.current.endClick()
          });
        }
      });
    }
  };
  // 应急处置
  const checkYjcz = (val: any) => {
    // debugger
    if (val) {
      yjczAn = false;
      if (yjczSet) yjczSet = false;
      if (rgaphGpsJl) {
        map.removeLayer(rgaphGpsJl);
        map.removeLayer(rgaphGpsCl);
        map.removeLayer(rgaphGpsJk);
      }
      map.removeLayer(graphicLayerSjcz);
    } else {
      removeAllAn();
      yjczAn = true;
      const obj = {
        liName: '',
        id: '999',
      };
      clickMenu(obj);
    }
  };
  // 制高点
  const checkZgd = (val: any) => {
    if (val) {
      setShowZgd(false);
      zgdAn = false;
      clearArr();
      map.removeLayer(graphicLayerZgd);
    } else {
      removeAllAn();
      map.addLayer(graphicLayerZgd);
      setShowZgd(true);
      zgdAn = true;
      props.changeRight(false);
    }
  };
  // 区域疏散
  const checkQyss = (val: any) => {
    if (val) {
      ssAn = false;
      clearAllqyss();
    } else {
      removeAllAn();
      ssAn = true;
      getQyss();
    }
  };
  // 安保日志
  const [abCode, setAbCode] = useState<string>('');
  // 获取管辖单位code
  const initFun = () => {
    const organizationId = window.cjObj.organizationId;
    if (organizationId) {
      getOrgDetail({ id: organizationId })
        .then((res: any) => {
          if (res.code === 200) {
            const info = res.result.detail || {};
            const stop = info.code.length - 2;
            const code = info.code.substring(0, stop);
            setAbCode(code);
          }
        })
        .catch((err: any) => {
          console.log(err.message);
          // message.error(err.message);
        });
    }
  };
  const checkAb = (val: any) => {
    if (val) {
      abAn = false;
      setShowAbrz(false);
    } else {
      initFun();
      removeAllAn();
      abAn = true;
      setShowAbrz(true);
    }
  };
  // 重点区域
  const checkQy = (val: any) => {
    if (val) {
      zdqyAn = false;
      props.setSpSrc([], null);
      for (const keys in zdqyTc) {
        // 删除预案
        map.removeLayer(zdqyTc[keys]);
      }
      zdqyTc = {};
    } else {
      removeAllAn();
      zdqyAn = true;
      // searchZdqyVideo()
    }
  };
  // 重点区域开始
  const searchZdqyVideo = () => {
    const param = {
      type: zdArr['重点区域'],
      sceneId: window.cjObj.id,
    };
    queryTcty(param).then((res: any) => {
      const result = res.data.rows;
      if (result.length) {
        result.forEach((item: any) => {
          zdqyTc[item.id] = new mars3D.layer.GraphicLayer({
            name: '重点区域预案',
          });
          const json = JSON.parse(item.entity || '{}').GeoJSON;
          zdqyTc[item.id + '3dTiles'] = '';
          map.addLayer(zdqyTc[item.id]);
          try {
            const new3dLayer = JSON.parse(
              JSON.parse(item?.entity || '{}')?.modelTreeData?.data?.entity || '{}',
            );
            new3dLayer.id = JSON.parse(item?.entity || '{}')?.modelTreeData?.data?.id || '';
            zdqyTc[item.id + '3dTiles'] = props.loadModel(new3dLayer, zdqyTc[item.id + '3dTiles']);
          } catch (error) {
            console.log(error);
          }
          const options = {
            clear: true,
            // flyTo: true
          };
          if (!json) {
            return;
          }
          zdqyTc[item.id].loadGeoJSON(json, options);
          // 查询id下的摄像机
          zdqyTc[item.id].eachGraphic((graphic: any) => {
            const graphicData = graphic.options?.attr?.data?.entity;
            if (graphicData) {
              const info = JSON.parse(graphicData || '{}').info?.self;
              // if (info && info.length) {
              innerHtml(info, graphic);
              // }
            }
            // graphic.on(mars3D.EventType.click, function (event: any) {
            //   if (event.graphic.options.type === 'polyline' || event.graphic.options.type === 'polygon') {
            //     if (item.videoIdList) {
            //       const newSrcs = {
            //         hkSrc: [],
            //         dhSrc: item.videoIdList
            //       }
            //       props.setSpSrc(newSrcs, true)
            //     }
            //   }
            // })
          });
        });
        // const params = {
        //   idList: result
        // }
        // videoQuery(params).then((rest: any) => {
        //   const dhSrc: any = []
        //   const hkSrc: any = []
        //   rest.data.rows.forEach((item: any) => {
        //     if (item.videoTypeName === 'dhlw' && dhSrc.length < 9) {
        //       dhSrc.push(item.videoId)
        //     }
        //     if (item.videoTypeName === 'HLS' && hkSrc.length < 9) {
        //       hkSrc.push(item.videoUrl)
        //     }
        //   });
        //   const newParam = {
        //     dhSrc: dhSrc,
        //     hkSrc: hkSrc
        //   }
        //   props.setSpSrc(newParam, true)
        // })
      }
      setTl();
    });
  };
  const setZdqyTc = (val: any) => {
    for (const keys in zdqyTc) {
      // 删除预案
      map.removeLayer(zdqyTc[keys]);
    }
    zdqyTc = {};
    zdqyVideo = {};
    if (val.length) {
      val.forEach((item: any) => {
        zdqyTc[item.id] = new mars3D.layer.GraphicLayer({
          name: '重点区域预案',
        });
        const json = JSON.parse(item.entity || '{}').GeoJSON;
        zdqyTc[item.id + '3dTiles'] = '';
        zdqyVideo[item.id] = item.videoIdList;
        map.addLayer(zdqyTc[item.id]);
        try {
          const new3dLayer = JSON.parse(
            JSON.parse(item?.entity || '{}')?.modelTreeData?.data?.entity || '{}',
          );
          new3dLayer.id = JSON.parse(item?.entity || '{}')?.modelTreeData?.data?.id || '';
          zdqyTc[item.id + '3dTiles'] = props.loadModel(new3dLayer, zdqyTc[item.id + '3dTiles']);
        } catch (error) {
          console.log(error);
        }
        const options = {
          clear: true,
          flyTo: true
        };
        if (!json) {
          return;
        }
        zdqyTc[item.id].loadGeoJSON(json, options);
        // 查询id下的摄像机
        zdqyTc[item.id].eachGraphic((graphic: any) => {
          // debugger
          const graphicData = graphic.options?.attr?.data?.entity;
          if (graphicData) {
            const info = JSON.parse(graphicData || '{}').info?.self;
            // if (info && info.length) {
            innerHtml(info, graphic);
            // }
          }
        });
      });
    }
    // TODO xb
    window.xzdArr = zdqyVideo;
  };
  const changeTableKey = (val: any) => {
    for (const keys in zdqyTc) {
      // 点位隐藏
      if (val.indexOf(keys) === -1) {
        if (zdqyTc[keys]) {
          zdqyTc[keys].show = false;
        }
      } else {
        if (zdqyTc[keys]) {
          zdqyTc[keys].show = true;
        }
      }
    }
  };
  // 视频批量
  const setPlsp = (val: any) => {
    let arr: any = [];
    val.forEach((item: any) => {
      if (zdqyVideo[item]) {
        arr = arr.concat(zdqyVideo[item]);
      }
    });
    if (arr.length > 9) {
      arr = arr.slice(0, 9);
    }
    const newSrcs = {
      hkSrc: [],
      dhSrc: arr,
    };
    // console.log(arr)
    props.setSpSrc(newSrcs, true);
  };
  const setoneSp = (val: any) => {
    let arr: any = [];
    if (val.length > 9) {
      arr = val.slice(0, 9);
    } else {
      arr = val;
    }
    const newSrcs = {
      hkSrc: [],
      dhSrc: arr,
    };
    props.setSpSrc(newSrcs, true);
  };
  // 重点区域结束
  // 重点追踪开始
  const [hcPic, setPic] = useState<any>('');
  const [cjPic, setCjPic] = useState<any>('');
  const [cjPicShow, setCjPicShow] = useState<boolean>(false);
  const [showMoreBtns, setShowMoreBtns] = useState<boolean>(true);
  const [firstBtn, setFirstBtn] = useState<boolean>(false);
  const setImg = () => {
    const ids = document.getElementById('file');
    if (ids) {
      ids.click();
    }
  };
  const changepic = (e: any) => {
    e.preventDefault();
    const reads = new FileReader();
    const file = e.target.files[0];
    // const type = file.type
    // const size = file.size
    reads.readAsDataURL(file);
    reads.onloadend = () => {
      setCjPic(reads.result);
      setCjPicShow(true);
    };
  };
  // 图片裁剪
  const onCropSuccess = (dataUrl: any) => {
    // console.log(dataUrl)
    setCjPic('');
    setCjPicShow(false);
    setPic(dataUrl);
  };
  const cancleCj = () => {
    setCjPic('');
    setCjPicShow(false);
  };
  const [peopleData, setpeopleData] = useState<any[]>([]);
  const [next_token, setNext_token] = useState<string>('');
  const peopleColumn = [
    {
      align: 'center',
      title: '时间',
      dataIndex: 'frame_timestamp',
      width: 80,
      // ellipsis: {
      //   showTitle: false,
      // },
      // render: (time: any) => (
      //   <Tooltip placement="topLeft" title={time}>
      //     {time}
      //   </Tooltip>
      // ),
    },
    {
      align: 'center',
      title: '照片',
      dataIndex: 'image_data',
      defaultSortOrder: 'descend',
      render: (faceImgUrl: any) => (
        <Tooltip placement="topLeft" title={faceImgUrl}>
          {window.cjObj.entity && JSON.parse(window.cjObj.entity)?.debug == 1 ? (
            <img src={`img/json/${faceImgUrl}.jpg`} style={{ width: '60px', height: '60px' }} />
          ) : (
            <img src={faceImgUrl} style={{ width: '60px', height: '60px' }} />
          )}
        </Tooltip>
      ),
      // sorter: (a:any, b:any) => a.age - b.age,
    },
    {
      align: 'center',
      title: '相似度',
      width: 70,
      dataIndex: 'score',
      render: (score: any) => (
        <Tooltip placement="topLeft" title={score * 100}>
          {(score * 100).toFixed(2)}%
        </Tooltip>
      ),
    },
    {
      align: 'center',
      title: '设备名称',
      width: 100,
      dataIndex: 'device_name',
      render: (device_name: any) => (
        <Tooltip placement="topLeft" title={device_name}>
          {device_name}
        </Tooltip>
      ),
    },
  ];
  const [peopleColumns] = useState<any[]>(peopleColumn);
  // 时间戳转时间
  const changeTime = (time: any) => {
    const date = new Date(parseInt(time));
    const y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const d = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '-';
    const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return y + M + d + h + m + s;
  };
  // 查询
  const [loading, setLoad] = useState<boolean>(false);
  const [hcTime, setHcTime] = useState<any>([]);
  const [defaultTime, setDefaultTime] = useState<any>([
    moment('2022-01-01 00:00:00'),
    moment('2022-01-02 00:00:00'),
  ]);
  const setTime = (date: any, dateString: any) => {
    setHcTime(dateString);
  };
  // 重点追踪地图点位
  const setPointLine = (arr: any) => {
    let endArr: any = [];
    const newArr = arr.map((item: any) => {
      return item.device_id;
    });
    window.videoList.map((item: any) => {
      if (item.vvideoId && item.vvideoId.indexOf('_') > -1) {
        const ids = item.vvideoId.split('_')[0];
        const newIndex = newArr.indexOf(ids);
        if (newIndex > -1) {
          const param = [
            item.lon,
            item.lat,
            arr[newIndex].image_data,
            arr[newIndex].device_name,
            arr[newIndex].frame_timestamp,
            arr[newIndex].score,
          ];
          endArr.push(param);
        }
      }
    });
    endArr = [...new Set(endArr)];
    map.removeLayer(graphicLayerRyhc);
    map.addLayer(graphicLayerRyhc);
    endArr.forEach((item: any) => {
      const point = new mars3D.graphic.BillboardEntity({
        name: '人员核查',
        position: [item[0], item[1], 0],
        style: {
          image: '/img/face.png',
          scale: 0.4,
          pixelOffset: new CesiuM.Cartesian2(0, 0), //偏移量
          horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
          verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
          visibleDepth:false
        },
      });
      graphicLayerRyhc.addGraphic(point);
      const innerBindPop =
        '<div class="ryhcTable">' +
        '<div class="left"><img src="' +
        item[2] +
        '"></div>' +
        '<div class="right"><p>设备名称: ' +
        item[3] +
        '</p>' +
        '<p>抓拍时间: ' +
        item[4] +
        '</p><p>相似度: ' +
        Number(item[5] * 100) +
        '%' +
        '</p>' +
        '</div></div>';
      point.bindPopup(
        function () {
          return innerBindPop;
        },
        {
          direction: 'top',
          offsetY: -20,
          template: false,
        },
      );
    });
    const graphic = new mars3d.graphic.PolylinePrimitive({
      positions: endArr.map((item: any) => {
        const param = [item[1], item[1]];
        return param;
      }),
      style: {
        width: 6,
        material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
          color: '#e990f9',
          image: '/img/lineClr2.png',
          speed: 1,
        }),
      },
    });
    graphicLayerRyhc.addGraphic(graphic);
  };
  // 重点追踪地图点位
  const setPointLinejson = (arr: any) => {
    let endArr: any = [];
    const newArr = arr.map((item: any) => {
      return item.device_id;
    });
    // window.videoList.map((item: any) => {
    //   if (item.vvideoId.indexOf("_") > -1) {
    //     const ids = item.vvideoId.split("_")[0]
    //     const newIndex = newArr.indexOf(ids)
    //     if (newIndex > -1) {
    //       const param = [item.lon, item.lat, arr[newIndex].image_data, arr[newIndex].device_name, arr[newIndex].frame_timestamp, arr[newIndex].score]
    //       endArr.push(param)
    //     }
    //   }
    // })
    arr.map((item: any) => {
      const param = [
        item.longitude,
        item.latitude,
        item.image_data,
        item.device_name,
        item.frame_timestamp,
        item.score,
      ];
      endArr.push(param);
    });
    endArr = [...new Set(endArr)];
    map.removeLayer(graphicLayerRyhc);
    map.addLayer(graphicLayerRyhc);
    endArr.forEach((item: any) => {
      const point = new mars3D.graphic.BillboardEntity({
        name: '人员核查',
        position: [item[0], item[1], 0],
        style: {
          image: '/img/face.png',
          scale: 0.2,
          pixelOffset: new CesiuM.Cartesian2(0, 0), //偏移量
          horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
          verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
          visibleDepth:false
        },
      });
      graphicLayerRyhc.addGraphic(point);
      const innerBindPop =
        '<div class="ryhcTable">' +
        '<div class="left"><img src="/img/json/' +
        item[2] +
        '.jpg"></div>' +
        '<div class="right"><p>设备名称: ' +
        item[3] +
        '</p>' +
        '<p>抓拍时间: ' +
        item[4] +
        '</p><p>相似度: ' +
        Number(item[5] * 100) +
        '%' +
        '</p>' +
        '</div></div>';
      point.bindPopup(
        function () {
          return innerBindPop;
        },
        {
          direction: 'top',
          offsetY: -20,
          template: false,
        },
      );
    });
    const graphic = new mars3d.graphic.PolylinePrimitive({
      positions: endArr.map((item: any) => {
        const param = [item[0], item[1]];
        return param;
      }),
      style: {
        width: 6,
        material: mars3d.MaterialUtil.createMaterial(mars3d.MaterialType.LineFlow, {
          color: '#ffffff',
          image: '/img/lineClr2.png',
          speed: 1,
        }),
      },
    });
    graphicLayerRyhc.addGraphic(graphic);
  };
  const searchArr = () => {
    if (showMoreBtn) {
      return;
    }
    setLoad(true);
    const params = {
      topn: 1,
      conditions: [
        {
          image_data: hcPic.replace(/^data:image\/\w+;base64,/, ''),
        },
      ],
      threshold: similarity / 100,
      begin_time: new Date(hcTime[0]).getTime() / 1000,
      end_time: new Date(hcTime[1]).getTime() / 1000,
      query_extinfo: true,
      max_results: 10,
      next_token: next_token,
    };
    const obj = window.cjObj.entity && JSON.parse(window.cjObj.entity);
    if (obj?.debug == 1) {
      ryhcOldJSON(params)
        .then((res: any) => {
          if (window.cjObj.id === 'de7cb93e-ace1-4120-baca-815b70ea93de') {
            const nowData = res.data.Result[1].map((item: any) => {
              const param = {
                score: item.score,
                camera_id: item.extened_info?.camera_id,
                device_id: item.extened_info?.device_id,
                device_name: item.extened_info?.device_name,
                frame_timestamp: moment()
                  .add(item.extened_info?.frame_timestamp, 'minutes')
                  .format('YYYY-MM-DD HH:mm:ss'),
                image_data: item.extened_info?.image_data,
                latitude: item.extened_info?.latitude,
                longitude: item.extened_info?.longitude,
                original_image_data: item.extened_info?.original_image_data,
              };
              return param;
            });
            setpeopleData([...peopleData, ...nowData]);
            setPointLinejson([...peopleData, ...nowData]);
          } else {
            const nowData = res.data.Result[0].map((item: any) => {
              const param = {
                score: item.score,
                camera_id: item.extened_info?.camera_id,
                device_id: item.extened_info?.device_id,
                device_name: item.extened_info?.device_name,
                frame_timestamp: moment()
                  .add(item.extened_info?.frame_timestamp, 'minutes')
                  .format('YYYY-MM-DD HH:mm:ss'),
                image_data: item.extened_info?.image_data,
                latitude: item.extened_info?.latitude,
                longitude: item.extened_info?.longitude,
                original_image_data: item.extened_info?.original_image_data,
              };
              return param;
            });
            setpeopleData([...peopleData, ...nowData]);
            setPointLinejson([...peopleData, ...nowData]);
          }
          setNext_token(res.data.next_token);
          setLoad(false);
          if (!res.data.next_token) {
            showMoreBtn = true;
            setShowMoreBtns(true);
          } else {
            setFirstBtn(true);
          }
        })
        .catch((e) => {
          setLoad(false);
          message.error(e?.msg || '检索失败');
        });
    } else {
      ryhcOld(params)
        .then((res: any) => {
          // console.log(res)
          const nowData = res.data.Result.map((item: any) => {
            const param = {
              score: item.score,
              camera_id: item.extened_info?.camera_id,
              device_id: item.extened_info?.device_id,
              device_name: item.extened_info?.device_name,
              frame_timestamp: changeTime(item.extened_info?.frame_timestamp),
              image_data: item.extened_info?.image_data,
              latitude: item.extened_info?.latitude,
              longitude: item.extened_info?.longitude,
              original_image_data: item.extened_info?.original_image_data,
            };
            return param;
          });
          setpeopleData([...peopleData, ...nowData]);
          setPointLine([...peopleData, ...nowData]);
          setNext_token(res.data.next_token);
          setLoad(false);
          if (!res.data.next_token) {
            showMoreBtn = true;
            setShowMoreBtns(true);
          } else {
            setFirstBtn(true);
          }
        })
        .catch((e) => {
          setLoad(false);
          console.log(e?.msg || '检索失败');
          // message.error(e?.msg || '检索失败');
        });
    }
  };
  // 重点追踪抽屉展示
  const [hcSpDrawer, setHcSpDrawer] = useState<boolean>(false);
  // const onClose = () => {
  //   setHcSpDrawer(false);
  // };
  const [similarity, setSimilarity] = useState<number>(60);
  const changeSimilartiy = (value: any) => {
    setSimilarity(value);
  };
  useEffect(() => {
    showMoreBtn = false;
    setpeopleData([]);
    setShowMoreBtns(false);
    setFirstBtn(false);
  }, [hcTime, hcPic, similarity]);
  //重点追踪结束
  // loading
  // const [loadingShow, setLoading] = useState<boolean>(false);
  // const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  // 视频标点开始
  const [spDrarer, setSpDrarer] = useState<boolean>(false);
  const [showRightSp, setShowRightSp] = useState<boolean>(false);
  const [vdtype, setVdType] = useState<string>('1');
  let allVideos: any = [];
  const [videos, setVideos] = useState<any[]>([]);
  const changeLeft = (arr: any, flag: any) => {
    const showVideo = arr.map((item: any, index: any) => {
      return (
        <li
          onClick={() => clickVideo(item, index)}
          key={index}
          className={item.flag ? 'active' : ''}
        >
          <span>{item.name}</span>
        </li>
      );
    });
    setVideos(showVideo);
  };
  const [category, setCateGory] = useState<string>('');
  const changeCategory = (e: any) => {
    setCateGory(e.target.value);
  };
  const [carmeraLoad, setCareraLoad] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<string>('');
  const [videoGlId, setVideoGlId] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const changeTopSearch = (e: any) => {
    setSearchValue(e.target.value);
  };
  // 查询视频
  const searchVideo = (value: any, type: any) => {
    if (spbdSet) {
      setSpbd(false);
      spbdSet = false;
      map.removeLayer(graphicLayerOne);
    }
    let typeNow = '';
    if (type) {
      typeNow = type;
    } else {
      typeNow = vdtype;
    }
    let param = {};
    if (typeNow === '1') {
      param = {
        name: value,
        pageNumber: 1,
        pageSize: 10,
      };
    } else if (typeNow === '2') {
      param = {
        name: value,
        hasMarker: '0',
        pageNumber: 1,
        pageSize: 10,
      };
    } else if (typeNow === '3') {
      param = {
        name: value,
        hasMarker: '1',
        pageNumber: 1,
        pageSize: 10,
      };
    } else {
      param = {
        name: value,
        pageNumber: 1,
        pageSize: 10,
      };
    }
    setCareraLoad(true);
    videoQuery(param).then((res) => {
      const result = res.data.rows;
      result.map((item: any, index: number) => {
        if (index === 0) {
          item.flag = true;
          setVideoId(item.id);
          // 执行查询详情
          setVideoDetail(item);
          videoDetailQuerys(item.id);
        } else {
          item.flag = false;
        }
      });
      setCareraLoad(false);
      setShowRightSp(true);
      allVideos = result;
      changeLeft(result, false);
    });
  };
  const changeType = (e: any) => {
    const value = e.target.value;
    setVdType(value);
    searchVideo(searchValue, value);
  };

  const clickVideo = (item: any, index: number) => {
    if (spbdSet) {
      setSpbd(false);
      spbdSet = false;
      map.removeLayer(graphicLayerOne);
    }
    if (allVideos[index].flag) {
      return;
    } else {
      allVideos.map((items: any, indexs: number) => {
        if (indexs === index) {
          items.flag = true;
          setVideoId(item.id);
          // 执行查询详情
          setVideoDetail(item);
          videoDetailQuerys(item.id);
        } else {
          items.flag = false;
        }
      });
      changeLeft(allVideos, false);
    }
  };
  // 查询摄像机详情
  const videoDetailQuerys = (id: any) => {
    const param = {
      vedioID: id,
    };
    videoDetailQuery(param).then((res) => {
      if (res.data.rows && res.data.rows.length) {
        const details = res.data.rows[0];
        setImgValue(details.iconID);
        urlSet(details.iconID);
        setCateGory(details.category);
        const obj = {
          lng: details.lon,
          lat: details.lat,
          height: details.height,
        };
        setCameraP(obj);
        setCameraType(details.type);
        // 设置图层id并展示图层模型
        setMOdelTree(details.layerID);
        setModelMap(details.layerID);
        setVideoGlId(details.id);
      } else {
        setImgValue('0');
        setCateGory('');
        setCameraP({});
        setCameraType('1');
        setMOdelTree('');
        setVideoGlId('');
      }
    });
  };
  // 地图模型展示
  const setModelMap = (id: any) => {
    dataList.some((item: any) => {
      if (item.key === id) {
        // 加载模型
        const entity = JSON.parse(item.data.entity || '{}');
        entity.id = item.data.id;
        map.removeLayer(threeLayerSp);
        threeLayerSp = props.loadModel(entity, threeLayerSp);
      }
    });
  };
  interface videoObj {
    name?: string;
    videoUrl?: string;
    address?: string;
  }
  const [videoDetail, setVideoDetail] = useState<videoObj>({});
  const [cameraType, setCameraType] = useState<string>('1');
  const setCameraTypes = (value: any) => {
    setCameraType(value);
  };
  const [imgValue, setImgValue] = useState<string>('0');
  const changeImg = (e: any) => {
    const value = e.target.value;
    setImgValue(value);
    urlSet(value);
  };
  // 改变当前url
  const urlSet = (value: any) => {
    switch (value) {
      case '0':
        mapSpbd = '/img/mapImg/bqLine.svg';
        break;
      case '1':
        mapSpbd = '/img/mapImg/qjLine.svg';
        break;
      case '2':
        mapSpbd = '/img/mapImg/qqLine.svg';
        break;
      case '3':
        mapSpbd = '/img/mapImg/bqOutline.svg';
        break;
      case '4':
        mapSpbd = '/img/mapImg/qjOutline.svg';
        break;
      case '5':
        mapSpbd = '/img/mapImg/qqOutline.svg';
        break;
      default:
        break;
    }
  };
  const [spbd, setSpbd] = useState<boolean>(false);
  const changeSpbd = (checked: any) => {
    setSpbd(checked);
    spbdSet = checked;
    if (checked) {
      // 移除图标点集
      map.addLayer(graphicLayerOne);
      if (cameraPosition.lng) {
        addPoint(cameraPosition);
      }
    } else {
      map.removeLayer(graphicLayerOne);
    }
  };
  const changeXyz = (position: any) => {
    const positions = new mars3D.LatLngPoint.fromCartesian(position);
    // console.log('lon=' + CesiuM.Math.toDegrees(wgs84.longitude) + ',lat=' + CesiuM.Math.toDegrees(wgs84.latitude) + ',height=' + wgs84.height);
    const newPositions = {
      lng: positions._lng,
      lat: positions._lat,
      height: positions._alt,
    };
    return newPositions;
  };
  let spPoint = ''; // 视频标点设置
  // 添加图标点
  const addPoint = (position: any) => {
    if (spPoint) {
      graphicLayerOne.removeGraphic(spPoint);
    }
    spPoint = new mars3D.graphic.BillboardEntity({
      name: '视频标点',
      position: [position.lng, position.lat, position.height],
      style: {
        image: mapSpbd,
        scale: 1,
        pixelOffset: new CesiuM.Cartesian2(0, 0), //偏移量
        horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
        verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
        visibleDepth:false
      },
    });
    graphicLayerOne.addGraphic(spPoint);
  };
  interface cameraP {
    lng?: string;
    lat?: number;
    height?: string;
  }
  const [cameraPosition, setCameraP] = useState<cameraP>({});
  const setPosition = (val: any) => {
    console.log(val);
  };
  const [treeDatas, setTreeDatas] = useState<any[]>([]);
  // const [treeDataList, setTreeDataList] = useState<Array<any>>([])
  // 模型value
  const [modelTreeData, setMOdelTree] = useState<string>('');
  const changeModelTree = (value: any, node: any) => {
    // console.log(value,node)
    if (node.children) {
      return;
    } else {
      const entity = JSON.parse(node.data.entity || '{}');
      entity.id = node.data.id;
      map.removeLayer(threeLayerSp);
      threeLayerSp = props.loadModel(entity, threeLayerSp);
      setMOdelTree(value);
    }
  };
  // 加载3d模型
  // const loadModel = (entity: any, flag: boolean) => {
  //   if (!flag) {
  //     map.removeLayer(threeLayerSp)
  //   }
  //   let rotax = 0
  //   let rotay = 0
  //   let rotaz = 0
  //   if (entity.offset && entity.offset.pitch) {
  //     rotax = parseInt(entity.offset.pitch)
  //   } else {
  //     rotax = 0
  //   }
  //   if (entity.offset && entity.offset.roll) {
  //     rotay = parseInt(entity.offset.roll)
  //   } else {
  //     rotay = 0
  //   }
  //   if (entity.offset && entity.offset.heading) {
  //     rotaz = parseInt(entity.offset.heading)
  //   } else {
  //     rotaz = 0
  //   }
  //   entity.show = true
  //   let layer = ''
  //   try {
  //     layer = new mars3D.layer.TilesetLayer({
  //       ...entity,
  //       center: map.getCameraView(),
  //       position: entity.position?entity.position:entity.offset
  //         ? { lng: entity?.offset?.x, lat: entity?.offset?.y, alt: entity?.offset?.z }
  //         : {},
  //       rotation: entity.rotation?entity.rotation:{ x: rotax, y: rotay, z: rotaz },
  //       show: true,
  //     })
  //   } catch (e) {
  //     message.error("后台数据错误")
  //   }
  //   return layer
  //   map.addLayer(layer)
  //   // 加载完成事件
  //   layer.on(mars3D.EventType.load, function (event: any) {
  //     const data = event.tileset
  //     eventTarget.fire("tiles3dLayerLoad", { data, layer })
  //   })
  //   // console.log(threeLayers)
  // }
  const getTreeData = () => {
    const param = {
      layerTypeList: ['3dtiles'],
      parentId: 'YYSG',
    };
    getModelLayer(param).then((res) => {
      // console.log(res)
      const datas = res.result.result;
      if (datas) {
        arrLx(datas);
        // setTreeDataList(dataList)
        setTreeDatas(datas);
      }
    });
  };
  // 轮询
  const arrLx = (arr: any) => {
    arr.forEach((item: any) => {
      item.value = item.key;
      if (item.children) {
        arrLx(item.children);
      } else {
        dataList.push(item);
      }
    });
  };
  const saveCamera = () => {
    const param = {
      height: cameraPosition.height,
      lat: cameraPosition.lat,
      layerID: modelTreeData,
      iconID: imgValue,
      lon: cameraPosition.lng,
      type: cameraType,
      vedioID: videoId,
      category: category,
    };
    addLayerCamera(param).then((res) => {
      if (res.success) {
        message.success('保存成功');
      }
    });
  };
  const removeCamera = () => {
    if (videoGlId) {
      const param = [videoGlId];
      removeCameraDW(param).then((res) => {
        if (res.success) {
          message.success('删除成功');
          videoDetailQuerys(videoId);
        }
      });
    } else {
      message.info('没有绑定的点位，删除失败');
    }
  };
  mars3d.LngLatPoint.toCartesian([120.243963, 30.049732, 15.2]);
  // 预览飞行
  const flyToPoint = () => {
    map.flyToPoint(
      new mars3D.LatLngPoint(cameraPosition.lng, cameraPosition.lat, cameraPosition.height),
    );
  };
  // 视频标点结束
  // 资源搜索开始
  const zydChange = (e: any) => {
    e.preventDefault();
    if (props.showLeftTree) {
      props.clickShowTree();
    }
  };
  // const [showZy, setShowZy] = useState<boolean>(false)
  const menuList = [
    { name: '监控', color: 'rgb(2, 37, 253)' },
    { name: '卡口', color: 'rgb(255, 68, 95)' },
    { name: '人脸', color: 'rgb(255, 84, 184)' },
    { name: '井盖', color: 'rgb(24, 255, 255)' },
    { name: '重点人员', color: 'rgb(231, 79, 40)' },
  ];
  const menuBf = menuList.map((item, index) => {
    return (
      <Menu.Item key={index} onClick={() => clickZyss(item, index)} className="topList">
        <span className="bd" style={{ background: item.color }} />
        <span>{item.name}</span>
      </Menu.Item>
    );
  });
  const menu = <Menu className="topListAll">{menuBf}</Menu>;
  const [topName, setTopName] = useState<string>('监控'); // 左侧类型
  const [endName, setEndName] = useState<string>(''); // 最终的类型
  const [searchTopValue, setSearchTopValue] = useState<any>('');
  const changeSearchValue = (e: any) => {
    setSearchTopValue(e.target.value);
  };
  const getDict = () => {
    getDictfindAll({ parentId: '95389895-59d1-4004-8429-b079d66a48bd' })
      .then((res) => {
        const result = res.result.result;
        result.forEach((item: any) => {
          if (item.name === '卡口') {
            zdArr['卡口'] = item.id;
          }
          if (item.name === '人脸') {
            zdArr['人脸'] = item.id;
          }
          if (item.name === '井盖') {
            zdArr['井盖'] = item.id;
          }
        });
      })
      .catch((err) => {
        console.log(err.message);
        // message.error(err.message);
      });
    getDictfindAll({ parentId: 'ccdf1602-38b2-4987-886c-944ac533b891' }).then((res) => {
      const result = res.result.result;
      result?.some((item: any) => {
        if (item.name === '重点人员') {
          zdArr['重点人员'] = item.id;
          return;
        }
      });
    });
    getDictfindAll({ parentId: '66867d78-c4b7-4dd9-a5f8-e3171e620056' })
      .then((res) => {
        const result = res.result.result;
        result.map((item: any) => {
          zdArr[item.name] = item.id;
        });
      })
      .catch((err) => {
        console.log(err.message);
        // message.error(err.message);
      });
  };
  // 资源搜索聚合点点位信息
  const clickZyss = (item: any, index: number) => {
    if (showSearchCamera) {
      setShowSearchCamera(false);
      setSearchTopValue('');
    }
    setTopName(item.name);
    // graphicLayerTwo.clear()
    return; //zsx
    switch (index) {
      case 0:
        // 监控
        searchTcs('监控点位');
        break;
      case 1:
        // 卡口
        searchTcs('车辆卡口');
        break;
      case 2:
        // 人脸
        searchTcs('人脸识别');
        break;
      case 3:
        // 井盖
        searchTcs('井盖');
        break;
      case 4:
        // 重点人员
        searchTcs('重点人员');
        break;
      default:
        break;
    }
  };
  // 查询监控点位
  const searchTcs = (name: any, startName?: any) => {
    props.setTcShow(name, startName);
    // graphicLayerTwo.clear()
    // map.getLayers({
    //   basemaps: false,
    //   layers: true,
    // }).some((item: any) => {
    //   if (item.options.name === name) item.show = true
    //   props.setTcShow(name)
    //   return true
    // });
  };
  // 聚合点展示
  const addFeature = (graphicLayer: any, arr: any) => {
    //单击事件
    // graphicLayer.on(mars3D.EventType.click, (event: any) => clickLayer(event));
    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i];
      const position = new mars3D.LatLngPoint(item.lng, item.lat, item.z || 0);

      const primitive = new mars3D.graphic.BillboardEntity({
        position: position,
        style: {
          image: item.iconUrl,
          // image: '/img/mapImg/yjcz.svg',
          scale: item.scale || 0.4,
          horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
          verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
          scaleByDistance: new CesiuM.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
          visibleDepth:false
        },
        attr: item,
        name: item.id + '++' + item.text,
        id: item.id,
        eventParent: false,
      });
      graphicLayer.addGraphic(primitive);
    }
    graphicLayer.bindTooltip(
      function (event: any) {
        const item = event.graphic?.attr;
        if (!item) {
          return false;
        }
        const innerTooltip = `<div>${item.text}</div>`;
        return innerTooltip;
      },
      {
        direction: 'top',
        offsetY: -30,
      },
    );
    graphicLayer.bindPopup(
      function (event: any) {
        // 点击聚合点id
        yjczSet = false;
        const item = event.graphic?.attr;
        if (item) {
          return false;
        }
        // if (graphicLayer.options.name === '事件处置图层') {
        //   yjczSet = false
        // }
        let innerPopup = '<div class="zyglTp"><div class="tops"><span>列表</span></div>';
        event.id.map((item: any) => {
          const idName = item.name.split('++');
          innerPopup +=
            '<li class="zyLi" onClick="clickZyLi(\'' +
            idName[0] +
            '\')">' +
            '<img src="' +
            item._billboard._image._value +
            '" />' +
            '<span>' +
            idName[1] +
            '</span></li>';
        });
        innerPopup += '</div>';
        if (
          graphicLayer.options.name === '事件处置警力图层' ||
          graphicLayer.options.name === '事件处置车辆图层' ||
          graphicLayer.options.name === '事件处置监控图层'
        ) {
          // yjczSet = false
          setTimeout(() => {
            yjczSet = true;
          }, 100);
        }
        return innerPopup;
      },
      {
        direction: 'top',
        offsetY: -30,
      },
    );
  };
  const clickZyLi = (id: any) => {
    console.log(id);
  };
  // 搜索头部列表
  const [topli, setTopLi] = useState<any>();
  const [showSearchCamera, setShowSearchCamera] = useState<boolean>(false);
  const SearchTopLi = (value: any) => {
    if (props.showLeftTree) {
      props.clickShowTree();
    }
    if (topName === '监控') {
      searchTcs('监控点位', endName);
      setEndName('监控点位');
      const polygon = JSON.parse(window.cjObj.views || '[]');
      if (polygon.length > 0) {
        polygon.push(polygon[0]);
      }
      const param = {
        polygon: polygon,
        videoName: value,
        category: '1',
        pageNumber: 1,
        pageSize: 100,
      };
      querySenceVideo(param).then((res) => {
        if (res.data) {
          setShowSearchCamera(true);
          setMenuBf(res.data.rows);
        } else {
          setShowSearchCamera(false);
        }
      });
    } else if (topName === '重点人员') {
      searchTcs(topName, endName);
      setEndName(topName);
      const paramPeople = {
        posType: zdArr['重点人员'],
        name: value,
      };
      querySencePeople(paramPeople).then((res) => {
        if (res.data) {
          setShowSearchCamera(true);
          setMenuBf(res.data.rows);
        } else {
          setShowSearchCamera(false);
        }
      });
    } else {
      let endsName = '';
      if (topName === '卡口') {
        endsName = '车辆卡口';
      } else if (topName === '人脸') {
        endsName = '人脸识别';
      } else if (topName === '井盖') {
        endsName = '井盖';
      }
      searchTcs(endsName, endName);
      setEndName(endsName);
      if (topName === '人脸') {
        const polygon = JSON.parse(window.cjObj.views || '{}');
        polygon.push(polygon[0]);
        const paramLl = {
          polygon: polygon,
          category: '0',
          videoName: value,
          pageNumber: 1,
          pageSize: 100,
        };
        querySenceVideo(paramLl).then((res) => {
          if (res.data) {
            setShowSearchCamera(true);
            setMenuBf(res.data.rows);
          } else {
            setShowSearchCamera(false);
          }
        });
      } else {
        const paramDevice = {
          category: zdArr[topName],
          name: value,
        };
        querySenceDevice(paramDevice).then((res) => {
          if (res.data) {
            setShowSearchCamera(true);
            setMenuBf(res.data.rows);
          } else {
            setShowSearchCamera(false);
          }
        });
      }
    }

    // const lis = [{ name: '三号门入口处1', iconUrl: '/img/mapImg/bqLine.svg' },
    // { name: '三号门入口处2', iconUrl: '/img/mapImg/bqLine.svg' }, { name: '三号门入口处4', iconUrl: '/img/mapImg/bqLine.svg' },
    // { name: '三号门入口处3', iconUrl: '/img/mapImg/bqLine.svg' }, { name: '三号门入口处5', iconUrl: '/img/mapImg/bqLine.svg' },]
  };
  // 飞行
  const gotoPosition = (item: any) => {
    map.flyToPoint(new mars3D.LatLngPoint(item.lon, item.lat, item.height || 0));
  };
  const dbClickJk = (item: any) => {
    const dhSrc: any = [];
    const hkSrc: any = [];
    if (item.type === 'dhlw' || item.videoType === 'dhlw') {
      dhSrc.push(item.videoId);
    }
    if (item.type === 'HLS' || item.videoType === 'HLS') {
      hkSrc.push(item.videoUrl);
    }
    const newParam = {
      dhSrc: dhSrc,
      hkSrc: hkSrc,
    };
    props.setSpSrc(newParam, true);
  };
  const setMenuBf = (arr: any) => {
    const menuBfList = arr.map((item: any, index: any) => {
      return (
        <li onClick={() => gotoPosition(item)} key={index} onDoubleClick={() => dbClickJk(item)}>
          <span>{index} | </span>
          <img src={item.minioFileUrl} />
          <span>{item?.vedioName || item?.deviceName || item?.personName || ''}</span>
        </li>
      );
    });
    setTopLi(menuBfList);
    setShowSearchCamera(true);
  };
  const closeShows = () => {
    setShowSearchCamera(false);
  };
  // 资源搜索结束
  // 预案推演开始
  const yatyRef: any = useRef(null);
  const [showYaty, setShowYaty] = useState<boolean>(false);
  const addYaty = (id: any) => {
    const param = {
      id: id,
    };
    queryYaJson(param).then((res: any) => {
      const result = res.data.rows;
      if (result.length) {
        const json = result[0].geoJson;
        yatytcObj[id] = new mars3D.layer.GraphicLayer({
          name: result[0].name,
        });
        yatytcObj[id + '3dTiles'] = '';
        map.addLayer(yatytcObj[id]);
        try {
          const new3dLayer = JSON.parse(
            JSON.parse(result[0]?.entity || '{}')?.modelTreeData?.data?.entity || '{}',
          );
          new3dLayer.id = JSON.parse(result[0]?.entity || '{}')?.modelTreeData?.data?.id || '';
          yatytcObj[id + '3dTiles'] = props.loadModel(new3dLayer, yatytcObj[id + '3dTiles']);
          if (yatytcObj[id + '3dTiles']) {
            map.addLayer(yatytcObj[id + '3dTiles']);
          }
        } catch (error) {
          console.log(error);
        }
        const options = {
          clear: true,
          // flyTo: true
        };
        if (json) {
          yatytcObj[id].loadGeoJSON(json, options);
        }
      }
    });
  };
  const setYatyLine = (arr: any) => {
    const objKeys = Object.keys(yatytcObj);
    for (const keys in yatytcObj) {
      if (keys.indexOf('3dTiles') === -1) {
        if (arr.indexOf(keys) > -1) {
          if (!yatytcObj[keys]) {
            // 调用预案
            addYaty(keys);
          }
        } else {
          // 删除预案
          map.removeLayer(yatytcObj[keys]);
          yatytcObj[keys] = '';
          map.removeLayer(yatytcObj[keys + '3dTiles']);
          yatytcObj[keys + '3dTiles'] = '';
        }
      }
    }
    arr.forEach((item: any) => {
      if (objKeys.indexOf(item) === -1) {
        // 调用预案
        addYaty(item);
      }
    });
  };
  // 清除所有预案
  const clearAllyaty = () => {
    for (const key in yatytcObj) {
      if (key.indexOf('3dTiles') === -1) {
        map.removeLayer(yatytcObj[key]);
        yatytcObj[key] = '';
        map.removeLayer(yatytcObj[key + '3dTiles']);
        yatytcObj[key + '3dTiles'] = '';
      }
    }
  };
  const showTables = () => {
    props.showYaYable();
  };
  // 预案推演结束
  // 应急处置开始
  const yjRef: any = useRef(null);
  const [showYjtc, setShowYjtc] = useState<boolean>(false);
  const [eventPerimeterData, setEventPerimeterData] = useState<any>({});
  const dataConfig = {
    message: '',
    id: '',
    category: '',
  };
  const sjczMapClick = () => {
    map.addLayer(graphicLayerSjcz);
    yjczSet = true;
  };
  const sjczMapClickOff = () => {
    if (!graphicLayerSjcz) return;
    graphicLayerSjcz.clear();
    map.removeLayer(graphicLayerSjcz);
    yjczSet = false;
  };
  const onCancel = () => {
    setShowYjtc(false);
    yjRef.current.rightSet();
  };

  const getLayer = () => {
    rgaphGpsJlTwo = '';
    map
      .getLayers({
        basemaps: false,
        layers: true, //是否取config.json中的layers
      })
      .forEach((item: any) => {
        if (item.options.name === 'GPS警力') rgaphGpsJlTwo = item;
        if (item.options.name === 'GPS车辆') rgaphGpsClTwo = item;
        if (item.options.name === '监控点位') rgaphGpsJkTwo = item;
      });
    if (rgaphGpsJlTwo) {
      return true;
    } else {
      return false;
    }
  };
  const searchPoint = (drawGraphic: any, position: any) => {
    map.removeLayer(rgaphGpsJl);
    map.removeLayer(rgaphGpsCl);
    map.removeLayer(rgaphGpsJk);
    const flag = getLayer();
    if (flag) {
      const data: any = [];
      const dataTwo: any = [];
      const dataThree: any = [];
      const dataFour: any = [];
      const dataFive: any = [];
      const dataSix: any = [];
      const dataGd: any = [];
      // const dataGdp: any = []
      if (rgaphGpsJlTwo) {
        map.addLayer(rgaphGpsJl);
        rgaphGpsJlTwo.eachGraphic((graphic: any) => {
          const positionOne = graphic.positionShow;
          const isInArea = drawGraphic.isInPoly(positionOne);
          if (isInArea) {
            // console.log(graphic)
            const result = graphic.options;
            const param = {
              lng: result.attr.lon,
              lat: result.attr.lat,
              text: result.attr.deviceName || result.attr.vedioName,
              iconUrl: result.style.image,
              id: result.attr.id,
              scale: result.style.scale,
            };
            data.push(param);
            dataFour.push({
              ...result.attr,
              iconUrl: result.style.image,
              checked: false,
            });
          }
        });
        addFeature(rgaphGpsJl, data);
      }
      if (rgaphGpsClTwo) {
        map.addLayer(rgaphGpsCl);
        rgaphGpsClTwo.eachGraphic((graphic: any) => {
          const positionTwo = graphic.positionShow;
          const isInArea = drawGraphic.isInPoly(positionTwo);
          if (isInArea) {
            // console.log(graphic)
            const result = graphic.options;
            const param = {
              lng: result.attr.lon,
              lat: result.attr.lat,
              text: result.attr.deviceName || result.attr.vedioName,
              iconUrl: result.style.image,
              id: result.attr.id,
              scale: result.style.scale,
            };
            dataTwo.push(param);
            dataFive.push({
              ...result.attr,
              iconUrl: result.style.image,
              checked: false,
            });
          }
        });
        addFeature(rgaphGpsCl, dataTwo);
      }
      if (rgaphGpsJkTwo) {
        map.addLayer(rgaphGpsJk);
        rgaphGpsJkTwo.eachGraphic((graphic: any) => {
          const positionThree = graphic.positionShow;
          const isInArea = drawGraphic.isInPoly(positionThree);
          if (isInArea) {
            // console.log(graphic)
            const result = graphic.options;
            const param = {
              lng: result.attr.lon,
              lat: result.attr.lat,
              text: result.attr.deviceName || result.attr.vedioName,
              iconUrl: result.style.image,
              id: result.attr.id,
              scale: result.style.scale,
            };
            dataThree.push(param);
            dataSix.push({
              ...result.attr,
              iconUrl: result.style.image,
              checked: false,
            });
          }
        });
        addFeature(rgaphGpsJk, dataThree);
      }
      if (gdData.length) {
        map.addLayer(rgaphGpsGd);
        gdData.map((item: any) => {
          if (item.lon && item.lat) {
            const positionPoint = mars3D.LatLngPoint.toCartesian([item.lon, item.lat]);
            const isInAreaOne = drawGraphic.isInPoly(positionPoint);
            if (isInAreaOne) {
              console.log(item);
              const style = JSON.parse(item.entity || '{}')?.GeoJSON?.properties?.style;
              const newPar = {
                lng: item.lon,
                lat: item.lat,
                text: item.name || item.iconTitle,
                iconUrl: style?.image,
                id: item.id,
                scale: style?.scale || 1,
              };
              dataGd.push(newPar);
              if (item.arPersonVOS.length) {
                item.arPersonVOS.map((items: any) => {
                  let src = '';
                  if (items.posTypeName === '民警') {
                    src = '/img/mapImg/mj.png';
                  } else if (items.posTypeName === '交警') {
                    src = '/img/mapImg/jj.png';
                  } else if (items.posTypeName === '辅警') {
                    src = '/img/mapImg/fj.png';
                  } else if (items.posTypeName === '保安') {
                    src = '/img/mapImg/ba.png';
                  }
                  const param = {
                    lon: item.lon,
                    lat: item.lat,
                    personName: items.name,
                    id: items.id,
                    checked: false,
                    phoneNumber: items.phoneNumber,
                    iconurl: src,
                  };
                  dataFour.push(param);
                });
              }
            }
          }
        });
        addFeature(rgaphGpsGd, gdData);
      }
      callBackPoint({ police: dataFour, car: dataFive, video: dataSix, position: position });
      setEventPerimeterData({
        police: dataFour,
        car: dataFive,
        video: dataSix,
        position: position,
      });
    } else {
      setTimeout(() => {
        searchPoint(drawGraphic, position);
      }, 500);
    }
    // graphicLayerCl.eachGraphic((graphic:any) => {
    //   const position = graphic.positionShow

    //   const isInArea = drawGraphic.isInPoly(position)
    //   if (isInArea) {
    //     console.log(graphic)
    //   }
    // })
    // graphicLayerJk.eachGraphic((graphic:any) => {
    //   const position = graphic.positionShow

    //   const isInArea = drawGraphic.isInPoly(position)
    //   if (isInArea) {
    //     console.log(graphic)
    //   }
    // })
  };
  const getEvent = (position: any) => {
    map.addLayer(graphicLayerSjcz);
    graphicLayerSjcz.clear();
    const entity = JSON.parse(window.cjObj.entity || '{}');
    const graphic = new mars3D.graphic.CircleEntity({
      position: [position.lng, position.lat, 0],
      style: {
        radius: entity?.outlineRadius || 200,
        height: 0,
        color: '#ffff00',
        opacity: 0.3,
        clampToGround: true,
      },
    });
    const graphicTwo = new mars3D.graphic.CircleEntity({
      position: [position.lng, position.lat, 0],
      style: {
        radius: entity?.inlineRadius || 100,
        height: 0,
        color: 'red',
        opacity: 0.5,
        clampToGround: true,
      },
    });
    const yjPoint = new mars3D.graphic.BillboardEntity({
      name: '应急处置标点',
      position: [position.lng, position.lat, 0],
      style: {
        image: '/img/mapImg/yjcz.svg',
        scale: 2,
        pixelOffset: new CesiuM.Cartesian2(0, 0), //偏移量
        horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
        verticalOrigin: CesiuM.VerticalOrigin.CENTER,
        clampToGround: true,
        visibleDepth:false
      },
    });
    graphicLayerSjcz.addGraphic(yjPoint);
    const obj = {
      maxAlpha: '1',
      time: null,
      color: CesiuM.Color.fromCssColorString('#ffff00'),
    };
    yjPoint.startFlicker(obj);
    graphicLayerSjcz.addGraphic(graphic);
    graphicLayerSjcz.addGraphic(graphicTwo);
    searchPoint(graphic, position);
  };
  // 应急处置结束
  // 车辆冲卡
  const getPoint = (item: any) => {
    return CesiuM.Cartesian3.fromDegrees(item[0], item[1], item[2]);
  };
  const openModel = () => {
    const graphic = new mars3d.graphic.ModelPrimitive({
      style: {
        url: "/qiche.gltf",
        scale: 0.3
      },
    });
    graphicClcz.addGraphic(graphic);
    return graphic;
  };
  const openCar = () => {
    const newGraphic = new mars3D.graphic.BillboardEntity({
      style: {
        image: '/img/cj.png',
        scale: 2,
        clampToGround: true,
        visibleDepth:false
      },
    })
    graphicClcz.addGraphic(newGraphic)
    return newGraphic
  }
  const openY = () => {
    const circleGraphic = new mars3D.graphic.CircleEntity({
      style: {
        radius: 10,
        height: 0,
        color: '#ffff00',
        opacity: 0.3,
        clampToGround: true,
      },
    });
    graphicClcz.addGraphic(circleGraphic);
    return circleGraphic;
  };
  const setTx = (graph: any, graphTwo: any, path: any, time?: any) => {
    if (time) {
      graph.addDynamicPosition(getPoint(path), time);
      graphTwo.addDynamicPosition(getPoint(path), time);
    } else {
      graph.addDynamicPosition(getPoint(path));
      graphTwo.addDynamicPosition(getPoint(path));
    }
  };
  const setClsj = (path: any) => {
    // 车辆数据移动信息

    // const distance = mars3D.MeasureUtil.getDistance([
    //   new mars3D.LatLngPoint(path[0][0], path[0][1], 0),
    //   new mars3D.LatLngPoint(path[1][0], path[1][1], 0),
    // ])
    const mdoelOne = openModel();
    const modelYone = openY();
    const txone = openCar();
    const txTwo = openCar();
    const txThree = openCar();
    const txFour = openCar();
    const yone = openY();
    const yTwo = openY();
    const yThree = openY();
    const yFour = openY();
    setTx(mdoelOne, modelYone, path[0]);
    setTx(txone, yone, clckPosition.xl1[0]);
    setTx(txTwo, yTwo, clckPosition.xl2[0]);
    setTx(txThree, yThree, clckPosition.xl3[0]);
    setTx(txFour, yFour, clckPosition.xl4[0]);
    setTx(mdoelOne, modelYone, path[1], 5);
    setTx(txone, yone, path[1], 5);
    setTx(txTwo, yTwo, clckPosition.xl2[1], 4);
    setTx(txThree, yThree, clckPosition.xl3[1], 4);
    setTx(txFour, yFour, clckPosition.xl4[1], 4);
    setTimeout(() => {
      setTx(txTwo, yTwo, path[1], 1);
      setTx(txThree, yThree, path[1], 1);
      setTx(txFour, yFour, path[1], 1);
    }, 4000);
    setTimeout(() => {
      graphicClcz.clear()
    }, 7000)
  }
  const setClck = (val: any) => {
    // console.log(val)
    for (const keys in clckObj) {
      // 删除预案
      map.removeLayer(clckObj[keys]);
    }
    clckObj = {};
    if (val.length) {
      if (graphicClcz) {
        graphicClcz.clear();
      }

      val.forEach((item: any) => {
        clckObj[item.id] = new mars3D.layer.GraphicLayer({
          name: '车辆冲卡预案',
        });
        const json = JSON.parse(item.entity || '{}');
        clckObj[item.id + '3dTiles'] = '';
        map.addLayer(clckObj[item.id]);
        try {
          const new3dLayer = JSON.parse(
            JSON.parse(item?.entity || '{}')?.modelTreeData?.data?.entity || '{}',
          );
          new3dLayer.id = JSON.parse(item?.entity || '{}')?.modelTreeData?.data?.id || '';
          clckObj[item.id + '3dTiles'] = props.loadModel(new3dLayer, clckObj[item.id + '3dTiles']);
        } catch (error) {
          console.log(error);
        }
        const GeoJson = json.GeoJSON;
        const options = {
          clear: true,
          // flyTo: true
        };
        if (!GeoJson) {
          return;
        }
        clckObj[item.id].loadGeoJSON(GeoJson, options);
        const code = json.info.code;
        clckPosition[code] = GeoJson.geometry.coordinates;
      });
      map.addLayer(graphicClcz)
      map.centerAt({
        "lng": 120.228934,
        "lat": 30.235093,
        "height": 500,
        "heading": -60,
        "pitch": -90
      }, {
        duration: 1
      })
      const positions = [[120.228886, 30.235015, 0], [120.228173, 30.23537, 0]]
      // return
      setClsj(positions);
    }
  };
  // 制高点开始
  const zgdRef: any = useRef(null);
  const [showZgd, setShowZgd] = useState<boolean>(false);
  const addZgd = (data: any) => {
    // 开始绘制
    graphicLayerZgd.startDraw({
      type: 'viewShed',
      style: {
        angle: data.angle,
        angle2: data.angle2,
        showFrustum: data.showFrustum,
        heading: data.heading,
        pitch: data.pitch,
        distance: data.distance,
        opacity: data.opacity,
        addHeight: 3, // 在坐标点增加的高度值，规避遮挡，效果更友好
      },
      success: function (graphic: any) {
        // console.log("绘制完成", graphic)

        selectedViewZgd = graphic; // 记录下

        eventTarget.fire('loadVideo', {
          value: {
            cameraAngle: selectedViewZgd.angle,
            cameraAngle2: selectedViewZgd.angle2,
            heading: selectedViewZgd.heading,
            pitchValue: selectedViewZgd.pitch,
            distanceValue: selectedViewZgd.distance,
            opcity: selectedViewZgd.opacity,
            showFrustum: selectedViewZgd.showFrustum,
          },
        });
      },
    });
  };
  const clearArr = () => {
    if (graphicLayerZgd) {
      graphicLayerZgd.clear();
    }
    selectedViewZgd = null;
  };
  const updateParams = (type: any, value: any) => {
    if (selectedViewZgd) {
      switch (type) {
        case 'spzj':
          selectedViewZgd.angle = value;
          break;
        case 'czzj':
          selectedViewZgd.angle2 = value;
          break;
        case 'fyjd':
          selectedViewZgd.pitch = value;
          break;
        case 'xk':
          selectedViewZgd.showFrustum = value;
          break;
        case 'txjl':
          selectedViewZgd.distance = value;
          break;
        case 'sptm':
          selectedViewZgd.opacity = value;
          break;
        case 'szfx':
          selectedViewZgd.heading = value;
          break;
        default:
          break;
      }
    }
  };
  const selCamera = () => {
    if (!selectedViewZgd) {
      return;
    }
    map.graphicLayer.startDraw({
      type: 'point',
      success: (graphic: any) => {
        const point = graphic.point;
        graphic.remove(); // 删除绘制的点

        selectedViewZgd.position = point;
      },
    });
  };
  const onClickSelView = () => {
    if (!selectedViewZgd) {
      return;
    }
    map.graphicLayer.startDraw({
      type: 'point',
      success: (graphic: any) => {
        const point = graphic.point;
        graphic.remove(); // 删除绘制的点

        selectedViewZgd.targetPosition = point;
      },
    });
  };
  // 制高点结束
  // 区域疏散开始
  const getQyss = () => {
    // 加载热力图数据
    // const arr = [{
    //   lng: 120.229,
    //   lat: 30.235628,
    //   value: 28
    // }, {
    //   lng: 120.229333,
    //   lat: 30.23561,
    //   value: 33
    // }, {
    //   lng: 120.229199,
    //   lat: 30.235761,
    //   value: 55
    // }, {
    //   lng: 120.229309,
    //   lat: 30.234891,
    //   value: 66
    // }]
    const arr = [
      {
        lng: 120.453671,
        lat: 30.190253,
        value: 28,
      },
      {
        lng: 120.452853,
        lat: 30.190484,
        value: 55,
      },
      {
        lng: 120.453729,
        lat: 30.190673,
        value: 66,
      },
    ];
    graphicLayerQyss.heartMap = new mars3D.layer.HeatLayer({
      positions: arr,
      // 以下为热力图本身的样式参数，可参阅api：https://www.patrick-wied.at/static/heatmapjs/docs.html
      heatStyle: {
        radius: 25,
        blur: 1.0,
        gradient: {
          0: 'rgba(0,0,255,0)',
          0.5: 'rgb(0,255,0)',
          0.75: 'rgb(255,255,0)',
          1: 'rgb(255,0,0)',
        },
        minOacity: 0.4, // 0.0 ~ 1.0
        maxOacity: 0.7, // 0.0 ~ 1.0
      },
      // 以下为矩形矢量对象的样式参数
      style: {
        opacity: 0.6,
        classificationType: Cesium.ClassificationType.BOTH,
        clampToGround: true,
      },
    });
    map.addLayer(graphicLayerQyss.heartMap);
    //测试区域疏散
    graphicLayerQyss.line = new mars3D.layer.GraphicLayer({
      name: '区域疏散图层',
    });
    map.addLayer(graphicLayerQyss.line);
    graphicLayerQyss['3dTitle'] = '';
    const param = {
      sceneId: window.cjObj.id,
    };
    queryLayerList(param).then((res: any) => {
      const result = res.data.rows;
      result.some((item: any) => {
        if (item.name === '区域疏散') {
          const options = {
            clear: true,
          };
          graphicLayerQyss.line.loadGeoJSON(item.geoJSON, options);
          try {
            const new3dLayer = JSON.parse(
              JSON.parse(item?.entity || '{}')?.modelTreeData?.data?.entity || '{}',
            );
            new3dLayer.id = JSON.parse(item?.entity || '{}')?.modelTreeData?.data?.id || '';
            graphicLayerQyss['3dTitle'] = props.loadModel(new3dLayer, graphicLayerQyss['3dTitle']);
          } catch (error) {
            console.log(error);
          }
          return true;
        } else {
          return false;
        }
      });
    });
  };

  useEffect(() => {
    console.log('eventPosition:', eventPosition);
    if (eventPosition) {
      getEvent(eventPosition);
      // getEvent({lng: 120.211424, lat: 30.223642, height: 0}) // 有车
      // getEvent({lng: 120.22409262952101, lat: 30.231899196913933, height: 17.682172499348447}) //有警力
      // getEvent({lng: 120.242913, lat: 30.241695, height: 0}) //有视频
      // getEvent({lng: 120.25134325481244, lat: 30.234538322487527, height: 17.65932205884705})
      // getEvent({lng: 120.25134325481244, lat: 30.234538322487527, height: 17.65932205884705})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventPosition]);
  // 区域疏散结束
  // 安保日志开始
  const [showAbrz, setShowAbrz] = useState<boolean>(false);
  const hideAb = () => {
    // checkAb(false)
    setShowAbrz(false);
  };
  const abrzRef = useRef(null);
  // 安保日志结束
  // 视频AR开始
  const showSprh = () => {
    map.getLayers().some((item: any) => {
      // console.log("视频标点")
      if (item.options.name === '监控点位') {
        graphicLayerSprh = item;
        graphicLayerSprh.show = true;
      }
    });
  };
  const setVideo = (item: any) => {
    // console.log(item)
    const entitys = JSON.parse(item.entity || '{}')?.video3D;
    const flag = hlsSet(item.videoUrl);
    if (!flag || !entitys) {
      console.log('请在后台配置视频融合');

      // message.warn("请在后台配置视频融合")
      return;
    }
    graphicLayerSprhTd.clear();
    selectedView = null;
    // const views = {"height": 100,"heading": 0, "lat": 31.842984, "lng": 117.205457, "pitch": -45}
    // map.centerAt(views)
    const targetPosition = map.getCenter({ format: false });
    const video3D = new mars3d.graphic.Video3D({
      position: entitys.position,
      targetPosition: targetPosition,
      style: {
        container: videoElement,
        angle: entitys.style.angle,
        angle2: entitys.style.angle2,
        opacity: entitys.style.opacity, //透明度
        showFrustum: entitys.style.showFrustum, //显示视锥框线
        // camera: entitys.style.camera
      },
    });
    graphicLayerSprhTd.addGraphic(video3D);
    selectedView = video3D;
  };
  const callBackUrl = (value: string[], type: string) => {
    props.setNewSrc(value, type);
  };
  // 视频AR结束
  // 图例开始
  const [showTl, setShowTl] = useState<boolean>(true);
  const changeTl = () => {
    setShowTl(!showTl);
  };
  const [liChecks, setLiChecks] = useState<any>(<div />);
  const [cllTlValue, setChangeTlAll] = useState<any>([]);
  const changeAllTl = (val: any) => {
    setChangeTlAll(val);
    graphicPoint.forEach((item: any) => {
      const name =
        item.options.attr?.data?.iconTitle ||
        item.options.attr?.iconTitle ||
        item.options.attr?.iconName ||
        item?.name;
      if (val.indexOf(name) > -1) {
        item.show = true;
      } else {
        item.show = false;
      }
    });
  };

  const setTl = (arr?: any) => {
    let newArr: any = [];
    if (arr) {
      newArr = arr;
      if (arr.length === 0) {
        graphicPoint = [];
      }
    } else {
      const arrs: any = [];
      const nameList: any = [];
      map?.getLayers({ basemaps: false, layers: true }).map((item: any) => {
        const options = item.options;
        if ((options.show || item.show) && !options.type) {
          const iconName = options.name;
          item?.eachGraphic((graphic: any) => {
            if (graphic.options.type === 'billboard' || graphic.options.edittype === 'billboard') {
              const newObj = graphic.options.attr?.data || {};
              const imgUrl = graphic.options.style?.image;
              graphic.name = newObj?.iconTitle || graphic.options.attr?.iconName || iconName || '';
              graphicPoint.push(graphic);
              if (
                newObj.iconTitle &&
                newObj.minioFileUrl &&
                nameList.indexOf(newObj.iconTitle) === -1
              ) {
                const param = {
                  name: newObj.iconTitle,
                  src: newObj.minioFileUrl,
                };
                arrs.push(param);
                nameList.push(newObj.iconTitle);
              } else if (iconName === '监控点位' && nameList.indexOf(newObj.iconTitle) === -1) {
                const iconN = graphic.options.attr?.iconName;
                const attr = graphic.options.attr;
                if (attr?.iconTitle && attr?.minioFileUrl && !nameList.includes(attr?.iconTitle)) {
                  const param = {
                    name: attr?.iconTitle,
                    src: attr?.minioFileUrl,
                  };
                  arrs.push(param);
                  nameList.push(attr?.iconTitle);
                } else if (iconN && imgUrl && !nameList.includes(attr?.iconTitle || iconN)) {
                  const param = {
                    name: attr?.iconTitle || iconN,
                    src: imgUrl,
                  };
                  arrs.push(param);
                  nameList.push(param.name);
                }
              } else if (iconName && imgUrl && !nameList.includes(iconName) && !newObj?.iconTitle) {
                const param = {
                  name: iconName,
                  src: imgUrl,
                };
                arrs.push(param);
                nameList.push(iconName);
              }
            }
          });
        }
      });
      newArr = arrs;
    }
    window.tlArr = newArr;
    if (newArr && newArr.length) {
      const liCheckBoxs = newArr.map((item: any) => {
        return (
          <Col span={12} key={item}>
            <Checkbox value={item.name}>
              <img src={item.src} className="ImgSrc" />
              <span className="name">{item.name}</span>
            </Checkbox>
          </Col>
        );
      });
      console.log('cxb2', liCheckBoxs);
      setLiChecks(liCheckBoxs);
      setChangeTlAll(
        newArr.map((item: any) => {
          return item.name;
        }),
      );
    } else {
      setLiChecks(<div />);
    }
  };

  useEffect(() => {
    setTl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.tlNum]);
  const setTcPoint = (graphicLayer: any, data: any) => {
    fetch('http://41.200.14.143:3000/park/query')
      .then((response) => response.json())
      .then((res) => {
        if (res.status == 'ok' && res.results.length > 0) {
          console.log('cxb00000000', res);
          let xdate: any = res.results;
          let newData: any = data;
          let newxdata: any = [];
          for (let i: any = 0; i < newData.length; i++) {
            for (let y: any = 0; y < xdate.length; y++) {
              if (newData[i].sys_code == xdate[y].sys_code) {
                xdate[y].position = newData[i].position;
                newxdata.push(xdate[y]);
              }
            }
          }
          console.log('bb', data, newxdata);
          newxdata.map((item: any) => {
            const kycw = item.total_place - item.left_place; //已停车位
            const rate = Math.ceil((kycw / item.total_place) * 100) || 0; //饱和度
            let colorstyle = '#009688';
            let imgType = stopgreen;
            if (rate < 50) {
              colorstyle = '#009688'; // 绿
              imgType = stopgreen;
            } else if (rate > 80) {
              colorstyle = '#E91E63'; // 红
              imgType = stopred;
            } else {
              colorstyle = '#FFC107'; // 黄
              imgType = stopyellow;
            }
            const primitive = new mars3D.graphic.BillboardEntity({
              position: [item.position.longitude, item.position.latitude, item.position.height],
              style: {
                width: 35,
                height: 35,
                image: imgType,
                scale: 1,
                // pixelOffset: new CesiuM.Cartesian2(0, 0), //偏移量
                horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
                verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
                visibleDepth:false
              },
              attr: item,
              name: item.neme, // 后端拼写错误
            });
            graphicLayer.addGraphic(primitive);
            const innerPopup =
              `<div class="stopPopupBox">
                <div class="stopCloseBtn">X</div>
                <div class="name">` +
              item.neme +
              `</div>
                <div class=" fl leftbox">
                    <div class="li">
                        <div class="fl txt">车位总数</div>
                        <div class="fl val">` +
              item.total_place +
              `</div>
                        <div class="clear"></div>
                    </div>
                    <div class="li">
                        <div class="fl txt">已停车位</div>
                        <div class="fl val" style="color: #E91E63;">` +
              kycw +
              `</div>
                        <div class="clear"></div>
                    </div>
                </div>
                <div class="fl leftbox">
                    <div class="li">
                        <div class="fl txt">饱和度(%)</div>
                        <div class="fl val"><span class="rate" style="background-color:` +
              colorstyle +
              `;">` +
              rate +
              `</span></div>
                        <div class="clear"></div>
                    </div>
                    <div class="li">
                        <div class="fl txt">空余车位</div>
                        <div class="fl val" style="color: #009688;">` +
              item.left_place +
              `</div>
                        <div class="clear"></div>
                    </div>
                </div>
                <div class="clear"></div>
            </div>`;
            primitive.bindPopup(
              function () {
                return innerPopup;
              },
              {
                direction: 'top',
                offsetY: -10,
                template: false,
              },
            );
          });
          setTl();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const setZdlkPoint = (graphicLayer: any, data: any) => {
    console.log(data, '路口');
    data?.forEach((item: any) => {
      const imgType = '/img/mapImg/traffic.png';
      const primitive = new mars3D.graphic.BillboardEntity({
        position: [item.position.longitude, item.position.latitude, item.position.height],
        style: {
          width: 35,
          height: 35,
          image: imgType,
          scale: 1,
          // pixelOffset: new CesiuM.Cartesian2(0, 0), //偏移量
          horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
          verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
          visibleDepth:false
        },
        attr: item,
        name: item.name,
        // id: item.id,
      });
      graphicLayer.addGraphic(primitive);
      const innerPopup =
        `<div class="stopPopupBox">
            <div class="stopCloseBtn">X</div>
            <div class="name">` +
        item.name +
        `</div>
            <div class=" fl leftbox">
                <div class="li">
                    <div class="fl txt">通过车辆</div>
                    <div class="fl val">` +
        23 +
        `</div>
            </div>
            <div class="clear"></div>
        </div>`;
      const tingCheWei = [
        { name: '粤A.68666', cwNum: '2022-4-23 13:45:18' },
        { name: '浙E.67232', cwNum: '2022-4-23 15:36:18' },
        { name: '京A.68666', cwNum: '2022-4-23 17:15:19' },
        { name: '湘B.68666', cwNum: '2022-4-23 17:15:19' },
        { name: '川A.89668', cwNum: '2022-4-23 17:15:19' },
        { name: '粤A.14256', cwNum: '2022-4-23 17:15:19' },
        { name: '浙E.68666', cwNum: '2022-4-23 18:15:19' },
        { name: '京A.67232', cwNum: '2022-4-23 18:35:30' },
        { name: '湘B.68666', cwNum: '2022-4-23 18:35:30' },
        { name: '川A.68666', cwNum: '2022-4-23 18:35:30' },
        { name: '粤A.89668', cwNum: '2022-4-23 19:35:30' },
        { name: '浙E.14256', cwNum: '2022-4-23 19:46:48' },
        { name: '京A.68666', cwNum: '2022-4-23 19:46:48' },
        { name: '湘B.67232', cwNum: '2022-4-23 19:46:48' },
        { name: '川A.68666', cwNum: '2022-4-23 19:46:49' },
        { name: '粤A.68666', cwNum: '2022-4-23 20:46:49' },
        { name: '浙E.89668', cwNum: '2022-4-23 20:46:49' },
        { name: '粤A.68666', cwNum: '2022-4-23 20:28:49' },
        { name: '粤A.67232', cwNum: '2022-4-23 20:28:49' },
        { name: '浙E.68666', cwNum: '2022-4-23 20:28:49' },
        { name: '京A.68666', cwNum: '2022-4-23 21:28:49' },
        { name: '湘B.89668', cwNum: '2022-4-23 21:28:49' },
        { name: '川A.14256', cwNum: '2022-4-23 21:28:49' },
      ];

      // 轮播
      let str = `<div class="policeInfo-box">
        <div class="tableTitle">
          <div class="tableCol">车牌号</div>
          <div class="tableCol">时间</div>
        </div>
        <div id="passScroll" class="canDrug" style="height: 120px;">
      `;
      tingCheWei.forEach((item: any) => {
        str += `<div class='JQScroll'>
              <span class="li-12" title='${item.name}'>${item.name}</span>
              <span class="li-12">${item.cwNum || 0}</span>
            </div>`;
      });
      str += '</div></div>';

      primitive.bindPopup(
        function () {
          setTimeout(() => {
            $('#passScroll').liMarquee({
              scrollamount: 15,
              direction: 'up',
            });
          }, 1000);
          return '<div>' + innerPopup + str + '</div>';
        },
        {
          direction: 'top',
          offsetY: -10,
          template: false,
        },
      );
    });
    setTl();
  };
  const setYcPoint = (graphicLayer: any, flag?: any) => {
    // /ARBIGdist/js/park.json   http://41.200.14.143:47970/zju/gps
    fetch('http://41.200.14.143:47970/zju/gps')
      .then((req) => req.json())
      .then((res) => {
        // const res = [{
        //   name: '111',
        //   speed: 20,
        //   status: '22',
        //   gpstime: '0000',
        //   position: {longitude: 120.2288892, latitude: 30.2349677, height: 1}
        // }]
        if (!res.length) {
          return;
        }
        props.changeYcNum(res.length);
        res.forEach((item: any) => {
          const primitive = new mars3D.graphic.BillboardEntity({
            position: [item.position.longitude, item.position.latitude, item.position.height],
            style: {
              width: 35,
              height: 35,
              image: '/img/mapImg/cruiseShip.png',
              scale: 1,
              // pixelOffset: new CesiuM.Cartesian2(0, 0), //偏移量
              horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
              verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
              visibleDepth:false
            },
            attr: item,
            name: item.name,
            // id: item.id,
          });
          graphicLayer.addGraphic(primitive);
          const innerPopup =
            `<div class="stopPopupBox">
              <div class="stopCloseBtn">X</div>
              <div class="name">` +
            item.name +
            `</div>
              <div style="width:100%;display:flex;">
                  <div class="leftbox">
                      <div class="fl txt">速度</div>
                      <div class="fl val" style="margin-left:10px">` +
            item.speed +
            `</div>
                  </div>
                  <div class="leftbox">
                      <div class="fl txt">状态</div>
                      <div class="fl val" style="margin-left:10px">` +
            item.status +
            `</div>
                  </div>
              </div>
              <div style="width:100%;display:flex;margin-top:4px">
                  <div class="leftbox" style="width:100%">
                      <div class="fl txt">上传时间</div>
                      <div class="fl val" style="margin-left:10px">` +
            item.gpstime +
            `</div>
                  </div
              </div>
          </div>`;
          primitive.bindPopup(
            function () {
              return innerPopup;
            },
            {
              direction: 'top',
              offsetY: -10,
              template: false,
            },
          );
        });
        if (flag) {
          graphicLayer.show = true;
        }
        setTl();
      });
  };
  const loadZdlk = (data: any) => {
    map.addLayer(graphicLayerXhZdlk);
    setZdlkPoint(graphicLayerXhZdlk, data);
  };
  const loadTcc = (data: any) => {
    map.addLayer(graphicLayerXhTcc);
    setTcPoint(graphicLayerXhTcc, data);
  };
  const loadYc = (flag?: any) => {
    map.addLayer(graphicLayerXhYc);
    setYcPoint(graphicLayerXhYc, flag);
  };
  // 湘湖景区重点路口加载死数据
  const setXhZDLK = (data: any) => {
    // 重点路口
    graphicLayerXhZdlk = new mars3D.layer.GraphicLayer({
      name: '重点路口',
      show: false,
    });
    if (map) {
      loadZdlk(data);
    } else {
      setTimeout(() => {
        loadZdlk(data);
      }, 1000);
    }
  };
  // 湘湖景区加载死数据
  const setXhCar = (data: any) => {
    // 湘湖停车
    graphicLayerXhTcc = new mars3D.layer.GraphicLayer({
      name: '停车场',
      show: false,
    });
    if (map) {
      loadTcc(data);
    } else {
      setTimeout(() => {
        loadTcc(data);
      }, 1000);
    }
  };
  const serXhYc = () => {
    // 湘湖游船
    graphicLayerXhYc = new mars3D.layer.GraphicLayer({
      name: '游船',
      show: false,
    });
    if (map) {
      loadYc();
    } else {
      setTimeout(() => {
        loadYc();
      }, 1000);
    }
  };
  const showXhZdlk = () => {
    if (graphicLayerXhZdlk.show) {
      graphicLayerXhZdlk.show = false;
    } else {
      graphicLayerXhZdlk.show = true;
    }
    setTl();
  };
  // 停车场撒点
  const showXhCar = () => {    
    if(tingchechangClick) return
    if (xtccLayer) {
      window.map.removeLayer(xtccLayer);
      xtccLayer = null;
      return;
    }
    tingchechangClick =  true
    fetch('/ARBIGdist/js/park.json').then((response) => response.json()).then((data) => {
      let newData: any = data.results;
      console.log('bbbbdddd',newData)
      fetch('http://41.200.14.143:3000/park/query').then((response) => response.json()).then( async (res) => {
        console.log('bbbbaaaaa',res)
        if (res.status == 'ok' && res.results.length > 0) {
          const date = res.results;
          date?.map((item: any, index: any) => {
            const indexId = findElem(newData, "id", item.id) as number; //拿到接口对应数据索引
            if (indexId === -1) return;
            newData[indexId].left_place = date[index]?.left_place;
            newData[indexId].total_place = date[index]?.total_place;
          })
          console.log('bbbb',newData)
          xtccLayer = new mars3D.layer.GraphicLayer({name: '停车场',});
          await XAddCar(xtccLayer, newData,date);
          window.map.addLayer(xtccLayer);
          tingchechangClick =false
        }
      })
    })
  };


  const XAddCar = (graphicLayer: any, data: any,res: any) => {
    console.log('bbbb7777777', res);
    let xdate: any = res;
    let newData: any = data;
    let newxdata: any = [];
    for (let i: any = 0; i < newData.length; i++) {
      for (let y: any = 0; y < xdate.length; y++) {
        if (newData[i].sys_code == xdate[y].sys_code) {
          xdate[y].position = newData[i].position;
          newxdata.push(xdate[y]);
        }
      }
    }
    newxdata.map((item: any) => {
      const kycw = item.total_place - item.left_place; //已停车位
      const rate = Math.ceil((kycw / item.total_place) * 100) || 0; //饱和度
      let colorstyle = '#009688';
      let imgType = stopgreen;
      if (rate < 50) {
        colorstyle = '#009688'; // 绿
        imgType = stopgreen;
      } else if (rate > 80) {
        colorstyle = '#E91E63'; // 红
        imgType = stopred;
      } else {
        colorstyle = '#FFC107'; // 黄
        imgType = stopyellow;
      }
      const primitive = new mars3D.graphic.BillboardEntity({
        position: [item.position.longitude, item.position.latitude, item.position.height],
        style: {
          width: 35,
          height: 35,
          image: imgType,
          scale: 1,
          // pixelOffset: new CesiuM.Cartesian2(0, 0), //偏移量
          horizontalOrigin: CesiuM.HorizontalOrigin.CENTER,
          verticalOrigin: CesiuM.VerticalOrigin.BOTTOM,
          visibleDepth:false
        },
        attr: item,
        name: item.neme, // 后端拼写错误
      });
      graphicLayer.addGraphic(primitive);
      const innerPopup =
        `<div class="stopPopupBox">
          <div class="stopCloseBtn">X</div>
          <div class="name">` +
        item.neme +
        `</div>
          <div class=" fl leftbox">
              <div class="li">
                  <div class="fl txt">车位总数</div>
                  <div class="fl val">` +
        item.total_place +
        `</div>
                  <div class="clear"></div>
              </div>
              <div class="li">
                  <div class="fl txt">已停车位</div>
                  <div class="fl val" style="color: #E91E63;">` +
        kycw +
        `</div>
                  <div class="clear"></div>
              </div>
          </div>
          <div class="fl leftbox">
              <div class="li">
                  <div class="fl txt">饱和度(%)</div>
                  <div class="fl val"><span class="rate" style="background-color:` +
        colorstyle +
        `;">` +
        rate +
        `</span></div>
                  <div class="clear"></div>
              </div>
              <div class="li">
                  <div class="fl txt">空余车位</div>
                  <div class="fl val" style="color: #009688;">` +
        item.left_place +
        `</div>
                  <div class="clear"></div>
              </div>
          </div>
          <div class="clear"></div>
      </div>`;
      primitive.bindPopup(
        function () {
          return innerPopup;
        },
        {
          direction: 'top',
          offsetY: -10,
          template: false,
        },
      );
    });
  };
  const showXhYc = () => {
    if (graphicLayerXhYc.show) {
      graphicLayerXhYc.clear();
      graphicLayerXhYc.show = false;
      setTl();
    } else {
      loadYc(true);
    }
  };
  // 三圈线加载
  const getSqx = (arr: any) => {
    // debugger
    // return
    console.log('sqx:', arr);
    sqxKeysArr = arr.map((it: any) => {
      return it.key;
    });
    const newArr: any = [];
    arr.forEach((item: any) => {
      newArr.push(item.key);
      addYa(item.key);
    });
    setLeftKeys(newArr);
    props.setKey(newArr);
  };
  // 右上角场馆迁移
  const [selectedCgKeys, setSelectedCgKeys] = useState<any>([]);
  const onCheckLeftCgTree = (checkedKeys: any, e: any) => {
    setSelectedCgKeys(checkedKeys);
    // console.log(checkedKeys, e)
    changeNormalTc(e.node.key);
    // 如果点击父节点
    if (e.node.children) {
      for (const key in leftTreeLayer[e.node.key]) {
        if (leftTreeLayer[e.node.key][key]) {
          leftTreeLayer[e.node.key][key].show = !e.node.checked;
        }
      }
      if (e.node.children[0].title.indexOf("倾斜") === -1 && JSON.parse(e.node.children[0]?.data?.entity || '{}')?.type === '3dtiles' ) {
        props.reloadVideo(checkedKeys);
      }
    } else {
      if (leftTreeLayer[e.node.parentId]) {
        if (leftTreeLayer[e.node.parentId][e.node.key]) {
          leftTreeLayer[e.node.parentId][e.node.key].show = !e.node.checked;
        }
      }
      if (e.node.title.indexOf("倾斜") === -1 && JSON.parse(e.node?.data?.entity || '{}')?.type === '3dtiles' ) {
        props.reloadVideo(checkedKeys);
      }
    }
  }
  const showTreeCg = (id: any) => {
    const param = {
      sceneId: id,
    };
    queryTreeTc(param).then((res) => {
      // console.log('1111')
      const treeData = res.result.result?.children || [];
      setModalData(treeData);
      if (treeData.length) {
        treeData.forEach((item: any) => {
          const sonsModel = item.children;
          if (!item.children) return;
          leftTreeLayer[item.key] = {};
          sonsModel.forEach((items: any) => {
            const enetity = JSON.parse(items?.data?.entity || '{}');
            if (Object.keys(enetity).length !== 0) {
              enetity.show = false;
              enetity.id = items.key;
            }
            leftTreeLayer[item.key][items.key] = '';
            let layer = '';
            if (enetity.type === '3dtiles') {
              layer = props.loadModel(enetity, leftTreeLayer[item.key][items.key], 'top');
              leftTreeLayer[item.key][items.key] = layer;
            } else {
              layer = mars3d.LayerUtil.create(enetity);
              leftTreeLayer[item.key][items.key] = layer;
              map.addLayer(leftTreeLayer[item.key][items.key]);
            }
          });
        });
      }
    });
  };
  const setTreeKey = (val: any) => {
    setSelectedCgKeys(val);
  };
  //将子组件的方法 暴露给父组件
  useImperativeHandle(ref, () => ({
    goHome,
    setBgLayer,
    getLayers,
    expImageMap,
    clearAllya,
    cutPic,
    setVideo,
    setCheckTree,
    setBigModel,
    removeBigModel,
    setSJ,
    changeYaShow,
    setTl,
    removeAllAn,
    setXhCar,
    serXhYc,
    showXhCar,
    showXhYc,
    getSqx,
    setXhZDLK,
    showXhZdlk,
    changeNormalTc,
    showTreeCg,
    setTreeKey,
    setZdqyTc,
  }));
  return (
    <div className="allbg">
      <div id="cesiumContainer" className={styles.cesiumContainer} />
      <div
        className="showMenus"
        onClick={() => {
          setShowMenus(!showMenus);
        }}
      >
        {/* <span style={{marginRight: '8rem'}}>应用工具</span>
        {showMenus?(<span className='iconfont icon-xialajiantouxia' />):
        (<span className='iconfont icon-xialajiantoushang' />)} */}
        {showMenus ? <span className="menuTop" /> : <span className="menuBottom" />}
      </div>
      <div
        className={showMenus ? 'menuBtns active' : 'menuBtns'}
        style={{
          width: props.visiableHeader == 'kbms' ? '34%' : '44%',
          marginLeft: props.visiableHeader == 'kbms' ? '-17%' : '-22%',
        }}
      >
        {menuLis}
      </div>
      {/* 图例 */}
      <div
        className={props.visiableLeft ? 'iconshow' : 'iconshow active'}
        onClick={() => {
          setIconshow(!iconshow);
        }}
      >
        <span className="iconfont icon-tuli" />
      </div>

      {iconshow && props.visiableHeader != 'kbms' && (
        <div
          className={`${props.visiableLeft ? '' : 'actives'} ${
            showMenus ? 'tlAll active' : 'tlAll'
          }`}
        >
          <p className="title">
            图例
            {!showTl && (
              <span className="iconfont icon-xialajiantoushang iconSpan" onClick={changeTl} />
            )}
            {showTl && (
              <span className="iconfont icon-xialajiantouxia iconSpan" onClick={changeTl} />
            )}
          </p>
          <div className={showTl ? 'allLi active' : 'allLi'}>
            <Checkbox.Group style={{ width: '100%' }} onChange={changeAllTl} value={cllTlValue}>
              <Row>{liChecks}</Row>
            </Checkbox.Group>
          </div>
        </div>
      )}
      {/* {videoShow && <VideoPlayer key={videoSrc}  src={videoSrc} ></VideoPlayer>}
    <DahuaVideo />*/}
      {/* 重点追踪 */}
      {hcSpDrawer ? (
        <Drawer
          title="Drawer with extra actions"
          placement="right"
          className="hcDrawer"
          visible={true}
          mask={false}
          maskClosable={false}
        >
          <div className="timeCheck topContent">
            <div className="title">
              <span className="iconfont icon-ARziyuan" />
              <span className="titles">重点追踪</span>
            </div>
            <div className="content">
              <Row className="timeCheck">
                <p className="name">开始时间 - 结束时间</p>
                {/* <Space direction="vertical" size={12}> */}
                <RangePicker
                  showTime
                  onChange={setTime}
                  dropdownClassName="ryhcTimeXq"
                  defaultValue={defaultTime}
                  className="ryhcTime"
                />
                {/* </Space> */}
              </Row>
              <Row className="likeSet">
                <p className="name likename">相似度:</p>
                <Col span={12}>
                  <Slider
                    min={0}
                    max={100}
                    onChange={changeSimilartiy}
                    value={typeof similarity === 'number' ? similarity : 0}
                  />
                </Col>
                <Col span={6}>
                  <InputNumber min={0} max={100} value={similarity} onChange={changeSimilartiy} />
                </Col>
              </Row>
              <Row className="jsZp">
                <Col span={14}>
                  <div className="imageDiv">
                    {hcPic ? (
                      <img src={hcPic} onClick={setImg} />
                    ) : (
                      <span onClick={setImg} className="iconfont icon-tianjia" />
                    )}
                  </div>
                  {!cjPicShow ? (
                    <input
                      type="file"
                      id="file"
                      onChange={(e) => changepic(e)}
                      style={{ display: 'none' }}
                      accept="image/jpg,image/jpeg,image/png,image/PNG"
                    />
                  ) : null}
                </Col>
                <Col span={10}>
                  <div className="searchP" onClick={searchArr}>
                    开始检索
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          {/* {loadingShow?<Spin indicator={antIcon} className="load"></Spin>:null} */}
          <Table
            className="peopleTable"
            columns={peopleColumns}
            dataSource={peopleData}
            pagination={false}
            loading={loading}
            scroll={{ y: 370 }}
          />
          {!showMoreBtns && firstBtn && (
            <Button type="primary" style={{ margin: '16rem 117rem' }} onClick={() => searchArr()}>
              加载更多
            </Button>
          )}
        </Drawer>
      ) : null}
      {/* 视频标点 */}
      {spDrarer ? (
        <Drawer
          title="Drawer with extra actions"
          placement="right"
          className="hcDrawer spDrawer"
          mask={false}
          maskClosable={false}
          width="550"
          visible={true}
        >
          <Row className="top">
            <span className="iconfont icon-sousuo" />
            <span>视频标点</span>
          </Row>
          <Row className="topN">
            <Button type="primary">添加视频</Button>
          </Row>
          <Row>
            <Search
              placeholder="请输入视频名称关键字"
              onSearch={searchVideo}
              value={searchValue}
              onChange={changeTopSearch}
              enterButton
              className="videoname"
            />
            <Radio.Group onChange={changeType} value={vdtype} className="allRadio">
              <Radio value={'1'}>全部</Radio>
              <Radio value={'2'}>未标</Radio>
              <Radio value={'3'}>以标</Radio>
            </Radio.Group>
          </Row>
          <Row className="content">
            <Col span={7} className="lefts">
              <ul>{videos}</ul>
            </Col>
            {showRightSp ? (
              <Col span={17} className="rights">
                <Row className="titleName">
                  <span>{videoDetail.name}</span>
                </Row>
                <Row className="ylName">- 视频预览 -</Row>
                <Row className="videosshow">
                  <VideoPlayer key={videoDetail.videoUrl} src={videoDetail.videoUrl} />
                </Row>
                <Row className="srcName">
                  <span>路径</span>
                  <span>{videoDetail.videoUrl}</span>
                </Row>
                <Row className="typeName">
                  <span>类别</span>
                  <Input value={category} onChange={changeCategory} />
                  <span>(字数&lt;100)</span>
                </Row>
                <Row className="jkName">
                  <span>类型</span>
                  <Select value={cameraType} style={{ width: '30%' }} onChange={setCameraTypes}>
                    <Option value="0">人脸</Option>
                    <Option value="1">监控</Option>
                  </Select>
                </Row>
                <Row>
                  <div className="leftImg">
                    <span>图标</span>
                  </div>
                  <div className="rightImg">
                    <Radio.Group onChange={changeImg} value={imgValue} className="allIcon">
                      <Radio value={'0'}>
                        <p>
                          <span className="iconfont icon-banqiushexianglv" />
                        </p>
                      </Radio>
                      <Radio value={'1'}>
                        <p>
                          <span className="iconfont icon-qiangjishexianglv" />
                        </p>
                      </Radio>
                      <Radio value={'2'}>
                        <p>
                          <span className="iconfont icon-quanqiushexianglv" />
                        </p>
                      </Radio>
                      <Radio value={'3'}>
                        <p>
                          <span className="iconfont icon-banqiushexianglixian1 red" />
                        </p>
                      </Radio>
                      <Radio value={'4'}>
                        <p>
                          <span className="iconfont icon-qiangjishexianglixian1 red" />
                        </p>
                      </Radio>
                      <Radio value={'5'}>
                        <p>
                          <span className="iconfont icon-quanqiushexianglixian1 red" />
                        </p>
                      </Radio>
                    </Radio.Group>
                  </div>
                </Row>
                <Row className="models">
                  <span>模型选择</span>
                  <TreeSelect
                    // fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                    style={{ width: '60%', marginLeft: '10rem' }}
                    value={modelTreeData}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={treeDatas}
                    placeholder="Please select"
                    treeDefaultExpandAll
                    onSelect={changeModelTree}
                    treeNodeFilterProp="title"
                    fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                  />
                </Row>
                <Row className="spbd">
                  <span>- 视频标点 -</span>
                  <Switch
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    checked={spbd}
                    onChange={changeSpbd}
                    className="switchOne"
                  />
                  {!spbd ? (
                    <div className="showPoint">
                      <p>
                        <span>经度</span>
                        <span>{cameraPosition.lng}</span>
                      </p>
                      <p>
                        <span>纬度</span>
                        <span>{cameraPosition.lat}</span>
                      </p>
                      <p>
                        <span>高度</span>
                        <span>{cameraPosition.height}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="showPoint">
                      <p>
                        <span>经度</span>
                        <Input value={cameraPosition.lng} onChange={() => setPosition('lng')} />
                      </p>
                      <p>
                        <span>纬度</span>
                        <Input value={cameraPosition.lat} onChange={() => setPosition('lat')} />
                      </p>
                      <p>
                        <span>高度</span>
                        <Input
                          value={cameraPosition.height}
                          onChange={() => setPosition('height')}
                        />
                      </p>
                    </div>
                  )}
                </Row>
                <Row style={{ marginBottom: '12rem' }}>
                  <Button type="primary" onClick={flyToPoint}>
                    预览
                  </Button>
                </Row>
                <Row>
                  <Button type="primary" onClick={saveCamera}>
                    保存
                  </Button>
                  <Button type="primary" onClick={removeCamera} danger>
                    删除
                  </Button>
                </Row>
              </Col>
            ) : (
              <div>
                <span>暂无数据</span>
              </div>
            )}
          </Row>
          {carmeraLoad ? (
            <Row className="loadings">
              <Space size="middle" style={{ margin: '0 auto' }}>
                <Spin size="large" />
              </Space>
            </Row>
          ) : null}
        </Drawer>
      ) : null}
      {/* 场馆展示 */}
      {true && (
        <div
          className={props?.visiableLeft ? 'stadiumicon' : 'stadiumicon active'}
          onClick={() => {
            setStadium(!stadium);
          }}
        >
          <span className="iconfont icon-moxing" />
        </div>
      )}
      {stadium && (
        <div className={props?.visiableLeft ? 'stadium' : 'stadium active'}>
          <Tree
            treeData={modalData}
            checkable
            defaultExpandAll
            onCheck={onCheckLeftCgTree}
            checkedKeys={selectedCgKeys}
          />
        </div>
      )}
      {/* 资源搜索 */}
      <div
        className={props?.visiableLeft ? 'activeicon' : 'activeicon active'}
        onClick={() => {
          setActiveshow(!activeshow);
        }}
      >
        <span className="iconfont icon-sousuo" />
      </div>
      {activeshow && (
        <div
          className={
            props.visiableHeader != 'kbms'
              ? props.visiableLeft
                ? 'leftIn'
                : 'leftIn active'
              : 'leftIn'
          }
          style={{ top: props.visiableHeader == 'kbms' ? '180rem' : '132rem' }}
        >
          <Dropdown overlay={menu} trigger={['click']} className="topSet">
            <a className="ant-dropdown-link" onClick={(e) => zydChange(e)}>
              <span>{topName}</span>
              <span className="iconfont icon-xialajiantouxia" />
            </a>
          </Dropdown>
          <Search
            placeholder="请输入名称"
            onSearch={SearchTopLi}
            enterButton
            className={props.visiableHeader == 'kbms' ? 'topSearch' : 'topSearch active'}
            value={searchTopValue}
            onChange={changeSearchValue}
          />
        </div>
      )}

      {cjPicShow ? <Cropper url={cjPic} onCropSuccess={onCropSuccess} onCancel={cancleCj} /> : null}
      {showSearchCamera ? (
        <div className={props.visiableLeft ? 'topt' : 'topt active'}>
          <div className="searchTopP">{topli}</div>
          <span className="iconfont icon-guanbi" onClick={closeShows} />
        </div>
      ) : null}
      {/* 资源树 */}
      <div
        className={props.visiableLeft ? 'leftTreeicon' : 'leftTreeicon active'}
        onClick={() => {
          setLeftTree(!leftTree);
          props.clickShowTree('close');
        }}
      >
        <span className="iconfont icon-yuan" />
      </div>
      {leftTree && (
        <div
          onClick={clickLeftTree}
          className={
            props.visiableLeft
              ? 'leftTree'
              : props.visiableHeader == 'kbms'
              ? 'leftTree'
              : 'leftTree active'
          }
          style={{ top: props.visiableHeader == 'kbms' ? '130rem' : '80rem' }}
        >
          <img
            src="/img/imageNew/icon1.png"
            style={{ position: 'absolute', left: '20rem', top: '12rem', width: '16rem' }}
          />
          <span style={{ margin: '0 6rem' }}>安保方案</span>
        </div>
      )}
      {props.showLeftTree ? (
        <div
          className={
            props.visiableLeft
              ? 'leftTreeShow'
              : props.visiableHeader == 'kbms'
              ? 'leftTreeShow'
              : 'leftTreeShow active'
          }
          style={{ top: props.visiableHeader == 'kbms' ? '170rem' : '120rem' }}
        >
          <Tree
            checkable
            defaultExpandAll={true}
            onCheck={checkLeftTree}
            treeData={props.leftTreeData}
            checkedKeys={leftKeys}
          />
        </div>
      ) : null}
      <Yaty
        showYaty={showYaty}
        setYatyLine={setYatyLine}
        ref={yatyRef}
        showTables={showTables}
        yatyData={yatyData}
      />

      {/* 应急处置 */}
      <div
        className={showMenus ? 'yjczDiv active' : 'yjczDiv'}
        style={{ left: props.visiableHeader == 'kbms' ? '440rem' : '343rem' }}
      >
        <Yjcz
          checkYaty={checkYaty}
          checkYjcz={checkYjcz}
          ref={yjRef}
          sjczMapClick={sjczMapClick}
          sjczMapClickOff={sjczMapClickOff}
          zdArr={zdArr}
          setClck={setClck}
        />
      </div>
      {/* 重点区域 */}
      <div
        className={showMenus ? 'zdqyDiv yjczDiv active' : 'yjczDiv zdqyDiv'}
        style={{ left: props.visiableHeader == 'kbms' ? '1023rem' : '926rem' }}
      >
        <Zdqy
          setoneSp={setoneSp}
          checkQy={checkQy}
          zdArr={zdArr}
          setPlsp={setPlsp}
          setZdqyTc={setZdqyTc}
          changeTableKey={changeTableKey}
        />
      </div>
      {showYjtc && (
        <YjczTc
          onCancel={onCancel}
          dataConfig={dataConfig}
          eventPerimeterData={eventPerimeterData}
          callBackUrl={callBackUrl}
        />
      )}
      {/* 制高点 */}
      {showZgd && (
        <Zgd
          ref={zgdRef}
          onClickSelView={onClickSelView}
          selCamera={selCamera}
          addZgd={addZgd}
          clearArr={clearArr}
          updateParams={updateParams}
        />
      )}
      {/* 沿线监控 */}
      {showYxjk && <Yxjk setYxjkRadius={setYxjkRadius} />}
      {/* 安保日志 */}
      {showAbrz && <Abrz hideAb={hideAb} ref={abrzRef} abCode={abCode} />}
      {/* 右侧图层 */}
      {showLayers && (
        <div className="leftTreeShow rightLayerShow">
          <Tree
            checkable
            defaultExpandAll={true}
            onCheck={checkRightTree}
            treeData={rightLayers}
            checkedKeys={checkedKeys}
          />
        </div>
      )}
      {/* 房屋详情对话框组件
       {xhouse && (
        <HouseDetail
          houseId={houseId.current}
          visible={xhouse}
          onCancel={() => {
            setXhouse(false);
          }}
        />
      )} */}
      <div
        className={styles.topContainBg}
        style={{
          top: props.visiableHeader == 'kbms' || props.visiableHeader == 'yyc' ? '0' : '60px',
        }}
      />
    </div>
  );
});

export default Mars3DMap;
