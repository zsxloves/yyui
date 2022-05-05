/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
// import CommonStyle from '@/components/styleCommon'
import bt from '../image/bt.png';
import React, { useState, useEffect } from 'react';
import { Button, Image, Modal } from 'antd';
// import $ from "jquery"
import { snapSearch, vehicleTracking } from '@/services/bigScreen';
import { getDate } from '@/utils/utilsJS';
//定义props的类型
interface Props {
  bayonetId: string;
  bayonetName: string;
  platform: string;
  callback: () => any;
}

let graphicLayerBayonet: any = null; // 车辆卡口轨迹图层
const CarBayonet: React.FC<Props> = (props) => {
  const { bayonetId, bayonetName, platform, callback } = props;
  const [carList, setCarList] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [itemData, setItemData] = useState<any>({});

  // 获取卡口数据
  const getDealRecard = () => {
    const dataT = getDate(0);
    const start = dataT.endDate + ' 00:00:00';
    const end = dataT.endDate + ' 23:59:59';
    const params = {
      data: {
        page: 0,
        size: 999,
        endTime: end,
        beginTime: start,
        crossingIds: [bayonetId],
        platform,
      },
    };
    snapSearch(params)
      .then((res: any) => {
        if (res.code === 200) {
          const list = res.result.page?.content || [];
          setCarList(list);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  //
  const setLocusFun = (data: any[]) => {
    graphicLayerBayonet = new mars3d.layer.GraphicLayer({
      name: '车辆轨迹',
      show: true,
    });
    window.map.addLayer(graphicLayerBayonet);
    console.log('data:', data);
    const positions: any = data?.map((ite: any) => {
      return [ite.longitude, ite.latitude, 0];
    });
    console.log('positions:', positions);
    const graphic = new mars3d.graphic.PolylineEntity({
      positions,
      style: {
        width: 10,
        material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.LineFlow, {
          color: '#fff',
          image: '/img/mapImg/xz256.png',
          speed: 3,
          repeat: new Cesium.Cartesian2(4.0, 1.0),
        }),
      },
    });
    graphicLayerBayonet.addGraphic(graphic);
    const graphic1 = new mars3d.graphic.PolylineEntity({
      positions,
      style: {
        clampToGround: true,
        width: 10,
        color: '#ff4a5f',
      },
    });
    graphicLayerBayonet.addGraphic(graphic1);

    data.forEach((item: any) => {
      const pos = new mars3d.LatLngPoint(item.longitude, item.latitude, 0);
      const primitive = new mars3d.graphic.BillboardEntity({
        position: pos,
        style: {
          image: '/img/cheliangkakou.png',
          scale: 0.5,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
          visibleDepth:false
        },
      });
      graphicLayerBayonet.addGraphic(primitive);

      const html = `<div class="marsFace">
                      <div class="rowItem">
                        <div class="name"><img src="${item.imagePath}" /></div>
                        <div class="con">
                          <div>${item.plateNo}</div>
                          <div>${item.crossingName}</div>
                          <div>${item.captureTime}</div>
                        </div>
                      </div>
                    </div>`;
      const graphic2 = new mars3d.graphic.DivGraphic({
        position: [item.longitude, item.latitude],
        style: {
          html: html,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          offsetY: -20,
        },
        pointerEvents: true, // false时不允许拾取和触发任意鼠标事件，但可以穿透div缩放地球
      });
      graphicLayerBayonet.addGraphic(graphic2);
    });
  };
  // 获取车辆轨迹
  const getVehicleTracking = (item: any) => {
    const params = {
      beginTime: startTime,
      endTime: endTime,
      pageNo: 0,
      pageSize: 9999,
      plateNo: item.plateNo,
      platform,
    };
    // const list1 = [
    //   {
    //     longitude: 120.2288892,
    //     latitude: 30.2349677,
    //     plateNo: '浙A 222222',
    //     crossingName: 'fdsakjhfdhsk发送接口幅度萨芬',
    //     captureTime: '2020-11-11 11:11:11',
    //     imagePath: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   },
    //   {
    //     longitude: 120.2488892,
    //     latitude: 30.2449677,
    //     plateNo: '浙A 333333',
    //     crossingName: 'fdsakjhfdhsk发送接口幅度萨芬',
    //     captureTime: '2020-11-11 11:11:11',
    //     imagePath: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   },
    //   {
    //     longitude: 120.2588892,
    //     latitude: 30.2449677,
    //     plateNo: '浙A 222222',
    //     crossingName: 'fdsakjhfdhsk发送接口幅度萨芬',
    //     captureTime: '2020-11-11 11:11:11',
    //     imagePath: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   },
    // ];
    // setLocusFun(list1);
    vehicleTracking(params)
      .then((res: any) => {
        if (res.code === 0) {
          const list = res.result.page?.content || [];
          setLocusFun(list);
        }
      })
      .catch();
  };
  const searchLocus = (item: any) => {
    const list = carList.map((val: any) => {
      if (item.id === val.id) {
        val.checked = !val.checked;
      } else {
        val.checked = false;
      }
      return val;
    });
    if (graphicLayerBayonet) window.map.removeLayer(graphicLayerBayonet);
    if (item.checked) {
      getVehicleTracking(item);
    } else if (graphicLayerBayonet) {
      window.map.removeLayer(graphicLayerBayonet);
    }
    setCarList(list);
  };
  const showDetail = (item: any) => {
    setVisible(true);
    setItemData(item);
  };
  useEffect(() => {
    const dataTime = getDate(0);
    setStartTime(dataTime.endDate + ' 00:00:00');
    setEndTime(dataTime.endDate + ' 23:59:59');
    if (bayonetId) {
      getDealRecard();
    }
  }, [bayonetId]);
  // const returnNumToVal = (num: any, val: any, str: any) => {
  //   const index = num.indexOf(str);
  //   return val[index];
  // }
  // const tansString = (str: any, type: string) => {
  //   if (type == 'age') {
  //       return str;
  //   } else if (type == 'race') {
  //       const num = [0, 1, 2, 3];
  //       const val = ['未识别', '黄种人', '白人'];
  //       return returnNumToVal(num, val, str);
  //   } else if (type == 'fringe') {
  //       const num = [0, 1];
  //       const val = ['无', '有'];
  //       return returnNumToVal(num, val, str);
  //   } else if (type == 'eye') {
  //       const num = [0, 1];
  //       const val = ['闭眼', '睁眼'];
  //       return returnNumToVal(num, val, str);
  //   } else if (type == 'mouth') {
  //       const num = [0, 1];
  //       const val = ['闭嘴', '张嘴'];
  //       return returnNumToVal(num, val, str);
  //   } else if (type == 'beard') {
  //       const num = [0, 1];
  //       const val = ['没胡子', '有胡子'];
  //       return returnNumToVal(num, val, str);
  //   } else if (type == 'mask') {
  //       const num = [0, 1];
  //       const val = ['没戴口罩', '戴口罩'];
  //       return returnNumToVal(num, val, str);
  //   } else if (type == 'glasses') {
  //       const num = [0, 1, 2];
  //       const val = ['没眼镜', '眼镜', '墨镜'];
  //       return returnNumToVal(num, val, str);
  //   } else if (type == 'emotion') {
  //       const num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  //       const val = ['微笑', '愤怒', '悲伤', '厌恶', '害怕', '惊讶', '正常', '大笑', '高兴', '困惑', '尖叫'];
  //       return returnNumToVal(num, val, str);
  //   } else if (type == 'gender') {
  //       const num = [0, 1, 2, 9];
  //       const val = ['未知性别', '男性', '女性', '未说明的性别'];
  //       return returnNumToVal(num, val, str);
  //   } else if (type == 'capTime') {
  //       return str[0] + str[1] + str[2] + str[3] + '-' + str[4] + str[5] + '-' + str[6] + str[7] + ' ' + str[9] + str[10] + ':' + str[11] + str[12] + ':' + str[13] + str[14];
  //   } else if (type == 'similarity') {
  //       const percent = Math.round(str * 100) + '%';
  //       return percent;
  //   }
  // }
  const callbackFun = () => {
    window.map.removeLayer(graphicLayerBayonet);
    callback();
  };
  return (
    <div className={styles.bayonetBox}>
      <div className={styles.callbackBtn}>
        <Button type="primary" size="small" onClick={callbackFun}>
          返回
        </Button>
      </div>
      <div className={styles.title}>{bayonetName}</div>
      <div className={styles.moduleBox}>
        <div className={styles.firstCard}>
          <img src={bt} className={styles.topImg} />
          <span className={styles.titleName}>车流信息</span>
        </div>
      </div>
      <div className={styles.filterTime}>
        <div className={styles.dateTime}>
          开始日期：<div className={styles.time}>{startTime}</div>
        </div>
        <div className={styles.dateTime}>
          开始日期：<div className={styles.time}>{endTime}</div>
          <Button type="primary" onClick={getDealRecard} className={styles.searchBtn}>
            查询
          </Button>
        </div>
      </div>
      <div className={styles.scrollBox} style={{ marginBottom: '20px' }}>
        {carList.length > 0 &&
          carList.map((item: any) => (
            <div className={styles.item} key={item.id}>
              <Image
                className={styles.image}
                width={60}
                preview={false}
                src={item.imagePath}
                onClick={() => {
                  showDetail(item);
                }}
              />
              <div className={styles.rightC}>
                <div className={styles.gender}>{item.plateNo}</div>
                <div className={styles.gender}>{item.vehicleTypeName}</div>
                <div className={styles.gender}>{item.captureTime}</div>
              </div>
              <div
                className={`${styles.btn} ${item.checked ? styles.checked : ''}`}
                onClick={() => searchLocus(item)}
              >
                {item.checked ? '退出' : '搜索'}
              </div>
            </div>
          ))}
        {carList.length === 0 && <div className={styles.noDate}>暂无数据</div>}
      </div>
      <div className={styles.footer}>
        总车流量：<span>{0}</span> 辆/小时
      </div>

      <Modal
        width={900}
        mask={false}
        bodyStyle={{ padding: '0' }}
        destroyOnClose
        maskClosable={false}
        title={false}
        className="commonPopup"
        visible={visible}
        footer={false}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div className="win-box" id="captureImgInfo">
          <div className="rect-1" />
          <div className="rect-2" />
          <div className="win-title mine-move" />
          <div className="win-content" style={{ paddingTop: '0px' }}>
            <img className="fl cap-img" id="cap-img" src={itemData?.imagePath} />
            <div className="fl" style={{ width: '260px' }}>
              <div className="gx-title">特征</div>
              <div className="cap-attr">
                {itemData.crossingName && (
                  <div className="cap-li">
                    <span>卡口名称</span>
                    <span>{itemData.crossingName}</span>
                  </div>
                )}
                {itemData.captureTime && (
                  <div className="cap-li">
                    <span>抓拍时间</span>
                    <span>{itemData.captureTime}</span>
                  </div>
                )}
                {itemData.plateNo && (
                  <div className="cap-li">
                    <span>车牌号</span>
                    <span>{itemData.plateNo}</span>
                  </div>
                )}
                {itemData.vehicleTypeName && (
                  <div className="cap-li">
                    <span>车辆类型</span>
                    <span>{itemData.vehicleTypeName}</span>
                  </div>
                )}
                {platform && (
                  <div className="cap-li">
                    <span>所属平台</span>
                    <span>{platform}</span>
                  </div>
                )}
              </div>
              {/* <div id="cap_personlist">
                      <div className="gx-title">可疑人员</div>
                      <div className="cap-attr"></div>
                  </div> */}
            </div>
            <div className="clear" />
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default CarBayonet;
