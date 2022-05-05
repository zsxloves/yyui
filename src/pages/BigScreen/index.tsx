/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import styles from './index.less';
import './iconfont.less';
import FirstCard from './components/first';
import EventSchedule from './components/eventSchedule';
import DepartmentDutySchedule from './components/departmentDutySchedule';
import AnbaoModule from './components/anbaoModule';
import YanzhengModule from './components/yanzhengModule';
import JianchazhanModule from './components/jianchazhanModule';
import TheTableModule from './components/theTableModule';
import AnjianModule from './components/anjianModule';
import ChangguanModule from './components/changguanModule';
import TingchechangModele from './components/tingchechangModule';
import JingqingModule from './components/jingqingModule';
import RealTimeAlarm from './components/realTimeAlarm';
import XRealTimeAlarm from './components/xrealTimeAlarm';
import PopupAlertSecurity from './components/popupAlertSecurity'; //安检信息弹窗
import PopupAlertjcz from './components/popupAlertjcz'; //检查站信息弹窗
import PopupAlerthdrc from './components/popupAlerthdrc'; //活动日程弹窗
import PopupAlertzbb from './components/popupAlertzbb'; //值班表弹窗
import DealAlarm from './components/dealAlarm';
import DealAlarmRecard from './components/dealAlarmRecard';
import RealTimeAlarmMore from './components/realTimeAlarmMore';
import BigImageView from './components/bigImageView';
import OneStandardAndThreeReals from './components/oneStandardAndThreeReals';
import VideoPlayer from '@/components/videoPlayer/indexMore'; // 海康视频播放
import DahuaVideo from '@/components/dahuaVideo'; // 大华视频播放
import CarBayonet from './components/carBayonet';
import FaceDetail from './components/faceDetail';
import SecurityDetail from './components/securityDetail';
import JczDetail from './components/jczDetail'; //检查站信息详情
import TopCenterModule from '@/components/TopCenter';
import TopCenterrll from '@/components/TopCenterrll';
import TopCentermodel from '@/components/TopCenterStorey';
import Mars3DMap from '../Mars3DMap';
import XhModel from './components/xhModel'
import Time from './components/timer';
import BaseInformation from './components/baseInformation';
import Represent from './components/represent';
import TopWarning from './components/topWarning';
// import {history} from 'umi';
import OrganizationalModule from './components/organizationalModule';
import ActivityFlowModule from './components/activityFlowModule';
import WorkFlowModule from './components/workFlowModule';
import SecurityForcesModule from './components/securityForcesModule';
import TicketModule from './components/ticketModule';
import SecurityCheckModule from './components/securityCheckModule';
import PassengerFlowModule from './components/passengerFlowModule';
import ShuttleBusModule from './components/shuttleBusModule';
import PopupAlertLinkage from './components/popupAlertLinkage';
import ShowMapElement from './components/showMapElement'; //地图
import CheckIn from './components/yyVillage/checkIn';
import KeyActivity from './components/yyVillage/keyActivity';
import ParkingLot from './components/yyVillage/parkingLot';
import Protect from './components/protect';
import OrganizationalStructure from './components/yyVillage/organizationalStructure';
import MatchAnbao from './components/yyVillage/matchAnbao';
import EpidemicPrevention from './components/yyVillage/epidemicPrevention';
import TrafficSituation from './components/yyVillage/trafficSituation';
import ControlCamera from './components/controlCamera';
import XrealTimeCar from './components/xrealTimeCar';
// import {
//   getOrganizationList, getActivityFlowList, getAnbaoFlowMap, getroadJam_points, arSecurityInfo
//   , arVehicleList, arPoliceCount, arAuxiliaryCount, arGuardCount, arCheckTickets, arCheckCertificates, read
// } from '@/services/bigKBMS';
import {
   getActivityFlowList, getAnbaoFlowMap, getroadJam_points, read
} from '@/services/bigKBMS';
import { Select, message, Checkbox, Row, Col, Switch } from 'antd';
import bt from './image/titlebg.png';
// import { ScrollBoard } from '@jiaminghi/data-view-react'
// import FullScreenContainer from '@jiaminghi/data-view-react/es/fullScreenContainer';
import React, { useState, useEffect, useRef } from 'react';
import {
  searchVenues,
  searchActives,
  selectLayer,
  queryJQNum,
  queryCgTc,
  queryYaDetail,
  queryRc,
} from '@/services/topManage/index';
import { updateConfig, querySQX } from '@/services/bigScreen';
import { isJSON, formatPolygon, findElem } from '@/utils/utilsJS';
import GridLayout from 'react-grid-layout';

import { Table } from 'antd';
// import { concat } from 'lodash';
import KeliuModule from './components/keliuModule';
import ImportantScenic from './components/importantScenic';
import { queryTcty } from '@/pages/Mars3DMap/service';

let refreshYJ: number = -1;
let refreshAB: number = -1;
let refreshYZ: number = -1;
let refreshCG: number = -1;
let refreshSS: number = -1;
let refreshAJ: number = -1;
let refreshJQ: number = -1;
let refreshHDRC: number = -1;
let refreshZB: number = -1;
let refreshJCZ: number = -1;
let refreshDBT: number = -1;
// const refreshFY: number = -1;
let refreshBASE: number = -1;





// let itemDateAJ: any = null; // 安检信息, 查询安检口是更改，用于安检点位数据赋值
let sjFlag: any = true;
let reloadVideoTimer: any = null;
const { Option } = Select;
let configData: any[] = [];
let hdDetailList: any[] = [];
let modelIds: string[] = [];
let rightLayers: any = {};
let showRightTop: any = false;
let rightTopId: any = '';
let normalTc: any = ''; // 右上角默认图层信息

const timeOut: any = null;

