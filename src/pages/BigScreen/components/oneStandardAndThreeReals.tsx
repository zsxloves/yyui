/* eslint-disable react/no-array-index-key */
import styles from './index.less';
import './popup.less';
import './popup_style.less';
import { message, Checkbox, Input } from 'antd';
import React, { useState, useEffect, useImperativeHandle } from 'react';
// import HousePersonDetail from './housePersonDetail';
import HouseDetail from '@/pages/Mars3DMap/components/houseDetail/houseDetail';
import { innerHtml } from '@/utils/utilsJS';
import {
  arGpsQuery,
  personPage,
  arCompanyPage,
  arHouseQuery,
  sendMessage,
  arViasQuery,
  queryLinkstatenow,
  queryTree,
  guestStatistics,
  queryTcty,
  queryByLine
} from '@/services/bigScreen';

//定义props的类型
interface Props {
  callBackBayonet: (falg: any) => void;
  showVideo: (vedioId: any) => void;
}
const { TextArea } = Input;
let graphicLayerGPSRen: any = null; //GPS人员定位图层
let graphicLayerGPSChe: any = null; //GPS车辆定位图层
let graphicLayerKeyPerson: any = null; //重点人员图层
let graphicLayerUnit: any = null; //单位图层
let graphicLayerHouse: any = null; //房屋图层
let graphicLayerLine: any = null; //线路图层
let graphicLayerBZ: any = null; //标注图层
let graphicLayerFWX: any = null; // 范围线
let graphicLayerBayonet: any = null; //车辆卡口图层
let graphicLayerJCGS: any = null; //机场高速图层
let graphicLayerJCGSPoint: any = null; //机场高速撒点图层
let graphicLayerLinkstatenow: any = null; //拥堵度
let graphicLayerXQ: any = null; // 小区
let graphicLayerDiv: any = null;
let timer: any = null;
let around = true;//显示隐藏周边
declare global {
  interface Window {
    clickPoint_ybss: any; // 显示点位详情
    showDetailPersonFun: any; // 显示房屋人员详情
    closeGraphic: any; // 关闭图层
    psendInfoWin: any; //对讲
    showDetailBayonetFun: any; //点击聚合卡口列表
  }
}
interface RefTypes {
  itemShowFlg: (code: any, flg: boolean) => void;
}
const OneStandardAndThreeReals = React.forwardRef<RefTypes, Props>((props, ref) => {
  const { callBackBayonet, showVideo } = props;
  const [visiableRB, setVisiableRB] = useState<boolean>(true); // 是否显示一标三实
  const [centerView, setCenterView] = useState<any>({});
  const [houseId, setHouseId] = useState<string>(''); // 房屋id
  const [visiableHouse, setVisiableHouse] = useState<boolean>(false); // 是否显示房屋人员详情
  const [visiavleFilterRen, setVisiavleFilterRen] = useState<boolean>(false); // 是否显示警力查询
  const [visiavleFilterChe, setVisiavleFilterChe] = useState<boolean>(false); // 是否显示车辆查询
  const [visiableDirectives, setVisiableDirectives] = useState<boolean>(false); // 是否显下达指令
  const [visiableHotel, setVisiableHotel] = useState<boolean>(false); // 是否酒店详情
  const [hotelInfo, setHotelInfo] = useState<any>({}); // 酒店信息
  const [phone, setPhone] = useState<string>(); // 是否显下达指令
  const [filterValue, setFilterValue] = useState<string>(); // 人
  const [filterValueChe, setFilterValueChe] = useState<string>(); // 车
  const [gpsRenList, setGpsRenList] = useState<any[]>([]); // 所有警力点位
  const [gpsRenListShow, setGpsRenListShow] = useState<any[]>([]); // 需要展示的警力点位
  const [gpsCheList, setGpsCheList] = useState<any[]>([]); // 所有车辆点位
  const [gpsCheListShow, setGpsCheListShow] = useState<any[]>([]); // 需要展示的警车辆点位
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [validationPoint, setValidationPoint] = useState<any>();
  const [dealOrder, setDealOrder] = useState<string>();
  const [bigObj, setBigObj] = useState<any>({}); // 对象
  const [rbList, setRbList] = useState<any>([
    // { name: '小区', key: '10', icon: 'icon-icon_xiaoqu', checked: false },
    { name: '交通拥堵度', key: '9', icon: 'icon-jiankonglixian', checked: false },
    { name: '车辆卡口', key: '0', icon: 'icon-kakou', checked: false },
    { name: '重点人员', key: '1', icon: 'icon-zhongdianrenyuan', checked: false },
    { name: '警力', key: '2', icon: 'icon-jingli', checked: false },
    { name: '车辆', key: '3', icon: 'icon-cheliang', checked: false },
    { name: '标注', key: '4', icon: 'icon-biaozhu', checked: false },
    { name: '单位', key: '5', icon: 'icon-danwei', checked: false },
    { name: '房屋', key: '6', icon: '/img/fangwus.png', checked: false },
    { name: '范围线', key: '7', icon: 'icon-quyu', checked: true },
    { name: '线路', key: '8', icon: 'icon-xianlu', checked: true },
  ]);
  const [houseNum, setHouseNum] = useState<number>(0);//房屋数量
  const [keypersonNum, setkeypersonNum] = useState<number>(0);//重点人员
  const [personNum, setPersonNum] = useState<number>(0);//实有人口
  const [keyUnitNum, setKeyUnitNum] = useState<number>(0);//重点单位
  const [houseShow, setHouseShow] = useState<boolean>(false);//房屋数量 实有人口 显示
  const [keypersonShow, setkeypersonShow] = useState<boolean>(false);//重点人员
  const [keyUnitShow, setKeyUnitShow] = useState<boolean>(false);//重点单位


  // 指令发送
  const sendMessageFun = () => {
    if (!dealOrder) {
      console.log('请输入指令内容')
      // message.error('请输入指令内容');
      return;
    }
    if (!phone) {
      console.log('手机号不能为空')
      // message.error('手机号不能为空');
      return;
    }
    const stateText = urlencode(dealOrder, 'gbk');
    sendMessage({ phone, con: stateText })
      .then((res: any) => {
        if (res.code === 200) {
          message.success('指令下发成功');
          setVisiableDirectives(false);
          setDealOrder('');
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const getIsShow = (name: string) => {
    const statue = rbList.find((item: any) => {
      return name === item.name;
    });
    return statue.checked;
  };
  window.psendInfoWin = (pho: string) => {
    const p = !pho ? '' : pho;
    setPhone(p);
    setVisiableDirectives(true);
  };
  const clickBtn = (videoId: any) => {
    let videoIdStr = videoId?.toString();
    videoIdStr = videoIdStr + "_";
    if (videoIdStr && videoIdStr.indexOf('_') >= 0) {
      showVideo(videoId);
    }
  };
  window.clickBtn = clickBtn;
  window.closeGraphic = () => {
    if (graphicLayerDiv) graphicLayerDiv.show = false;
    window.map.removeLayer(graphicLayerDiv);
  };
  // div Popup
  const addGraphicDiv = async (id: string) => {
    const item = bigObj[id];
    if (!item) return;
    window.closeGraphic();
    graphicLayerDiv = new mars3d.layer.GraphicLayer({
      name: 'div图层',
      show: true,
      hasZIndex: true,
      zIndex: 999,
    });
    window.map.addLayer(graphicLayerDiv);
    let html = '';
    console.log(item);
    if (item.typeName === '单位') {
      html = `<div class="marsTiltPanel">
        <div class="line line1"></div>
        <div class="line line2"></div>
          <div class="marsTiltPanel-wrap">
              <div class="rowItem">
                <span class="name">单位名称：</span>
                <span class="con">${item.deviceName}</span>
              </div>
              <div class="rowItem">
                <span class="name">实际地址：</span>
                <span class="con">${item.standardAddress || ''}</span>
              </div>
              <div class="rowItem">
                <span class="name">法人代表：</span>
                <span class="con">${item.corporation || ''}</span>
              </div>
              <div class="rowItem">
                <span class="name">联系方式：</span>
                <span class="con">${item.contactNo || ''}</span>
              </div>
              <div class="rowItem">
                <span class="name">管辖单位：</span>
                <span class="con">${item.orgName || ''}</span>
              </div>
          </div>
          <div class="arrow" onClick="closeGraphic()"><i class="iconfont icon-guanbi"></i></div>
      </div>`;
    } else if (item.typeName === '重点人员') {
      html = `<div class="marsTiltPanel">
        <div class="line line1"></div>
        <div class="line line2"></div>
          <div class="marsTiltPanel-wrap">
              <div class="rowItem">
                <span class="name">姓名：</span>
                <span class="con">${item.deviceName}</span>
              </div>
              <div class="rowItem">
                <span class="name">身份证号：</span>
                <span class="con">${item.idCardCode || ''}</span>
              </div>
              <div class="rowItem">
                <span class="name">住址：</span>
                <span class="con">${item.standardAddress || ''}</span>
              </div>
              <div class="rowItem">
                <span class="name">管控单位：</span>
                <span class="con">${item.orgName || ''}</span>
              </div>
              <div class="rowItem">
                <span class="name">最近人工管控时间：</span>
                <span class="con">${item.controlTime || ''}</span>
              </div>
              <div class="rowItem">
                <span class="name">重点类别：</span>
                <span class="con">${item.personClass || ''}</span>
              </div>
              <div class="rowItem">
                <span class="name">管控级别：</span>
                <span class="con">${item.controlLevel || ''}</span>
              </div>
          </div>
          <div class="arrow" onClick="closeGraphic()"><i class="iconfont icon-guanbi"></i></div>
      </div>`;
    } else if (item.typeName === '房屋') {
      html = `<div class="marsTiltPanel">
        <div class="line line1"></div>
        <div class="line line2"></div>
          <div class="marsTiltPanel-wrap">
              <div class="rowItem">
                <span class="name">房屋地址：</span>
                <span class="con">${item.deviceName}</span>
              </div>
              <div class='btnBox'><div class="btn" onClick="showDetailPersonFun('${item.code}')">楼栋详情</div></div>
          </div>
          <div class="arrow" onClick="closeGraphic()"><i class="iconfont icon-guanbi"></i></div>
      </div>`;
    } else if (item.typeName === '警力' || item.typeName === '车辆') {
      let iconSelf
      if (item?.deviceType === 'cd4926ac-57f3-4ec2-9afd-ab29a5549e99') {
        iconSelf = '/img/danbing.png'
      } else if (item?.deviceType === '931d605e-f1cc-40b7-9d62-0bce5b986059') {
        iconSelf = '/img/jingwutong.png'
      } else if (item?.deviceType === '6e876b75-8dda-4012-a766-cf09abf2c19c') {
        iconSelf = '/img/duijiang.png'
      }
      html =
        `<div class="safetyinfo">
              <div class="top_line"></div>
              <div class="top_block"></div>
              <div class="left_line"></div>
              <div class="left_block"></div>
              <div class="info_left_line"></div>
              <div class="info_left"></div>
              <div class="info_right_line"></div>
              <div class="info_right"></div>
              <div class="info_bottom"></div>
              <div class="bottom_one"></div>
              <div class="bottom_two"></div>
              <div class="bottom_three"></div>
              <div class="bottom_four"></div>
              <div class="bottom_arr"></div>
              <div class="arrow" onClick="closeGraphic()"><i class="iconfont icon-guanbi"></i></div>
            <div class="info_content">
              <div class="info_key flex" style="margin-bottom: 5px;">
              <div class="fl"><img src="${item.typeName === '警力' ? iconSelf : '/img/cheliang.png'
        }" style="width: 40px;"></div>
              <div class="fl" style="padding-left: 10px;">
                  <div><span class="info_value info-tedingnum">` +
        (item.deviceName || '') +
        `</span></div>
                  <div style="margin-left:5px; display:none;">${item.organizationName}</div>
              </div>
              <div class="clear"></div>
              </div>
              <div class="info_key" style="margin-bottom: 5px;display:none;">
                  <div class="fl">
                      <img src="LS/img/people/6146.jpg" style="height: 75px;">
                  </div>
                  <div class="fl" style="padding-left: 10px;">
                      <div style="margin-left:5px;">警员姓名&nbsp;&nbsp;` +
        (item.personName || 'xxx') +
        `</div>
                      <div style="margin-left:5px;">移动号码&nbsp;&nbsp;` +
        (item.phone || '') +
        `</div>
                      <div style="margin-left:5px;">虚拟号&nbsp;&nbsp;711050</div>
                  </div>
                  <div class="clear"></div>
              </div>
              <div class="info_key">终端ID:<span class="info_value info-tedingnum">` +
        (item.deviceid || '') +
        `</span></div>
              <div class="info_key">携带设备:<span class="info_value info-tedingnum">${item.typeName === '车辆' ? '车载GPS-维慕德' : '对讲机-PDT'
        }</span>
              <div class="sendBtn" onclick="psendInfoWin('` +
        (item.phone || '') +
        `')">发送</div>
              <div class="talkBtn">对讲</div>` +
        ((item.deviceid + '')?.indexOf('3301') == 0
          ? `<div class="videoBtn" onClick="clickBtn('${item.deviceid}')">视频播放</div>`
          : '') +
        `
              </div>
              <div class="info_key">定位时间:<span class="info_value info-tedingnum">` +
        (item.gpstime || '') +
        `</span></div>
              <div class="info_key">行驶速度:<span class="info_value info-tedingnum">${item.speed}</span></div>
            </div>
          </div>
        `;
    }
    const position = new mars3d.LatLngPoint(item.lon, item.lat, item.height || 0);
    const graphic = new mars3d.graphic.DivGraphic({
      position: position,
      style: {
        html: html,
        horizontalOrigin:
          item.typeName === '警力' ? Cesium.HorizontalOrigin.CENTER : Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        offsetX: item.typeName === '警力' || item.typeName === '车辆' ? -13 : 85,
        offsetY: item.typeName === '警力' || item.typeName === '车辆' ? -40 : -67,
      },
      pointerEvents: true, // false时不允许拾取和触发任意鼠标事件，但可以穿透div缩放地球
    });
    await graphicLayerDiv.addGraphic(graphic);
    setTimeout(() => {
      if ($('.marsTiltPanel').parent('.mars3d-divGraphic')) {
        $('.marsTiltPanel').parent('.mars3d-divGraphic').css({
          zIndex: 999999999,
        });
      }
    }, 300);
  };
  // 点击聚合列表
  window.clickPoint_ybss = (id: string) => {
    addGraphicDiv(id);
  };
  // 显示房屋人口详情
  window.showDetailPersonFun = (id: string) => {
    console.log(id, '详情');
    setHouseId(id);
    setVisiableHouse(true);
  };
  window.showDetailBayonetFun = (id: string, name: string, platform: string) => {
    callBackBayonet({ id, name, platform });
  };

  const selectList = (item: any, type: string) => {
    if (type === '人') {
      const list = gpsRenListShow.map((val: any) => {
        if (val.id === item.id) {
          val.checked = !val.checked;
        }
        return val;
      });
      setGpsRenListShow(list);
    } else {
      const list = gpsCheListShow.map((val: any) => {
        if (val.id === item.id) {
          val.checked = !val.checked;
        }
        return val;
      });
      setGpsCheListShow(list);
    }
  };
  const getHodelDetail = () => {
    if (window.cjObj.code.indexOf('JD') === 0) {
      const hotelCode = window.cjObj.code.substr(2) || '';
      const params = {
        hotelCodeList: [hotelCode],
        page: 1,
        size: 10,
      };
      guestStatistics(params)
        .then((res: any) => {
          if (res.code === 200) {
            const List = res?.result?.page?.content;
            if (List.length) {
              setHotelInfo(List[0]);
            } else {
              setHotelInfo({});
            }
          }
        })
        .catch((err: any) => {
          console.log('err:', err);
        });
    }
  };
  // 一标三实
  const checkChange = (item: any) => {
    if (window.map) window.map.removeLayer(graphicLayerDiv);
    const newL = rbList.map((val: any) => {
      if (item.name === val.name) {
        val.checked = !val.checked;
        if (item.name === '警力' && graphicLayerGPSRen) {
          setVisiavleFilterRen(val.checked);
          setGpsRenListShow(gpsRenList);
          graphicLayerGPSRen.show = val.checked;
        } else if (item.name === '车辆' && graphicLayerGPSChe) {
          setVisiavleFilterChe(val.checked);
          graphicLayerGPSChe.show = val.checked;
          setGpsCheListShow(gpsCheList);
        } else if (item.name === '单位' && graphicLayerUnit) {
          setKeyUnitShow(val.checked)
          graphicLayerUnit.show = val.checked;
        } else if (item.name === '重点人员' && graphicLayerKeyPerson) {
          setkeypersonShow(val.checked)
          graphicLayerKeyPerson.show = val.checked;
        } else if (item.name === '房屋' && graphicLayerHouse) {
          setHouseShow(val.checked)
          graphicLayerHouse.show = val.checked;
        } else if (item.name === '线路' && graphicLayerLine) {
          graphicLayerLine.show = val.checked;
        } else if (item.name === '标注' && graphicLayerBZ) {
          graphicLayerBZ.show = val.checked;
        } else if (item.name === '车辆卡口' && graphicLayerBayonet) {
          graphicLayerBayonet.show = val.checked;
        } else if (item.name === '交通拥堵度' && graphicLayerLinkstatenow) {
          graphicLayerLinkstatenow.show = val.checked;
        } else if (item.name === '小区' && graphicLayerXQ) {
          graphicLayerXQ.show = val.checked;
        } else if (item.name === '范围线' && graphicLayerFWX) {
          graphicLayerFWX.show = val.checked;
        } else if (item.name === '酒店详情') {
          setVisiableHotel(val.checked);
          if (!hotelInfo?.id) {
            getHodelDetail();
          }
        }
        window.changeLayer();
      }
      return val;
    });
    setRbList(newL);
  };

  const addFeature = (graphicLayer: any, arr: any, icon?: string) => {
    graphicLayer.on(mars3d.EventType.click, function (event: any) {
      const graphic = event.graphic;
      if (graphic) {
        if (graphic.options.attr.typeName === '车辆卡口') {
          callBackBayonet({
            id: graphic.options.attr.devChnId,
            name: graphic.options.attr.deviceName,
            platform: graphic.options.attr.source,
          });
        } else {
          addGraphicDiv(graphic.options.attr.id);
        }
      } else {
        //单击了聚合的点
      }
    });
    let iconSelf = icon
    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i];
      if (item?.deviceType === 'cd4926ac-57f3-4ec2-9afd-ab29a5549e99') {
        iconSelf = '/img/danbing.png'
      } else if (item?.deviceType === '931d605e-f1cc-40b7-9d62-0bce5b986059') {
        iconSelf = '/img/jingwutong.png'
      } else if (item?.deviceType === '6e876b75-8dda-4012-a766-cf09abf2c19c') {
        iconSelf = '/img/duijiang.png'
      }
      const position = new mars3d.LatLngPoint(item.lon, item.lat, item.height || 0);
      const primitive = new mars3d.graphic.BillboardEntity({
        position: position,
        style: {
          image: iconSelf || '/img/jingli.png',
          width: 24,
          height: 24,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
          visibleDepth:false
        },
        attr: item,
        name: `${item.id}++${(iconSelf === '/img/duijiang.png' || iconSelf === '/img/jingwutong.png' || iconSelf === '/img/danbing.png') ? item.personName : item.deviceName}`,
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
        const innerTooltip = `<div>
        ${item.deviceName} ${item.company ? '<br/>' + item.company : ''}${item.gpstime ? '<br/>' + item.gpstime : ''
          }</div>`;
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
        if (!Array.isArray(event.id)) {
          return;
        }
        let innerPopup =
          '<div class="zyglTp"><div class="tops"><span>列表</span></div><ul class="ulScrollBox">';
        event.id.map((val: any) => {
          const idName = val.name.split('++');
          if (iconSelf === '/img/cheliangkakou.png') {
            // 车辆卡口
            innerPopup +=
              '<li class="zyLi" onClick="showDetailBayonetFun(\'' +
              idName[0] +
              "','" +
              idName[1] +
              "','" +
              val._properties.source?._value +
              '\')">' +
              '<img src="' +
              val._billboard._image._value +
              '" />' +
              '<span>' +
              idName[1] +
              '</span></li>';
          } else {
            innerPopup +=
              '<li class="zyLi" onClick="clickPoint_ybss(\'' +
              idName[0] +
              '\')">' +
              '<img src="' +
              val._billboard._image._value +
              '" />' +
              '<span>' +
              idName[1] +
              '</span></li>';
          }
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
  const addDiv = (graphicLayer: any, arr: any) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i];
      const pos = item.position;
      const position = new mars3d.LatLngPoint(pos.longitude, pos.latitude, pos.height || 0);
      let html = '';
      if (item?.attr['图标']) {
        html = `<div class="marsBlueGradientPnlBg">
                  <div class="icon"><img src=${item?.attr['图标']}></div>
                  <div class="name">${item.name}</div>
                </div>`;
      } else {
        html = `<div class="marsBlueGradientPnl">
                  <div>${item.name}</div>
                </div>`;
      }
      const graphic = new mars3d.graphic.DivGraphic({
        position: position,
        style: {
          html,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
      });
      graphic.bindPopup(
        function () {
          const attr = item?.attr || {};
          const htmls = `<div class="popupHouse">
                          <div class='rowItem'>
                              <span class="title">地址：</span>
                              <span class="con">${attr['地址']}</span>
                          </div>
                          <div class='rowItem'>
                              <span class="title">安保联系人：</span>
                              <span class="con">${attr['安保联系人']}</span>
                          </div>
                          <div class='rowItem'>
                              <span class="title">类型：</span>
                              <span class="con">${attr['类型']}</span>
                          </div>
                          <div class='rowItem'>
                              <span class="title">联系电话：</span>
                              <span class="con">${attr['联系电话']}</span>
                          </div>
                      </div>`;
          return htmls;
        },
        {
          direction: 'top',
          offsetY: -50,
        },
      );
      graphicLayer.addGraphic(graphic);
    }
  };

  const addLine = (graphicLayer: any, arr: any) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i];
      const pos: any[] = [];
      item.pos.forEach((val: any) => {
        pos.push([val.longitude, val.latitude, val.height]);
      });
      const primitive = new mars3d.graphic.PolylinePrimitive({
        positions: pos,
        style: {
          width: item.width || 5,
          color: item.isHighlight ? item.highlightColor : item.defaultColor || '#fee8d1',
          label: {
            text: item.name,
            background: true,
            backgroundColor: '#428dfd',
            visibleDepth: false,
            font_size: 16,
            font_family: '微软雅黑'
          },
        },
        name: item.name,
      });
      graphicLayer.addGraphic(primitive);
    }
    graphicLayer.bindTooltip(
      function (event: any) {
        const item = event.graphic;
        const innerTooltip = `<div>${item.name}</div>`;
        return innerTooltip;
      },
      {
        direction: 'top',
        offsetY: -30,
      },
    );
    graphicLayer.on(mars3d.EventType.click, function (event: any) {
      const color = event.graphic.options?.style?.color;
      const rold = arr.find((re: any) => {
        return re.name === event.graphic.options?.name;
      });
      event.graphic.setOptions({
        style: {
          color: color === rold.defaultColor ? rold.highlightColor : rold.defaultColor,
        },
      });
    });
  };
  const addWall = (graphicLayer: any, item: any) => {
    console.log('范围线', item.position);
    const lineArr = item?.position || [];
    const positions =
      lineArr
        .map((res: any) => {
          if (res.longitude && res.latitude) {
            return [res.longitude, res.latitude];
          } else {
            return undefined;
          }
        })
        .filter(Boolean) || [];
    const graphic = new mars3d.graphic.WallEntity({
      positions,
      style: {
        closure: true,
        diffHeight: item.wall,
        // 动画线材质
        material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.LineFlow, {
          image: '/img/imgwall.png',
          color: item.color,
          repeat: new Cesium.Cartesian2(5, 1),
          speed: 10,
          axisY: true,
        }),
      },
      attr: { remark: '示例1' },
    });
    graphicLayer.addGraphic(graphic);

    // graphicLayer.bindTooltip(
    //   function () {
    //     const innerTooltip = `<div>${item.name}</div>`;
    //     return innerTooltip;
    //   },
    //   {
    //     direction: 'top',
    //     offsetY: -30,
    //   },
    // );
  };
  // 获取GPS装备
  const getGPSData = (type: string) => {
    const params = {
      isCar: type,
      polygon: window.polygon,
    };
    arGpsQuery(params)
      .then((res: any) => {
        if (res.code === 200) {
          const obj: any = bigObj;
          const gpsList = res?.data?.rows || [];
          gpsList.forEach((item: any) => {
            const ite = { ...item, typeName: type === '0' ? '警力' : '车辆' };
            if (item.id) {
              obj[item.id] = ite;
            }
          });
          setBigObj(obj);
          if (type === '0') {
            setGpsRenList(gpsList);
          } else {
            setGpsCheList(gpsList);
          }
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  // 获取重点单位
  const getUnit = () => {
    const params = {
      page: 0,
      size: 9999,
      polygon: window.polygon,
      dataTypes: [0]
    };
    arCompanyPage(params)
      .then((res: any) => {
        if (res.code === 200) {
          const obj: any = bigObj;
          const List =
            res?.data?.rows.map((item: any) => {
              item.deviceName = item.name;
              item.typeName = '单位';
              if (item.id) {
                obj[item.id] = item;
              }
              delete item.name;
              return item;
            }) || [];
          setKeyUnitNum(List?.length)
          window.map.removeLayer(graphicLayerUnit);
          graphicLayerUnit = new mars3d.layer.GraphicLayer({
            clustering: {
              enabled: true,
              pixelRange: 50,
              // getImage:function(count){
              //     return 'img/zhongdianrenyuan.png'
              // }
            },
            name: '单位',
            show: getIsShow('单位'),
            zIndex: 999,
          });
          setBigObj(obj);
          window.map.addLayer(graphicLayerUnit);
          addFeature(graphicLayerUnit, List, '/img/danwei.png');
        }
      })
      .catch((err: any) => {
        console.log('errrr:', err);
      });
  };
  // 获取重点人员
  const getKeyPerson = () => {
    const params = {
      posType: '86270cf6-bac3-45fb-9d0f-f6440d6b1ea6',
      polygon: window.polygon,
    };
    personPage(params)
      .then((res: any) => {
        if (res.code === 200) {
          const obj: any = bigObj;
          const List =
            res?.data?.rows?.map((item: any) => {
              item.deviceName = item.name;
              item.typeName = '重点人员';
              if (item.id) {
                obj[item.id] = item;
              }
              delete item.name;
              return item;
            }) || [];
          setkeypersonNum(List?.length)
          if (graphicLayerKeyPerson) window.map.removeLayer(graphicLayerKeyPerson);
          graphicLayerKeyPerson = new mars3d.layer.GraphicLayer({
            clustering: {
              enabled: true,
              pixelRange: 50,
            },
            name: '重点人员',
            show: getIsShow('重点人员'),
            zIndex: 99,
          });
          setBigObj(obj);
          window.map.addLayer(graphicLayerKeyPerson);
          addFeature(graphicLayerKeyPerson, List, '/img/zhongdianrenyuan.png');
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  // 获取房屋
  const getHouse = () => {
    const params = {
      pageNumber: 0,
      pageSize: 999,
      polygon: window.polygon,
    };
    arHouseQuery(params)
      .then((res: any) => {
        if (res.code === 200) {
          let num = 0
          const obj: any = bigObj;
          const List =
            res?.data?.rows.map((item: any) => {
              item.deviceName = item.address;
              item.typeName = '房屋';
              if (item.id) {
                obj[item.id] = item;
              }
              num = num + item.personInfoVOList?.length
              return item;
            }) || [];
          setPersonNum(num)
          setHouseNum(List?.length)
          if (graphicLayerHouse) window.map.removeLayer(graphicLayerHouse);
          graphicLayerHouse = new mars3d.layer.GraphicLayer({
            clustering: {
              enabled: true,
              pixelRange: 50,
            },
            name: '房屋',
            show: getIsShow('房屋'),
          });
          setBigObj(obj);
          window.map.addLayer(graphicLayerHouse);
          addFeature(graphicLayerHouse, List, '/img/fangwu.png');
        }
      })
      .catch((err: any) => {
        console.log('err:', err);
      });
  };
  // 获取车辆卡口
  const getBayonet = () => {
    const params = {
      pageNumber: 0,
      pageSize: 999,
      polygon: window.polygon,
    };
    arViasQuery(params)
      .then((res: any) => {
        if (res.code === 200) {
          // const obj: any = bigObj;
          const List =
            res?.data?.rows.map((item: any) => {
              item.deviceName = item.name;
              item.id = item.devChnId;
              item.typeName = '车辆卡口';
              delete item.name;
              // if (item.id) {
              //   obj[item.id] = item;
              // }
              return item;
            }) || [];
          // const List: any[] = [];
          if (graphicLayerBayonet) window.map.removeLayer(graphicLayerBayonet);
          graphicLayerBayonet = new mars3d.layer.GraphicLayer({
            clustering: {
              enabled: true,
              pixelRange: 50,
            },
            name: '车辆卡口',
            show: getIsShow('车辆卡口'),
          });
          // setBigObj(obj)
          window.map.addLayer(graphicLayerBayonet);
          addFeature(graphicLayerBayonet, List, '/img/cheliangkakou.png');
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const addDemoGraphics = (graphicLayer: any, arr: any[]) => {
    arr.forEach((item: any) => {
      let roadColor = '#99ff99';
      const state_index = item.state.state_index;
      if (state_index >= 0 && state_index < 2) {
        roadColor = '#99ff99';
      } else if (state_index >= 2 && state_index < 4) {
        roadColor = '#99ff66';
      } else if (state_index >= 4 && state_index < 6) {
        roadColor = '#ffff66';
      } else if (state_index >= 6 && state_index < 8) {
        roadColor = '#ff9966';
      } else if (state_index >= 6 && state_index < 8) {
        roadColor = '#ff0066';
      }
      const pos: any = [];
      item.info.position.map((k: any) => {
        pos.push([k.longitude, k.latitude]);
      });
      const primitive = new mars3d.graphic.PolylinePrimitive({
        positions: pos,
        style: {
          width: 3,
          color: roadColor,
          opacity: 0.8,
          setHeight: 0,
        },
        name: item.info.link_name,
        id: 'line_' + item.state.link_id,
        item: item.state,
        attr: item.attr,
      });
      graphicLayer.addGraphic(primitive);
    });
    graphicLayer.bindTooltip(
      function (event: any) {
        const item = event.graphic?.options;
        let roadColor = '#38A800';
        const state_index = item.item.state_index;
        if (state_index >= 0 && state_index < 2) {
          roadColor = '#38A800';
        } else if (state_index >= 2 && state_index < 4) {
          roadColor = '#8BD100';
        } else if (state_index >= 4 && state_index < 6) {
          roadColor = '#FFFF00';
        } else if (state_index >= 6 && state_index < 8) {
          roadColor = '#FF8000';
        } else if (state_index >= 6 && state_index < 8) {
          roadColor = '#FF0000';
        }
        if (!item) {
          return false;
        }
        const innerTooltip = `<div >
            <div style="color:#ffd324;font-size:18px">${item.name}</div>
            <div style="color:#fff;font-size:18px">通/均<span style="margin:0 8px">${item.item.avg_speed}/${item.item.free_speed}
            </span>拥堵指数<span style="padding:0 8px;background:${roadColor};border-radius:6px;margin-left:8px;">${item.item.state_index}</span></div>
            <div style="color:#fff;font-size:18px">监测时间<span style="margin-left:8px">${item.item.time_point}</span></div>
            </div>`;
        return innerTooltip;
      },
      {
        direction: 'top',
        offsetY: -30,
      },
    );
  };
  // 拥堵度
  const getLinkstatenow = () => {
    queryLinkstatenow({})
      .then((res: any) => {
        if (res && res.length > 0) {
          if (graphicLayerLinkstatenow) window.map.removeLayer(graphicLayerLinkstatenow);
          graphicLayerLinkstatenow = new mars3d.layer.GraphicLayer({
            clustering: {
              enabled: true,
              pixelRange: 50,
            },
            name: '交通拥堵度',
            show: getIsShow('交通拥堵度'),
          });
          window.map.addLayer(graphicLayerLinkstatenow);
          addDemoGraphics(graphicLayerLinkstatenow, res);
        }
      })
      .catch((err: any) => {
        if (err && err.length > 0) {
          if (graphicLayerLinkstatenow) window.map.removeLayer(graphicLayerLinkstatenow);
          graphicLayerLinkstatenow = new mars3d.layer.GraphicLayer({
            clustering: {
              enabled: true,
              pixelRange: 50,
            },
            name: '交通拥堵度',
            show: getIsShow('交通拥堵度'),
          });
          window.map.addLayer(graphicLayerLinkstatenow);
          addDemoGraphics(graphicLayerLinkstatenow, err);
        }
      });
  };
  const getLine = () => {
    let json: any = '';
    if (graphicLayerLine) window.map.removeLayer(graphicLayerLine);
    if (graphicLayerBZ) window.map.removeLayer(graphicLayerBZ);
    try {
      json = JSON.parse(window.cjObj?.entity || '{}');
    } catch (error) {
      console.log(error, 'json解析失败');
      return;
    }
    if (!json) {
      return;
    }
    if (json['线路']) {
      if (graphicLayerLine) window.map.removeLayer(graphicLayerLine);
      graphicLayerLine = new mars3d.layer.GraphicLayer({
        name: '线路',
        show: true,
      });
      window.map.addLayer(graphicLayerLine);
      addLine(
        graphicLayerLine,
        json['线路'].filter((val: any) => {
          return val.type === '主干道路';
        }),
      );
    }
    if (json['标注']) {
      if (graphicLayerBZ) window.map.removeLayer(graphicLayerBZ);
      graphicLayerBZ = new mars3d.layer.GraphicLayer({
        name: '标注',
        show: false,
      });
      window.map.addLayer(graphicLayerBZ);
      addDiv(graphicLayerBZ, json['标注']);
    }
    if (json['范围线']) {
      if (graphicLayerFWX) window.map.removeLayer(graphicLayerFWX);
      graphicLayerFWX = new mars3d.layer.GraphicLayer({
        name: '范围线',
        show: true,
      });
      window.map.addLayer(graphicLayerFWX);
      addWall(graphicLayerFWX, json['范围线']);
    }
  };
  // 资源搜索专用
  const itemShowFlg = (name: string, flg: boolean) => {
    console.log('itemShowFlg:', name);
    if (window.map) window.map.removeLayer(graphicLayerDiv);
    const newL = rbList.map((val: any) => {
      if (name === val.name) {
        val.checked = flg;
        if (name === '重点人员' && graphicLayerKeyPerson) {
          graphicLayerKeyPerson.show = flg;
        } else if (name === '车辆卡口' && graphicLayerBayonet) {
          graphicLayerBayonet.show = flg;
        }
        window.changeLayer();
      }
      return val;
    });
    setRbList(newL);
  };
  //将子组件的方法 暴露给父组件
  useImperativeHandle(ref, () => ({
    itemShowFlg,
  }));
  const setPointXQ = () => {
    let newList = [];
    newList = rbList.filter((it: any) => {
      return it.name === '小区';
    });
    if (newList === 0) return;
    if (graphicLayerXQ) {
      graphicLayerXQ.clear();
      window.map.removeLayer(graphicLayerXQ);
    }
    graphicLayerXQ = new mars3d.layer.GraphicLayer({
      clustering: {
        enabled: false,
      },
      name: '小区',
      show: false,
      zIndex: 99,
    });
    window.map.addLayer(graphicLayerXQ);
    console.log('validationPoint:', validationPoint);
    if (!validationPoint?.geoJSON) return;
    graphicLayerXQ.loadGeoJSON(validationPoint?.geoJSON, {
      clear: true,
    });
    graphicLayerXQ.eachGraphic((graphic: any) => {
      innerHtml(graphic);
      if (graphic?.options?.edittype === 'polygon' && graphic.options.style.opacity === 0) {
        graphic.setOptions({
          style: {
            opacity: 0.01,
          },
        });
      }
    });
    graphicLayerXQ.on(mars3d.EventType.mouseOver, function (event: any) {
      if (event.graphic?.options?.edittype === 'polygon') {
        event.graphic.setOptions({
          style: {
            opacity: 0.6,
          },
        });
      }
    });
    graphicLayerXQ.on(mars3d.EventType.mouseOut, function (event: any) {
      if (event.graphic?.options?.edittype === 'polygon') {
        event.graphic.setOptions({
          style: {
            opacity: 0.01,
          },
        });
      }
    });
    graphicLayerXQ.on(mars3d.EventType.click, function (event: any) {
      if (event.graphic?.options?.edittype === 'polygon') {
        const entityChild = event.graphic.options?.attr?.data?.entity
          ? JSON.parse(event.graphic.options?.attr?.data?.entity || '{}')
          : {};
        console.log('entity点击了面：', event.graphic.options, entityChild);
        if (entityChild?.info?.code) {
          const code = entityChild?.info?.code.split(',')[0];
          const label = entityChild?.info?.code.split(',')[1];
          // 链接跳转
          window.open('https://afxq.hzos.hzs.zj/estate?communitysCode=' + code + '&label=' + label);
        }
      }
    });
  };
  // 获取预案树
  const getTree = () => {
    queryTree({ sceneId: window.cjObj?.id })
      .then((res) => {
        if (res.code === 200) {
          const arr =
            res?.data?.filter((ite: any) => {
              const newItem = ite.data;
              const entity = JSON.parse(newItem?.entity || '{}');
              return entity?.type === '14dca34e-cb24-445b-b52d-130bc7ceaab3';
            }) || [];
          console.log('arr:', arr, arr.length);
          if (arr.length === 0) {
            let newList = [];
            newList = rbList.filter((it: any) => {
              return it.name !== '小区';
            });
            setRbList(newList);
            if (graphicLayerXQ) {
              graphicLayerXQ.clear();
              window.map.removeLayer(graphicLayerXQ);
            }
          } else {
            let newList = [];
            newList = rbList.filter((it: any) => {
              return it.name === '小区';
            });
            if (newList.length === 0) {
              const lis = rbList;
              lis.unshift({ name: '小区', key: '10', icon: 'icon-icon_xiaoqu', checked: false });
              setRbList(lis);
            }
            setValidationPoint(arr[0].data);
          }
        }
      })
      .catch((err) => {
        console.log(err.message || err)
        // message.error(err.message || err);
      });
  };
  // 是否显示酒店
  const checkHotel = (falg: boolean) => {
    setVisiableHotel(false);
    if (falg) {
      let newList = [];
      newList = rbList.filter((it: any) => {
        return it.name === '酒店详情';
      });
      if (newList.length === 0) {
        const lis = rbList;
        lis.unshift({ name: '酒店详情', key: '12', icon: 'icon-guojijiudian', checked: false });
        setRbList(lis);
      } else {
        newList = rbList.filter((it: any) => {
          if (it.name === '酒店详情') {
            it.checked = false;
          }
          return it;
        });
        setRbList(newList);
      }
    } else {
      let newList = [];
      newList = rbList.filter((it: any) => {
        return it.name !== '酒店详情';
      });
      setRbList(newList);
    }
  };

  const initFun = () => {
    if (window.map) {
      getUnit();
      getHouse();
      setPointXQ();
    } else {
      setTimeout(() => {
        initFun();
      }, 1000);
    }
  };
  const initFunGPS = () => {
    if (window.map) {
      window.map.removeLayer(graphicLayerGPSRen);
      window.map.removeLayer(graphicLayerGPSChe);
      setCenterView(window.map.getCameraView());
      graphicLayerGPSRen = new mars3d.layer.GraphicLayer({
        clustering: {
          enabled: false,
          pixelRange: 20,
        },
        name: 'GPS警力',
        show: getIsShow('警力'),
      });
      window.map.addLayer(graphicLayerGPSRen);
      console.log(graphicLayerGPSRen);
      graphicLayerGPSChe = new mars3d.layer.GraphicLayer({
        clustering: {
          enabled: false,
          pixelRange: 80,
        },
        name: 'GPS车辆',
        show: getIsShow('车辆'),
      });
      window.map.addLayer(graphicLayerGPSChe);

      getGPSData('0');
      getGPSData('1');
      getLine();
      getKeyPerson();
      getBayonet();
      getTree();
      clearInterval(timer);
      timer = setInterval(() => {
        getGPSData('0');
        getGPSData('1');
      }, 30000);
    } else {
      setTimeout(() => {
        initFunGPS();
      }, 1000);
    }
  };
  useEffect(() => {
    if (window.cjObj.id) {
      setTimeout(() => {
        initFunGPS();
      }, 300);
      if (!visiableRB) {
        initFun();
      }
      getLinkstatenow();
      setIsFirst(false);
      setHotelInfo({});
    }
    if (window.cjObj?.code && window.cjObj?.code.indexOf('JD') == 0) {
      checkHotel(true);
    } else {
      checkHotel(false);
    }
  }, [window.cjObj]);
  useEffect(() => {
    if (isFirst) {
      initFun();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirst]);
  useEffect(() => {
    // 警力点位监听
    if (graphicLayerGPSRen) {
      graphicLayerGPSRen.clear();
      if (visiavleFilterRen) {
        const list = gpsRenListShow.map((item: any) => {
          if (!item.checked) {
            return item.id;
          }
        });
        const newList = gpsRenList.filter((item: any) => {
          return list.includes(item.id);
        });
        addFeature(graphicLayerGPSRen, newList, '/img/jingli.png');
      } else {
        addFeature(graphicLayerGPSRen, gpsRenList, '/img/jingli.png');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpsRenList]);
  useEffect(() => {
    // 车辆点位监听
    if (graphicLayerGPSChe) {
      graphicLayerGPSChe.clear();
      if (visiavleFilterChe) {
        const list = gpsCheListShow.map((item: any) => {
          if (!item.checked) {
            return item.id;
          }
        });
        const newList = gpsCheList.filter((item: any) => {
          return list.includes(item.id);
        });
        addFeature(graphicLayerGPSChe, newList, '/img/cheliang.png');
      } else {
        addFeature(graphicLayerGPSChe, gpsCheList, '/img/cheliang.png');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpsCheList]);
  useEffect(() => {
    // 点击警力筛选跟新点位
    if (visiavleFilterRen) {
      const list = gpsRenListShow.filter((item: any) => {
        return !item.checked;
      });
      if (graphicLayerGPSRen) graphicLayerGPSRen.clear();
      addFeature(graphicLayerGPSRen, list, '/img/jingli.png');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpsRenListShow, visiavleFilterRen]);
  useEffect(() => {
    // 点击车辆筛选跟新点位
    if (visiavleFilterChe) {
      const list = gpsCheListShow.filter((item: any) => {
        return !item.checked;
      });
      if (graphicLayerGPSChe) graphicLayerGPSChe.clear();
      addFeature(graphicLayerGPSChe, list, '/img/cheliang.png');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpsCheListShow, visiavleFilterChe]);
  //机场线路
  const airpop = (val: any) => {
    switch (val?.dataType) {
      // 重点单位名册表
      case 0:
        return `<div class="popupHouse popair">
                  <div class='rowItem'>
                      <span class="title">单位名称：</span>
                      <span class="con">${val?.name || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">负责人：</span>
                      <span class="con">${val?.contacts || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">手机号码：</span>
                      <span class="con">${val?.contactNo || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">存放危险物品名称：</span>
                      <span class="con">${val?.dangerName || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">存放位置（层、号）：</span>
                      <span class="con">${val?.standardAddress || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">类别：</span>
                      <span class="con">${val?.type || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">数量：</span>
                      <span class="con">${val?.num || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">控制措施：</span>
                      <span class="con">${val?.measures || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">片区：</span>
                      <span class="con">${val?.area || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">涉及路名：</span>
                      <span class="con">${val?.road || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">上报单位：</span>
                      <span class="con">${val?.orgName || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">备注：</span>
                      <span class="con">${val?.remark || ''}</span>
                  </div>
                </div>`;
      // 重点人员
      case 1:
        return `<div class="popupHouse popair">
                  <div class='rowItem'>
                      <span class="title">姓名：</span>
                      <span class="con">${val?.name}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">性别：</span>
                      <span class="con">${val?.contacts}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">身份证号：</span>
                      <span class="con">${val?.contactNo}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">现住地址：</span>
                      <span class="con">${val?.dangerName}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">手机号码：</span>
                      <span class="con">${val?.standardAddress}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">重点人员类别：</span>
                      <span class="con">${val?.type}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">问题及表现：</span>
                      <span class="con">${val?.num}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">管控措施：</span>
                      <span class="con">${val?.measures}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">管理人员姓名：</span>
                      <span class="con">${val?.area}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">职务：</span>
                      <span class="con">${val?.road}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">联系方式：</span>
                      <span class="con">${val?.orgName}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">上报单位：</span>
                      <span class="con">${val?.remark}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">涉及路名：</span>
                      <span class="con">${val?.orgName}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">片区：</span>
                      <span class="con">${val?.remark}</span>
                  </div>
                </div>`;
      //工地采集表
      case 2:
        return `<div class="popupHouse popair">
                  <div class='rowItem'>
                        <span class="title">单位名称：</span>
                        <span class="con">${val?.name || ''}</span>
                   </div>
                    <div class='rowItem'>
                        <span class="title">负责人：</span>
                        <span class="con">${val?.contacts || ''}</span>
                    </div>
                    <div class='rowItem'>
                        <span class="title">手机号码：</span>
                        <span class="con">${val?.contactNo || ''}</span>
                    </div>
                    <div class='rowItem'>
                        <span class="title">地址：</span>
                        <span class="con">${val?.standardAddress || ''}</span>
                    </div>
                    <div class='rowItem'>
                        <span class="title">道路出入口数：</span>
                        <span class="con">${val?.roadNum || ''}</span>
                    </div>
                    <div class='rowItem'>
                        <span class="title">出入口面向排查道路数：</span>
                        <span class="con">${val?.checkNum || ''}</span>
                    </div>
                    <div class='rowItem'>
                        <span class="title">隶属单位：</span>
                        <span class="con">${val?.unit || ''}</span>
                    </div>
                    <div class='rowItem'>
                        <span class="title">属地派出所负责人：</span>
                        <span class="con">${val?.securityContacts || ''}</span>
                    </div>
                  </div>`;
      //交叉路口采集表
      case 3:
        return `<div class="popupHouse popair">
                  <div class='rowItem'>
                      <span class="title">交叉道路名称：</span>
                      <span class="con">${val?.name || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">类别：</span>
                      <span class="con">${val?.type || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">双向几车道：</span>
                      <span class="con">${val?.roadNum || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">是否有红绿灯：</span>
                      <span class="con">${val?.isLight || ''}</span>
                  </div> <div class='rowItem'>
                      <span class="title">道路中间是否有隔离：</span>
                      <span class="con">${val?.isLimit || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">与非机动车是否有隔离：</span>
                      <span class="con">${val?.isCarLimit || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">是否有斑马线：</span>
                      <span class="con">${val?.isLine || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">片区：</span>
                      <span class="con">${val?.area || ''}</span>
                  </div>
                     <div class='rowItem'>
                      <span class="title">涉及路名：</span>
                      <span class="con">${val?.road || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">上报单位：</span>
                      <span class="con">${val?.orgName || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">备注：</span>
                      <span class="con">${val?.remark || ''}</span>
                  </div>
                </div>`;
      //公交车站
      case 4:
        return `<div class="popupHouse popair">
                  <div class='rowItem'>
                      <span class="title">公交车站名称：</span>
                      <span class="con">${val?.name || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">具体地址：</span>
                      <span class="con">${val?.standardAddress || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">位置方向：</span>
                      <span class="con">${val?.storeAddress || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">具体线路：</span>
                      <span class="con">${val?.line || ''}</span>
                  </div>
                    <div class='rowItem'>
                      <span class="title">上报单位：</span>
                      <span class="con">${val?.orgName || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">涉及道路：</span>
                      <span class="con">${val?.road || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">片区：</span>
                      <span class="con">${val?.area || ''}</span>
                  </div>
                </div>`;
      //上垮桥
      case 5:
        return `<div class="popupHouse popair">
                  <div class='rowItem'>
                      <span class="title">名称：</span>
                      <span class="con">${val?.name || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">位置：</span>
                      <span class="con">${val?.standardAddress || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">类型：</span>
                      <span class="con">${val?.type || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">长度：</span>
                      <span class="con">${val?.length || ''}</span>
                  </div>
                   <div class='rowItem'>
                      <span class="title">宽度：</span>
                      <span class="con">${val?.width || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">高度：</span>
                      <span class="con">${val?.height || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">片区：</span>
                      <span class="con">${val?.area || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">备注：</span>
                      <span class="con">${val?.remark || ''}</span>
                  </div>
                </div>`;
      //涵洞桥梁高架
      case 6:
        return `<div class="popupHouse popair">
                  <div class='rowItem'>
                      <span class="title">名称：</span>
                      <span class="con">${val?.name || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">位置：</span>
                      <span class="con">${val?.standardAddress || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">类型：</span>
                      <span class="con">${val?.type || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">长度：</span>
                      <span class="con">${val?.length || ''}</span>
                  </div>
                   <div class='rowItem'>
                      <span class="title">宽度：</span>
                      <span class="con">${val?.width || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">高度：</span>
                      <span class="con">${val?.height || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">片区：</span>
                      <span class="con">${val?.area || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">上报单位：</span>
                      <span class="con">${val?.orgName || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">涉及路名：</span>
                      <span class="con">${val?.road || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">备注：</span>
                      <span class="con">${val?.remark || ''}</span>
                  </div>
                </div>`;
      //制高点
      case 7:
        return `<div class="popupHouse popair">
                  <div class='rowItem'>
                      <span class="title">经度：</span>
                      <span class="con">${val?.lon || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">纬度：</span>
                      <span class="con">${val?.lat || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">岗位位置：</span>
                      <span class="con">${val?.standardAddress || ''}</span>
                  </div>
                  <div class='rowItem'>
                      <span class="title">片区：</span>
                      <span class="con">${val?.area || ''}</span>
                  </div>
                </div>`;
      default:
        return;
    }
  }
  const airimg = (val: any) => {
    switch (val?.dataType) {
      // 重点单位
      case 0:
        return `zhongdiandanweimingcebiao.png`;
      // 重点单位名册表
      case 1:
        return `zhongdiandanweimingcebiao.png`;
      //工地采集表
      case 2:
        return `gongdicaijibiao.png`;
      //交叉路口采集表
      case 3:
        switch (val.type) {
          case '小区出入口':
            return `xiaoquchurukou.png`;
          case '主干道出口':
            return `zhuluchurukou.png`;
          case '小路出口':
            return `xiaoluchurukou.png`;
          case '单位出入口':
            return `danweichurukou.png`;
          default:
            return;
        }
      //公交车站
      case 4:
        return `gongjiaochezhan.png`;
      //上垮桥
      case 5:
        switch (val.type) {
          case '铁路上跨':
            return `tielushangkua.png`;
          case '公路上跨':
            return `gonglushangkua.png`;
          default:
            return;
        }
      //涵洞桥梁高架
      case 6:
        switch (val.type) {
          case '涵洞':
            return `handong.png`;
          case '桥梁':
            return `qiaoliang.png`;
          case '高架':
            return `gaojia.png`;
          default:
            return;
        }
      //制高点
      case 7:
        return `zhigaodian.png`;
      default:
        return;
    }
  }
  const bindContext = () => {
    //添加右键
    graphicLayerJCGS.eachGraphic((graphics: any) => {
      graphics?.bindContextMenu([
        {
          text: `显示周边`,
          iconCls: 'fa fa-trash-o',
          show: (event: any) => {
            const graphic = event.graphic;
            if (!graphic || graphic.isDestroy) {
              return false;
            } else {
              return around ? true : false;
            }
          },
          callback: function (e: any) {
            const graphic = e.graphic;
            if (!graphic) {
              return;
            }
            const polygon: any[] = []
            graphic?.options?.positions?.map((iter: any) => {
              polygon.push({ x: iter[0], y: iter[1] })
            })
            const params = {
              polygon: polygon,
              radius: '300',
              dataTypes: [0, 1, 2, 3, 4, 5, 6, 7]
            }
            queryByLine(params).then((resLine: any) => {
              const arr = resLine.data
              graphicLayerJCGSPoint = new mars3d.layer.GraphicLayer({
                clustering: {
                  enabled: false,
                },
                name: '机场高速撒点',
                show: true,
                zIndex: 99,
              });
              arr.map((item: any) => {
                const position = new mars3d.LatLngPoint(item.lon, item.lat, Number(item.height) || 0);
                const primitive = new mars3d.graphic.BillboardEntity({
                  position: position,
                  style: {
                    image: '/img/airplan/' + airimg(item),
                    width: 24,
                    height: 24,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
                    visibleDepth:false
                  },
                  popup: airpop(item)
                });
                graphicLayerJCGSPoint.addGraphic(primitive);
              })
              window.map.addLayer(graphicLayerJCGSPoint);

            }).catch((err: any) => {
              console.log(err?.message)
            })
            around = false
          },
        },
        {
          text: '隐藏周边',
          iconCls: 'fa fa-trash-o',
          show: (event: any) => {
            const graphic = event.graphic;
            if (!graphic || graphic.isDestroy) {
              return false;
            } else {
              return !around ? true : false;
            }
          },
          callback: function (e: any) {
            const graphic = e.graphic;
            if (!graphic) {
              return;
            }
            around = true
            if (graphicLayerJCGSPoint) window.map.removeLayer(graphicLayerJCGSPoint);
          },
        },
        {
          text: '删除对象',
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
            const graphic = e.graphic;
            if (!graphic) {
              return;
            }
            if (graphicLayerJCGS) {
              window.map.removeLayer(graphicLayerJCGS);
              if (graphicLayerJCGSPoint) window.map.removeLayer(graphicLayerJCGSPoint);
            }
          },
        },
      ]);
    })
  }
  useEffect(() => {
    if (graphicLayerJCGS) {
      around = true
      window.map.removeLayer(graphicLayerJCGS);
      if (graphicLayerJCGSPoint) window.map.removeLayer(graphicLayerJCGSPoint);
    }
    if (window.cjObj.code === 'jcgs') {
      const param = {
        type: '548218ee-4c75-4271-be0a-6bd2cf1dc860',
        // code:'jcgs',
        sceneId: window.cjObj.id,
      };
      queryTcty(param).then((res: any) => {
        const result = res.data.rows;
        const airPlanArr: any = []
        if (result?.length)
          result.forEach((item: any) => {
            airPlanArr.push(JSON.parse(item?.entity)?.GeoJSON);
          });
        graphicLayerJCGS = new mars3d.layer.GraphicLayer({
          clustering: {
            enabled: false,
          },
          name: '机场高速',
          show: true,
          zIndex: 99,
        });
        window.map.addLayer(graphicLayerJCGS);
        if (!airPlanArr) return;
        graphicLayerJCGS.loadGeoJSON(airPlanArr, {
          clear: true,
        });
        bindContext()
      });
    }
  }, [window.cjObj.code])
  return (
    <>
      <div className={styles.rightBottomCheck}>
        <div
          className={styles.rbArr}
          onClick={() => {
            setIsFirst(true);
            setVisiableRB(!visiableRB);
          }}
        >
          <i
            className={`iconfont ${visiableRB ? 'icon-xialajiantouxia' : 'icon-xialajiantoushang'}`}
          />
        </div>
        <div className={`${styles.box} ${visiableRB ? styles.hide : ''}`}>
          {rbList.map((item: any) => (
            <div className={styles.checkItem} key={item.key}>
              <Checkbox
                onChange={() => checkChange(item)}
                checked={item.checked}
                className={styles.check}
              >
                {item?.icon.slice(0, 4) === 'icon' ? <i className={'iconfont ' + item.icon} /> : <img style={{ width: '16px', height: '16px' }} src={item.icon} />}
                <span style={{ marginLeft: '6rem' }}>{item.name}</span>
              </Checkbox>
            </div>
          ))}
        </div>
        {(visiavleFilterRen || visiavleFilterChe) && (
          <div className="jlclFilter">
            {visiavleFilterRen && (
              <div>
                <div className="name">警力</div>
                <Input
                  value={filterValue}
                  onChange={(e) => {
                    setFilterValue(e.target.value);
                    const list = gpsRenList.filter((item: any) => {
                      return item.deviceName.indexOf(e.target.value) !== -1;
                    });
                    setGpsRenListShow(list);
                  }}
                />
                <div className="scrollList">
                  {gpsRenListShow.map((item: any) => (
                    <div className="list" key={item.id}>
                      <span
                        className={`${!item.checked ? 'pointer' : ''}`}
                        onClick={() => {
                          if (!item.checked) {
                            window.map.centerAt({ ...centerView, lat: item.lat, lng: item.lon });
                          }
                        }}
                      >
                        {item.deviceName}
                      </span>
                      <span
                        className={`${!item.checked ? 'checked check' : 'check'}`}
                        onClick={() => {
                          selectList(item, '人');
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {visiavleFilterChe && (
              <div style={{ marginTop: '10px' }}>
                <div className="name">车辆</div>
                <Input
                  value={filterValueChe}
                  onChange={(e) => {
                    setFilterValueChe(e.target.value);
                    const list = gpsCheList.filter((item: any) => {
                      return item.deviceName.indexOf(e.target.value) !== -1;
                    });
                    setGpsCheListShow(list);
                  }}
                />
                <div className="scrollList">
                  {gpsCheListShow.map((item: any) => (
                    <div className="list" key={item.id}>
                      <span
                        className={`${!item.checked ? 'pointer' : ''}`}
                        onClick={() => {
                          if (!item.checked) {
                            window.map.centerAt({ ...centerView, lat: item.lat, lng: item.lon });
                          }
                        }}
                      >
                        {item.deviceName}
                      </span>
                      <span
                        className={`${!item.checked ? 'checked check' : 'check'}`}
                        onClick={() => {
                          selectList(item, '车');
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {visiableHouse && (
          <HouseDetail
            houseId={houseId}
            visible={visiableHouse}
            onCancel={() => {
              setVisiableHouse(false);
            }}
          />
        )}
        {visiableDirectives && (
          <div className="orderBox" id="orderBox" style={{ height: '300px' }}>
            <div className="title mine-move">
              <span>指令下达</span>
            </div>
            <div className="con-center" />
            <div className="con-right" />
            <div className="con-bottom" />
            <div
              className="con-close-btn"
              onClick={() => {
                setVisiableDirectives(false);
                setDealOrder('');
              }}
            >
              <i className="iconfont icon-guanbi" />
            </div>
            <div className="content">
              <div className="fontList">手机号：{phone}</div>
              <TextArea
                value={dealOrder}
                onChange={(val) => {
                  setDealOrder(val.target.value);
                }}
                autoSize
                className="state"
              />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="orderBtn" onClick={sendMessageFun}>
                  <div className="b-left" />
                  <div className="b-right" />
                  <span>发送指令</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 酒店详情 */}
        {visiableHotel && (
          <div className="orderBox" id="orderBox" style={{ height: '250px' }}>
            <div className="title mine-move">
              <span>酒店详情</span>
            </div>
            <div className="con-center" />
            <div className="con-right" />
            <div className="con-bottom" />
            <div
              className="con-close-btn"
              onClick={() => {
                setVisiableHotel(false);
                const newList = rbList.filter((it: any) => {
                  if (it.name === '酒店详情') {
                    it.checked = false;
                  }
                  return it;
                });
                setRbList(newList);
              }}
            >
              <i className="iconfont icon-guanbi" />
            </div>
            <div className="content">
              <div className="fontList2">
                <span className="name">酒店名称：</span>
                <span>{hotelInfo.hotelName}</span>
              </div>
              <div className="fontList2">
                <span className="name">管辖单位：</span>
                <span>{hotelInfo.stationName}</span>
              </div>
              <div className="fontList2">
                <span className="name">总开房数：</span>
                <span>{hotelInfo.totalRoom}</span>
              </div>
              <div className="fontList2">
                <span className="name">单人开房数：</span>
                <span>{hotelInfo.totalSingleOccupancy}</span>
              </div>
              <div className="fontList2">
                <span className="name">酒店地址：</span>
                <span>{hotelInfo.hotelAddress}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 显示数量 */}
      {(houseShow || keyUnitShow || keypersonShow) && (
        <div className={styles.contentrll}>
          <div>
            {houseShow && <span>三区范围房屋：<div>{houseNum}</div></span>}
            {/* {houseShow&&<span>实有人口：<div>{personNum}</div></span>} */}
          </div>
          <div>
            {keyUnitShow && <span>三区范围单位：<div>{keyUnitNum}</div></span>}
            {keypersonShow && <span>三区范围重点人员：<div>{keypersonNum}</div></span>}
          </div>
        </div>
      )}
    </>
  );
});

export default OneStandardAndThreeReals;