declare global {
  interface Window {
    changeLayer: any;
  }
}
const BigScreen: React.FC = () => {
  const realTimeAlarm: any = useRef();
  // const handleChange = (value: String) => {
  //     value === '1'? '' : (value === '2' ? history.push('/screenTwo') : history.push('/screenThree'))
  // }
  const [pageTitle, setPageTitle] = useState<string>('亚运AR数智安保平台');
  const [cgValue, changeCgValue] = useState<string>('');
  const [hdList, setHdlist] = useState<any[]>([]);
  const [cgOptions, setCgOptions] = useState<any>('');
  const [activeValue, changeActiveValue] = useState<string>('');
  const [activeOptions, setActiveOptions] = useState<any[]>([]);
  const [moduleArrLeft, setModuleArrLeft] = useState<any[]>([]);
  const [moduleArrRight, setModuleArrRight] = useState<any[]>([]);
  const [visiableSecurity, setVisiableSecurity] = useState<boolean>(false);
  const [visiablejcz, setVisiablejcz] = useState<boolean>(false);
  const [visiablehdrc, setVisiablehdrc] = useState<boolean>(false);
  const [visiablezbb, setVisiablezbb] = useState<boolean>(false);
  const [visiableAlarm, setVisiableAlarm] = useState<boolean>(false); // 预警处置
  const [visiableDealRecard, setVisiableDealRecard] = useState<boolean>(false); // 预警处置记录
  const [popupData, setPopupData] = useState<any>();
  const [popupjczData, setPopupjczData] = useState<any>();
  const [popuphdrcData, setPopuphdrcData] = useState<any>();
  const [popupzbbData, setPopupzbbData] = useState<any>();
  const [alarmItem, setAlarmItem] = useState<any>(); // 预警事件对象
  const [eventPosition, setEventPosition] =
    useState<{ lng: number; lat: number; height: number }>(); // 预警事件位置
  const [eventPerimeterData, setEventPerimeterData] = useState<any>(); // 事件处置周边视频，警力，车辆
  const [visiableLeft, setVisiableLeft] = useState<boolean>(true); // 是否显示左侧栏
  const [visiableRight, setVisiableRight] = useState<boolean>(true); // 是否显示右侧栏
  const [visiableHeader, setVisiableHeader] = useState<string>(''); // 是否显示标题
  const [visiableAlarmMore, setVisiableAlarmMore] = useState<boolean>(false); // 是否显示更多预警
  const [showRight, setShowRight] = useState<number>(1); // 1:主题内容， 2：卡口车流量详情，3：人类抓拍详情，4：安检点详情，5：检查站详情
  const [visiableTop, setVisiableTop] = useState<boolean>(true); // 中间顶部
  const [visiablerll, setVisiablerll] = useState<boolean>(false); // 中间顶部
  const [videoUrlHK, setVideoUrlHK] = useState<string[]>([]); // 海康视频地址
  const [videoUrlDH, setVideoUrlDH] = useState<string[] | string>([]); // 海康视频地址
  const [faceBack, setFaceBack] = useState<{ id: string; name: string }>({ id: '', name: '' }); // 人脸识别点击返回参数
  const [bayonetObj, setBayonetObj] = useState<any>({}); // 车辆卡口id
  const [securityObj, setSecurityObj] = useState<any>({}); // 车辆卡口id
  const [jczObj, setJczObj] = useState<any>({}); // 车辆卡口id

  const [showLeftTree, setShowLeftTree] = useState<boolean>(false);
  const [leftTreeData, setLeftTreeData] = useState<any[]>([]);
  const [leftKey, setLeftKey] = useState<any>([]);
  const [rightCheckBox, setRightCheckBox] = useState<boolean>(false); // 右上角展示
  const [topCheckLi, setTopCheckLi] = useState<any>([]); // 右上角图层
  const [topLis, setTopLis] = useState<any>(''); // 右上角场馆LI
  const [liValue, setLiValue] = useState<any>([]); // 右上角图层
  const [rightId, setRightId] = useState<any>(''); // 右上角点击之后id
  const [rightArr, setRightArr] = useState<any>([]); // 右上角li数组图层
  const [personNumId, setPersonNumId] = useState<any>('');

  const [isDraggable, setIsDraggable] = useState<boolean>(false);
  const [layout, setLayout] = useState<any>();
  const [screenConfigLeft, setScreenConfigLeft] = useState<any>();
  const [screenConfigRight, setScreenConfigRight] = useState<any>();
  const [imgUrl, setImgUrl] = useState<string>('');
  // 开闭幕式
  const [visiableOrganization, setVisiableOrganization] = useState<boolean>(false);
  const [popupOrganizationData, setPopupOrganizationData] = useState<any>();
  const [visiableActivityFlow, setVisiableActivityFlow] = useState<boolean>(false);
  const [popupActivityFlowData, setPopupActivityFlowData] = useState<any>();
  const [visiableAnbaoFlow, setVisiableAnbaoFlow] = useState<boolean>(false);
  const [popupAnbaoFlowData, setPopupAnbaoFlowData] = useState<any>();
  const [visiableAnbaoList, setVisiableAnbaoList] = useState<boolean>(false);
  const [popupAnbaoListData, setPopupAnbaoListData] = useState<any>();
  const [visiableSecurityForces, setVisiableSecurityForces] = useState<boolean>(false);
  const [popupSecurityForcesData, setPopupSecurityForcesData] = useState<any>();
  const [visiableTicket, setVisiableTicket] = useState<boolean>(false);
  const [popupTicketData, setPopupTicketData] = useState<any>();
  const [visiableAnjianFlow, setVisiableAnjianFlow] = useState<boolean>(false);
  const [popupAnjianFlowData, setPopupAnjianFlowData] = useState<any>();
  const [visiableBus, setVisiableBus] = useState<boolean>(false);
  const [visiableControl, setVisiableControl] = useState<boolean>(false);
  const [Senic, setSenic] = useState<boolean>(true);

  const [popupBusData, setPopupBusData] = useState<any>();
  const [flowId, setFlowId] = useState<any>({ id: '' });
  const [securityType, setSecurityType] = useState<number>(1);
  const [ticketsType, setTicketsType] = useState<number>(0);
  const securityApi = { 1: '/kbms/securityCount/policeInfo', 2: '/kbms/securityCount/auxiliaryPolice', 3: '/kbms/securityCount/guard' }
  const certificatesApi = { 0: '/kbms/checkTickets/check_info', 1: '/kbms/checkCertificates/certInfo' }
  // 3d地图ref
  const mapRef: any = useRef(null);
  const abRef: any = useRef(null);
  const ajRef: any = useRef(null);
  const ybssRef: any = useRef(null);
  const jczRef: any = useRef(null);
  const [visiableStorey, setVisiableStorey] = useState<boolean>(false); // 楼层显示

  const hidePopupAll = () => {
    setVisiableAlarm(false);
    setVisiableAlarmMore(false);
    setVisiableDealRecard(false);
  };

  const reloadVideo = (ids?: any) => {
    clearTimeout(reloadVideoTimer);
    reloadVideoTimer = setTimeout(() => {
      if (ids) {
        abRef?.current?.getArVideos(ids);
      } else {
        const li = window.map.getLayers({
          layers: true,

        });
        console.log('liwwwwwwwww:', li);
        const lis = li
          .map((item: any) => {
            if (
              item.show &&
              item.options?.type === '3dtiles' &&
              item.state === 'added' &&
              item.options?.name.indexOf('倾斜') === -1
            ) {
              return item.options.id;
            }
          })
          .filter((val: any) => {
            return val;
          });
        if (modelIds.sort().toString() == lis.sort().toString()) {
          return;
        }
        modelIds = lis;
        console.log(lis);
        abRef?.current?.getArVideos(lis);
      }
    }, 500);
  };
  // 加载3d模型
  const loadModel = (entity: any, layerGrap: any, name?: any) => {
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
    const eventTarget = new mars3d.BaseClass();
    let flag = true;
    if (name) {
      flag = false;
    }
    try {
      const position = entity.position
        ? entity.position
        : entity.offset
          ? { lng: entity?.offset?.x, lat: entity?.offset?.y, alt: entity?.offset?.z }
          : {}
      if (Object.keys(position).length === 0) {
        // message.error('后台模型数据配置错误');
        return ''
      }
      layerGrap = new mars3d.layer.TilesetLayer({
        ...entity,
        center: window.map.getCameraView(),
        position: position,
        rotation: entity.rotation ? entity.rotation : { x: rotax, y: rotay, z: rotaz },
        show: flag,
      });
    } catch (e: any) {
      console.log(e);
    }
    if (!layerGrap) {
      return;
    }
    window.map.addLayer(layerGrap);
    layerGrap.on(mars3d.EventType.load, function (event: any) {
      const dataV = event.tileset;
      const lay = layerGrap;
      eventTarget.fire('tiles3dLayerLoad', { dataV, lay });
      reloadVideo();
    });
    return layerGrap;
  };

  const checkMessage = (name: string, obj: number | null) => {
    configData.map((k) => {
      if (k.code == name) {
        if (obj || obj == 0) {
          k.popupContent.subscript = obj
        }
        setVisiableSecurityForces(false)
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        titleClickFun(k)
      }
    })
  }
  const readd = (item: any) => {
    if (item?.isRead === '1') return
    read({ 'id': item?.id }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const checkMessageMap = (name: string, obj: number | null) => {
    setPopupAnbaoFlowData({})
    if (name == 'abgongzuoliuchengMap') {
      const obj1 = {
        subscript: obj,
        polygon: 'circular&point',
        timeStamp: (new Date()).valueOf(),
        requestGraphic: getAnbaoFlowMap,
        requestPoint: getAnbaoFlowMap,
        paramsGraphic: { "time": '123' },
        paramsPoint: { "time": '123' },
        icon: "/img/jingli.png",
        type: '安保工作流程',
      }
      setVisiableAnbaoFlow(!visiableAnbaoFlow);
      setPopupAnbaoFlowData(obj1);
    } else if (name == 'anjianxinxikbmsMap') {
      const obj1 = {
        subscript: obj,
        polygon: 'point',
        timeStamp: (new Date()).valueOf(),
        requestPoint: getAnbaoFlowMap,
        paramsPoint: { "time": '123' },
        icon: '/img/mapImg/aj.png',
        type: '安检',
      }
      setVisiableAnbaoFlow(!visiableAnbaoFlow);
      setPopupAnbaoFlowData(obj1);
    } else if (name == 'banchediaoduMap') {
      const obj1 = {
        subscript: obj,
        polygon: 'line&point',
        timeStamp: (new Date()).valueOf(),
        requestPoint: getAnbaoFlowMap,
        requestLine: getroadJam_points,
        paramsPoint: { "time": '123' },
        icon: '/img/cheliang.png',
        type: '车辆',
        resultLine: ['result']
      }
      setVisiableAnbaoFlow(!visiableAnbaoFlow);
      setPopupAnbaoFlowData(obj1);
    }
  }
  // 模块渲染
  const moduleCom = (component: string, config: any, key: number, refresh?: boolean) => {
    switch (component) {
      case '1': {
        if (refresh) {
          refreshSS = new Date().getTime();
        }
        return <FirstCard dataConfig={config} key={key} refresh={refreshSS} />;
      }
      case '2': {
        if (refresh) {
          refreshAB = new Date().getTime();
        }
        return (
          <AnbaoModule
            dataConfig={config}
            key={key}
            ref={abRef}
            refresh={refreshAB}
            callBackUrl={(value: string[], type: string) => {
              if (type === '大华') {
                setVideoUrlDH(value);
              } else {
                setVideoUrlHK(value);
              }
            }}
            callBackFace={(val: { id: string; name: string }) => {
              setFaceBack(val);
              setShowRight(3);
            }}
            callBackVideoAR={(item: any) => {
              // 视频AR用
              mapRef.current.setVideo(item);
            }}
          />
        );
      }
      case '3': {
        if (refresh) {
          refreshYZ = new Date().getTime();
        }
        return <YanzhengModule dataConfig={config} key={key} refresh={refreshYZ} />;
      }
      case '4': {
        if (refresh) {
          refreshAJ = new Date().getTime();
        }
        return (
          <AnjianModule
            ref={ajRef}
            dataConfig={config}
            key={key}
            refresh={refreshAJ}
            callBackLoadModel={(entity, layer) => {
              if (entity) {
                return loadModel(entity, layer);
              } else {
                window.map.removeLayer(layer);
                reloadVideo();
              }
            }}
            callBackSecurity={(val: { id: string; name: string }) => {
              setSecurityObj(val);
              setShowRight(4);
            }}
            callBackImageUrl={(val: string) => {
              setImgUrl(val);
            }}
          />
        );
      }
      case '5': {
        if (refresh) {
          refreshCG = new Date().getTime();
        }
        return (
          <ChangguanModule
            dataConfig={config}
            key={key}
            refresh={refreshCG}
            callBackLoadModel={(entity, layer) => {
              if (entity) {
                return loadModel(entity, layer);
              } else {
                window.map.removeLayer(layer);
                reloadVideo();
              }
            }}
          />
        );
      }
      case '6': {
        if (refresh) {
          refreshYJ = new Date().getTime();
        }
        return (
          <RealTimeAlarm
            ref={realTimeAlarm}
            dataConfig={config}
            refresh={refreshYJ}
            key={key}
            showDealMore={() => {
              hidePopupAll();
              setVisiableAlarmMore(true);
            }}
            alarmDeal={(item) => {
              readd(item)
              setAlarmItem(item);
              setEventPosition({
                lng: item.lon,
                lat: item.lat,
                height: item.height || 0,
              });
              window.map.centerAt({
                lng: item.lon,
                lat: item.lat,
                height: item.height || 0,
              });
              if (Number(item.state) === 0) {
                setVisiableAlarm(true);
                setVisiableDealRecard(false);
              } else {
                realTimeAlarm?.current?.getPageFun()
                setVisiableAlarm(false);
                setVisiableDealRecard(true);
              }
            }}
          />
        );
      }
      case '7': {
        if (refresh) {
          refreshJQ = new Date().getTime();
        }
        return <JingqingModule dataConfig={config} key={key} refresh={refreshJQ} />;
      }
      case '8': {
        if (refresh) {
          refreshHDRC = new Date().getTime();
        }
        return <EventSchedule dataConfig={config} key={key} refresh={refreshHDRC} />;
      }
      case '9': {
        if (refresh) {
          refreshZB = new Date().getTime();
        }
        return <DepartmentDutySchedule dataConfig={config} key={key} refresh={refreshZB} />;
      }
      case '10': {
        if (refresh) {
          refreshJCZ = new Date().getTime();
        }
        return (
          <>
            <JianchazhanModule
              ref={jczRef}
              dataConfig={config}
              key={key}
              refresh={refreshJCZ}
              callBackSecurity={(val: { id: string; name: string }) => {
                setJczObj(val);
                setShowRight(5);
              }}
            />
            {/* <TheTableModule
            dataConfig={config}
            key={key}
            refresh={refreshJCZ}
            xdata={{}}
            // xdata={window.setStatisData}
          /> */}
          </>
        );
      }
      case '11': {
        if (refresh) {
          refreshBASE = new Date().getTime();
        }
        return (
          <BaseInformation
            ref={ajRef}
            dataConfig={config}
            key={key}
            refresh={refreshBASE}
            callBackLoadModel={(entity, layer) => {
              if (entity) {
                return loadModel(entity, layer);
              } else {
                window.map.removeLayer(layer);
                reloadVideo();
              }
            }}
            callBackSecurity={(val: { id: string; name: string }) => {
              setSecurityObj(val);
              setShowRight(4);
            }}
            callBackImageUrl={(val: string) => {
              setImgUrl(val);
              console.log('val:', val);
            }}
          />
        );
      }
      case '12': {
        if (refresh) {
          refreshDBT = new Date().getTime();
        }
        return (
          <Represent
            dataConfig={config}
            key={key}
            refresh={refreshDBT}
          />
        );
      }
      case '19': {//组织架构
        return <OrganizationalModule dataConfig={config} key={key} refresh={refreshJCZ} />;
      }
      case '20': {//活动流程
        return <ActivityFlowModule dataConfig={config} key={key} callBackUrl={checkMessage} />;
      }
      case '28': {//安保工作流程
        return <WorkFlowModule dataConfig={config} key={key} callBackUrl={checkMessage} />;
      }
      case '14': {//安保力量信息
        return <SecurityForcesModule dataConfig={config} key={key} />;
      }
      case '15': {//票证信息
        return <TicketModule dataConfig={config} key={key} />;
      }
      case '16': {//安检信息
        return <SecurityCheckModule dataConfig={config} key={key} />;
      }
      case '17': {//地铁客流信息
        return <PassengerFlowModule dataConfig={config} key={key} />;
      }
      case '18': {//班车调度信息
        return <ShuttleBusModule dataConfig={config} key={key} />;
      }
      case '21': {//入住信息
        //  dataConfig={config}
        return <CheckIn key={key} />;
      }
      case '22': {//重要活动
        //  dataConfig={config}
        return <KeyActivity key={key} />;
      }
      case '23': {//停车场信息
        //  dataConfig={config}
        return <ParkingLot key={key} />;
      }
      case '24': {//周边交通态势
        //  dataConfig={config}
        return <TrafficSituation key={key} />;
      }
      case '25': {//组织指挥
        //  dataConfig={config}
        return <OrganizationalStructure key={key} />;
      }
      case '26': {//验证信息
        //  dataConfig={config}
        return <MatchAnbao key={key} />;
      }
      case '27': {//疫情信息
        //  dataConfig={config}
        return <EpidemicPrevention key={key} />;
      }
      case '29': {
        if (refresh) {
          refreshJCZ = new Date().getTime();
        }
        return (
          <>
            <TheTableModule dataConfig={config} key={key} refresh={refreshJCZ} xdata={{}} />
          </>
        );
      }
      case '30': {
        if (refresh) {
          refreshCG = new Date().getTime();
        }
        return (
          <XrealTimeCar
            dataConfig={config}
            key={key}
            refresh={refreshCG}
          />
        );
      }
      case '31': {
        if (refresh) {
          refreshCG = new Date().getTime();
        }
        return (
          <KeliuModule
            key={key}
            refresh={refreshCG}
            // 返回实时客流
            callBackKlNum={(kl) => {
              // eslint-disable-next-line @typescript-eslint/no-use-before-define
              setKlNum(kl)
            }}
          />
        );
      }
      case '32': {
        if (refresh) {
          refreshYJ = new Date().getTime();
        }
        return (
          <XRealTimeAlarm
            dataConfig={config}
            refresh={refreshYJ}
            key={key}
            showDealMore={() => {
              hidePopupAll();
              setVisiableAlarmMore(true);
            }}
            alarmDeal={(item) => {
              setAlarmItem(item);
              setEventPosition({
                lng: item.lon,
                lat: item.lat,
                height: item.height || 0,
              });
              window.map.centerAt({
                lng: item.lon,
                lat: item.lat,
                height: item.height || 0,
              });
              if (Number(item.state) === 0) {
                setVisiableAlarm(true);
                setVisiableDealRecard(false);
              } else {
                setVisiableAlarm(false);
                setVisiableDealRecard(true);
              }
            }}
          />
        );
      }
      case '33': {
        if (refresh) {
          refreshCG = new Date().getTime();
        }
        return (
          <ImportantScenic
            key={key}
            refresh={refreshCG}
            callBackUrl={(value: string[], type: string) => {
              if (type === '大华') {
                setVideoUrlDH(value);
              } else {
                setVideoUrlHK(value);
              }
            }}
            getMapRef={mapRef}
            reloadVideo={reloadVideo}
            callbackOnMap={(result: any)=>{
              mapRef?.current?.setZdqyTc(result)
            }}
            personNumId={personNumId}
          />
        );
      }
      case '34': {
        if (refresh) {
          refreshCG = new Date().getTime();
        }
        return (
          <Protect
            key={key}
            refresh={refreshCG}
            dataConfig={config}
          />
        );
      }
      case '13': {
        if (refresh) {
          refreshCG = new Date().getTime();
        }
        return (
          <TingchechangModele
            dataConfig={config}
            key={key}
            refresh={refreshCG}
            callBackLoadModel={(entity, layer) => {
              if (entity) {
                return loadModel(entity, layer);
              } else {
                window.map.removeLayer(layer);
                reloadVideo();
              }
            }}
          />
        );
      }
      default: {
        return null;
      }
    }
  };
  const initData = (refreshArr?: string[]) => {
    let ArrLeft: any[] = [];
    let ArrRight: any[] = [];
    ArrLeft = [];
    ArrRight = [];
    if (!Array.isArray(configData)) {
      return;
    }
    configData.forEach((item: any, index: number) => {
      if (item.show) {
        const isRefresh = refreshArr && refreshArr.includes(item.component) ? true : false;
        if (item.position === 'left') {
          ArrLeft.push({
            ...item,
            children: moduleCom(item.component, item.dataConfig, index, isRefresh),
          });
        } else {
          ArrRight.push({
            ...item,
            children: moduleCom(item.component, item.dataConfig, index, isRefresh),
          });
        }
      }
      if (item.code === 'anjianxinix' && item.popupContent) {
        setPopupData(item.popupContent);
      }
      if (item.code === 'jianchazhan' && item.popupContent) {
        setPopupjczData(item.popupContent);
      }
      if (item.code === 'hdrc' && item.popupContent) {
        setPopuphdrcData(item.popupContent);
      }
      if (item.code === 'bmzbb' && item.popupContent) {
        setPopupzbbData(item.popupContent);
      }
      if (item.code === 'zuzhijiagou' && item.popupContent) {
        setPopupOrganizationData(item.popupContent);
      }
      if (item.code === 'huodongliucheng' && item.popupContent) {
        setPopupActivityFlowData(item.popupContent);
      }
      if (item.code === 'abgongzuoliucheng' && item.popupContent) {
        setPopupAnbaoFlowData(item.popupContent);
      }
      if (item.code === 'anbaoziyuan' && item.popupContent) {
        setPopupSecurityForcesData(item.popupContent);
      }
      if (item.code === 'piaozhengxinxi' && item.popupContent) {
        setPopupTicketData(item.popupContent);
      }
      if (item.code === 'anjianxinxikbms' && item.popupContent) {
        setPopupAnjianFlowData(item.popupContent);
      }
      if (item.code === 'banchediaodu' && item.popupContent) {
        setPopupBusData(item.popupContent);
      }
    });
    // ArrLeft.sort((n1, n2) => {
    //   return n1.orderIndex - n2.orderIndex;
    // });
    // ArrRight.sort((n1, n2) => {
    //   return n1.orderIndex - n2.orderIndex;
    // });
    setModuleArrLeft(ArrLeft);
    setModuleArrRight(ArrRight);
    const title = window.cjObj.title || '数智安保平台';
    setPageTitle(title);
    $('title').html(title);
  };
  // 根据场景查询图层
  const searchTc = (id: any, flag: boolean) => {
    normalTc = [];
    const param = {
      id: id,
      pageSize: 999,
      pageNumber: 1,
    };
    selectLayer(param).then((res: any) => {
      const dataRow: any = [];
      res.data?.rows.forEach((item: any) => {
        if (item.isDefult === '1') {
          dataRow.push(item.id);
        }
      });
      normalTc = dataRow;
      mapRef?.current?.setBgLayer(res, flag);
      mapRef?.current?.setTreeKey(normalTc)
    });
  };
  // 设置左侧数量
  const setLeftAbNum = (obj: any) => {
    abRef?.current?.setAbDate(obj);
  };
  const setKey = (val: any) => {
    setLeftKey(val);
  };
  // 岗点数据查询鼻
  const searchGdData = (value: any) => {
    const params = {
      avtivityId: value,
      level: '422260ba-5c8b-11ec-8bb3-0242ac110002',
      needPerson: '1',
    };
    queryYaDetail(params).then((res: any) => {
      const results = res.data.rows;
      mapRef.current.gdData = results;
    });
  };
  // 设置全局视域
  const setViewsFun = (data: any) => {
    if (!data) {
      window.polygon = null;
      return;
    }
    const a = JSON.parse(data);
    const polygon = formatPolygon(a);
    window.polygon = polygon;
  };
  // 大屏三圈线点击
  const sqxClick = (val: any) => {
    console.log('三圈：', val);
    if (val.checked) {
      window.polygon = val.coordinates.map((item: any) => {
        return { x: item[0], y: item[1] };
      });
    } else {
      setViewsFun(window.cjObj.views);
    }
    initData(['2', '6', '7']);
  };
  // 调用方法
  const loadSqx = (sqxData: any) => {
    if (mapRef?.current) {
      mapRef.current.getSqx(sqxData)
    } else {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        loadSqx(sqxData)
      }, 1000)
    }
  }
  // 活动设置
  const setHd = (value: any) => {
    setLeftKey([]);
    mapRef.current.setCheckTree([]);
    changeActiveValue(value);
    window.hdObj = {};
    hdDetailList.some((item: any) => {
      if (item.id === value) {
        window.hdObj = item;
        initData(['1']);
        return;
      }
    });
    // 设置场景改变数量和预案
    mapRef?.current?.clearAllya();
    if (value) {
      const param = {
        activityId: value,
      };
      searchActives(param).then((res) => {
        if (res.data) {
          setLeftTreeData(res.data);
          // let code: any = []
          // const sqxData: any = []
          // // const arr=tree2Array(res.data,value) || []
          // // arr.map((items: any) => {
          // //   const newCode = JSON.parse(items?.data?.geoJson || "{}")?.features?.filter((item: any) => {
          // //     const properties = item.properties
          // //     const entity = JSON.parse(properties?.data?.entity||"{}")
          // //     const sqx = entity?.info?.code
          // //     if (sqx === 'sqx') {
          // //       sqxData.push(items)
          // //       return true
          // //     } else {
          // //       return false
          // //     }
          // //   })||[]
          // //   code = [...newCode,...code]
          // // })
          // // 活动下有三圈线
          // if (code && code.length) {
          //   const params = {
          //     checked: true,
          //     coordinates: code[0].geometry?.coordinates || []
          //   }
          //   sqxClick(params)
          //   console.log('sqx-loadSqx:',sqxData)
          //   // 调用点击
          //   loadSqx(sqxData)
          // }
        } else {
          setLeftTreeData([]);
        }
      });
      queryJQNum(param).then((res: any) => {
        setLeftAbNum(res.data);
      });
      searchGdData(value);
    } else {
      setLeftTreeData([]);
      mapRef.current.gdData = [];
    }
  };
  const setHdnum = () => {
    const param = {
      activityId: window.hdObj.id,
    };
    queryJQNum(param).then((res: any) => {
      setLeftAbNum(res.data);
    });
  };
  // 去除默认图层
  const changeOneBox = (e: any) => {
    const value = e.target.value
    mapRef.current.changeNormalTc(value)
  }
  const changeLiList = (val: any, id?: any) => {
    setLiValue(val);
    if (id) {
      for (const key in rightLayers[id]) {
        console.log(key)
        if (val.indexOf(key) === -1) {
          if (rightLayers[id][key]) {
            rightLayers[id][key].show = false;
          }
        } else {
          if (rightLayers[id][key]) {
            rightLayers[id][key].show = true;
          }
        }
      }
      setRightId(id);
    } else {
      for (const keys in rightLayers[rightId]) {
        if (val.indexOf(keys) === -1) {
          if (rightLayers[rightId][keys]) {
            rightLayers[rightId][keys].show = false;
          }
        } else {
          if (rightLayers[rightId][keys]) {
            rightLayers[rightId][keys].show = true;
          }
        }
      }
    }
    reloadVideo();
  };
  const callBackLiSet = (val: any, id: any) => {
    changeLiList(val, id);
  };
  const clickTopLi = (item: any) => {
    if (item.id === rightTopId) {
      if (showRightTop) {
        setRightCheckBox(false);
        showRightTop = false;
        rightTopId = '';
        return;
      }
    }
    // setRightCheckBox(true);
    setRightCheckBox(false);
    showRightTop = true;
    setRightId(item.id);
    rightTopId = item.id;
    const topParam = {
      id: item.id,
    };
    queryCgTc(topParam).then((res: any) => {
      const keys = Object.keys(rightLayers[item.id]);
      const result = res.data.rows;
      if (result.length) {
        result.sort(function (a: any, b: any) {
          return parseInt(b.sortIndex) - parseInt(a.sortIndex);
        });
        // if (normalTc.length) {
        //   result = result.filter((items: any) => {
        //     return normalTc.indexOf(items.id) === -1;
        //   });
        // }
        setTopCheckLi(result);
        if (!keys.length) {
          result.forEach((cgTc: any) => {
            const enetity = JSON.parse(cgTc.entity || '{}');
            if (Object.keys(enetity).length !== 0) {
              enetity.show = false;
              enetity.id = cgTc.id;
            }
            // const layer = mars3d.LayerUtil.create(enetity);
            rightLayers[item.id][cgTc.id] = ''
            const layer = loadModel(enetity, rightLayers[item.id][cgTc.id], 'top');
            rightLayers[item.id][cgTc.id] = layer;
            // mapRef.current.setBigModel(rightLayers[item.id][cgTc.id]);
          });
          let newArrOne: any = [];
          if (normalTc.length) {
            newArrOne = newArrOne.concat(normalTc)
          }
          // console.log(newArrOne)
          setLiValue(newArrOne);
        } else {
          let newArr: any = [];
          for (const key in rightLayers[item.id]) {
            if (rightLayers[item.id][key].show === true) {
              newArr.push(key);
            }
          }
          if (normalTc.length) {
            newArr = newArr.concat(normalTc)
          }
          // console.log(newArr)
          setLiValue(newArr);
        }
        // setTimeout(() => {
        if (item.newId) {
          const cgliList = result.map((itemss: any) => {
            return itemss.id;
          });
          if (cgliList.indexOf(item.newId) > -1) {
            callBackLiSet(item.newId, item.id);
          } else {
            console.log('场馆模型不匹配，请重新配置')
            // message.error('场馆模型不匹配，请重新配置');
          }
        }
        // }, 2000)
      } else {
        setLiValue([]);
        setTopCheckLi([]);
      }
    });
  };
  const setToplis = (arr: any) => {
    return arr.map((item: any, index: number) => {
      rightLayers[item.id] = {};
      return (
        <li onClick={() => clickTopLi(item)} key={index} className={item.flag ? 'active' : ''}>
          <span>{item.name}</span>
        </li>
      );
    });
  };
  // 关联场景 TODO
  const setCj = async (value: any) => {
    if (timeOut) {
      clearTimeout(timeOut);
    }
    mapRef.current.setTl([]);
    changeCgValue(value);
    await searchTc(value, true);
    mapRef.current.gdData = [];
    mapRef.current.removeAllAn();
    // window.cjObj = item
    hdList.some((item: any) => {
      if (item.id === value) {
        setPersonNumId(item.entity);
        const result = item.activityList;
        hdDetailList = result;
        window.cjObj = item;
        setRightArr(item.gymList);
        setTopLis(setToplis(item.gymList));
        mapRef?.current?.goHome();
        if (sjFlag) {
          setTimeout(() => {
            mapRef?.current?.expImageMap(false);
          }, 2000)
        }
        mapRef?.current?.showTreeCg(item.id)
        // if (sjFlag) {
        //   setTimeout(mapRef?.current?.expImageMap(true), 1000);
        // }
        rightLayers = {};
        setTopLis(setToplis(item.gymList));
        setViewsFun(item.views);
        let activeValueNew = '';
        if (result.length) activeValueNew = result[0].id;
        changeActiveValue(activeValueNew);
        const activeOptionsNew = result.map((val: any, index: any) => {
          return (
            <Option value={val.id} key={index}>
              {val.name}
            </Option>
          );
        });
        setActiveOptions(activeOptionsNew);
        if (result.length) {
          setHd(result[0].id);
          window.hdObj = result[0];
        } else {
          setHd('');
          window.hdObj = {};
        }
        return;
      }
    });

    if (showRightTop) {
      showRightTop = false;
      setRightCheckBox(false);
      rightTopId = '';
    }
    //TODO xb 解决初始化飞行BUG 方法
    // if (sjFlag) {
    //   timeOut = setTimeout(()=>{
    //     mapRef?.current?.expImageMap(true)
    //   },10000)
    // }
  };

  // 查询场景
  const searchSelect = () => {
    const param = {
      queryObject: {
        size: 9999,
        page: 0,
      },
    };
    // 查询所有场景
    searchVenues(param).then((res) => {
      const result = res.result?.page?.content || [];
      let list = [];
      let listTwo = [];
      if (result.length) {
        let endResult: any = {};
        let scenseId = '';
        // 奥体  0e8db8e7-de5f-47a7-bd7e-cf31715dc63c
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
        changeCgValue(endResult.id);
        window.cjObj = endResult;
        rightLayers = {};
        setRightArr(endResult.gymList);
        setTopLis(setToplis(endResult.gymList));
        setViewsFun(endResult.views);
        searchTc(endResult.id, false);
        mapRef?.current?.showTreeCg(endResult.id)
        list = result;
        listTwo = endResult.activityList;
        setPersonNumId(endResult.entity);
        if (listTwo.length) {
          changeActiveValue(listTwo[0].id);
          setHd(endResult.activityList[0].id);
          window.hdObj = endResult.activityList[0];
        } else {
          changeActiveValue('');
          setLeftTreeData([]);
          window.hdObj = {};
        }
        // initData(); //场景，活动加载完成后初始化页面
      } else {
        changeCgValue('');
        changeActiveValue('');
        window.cjObj = {};
        window.hdObj = {};
        list = [];
        listTwo = [];
      }
      const cgOptionsNew = list.map((item: any, index: any) => {
        return (
          <Option value={item.id} key={index}>
            {item.name}
          </Option>
        );
      });
      const activeOptionsNew = listTwo.map((item: any, index: any) => {
        return (
          <Option value={item.id} key={index}>
            {item.name}
          </Option>
        );
      });
      hdDetailList = listTwo;
      setHdlist(list);
      setCgOptions(cgOptionsNew);
      setActiveOptions(activeOptionsNew);
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isCg = (param: any) => {
    const ids = rightArr.map((item: any) => {
      return item.id;
    });
    if (ids.indexOf(param.id) === -1) {
      console.log('场景场馆不匹配，请重新配置')
      // message.error('场景场馆不匹配，请重新配置');
      return;
    } else {
      clickTopLi(param);
    }
  };
  const clickShowTree = (val?: any) => {
    if (val !== 'close') {
      if (val) {
        setLeftKey(val);
      }
    } else {
      setShowLeftTree(false);
      return
    }
    setShowLeftTree(!showLeftTree);
    if (!showLeftTree) {
      mapRef.current.setCheckTree(val ? val : leftKey);
    }
  };
  // const showAlertAJFun = () => {
  //     setVisiableAJ(!visiableAJ)
  // }
  const getScreenConfig = () => {
    const json1 = window.cjObj.screenConfig;
    let layoutObj: any[] = [];
    if (isJSON(json1) && JSON.parse(json1 || '[]') && Array.isArray(JSON.parse(json1 || '[]'))) {
      layoutObj = JSON.parse(json1);
    }
    configData.forEach((res: any) => {
      const flg = layoutObj.every((ite: any) => {
        return ite.i !== res.code;
      });
      if (res.show && flg) {
        layoutObj.push({ i: res.code, x: 0, y: 0, w: 24, h: res?.h || 9, minW: 24, minH: 5 });
      }
    });
    setLayout(layoutObj);
  };
  const getQueryString = (name: string) => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  }
  const getQueryStringObj = (name: string) => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[0]); return null;
  }
  // 湘湖景区数据
  const [carNum, setCarNum] = useState<number>(0)
  const [ycNum, setYcNum] = useState<number>(0)
  const [klNum, setKlNum] = useState<number>(0)
  const [xhjq, setXhjq] = useState<boolean>(false)

  const setXhZd = () => {
    mapRef.current.showXhZdlk()
  }
  const setXhCars = () => {
    mapRef.current.showXhCar()
  }
  const serXhYcs = () => {
    mapRef.current.showXhYc()
  }
  const changeYcNum = (num: any) => {
    setYcNum(num)
  }
  // 修改陈亮20220501
  const setNewXh = (newData: any) => {
    fetch('http://41.200.14.143:3000/park/query').then((response) => response.json())
      .then((res) => {
        if (res.status == 'ok' && res.results.length > 0) {
          const date = res.results;
          date?.map((item: any, index: any) => {
            const indexId = findElem(newData, "id", item.id) as number; //拿到接口对应数据索引
            if (indexId === -1) return;
            newData[indexId].left_place = date[index]?.left_place;
            newData[indexId].total_place = date[index]?.total_place;
          })
          mapRef.current.setXhCar(newData);
        }
      })
      .catch((err) => {
        console.log(err.message || err)
        // message.error(err.message || err);
      });
    fetch('http://41.200.14.143:47970/zju/gps').then((response) => response.json())
      .then((data) => {
        setYcNum(data.length)
        mapRef.current.serXhYc(data)
      }).catch((err) => {
        console.log(err.message || err)
        // message.error(err.message || err);
      });
  }
  const setXh = () => {
    setXhjq(true)
    fetch('/ARBIGdist/js/park.json').then((response) => response.json())
      .then((data) => {
        setCarNum(data.results.length)
        mapRef.current.setXhCar(data.results)
        setNewXh(data.results);
        setInterval(() => {
          setNewXh(data.results);
        }, 1000 * 60);
      }).catch((err) => {
        console.log(err.message || err)
        // message.error(err.message || err);
      });
  }
  const setXhZdlk = () => {
    setXhjq(true)
    fetch('/ARBIGdist/js/keyCross.json').then((response) => response.json())
      .then((data) => {
        // setCarNum(data.results.length)
        mapRef.current.setXhZDLK(data.results)
      }).catch((err) => {
        console.log(err.message || err)
        // message.error(err.message || err);
      });
    //mapRef.current.setXhZDLK()  //findElem
  }

  useEffect(() => {
    initData(['33'])
  }, [personNumId])

  useEffect(() => {
    console.log('模块：', window.cjObj);
    setXhjq(false)
    if (window.cjObj.name === '湘湖景区') {
      if (window.cjObj.name) {
        if (mapRef?.current) {
          setXh();
          setXhZdlk();
        } else {
          setTimeout(() => {
            setXh();
            setXhZdlk();
          }, 1000)
        }
      }
    }
    if (window.cjObj.id) {
      if (window.cjObj?.indexConfigUrl && isJSON(window.cjObj.indexConfigUrl)) {
        configData = JSON.parse(window.cjObj.indexConfigUrl);
        if (Array.isArray(configData)) {
          setVisiableTop(true);
          initData(['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33']);
          getScreenConfig();
        }
        // fetch(window.cjObj.indexConfigUrl)
        //   .then((response) => response.json())
        //   .then((data) => {
        //     configData = data;
        //     setVisiableTop(true);
        //     initData(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
        //   })
        //   .catch(() => {
        //     console.log('error');
        //   });
      } else {
        fetch('/ARBIGdist/js/config.json')
          .then((response) => response.json())
          .then((data) => {
            configData = data;
            setVisiableTop(true);
            initData(['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33']);
            getScreenConfig();
          })
          .catch(() => {
            console.log('error');
          });
      }
    }
    const harfType = getQueryString('params');
    const isParams = getQueryStringObj('params')
    if (isParams && isParams?.indexOf('params') != -1) {
      setVisiableLeft(false)
      setVisiableRight(false)
      if (harfType) {
        setVisiableHeader(harfType)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.cjObj]);

  // postMessage接收动作
  const dealMessage = (e: any) => {
    const { code, params } = e.data;
    console.log('message-111', e.data, params);
    // message.info(code);
    switch (code) {
      case 'kbms_organization': {
        //组织架构
        checkMessage('zuzhijiagou', null)
        break;
      }
      case 'kbms_activety': {
        //开幕式活动流程
        if (params) {
          setFlowId({ id: params.id })
          checkMessage('huodongliucheng', 1)
        } else {
          setFlowId({ id: '' })
          checkMessage('huodongliucheng', 0)
        }
        break;
      }
      case 'kbms_ablc': {
        //地图展示内容
        if (params) {
          // checkMessageMap('abgongzuoliuchengMap',1)
        }
        break;
      }
      case 'kbms_police': {
        // 民警计划上岗树
        if (params) {
          setSecurityType(params.id)
          checkMessage('anbaoziyuan', params.id - 1)
        }
        break;
      }
      case 'kbms_ticketCheck': {
        // 已验票数
        setTicketsType(0)
        checkMessage('piaozhengxinxi', 0)
        break;
      }
      case 'kbms_enter': {
        // 观众入场

        break;
      }
      case 'kbms_cardCheck': {
        // 已验证数
        setTicketsType(1)
        checkMessage('piaozhengxinxi', 1)
        break;
      }
      case 'kbms_channelGoods': {
        // 违禁物品总数
        checkMessage('anjianxinxikbms', 1)
        break;
      }
      case 'kbms_channel': {
        // 通道名称
        if (params) {
          // checkMessageMap('anjianxinxikbmsMap',1)
        }
        break;
      }
      case 'kbms_busPlan': {
        // 计划总车次数
        checkMessage('banchediaodu', 0)
        break;
      }
      case 'kbms_busGps': {
        // 指定在途车辆当前位置
        if (params) {
          // checkMessageMap('banchediaoduMap',1)
        }
        break;
      }
      default:
        break;
    }
  };
  useEffect(() => {
    searchSelect();
    // 监听postMessage
    window.addEventListener('message', (e: any) => {
      dealMessage(e);
    });
    // setVideoUrlHK(
    //   [
    //     'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    //     'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    //   ]
    // )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const titleClickFun = (item: any) => {
    const obj: any = { ...item.popupContent }
    obj.timeStamp = (new Date()).valueOf()
    // importantSenic
    if (item.code === 'anjianxinxi' && item.popupContent) {
      setVisiableSecurity(!visiableSecurity);
      setPopupData(item.popupContent);
    } else if (item.code === 'jingqingxinxi') {
      $('.isClick[data-code="jingqingxinxi"]').toggleClass('visiableSecurity');
      refreshJQ = new Date().getTime();
      initData();
    } else if (item.code === 'jianchazhan' && item.popupContent) {
      setVisiablejcz(!visiablejcz);
      setPopupjczData(item.popupContent);
    } else if (item.code === 'hdrc' && item.popupContent) {
      setVisiablehdrc(!visiablehdrc);
      setPopuphdrcData(item.popupContent);
    } else if (item.code === 'bmzbb' && item.popupContent) {
      setVisiablezbb(!visiablezbb);
      setPopupzbbData(item.popupContent);
    } else if (item.code === 'zuzhijiagou' && item.popupContent) {
      setVisiableOrganization(!visiableOrganization);
      setPopupOrganizationData(obj);
    } else if (item.code === 'huodongliucheng' && item.popupContent) {
      setVisiableActivityFlow(!visiableActivityFlow);
      setPopupActivityFlowData(obj);
    } else if (item.code === 'abgongzuoliucheng' && item.popupContent.subscript == 0) {
      setVisiableAnbaoList(!visiableAnbaoList);
      setVisiableAnbaoFlow(false);
      setPopupAnbaoListData(obj);
    } else if (item.code === 'abgongzuoliucheng' && item.popupContent.subscript == 1) {
      const obj1 = {
        subscript: item.popupContent.subscript,
        polygon: 'circular&point',
        timeStamp: (new Date()).valueOf(),
        requestGraphic: getAnbaoFlowMap,
        requestPoint: getAnbaoFlowMap,
        paramsGraphic: { "time": '123' },
        paramsPoint: { "time": '123' },
        icon: "/img/jingli.png",
        type: '安保工作流程',
      }
      setVisiableAnbaoFlow(!visiableAnbaoFlow);
      setVisiableAnbaoList(false);
      setPopupAnbaoFlowData(obj1);
    } else if (item.code === 'anbaoziyuan' && item.popupContent) {
      setVisiableSecurityForces(!visiableSecurityForces);
      setPopupSecurityForcesData(obj);
    } else if (item.code === 'piaozhengxinxi' && item.popupContent) {
      setVisiableTicket(!visiableTicket);
      setPopupTicketData(obj);
    } else if (item.code === 'anjianxinxikbms' && item.popupContent) {
      setVisiableAnjianFlow(!visiableAnjianFlow);
      setPopupAnjianFlowData(obj);
    } else if (item.code === 'banchediaodu' && item.popupContent) {
      setVisiableBus(!visiableBus);
      setPopupBusData(obj);
    }else if (item.code === 'importantSenic') {
      console.log('132312',item);
      if (Senic) {
      const param = {
        type: '386ee878-bc63-4b83-b7d3-1bec34dda281',
        sceneId: '835c9690-1703-4f0d-83da-b4c78a1909c7'
      }
      queryTcty(param).then((res: any) => {
        
        const result = res.data.rows
        console.log('#############',result[0].entity);
        
        console.log('dasddadsadas',result);
        if (result.length) {
              mapRef?.current?.setZdqyTc(result)
        } else {
              mapRef?.current?.setZdqyTc([])
        }
      }).catch(e => {
        console.log(e,'123123');
      })
    }else{
      mapRef?.current?.setZdqyTc([])
      mapRef?.current?.goHome();

    }
    setSenic(!Senic)
    }
  };
  const moduleRender = (params: any) => {
    return (
      <div className={styles.moduleBox} key={params.code}>
        <div
          style={{
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: '100%',
            height: 'calc(100% - 10px)',
            cursor: isDraggable ? 'move' : 'default',
            zIndex: isDraggable ? 99999 : -1,
          }}
        />
        <div
          data-code={params.code}
          className={`${styles.firstCard} ${params.isClick ? 'isClick' : ''} ${(visiableSecurity && params.code === 'anjianxinxi') ||
            (visiablejcz && params.code === 'jianchazhan') ||
            (visiablehdrc && params.code === 'hdrc') ||
            (visiablezbb && params.code === 'bmzbb') ||
            (visiableOrganization && params.code === 'zuzhijiagou') ||
            (visiableActivityFlow && params.code === 'huodongliucheng' && params.popupContent.subscript === 0) ||
            (visiableAnbaoList && params.code === 'abgongzuoliucheng' && params.popupContent.subscript === 0) ||
            (visiableTicket && params.code === 'piaozhengxinxi' && params.popupContent.subscript === 0) ||
            (visiableAnjianFlow && params.code === 'anjianxinxikbms' && params.popupContent.subscript === 0) ||
            (visiableBus && params.code === 'banchediaodu')
            ? 'visiableSecurity'
            : ''
            }`}
          onClick={() => {
            if (params.isClick) {
              if (params.popupContent) {
                params.popupContent.subscript = 0;
              }
              titleClickFun(params)
            }
          }}
        >
          <img src={bt} className={styles.topImg} />
          <span className={styles.titleName}>{params.title}</span>
        </div>
        {params.children}
      </div>
    );
  };
  // 预案推演
  const [showList, setShowList] = useState<boolean>(false);
  const closeTable = () => {
    setShowList(false);
  };
  // 时间格式转换
  const getTime = (number: any) => {
    const second = number * 30;
    const hour = Math.floor(second / 60);
    const minutes = second % 60;
    const time = (hour > 10 ? hour : '0' + hour) + ':' + (minutes > 10 ? minutes : '0' + minutes);
    return time;
  };
  const [yatyData, setYatyData] = useState<any>([]);
  const showYaYable = () => {
    const params = {
      activityId: window.hdObj.id,
      pageNumber: 1,
      pageSize: 99,
    };
    queryRc(params).then((res: any) => {
      const arr: any = [];
      const result = res.data.rows;
      result.forEach((items: any, index: number) => {
        const newParam: any = {};
        newParam.index = index + 1;
        newParam.startTime = getTime(Number(items.startTimeNumber));
        newParam.endTime = getTime(Number(items.endTimeNumber));
        const data = JSON.parse(items.entity || '{}');
        newParam.people = data?.name || '';
        newParam.lc = data?.dolist || '';
        newParam.work = data?.keytask || '';
        newParam.phone = data?.tel || '';
        newParam.address = data?.modelTreeData?.title || '';
        newParam.key = index;
        arr.push(newParam);
      });
      setYatyData(arr);
      setShowList(true);
    });
  };
  // 日程表格
  const columns: any = [
    {
      title: '序号',
      width: 100,
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      align: 'center',
    },
    {
      title: '开始时间',
      width: 100,
      dataIndex: 'startTime',
      key: 'startTime',
      fixed: 'left',
      align: 'center',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 150,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '工作任务',
      dataIndex: 'work',
      key: 'work',
      width: 150,
      align: 'center',
    },
    {
      title: '运行地点',
      dataIndex: 'address',
      key: 'address',
      width: 150,
      align: 'center',
    },
    {
      title: '责任单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 150,
      align: 'center',
    },
    {
      title: '责任人',
      dataIndex: 'people',
      key: 'people',
      width: 150,
      align: 'center',
    },
    {
      title: '执行流程',
      dataIndex: 'lc',
      key: 'lc',
      width: 150,
      align: 'center',
    },
  ];

  const goHome = () => {
    mapRef?.current?.goHome();
  };
  const [activeLayer, setActiveLayer] = useState<boolean>(false);
  const getLayers = () => {
    if (visiableRight) {
      setVisiableRight(false);
    }
    mapRef?.current?.getLayers(activeLayer);
    setActiveLayer(!activeLayer);
  };
  const [sjChange, setSjChange] = useState<boolean>(true);
  const expImageMap = () => {
    setSjChange(!sjFlag);
    sjFlag = !sjFlag;
    mapRef?.current?.expImageMap(sjFlag);
  };
  const cutPic = () => {
    mapRef?.current?.cutPic();
  };
  // 大屏资源搜索点击
  const setTcShow = (val: any, startName: any) => {
    console.log('flg:', val, startName);
    if (val === startName) {
      return;
    }
    setTimeout(() => {
      if (val === '监控点位') {
        abRef.current.itemShowFlg('jk', true);
      } else if (val === '人脸识别') {
        abRef.current.itemShowFlg('rl', true);
      } else {
        ybssRef.current.itemShowFlg(val, true);
      }
    }, 100);
    if (startName === '监控点位') {
      abRef.current.itemShowFlg('jk', false);
    } else if (startName === '人脸识别') {
      abRef.current.itemShowFlg('rl', false);
    } else {
      ybssRef.current.itemShowFlg(startName, false);
    }
  };
  // 中间顶部选择是否改变
  const callBackIsCheckTopFun = (flg: boolean) => {
    // console.log('flg:', flg);
    mapRef.current.changeYaShow(flg);
  };
  // 重点区域更改src
  const setSpSrc = (arr: any, flag: any) => {
    if (flag) {
      setVideoUrlHK(arr.hkSrc);
      setVideoUrlDH(arr.dhSrc);
    } else {
      setVideoUrlHK([]);
      setVideoUrlDH([]);
    }
  };
  const changeRight = (flag: any) => {
    setVisiableRight(flag);
  };
  const setNewSrc = (value: string[], type: string) => {
    if (type === '大华') {
      setVideoUrlDH(value);
    } else {
      setVideoUrlHK(value);
    }
  };
  // 监听活动
  useEffect(() => {
    if (window.hdObj.id) {
      querySQX({ activityId: window.hdObj.id })
        .then((res: any) => {
          if (res.code === 200) {
            window.sqxDataArr = res?.data || [];
          }
        })
        .catch();
    } else {
      window.sqxDataArr = [];
    }
  }, [window.hdObj]);
  const setTl = (arr?: any) => {
    if (arr) {
      mapRef.current.setTl(arr);
    } else {
      mapRef.current.setTl();
    }
  };
  window.changeLayer = (arr?: any) => {
    window.tlNum++;
    if (arr) {
      setTl(arr);
    } else {
      setTl();
    }
  };
  return (
    // <FullScreenContainer> </FullScreenContainer>
    <div className={[styles.all, styles.containBody].join(' ')}>
      <Mars3DMap
        showLeftTree={showLeftTree}
        leftTreeData={leftTreeData}
        clickShowTree={clickShowTree}
        ref={mapRef}
        eventPosition={eventPosition}
        callBackPoint={(value: any) => {
          console.log('callbackdata:', value);
          setEventPerimeterData(value);
        }}
        showYaYable={showYaYable}
        setLeftAbNum={setLeftAbNum}
        setHdnum={setHdnum}
        setKey={setKey}
        loadModel={loadModel}
        setTcShow={setTcShow}
        sqxClick={sqxClick}
        setSpSrc={setSpSrc}
        changeRight={changeRight}
        setNewSrc={setNewSrc}
        visiableLeft={visiableLeft}
        visiableHeader={visiableHeader}
        changeYcNum={changeYcNum}
        reloadVideo={reloadVideo}
      />
      <div className={styles.topContain} style={{ top: visiableHeader == 'kbms' || visiableHeader == 'yyc' ? '-64px' : 0 }}>
        <div className={styles.contain}>
          <div className={styles.topLeft}>
            <Select
              className={[styles.section, styles.leftActive].join(' ')}
              value={activeValue}
              onChange={(e) => {
                setHd(e);
              }}
            >
              {activeOptions}
            </Select>
            {/* <span className={styles.treeClick} onClick={() => clickShowTree(false)}>
              <span
                className="iconfont icon-shuxuanze"
                style={{ margin: '0 6rem 0 60rem', fontSize: '16rem' }}
              />
              <span>安保方案</span>
            </span> */}
          </div>
          <div className={styles.topCenter}>
            <span className={styles.big}>{pageTitle}</span>
            <span className={styles.small}> 指挥屏</span>
          </div>
          <div className={styles.topRight}>
            <Select className={styles.section} value={cgValue} onChange={setCj}>
              {cgOptions}
            </Select>
            <span className="iconfont icon-shouye" onClick={goHome} title="复位视角" />
            <span
              onClick={getLayers}
              className={activeLayer ? 'active iconfont icon-guanli' : 'iconfont icon-guanli'}
              title="图层"
            />
            <span
              className={
                sjChange ? 'iconfont icon-shijiaosuoding1 active' : 'iconfont icon-shijiaosuoding1'
              }
              onClick={expImageMap}
              title="限定视角"
            />
            <span className="iconfont icon-xiangji" onClick={cutPic} title="截图" />
            <Switch
              size="small"
              className="isEditScreenConfig"
              title="是否开启拖动"
              checkedChildren="开启"
              unCheckedChildren="关闭"
              onChange={(val) => {
                setIsDraggable(val);
                if (!val && window.cjObj.id) {
                  const screenConfig = JSON.stringify(screenConfigLeft.concat(screenConfigRight));
                  updateConfig({
                    data: {
                      id: window.cjObj.id,
                      screenConfig,
                    },
                  })
                    .then(() => {
                      message.success('保存成功');
                    })
                    .catch();
                }
              }}
            />
          </div>
          <div className={styles.topCg} style={{ display: 'none' }}>{topLis}</div>
          <div className={styles.clear} />
        </div>
        <div className={styles.topTime}>
          <Time />
        </div>
      </div>
      {/* 左侧 */}
      <div
        className={styles.leftContain}
        style={{ left: visiableLeft ? '0' : '-401rem', padding: '0px' }}
      >
        <div
          className={styles.leftArr}
          onClick={() => {
            setVisiableLeft(!visiableLeft);
          }}
        >
          {/* <i
            className={`iconfont ${visiableLeft ? 'icon-jiantouzuo' : 'icon-jiantouyou'}`}
            style={{ display: 'block' }}
          />
          <span className={styles.txt}>{visiableLeft ? '收起' : '展开'}侧栏</span> */}
        </div>
        {moduleArrLeft[0] && (
          <GridLayout
            className="layout"
            layout={layout}
            autoSize={true}
            cols={24}
            rowHeight={9}
            width={346}
            isDraggable={isDraggable}
            isResizable={isDraggable}
            onLayoutChange={(res: any) => {
              setScreenConfigLeft(res);
            }}
          >
            {moduleArrLeft.map((item: any) => moduleRender(item))}
          </GridLayout>
        )}

        {/* {moduleArrLeft.map((item: any) => moduleRender(item))} */}
      </div>
      {/* 人流量中间 */}
      {visiablerll && visiableHeader != 'kbms' && visiableHeader != 'yyc' && (
        <TopCenterrll
          personNumId={personNumId}
          onCancel={() => {
            setVisiablerll(false);
          }}
        />
      )}
      {/* TODO 模型 */}
      {visiableStorey && (
        <TopCentermodel
          onCancel={() => {
            setVisiableStorey(false);
          }}
          // 陈亮修改20220429
          leftTreeData={leftTreeData}
          callBackUrl={(value: string[],type: string='海康')=>{
            if (type==='大华') {
              setVideoUrlDH(value)
            }else{
              setVideoUrlHK(value)
            }
          }}
        />
      )}
      {/* 右侧 */}
      <div className={styles.rightContain} style={{ right: visiableRight ? '0' : '-401rem' }}>
        {!visiableTop && visiableHeader != 'kbms' && visiableHeader != 'yyc' && (
          <div
            className={styles.abcs}
            onClick={() => {
              setVisiableTop(true);
              abRef?.current?.searchLayerTc();
            }}
          >
            <i className="iconfont icon-anbaohuodong" />
          </div>
        )}
        {!visiablerll && visiableHeader != 'kbms' && visiableHeader != 'yyc' && (
          <div
            className={styles.abcs} style={{ top: '63px' }}
            onClick={() => {
              setVisiablerll(true);
            }}
          >
            <i className="iconfont icon-zhongdianrenyuan" />
          </div>
        )}
        {!visiableStorey && visiableHeader != 'kbms' && visiableHeader != 'yyc' && (
          <div
            className={styles.abcs} style={{ top: '113px' }}
            onClick={() => {
              setVisiableStorey(true);
            }}
          >
            <i className="iconfont icon-zhongdianrenyuan" />
          </div>
        )}
        <div
          className={styles.rightArr}
          onClick={() => {
            setVisiableRight(!visiableRight);
          }}
        >
          {/* <i
            className={`iconfont ${!visiableRight ? 'icon-jiantouzuo' : 'icon-jiantouyou'}`}
            style={{ display: 'block' }}
          />
          <span className={styles.txt}>{visiableRight ? '收起' : '展开'}侧栏</span> */}
        </div>
        {/* 一标三实 */}
        <OneStandardAndThreeReals
          ref={ybssRef}
          showVideo={(videoId: string) => {
            setVideoUrlDH([videoId]);
          }}
          callBackBayonet={(val: any) => {
            setShowRight(2);
            let platform = val.platform;
            if (val.platform === '1') {
              platform = 'ISC';
            } else if (val.platform === '2') {
              platform = 'IOT';
            } else if (val.platform === '3') {
              platform = '大华';
            }
            setBayonetObj({ ...val, platform });
          }}
        />
        {/* 右侧主题 */}
        {/* {showRight === 1 && moduleArrRight.map((item: any) => moduleRender(item))} */}
        <div className={showRight !== 1 ? 'hideRight' : ''}>
          {/* {moduleArrRight.map((item: any) => moduleRender(item))} */}
          {moduleArrRight[0] && (
            <GridLayout
              className="layout"
              layout={layout}
              autoSize={true}
              cols={24}
              rowHeight={9}
              width={346}
              isDraggable={isDraggable}
              isResizable={isDraggable}
              onLayoutChange={(res: any) => {
                setScreenConfigRight(res);
              }}
            >
              {moduleArrRight.map((item: any) => moduleRender(item))}
            </GridLayout>
          )}
        </div>
        {/* 车辆卡口详情 */}
        {showRight === 2 && (
          <CarBayonet
            bayonetId={bayonetObj.id}
            bayonetName={bayonetObj.name}
            platform={bayonetObj.platform}
            callback={() => {
              setShowRight(1);
            }}
          />
        )}
        {/* 人脸识别详情 */}
        {showRight === 3 && (
          <FaceDetail
            id={faceBack.id}
            name={faceBack.name}
            callback={() => {
              setShowRight(1);
            }}
          />
        )}
        {/* 检查站详情 */}
        {showRight === 5 && (
          <JczDetail
            bayonetId={jczObj.id}
            bayonetName={jczObj.name}
            callback={() => {
              setShowRight(1);
            }}
          />
        )}
        {/* 安检点详情 */}
        {showRight === 4 && (
          <SecurityDetail
            bayonetId={securityObj.id}
            bayonetName={securityObj.name}
            callback={() => {
              setShowRight(1);
              if (visiableHeader == 'kbms') {
                setVisiableRight(false)
              }
            }}
          />
        )}
      </div>
      {/* 顶部中间 */}
      {visiableTop && visiableHeader != 'kbms' && visiableHeader != 'yyc' && (
        <TopCenterModule
          onCancel={() => {
            setVisiableTop(false);
          }}
          callBackLoadModel={(entity, layer) => {
            if (entity) {
              return loadModel(entity, layer);
            } else {
              window.map.removeLayer(layer);
              reloadVideo();
            }
          }}
          callBackIsHide={(flg: boolean) => {
            setVisiableTop(flg);
          }}
          callBackIsCheckTop={(flg: boolean) => {
            callBackIsCheckTopFun(flg);
          }}
        />
      )}
      {/* 检查站信息 */}
      {visiablejcz && popupjczData && (
        <PopupAlertjcz
          popupData={popupjczData}
          callBackHJ={(value: any) => {
            jczRef.current.setCheckDetail(value);
            // initData(['4']);
          }}
        />
      )}
      {/* 活动日程信息 */}
      {visiablehdrc && popuphdrcData && <PopupAlerthdrc popupData={popuphdrcData} />}
      {/* 活动日程信息 */}
      {visiablezbb && popupzbbData && <PopupAlertzbb popupData={popupzbbData} />}
      {/* 安检信息 */}
      {visiableSecurity && popupData && (
        <PopupAlertSecurity
          popupData={popupData}
          callBackHJ={(value: any) => {
            ajRef.current.setCheckDetail(value);
            // initData(['4']);
          }}
        />
      )}
      {/* 更多预警 */}
      {visiableAlarmMore && (
        <RealTimeAlarmMore
          onCancel={() => {
            setVisiableAlarmMore(false);
          }}
          alarmDeal={(item) => {
            readd(item)
            setAlarmItem(item);
            setEventPosition({
              lng: item.lon,
              lat: item.lat,
              height: item.height || 0,
            });
            if (Number(item.state) === 0) {
              setVisiableAlarm(true);
              setVisiableDealRecard(false);
              setVisiableAlarmMore(false);
            } else {
              realTimeAlarm?.current?.getPageFun()
              setVisiableAlarm(false);
              setVisiableDealRecard(true);
              setVisiableAlarmMore(false);
            }
          }}
        />
      )}
      {/* 预警处置记录 */}
      {visiableDealRecard && (
        <DealAlarmRecard
          warnId={alarmItem.id}
          onCancel={() => {
            setVisiableDealRecard(false);
            window.map.getLayers().some((item: any) => {
              if (
                item.options.name === '事件处置图层' ||
                item.options.name === '事件处置监控图层' ||
                item.options.name === '事件处置车辆图层' ||
                item.options.name === '事件处置警力图层'
              ) {
                window.map.removeLayer(item);
              }
            });
          }}
        />
      )}
      {/* 预警处置 */}
      {visiableAlarm && (
        <DealAlarm
          dataConfig={alarmItem}
          eventPerimeterData={eventPerimeterData}
          onCancel={(flg) => {
            window.map.getLayers().some((item: any) => {
              if (
                item.options.name === '事件处置图层' ||
                item.options.name === '事件处置监控图层' ||
                item.options.name === '事件处置车辆图层' ||
                item.options.name === '事件处置警力图层'
              ) {
                window.map.removeLayer(item);
              }
            });
            if (flg) {
              refreshYJ = new Date().getTime();
              initData();
            }
            realTimeAlarm?.current?.getPageFun()
            setVisiableAlarm(false);
          }}
          callBackUrl={(value: string[], type: string) => {
            if (type === '大华') {
              setVideoUrlDH(value);
            } else {
              setVideoUrlHK(value);
            }
          }}
        />
      )}
      {/* 预案推演弹窗 */}
      {showList && (
        <div className="yaTable">
          <div className="titles">日程</div>
          <div className="closeBtn" onClick={closeTable}>
            <span className="iconfont icon-guanbi" />
          </div>
          <Table
            columns={columns}
            dataSource={yatyData}
            bordered
            size="middle"
            className="yaListTable"
            scroll={{ x: 'calc(700px + 50%)', y: 450 }}
          />
        </div>
      )}
      {/* 海康视频播放 */}
      {videoUrlHK.length > 0 && (
        <VideoPlayer
          // key={videoUrlHK}
          viderUrls={videoUrlHK}
          onCancel={() => {
            setVideoUrlHK([]);
          }}
        />
      )}
      {/* 大华视频播放 */}
      {videoUrlDH.length > 0 && (
        <DahuaVideo
          viderUrls={videoUrlDH}
          onCancel={() => {
            setVideoUrlDH([]);
          }}
        />
      )}
      {/* 云台控制 */}
      {visiableControl && <ControlCamera cameraIndexCode='' onCancel={() => {
        setVisiableControl(false)
      }} />}
      {/* 右上角场馆信息 */}
      {rightCheckBox && (
        <div className={styles.rightCheck}>
          <Checkbox.Group value={liValue} onChange={changeLiList}>
            <Row>
              {topCheckLi.map((item: any) => (
                <Col span={24} key={item.id}>
                  <Checkbox value={item.id} onChange={changeOneBox}>{item.name}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
      )}
      {imgUrl && (
        <BigImageView
          imgUrl={imgUrl}
          onCancel={() => {
            setImgUrl('');
          }}
        />
      )}
      {visiableHeader == 'kbms' ? <TopWarning /> : ''}
      {/* 组织架构 */}
      {visiableOrganization && popupOrganizationData && <PopupAlertLinkage popupData={popupOrganizationData} popupClose={() => setVisiableOrganization(false)}
        request={'/kbms/commanders'} params={{}} operationCZ={''} callBackUrl={() => { }} />}
      {/* 活动流程 */}
      {visiableActivityFlow && popupActivityFlowData && <PopupAlertLinkage popupData={popupActivityFlowData} popupClose={() => setVisiableActivityFlow(false)}
        request={'/kbms/activityFlow?id=' + flowId.id} params={flowId} operationCZ={''} callBackUrl={() => { }} />}
      {/* 安保工作流程 */}
      {visiableAnbaoFlow && popupAnbaoFlowData?.subscript == 1 && <ShowMapElement popupData={popupAnbaoFlowData} popupClose={() => {
        setShowRight(1);
        setVisiableAnbaoFlow(false)
        if (visiableHeader == 'kbms') {
          setVisiableRight(false)
        }
      }}
        callBackSecurity={(val: { id: string; name: string }) => {
          setSecurityObj(val);
          setShowRight(4);
          setVisiableRight(true)
        }} />}
      {visiableAnbaoList && popupAnbaoListData?.subscript == 0 && <PopupAlertLinkage popupData={popupAnbaoListData} popupClose={() => setVisiableAnbaoList(false)}
        request={getActivityFlowList} params={{ "time": '123' }} operationCZ={'查看视频'} callBackUrl={checkMessage} />}
      {/* 安保力量 */}
      {visiableSecurityForces && popupSecurityForcesData && <PopupAlertLinkage popupData={popupSecurityForcesData} popupClose={() => setVisiableSecurityForces(false)}
        request={securityApi[securityType]} params={{}} operationCZ={''} callBackUrl={() => { }} />}
      {/* 票证信息 */}
      {visiableTicket && popupTicketData && <PopupAlertLinkage popupData={popupTicketData} popupClose={() => setVisiableTicket(false)}
        request={certificatesApi[ticketsType]} params={{}} operationCZ={''} callBackUrl={() => { }} />}
      {/* 安检信息 */}
      {visiableAnjianFlow && popupAnjianFlowData && <PopupAlertLinkage popupData={popupAnjianFlowData} popupClose={() => setVisiableAnjianFlow(false)}
        request={'/kbms/securityInfo/items'} params={{}} operationCZ={''} callBackUrl={() => { }} />}
      {/* 班车信息 */}
      {visiableBus && popupBusData && <PopupAlertLinkage popupData={popupBusData} popupClose={() => setVisiableBus(false)}
        request={'/kbms/vehicleInfo'} params={{}} operationCZ={''} callBackUrl={() => { }} />}
      {/* 湘湖景区展示模块 */}
      {xhjq && <XhModel carNum={carNum} ycNum={ycNum} klNum={klNum} setXhZd={setXhZd} setXhCars={setXhCars} serXhYcs={serXhYcs} />}
    </div>
  );
};

export default BigScreen;
