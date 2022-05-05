import styles from './indexNew.less';
import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Row, Col, message } from 'antd';
import type { ItemData } from './data';
import { queryCheckCount, queryCheckList } from '@/services/bigScreen';
import IconOrImage from './IconOrImage';
import { getDate } from '@/utils/utilsJS';

//定义props的类型
interface Props {
  dataConfig: { height?: string; list: ItemData[] };
  refresh?: any;
  callBackSecurity: (obj: any) => void;
}
declare global {
  interface Window {
    clickPoint_jk: any;
  }
}
let configObj: any = {};
let graphicLayerJCZ: any = null; // 检查站点位图层

interface RefTypes {
  go: () => void
}
let timer: any = null;
const JianchazhanCard = React.forwardRef<RefTypes, Props>((props, ref) => {
  const { dataConfig, refresh, callBackSecurity } = props;
  const [dataList, setDataList] = useState<ItemData[]>([]);
  // 聚合点展示
  const addFeature = (graphicLayer: any, arr: any, type: string) => {
    //单击事件
    graphicLayer.on(mars3d.EventType.click, function (event: any) {
      console.log('你单击了', event);
      const graphic = event.graphic;
      if (graphic) {
        const { id, name } = graphic.options.attr;
        if (type === '检查站') {
          callBackSecurity({
            id: id,
            name: name,
          });
        }
      } else {
        //单击了聚合的点
      }
    });
    graphicLayer.on(mars3d.EventType.rightClick, function (event: any) {
      const graphic = event.graphic;
      if (graphic) {
        if (type === '检查站') {
          console.log('你单右击了检查站点位', event);
        }
      }
    });
    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i];
      const position = new mars3d.LatLngPoint(item.lon, item.lat, 0);
      const defaultIcon = '/img/jiaotongkakou.png';
      const primitive = new mars3d.graphic.BillboardEntity({
        position: position,
        style: {
          image: defaultIcon,
          width: 26,
          height: 26,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
          visibleDepth:false
        },
        attr: item,
        name: item.name,
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
        const innerTooltip = `<div>${item.name}</div>`;
        return innerTooltip;
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
        if (item.code === 'jcz' && graphicLayerJCZ) {
          graphicLayerJCZ.show = val.isActive;
        }
      }
      return val;
    });
    setDataList(newList);
  };
  const getArVideos = () => {
    const config = configObj;
    const dataTime = getDate(0);
    const params = {
      begin: dataTime.endDate + ' 00:00:00',
      checkPointIdList: [],
      end: dataTime.endDate + ' 23:59:59',
    };
    queryCheckCount(params)
      .then((res: any) => {
        if (res.code === 200) {
          const videoList = res?.result?.result || {};
          // setVideoObj(obj);
          const newList = config.map((item: ItemData) => {
            if (item.code === 'jcz') {
              item.num = videoList.checkPoint;
            }
            if (item.code === 'rhrs') {
              item.num = videoList.pedestrian;
            }
            if (item.code === 'rhcl') {
              item.num = videoList.vehicle;
            }
            return item;
          });
          setDataList(newList);
        }
      })
      .catch((err: any) => {
        console.log(err.message || err)
        // message.error(err.message || err);
      });
  };
  const getCheckList = () => {
    const dataTime = getDate(0);
    const params = {
      begin: dataTime.endDate + ' 00:00:00',
      checkPointIdList: [],
      end: dataTime.endDate + ' 23:59:59',
    };
    queryCheckList(params)
      .then((res: any) => {
        if (res.code === 200) {
          const videoList = res?.result?.result || [];
          if (graphicLayerJCZ) {
            window.map.removeLayer(graphicLayerJCZ);
          }
          // 聚合图层点位采集
          graphicLayerJCZ = new mars3d.layer.GraphicLayer({
            clustering: {
              enabled: true,
              pixelRange: 80,
            },
            name: '检查站点位',
            show: false,
          });
          window.map.addLayer(graphicLayerJCZ);
          graphicLayerJCZ.clear();
          addFeature(graphicLayerJCZ, videoList, '检查站');
        }
      })
      .catch((err: any) => {
        // message.error(err.message || err);
        console.log(err.message || err)
      });
  };
  // 定时
  const setIntervalFun = () => {
    getArVideos();
    clearInterval(timer);
    timer = setInterval(() => {
      getArVideos();
    }, 1000 * 30);
  };
  useEffect(() => {
    console.log('模块2刷新了');
    if (dataConfig) {
      configObj = dataConfig?.list.map((item: ItemData) => {
        item.isActive = false;
        return item;
      });
      setDataList(configObj);
      setIntervalFun();
      getCheckList();
    }
  }, [dataConfig, refresh]);
  const go = () => {
    console.log('1111')
  }
  useImperativeHandle(ref, () => ({
    go
  }))
  return (
    <Row gutter={5} className={styles.moduleWrapStyle}>
      <div className={`${styles.itemBox} ${styles.jcz}`}>
        {dataList.length > 0 &&
          dataList.map((item: ItemData) => {
            if (item.show) {
              return (
                <Col
                  key={item.name}
                  span={8}
                  className={`${styles.nthList} ${item.isClick ? styles.isClick : ''}`}
                >
                  <div
                    className={`${styles.item} ${item.isActive ? styles.active : ''}`}
                    onClick={() => activeFun(item)}
                  >
                    {/* <i className={`iconfont icon-${item.icon}`} style={{ color: item.color }} /> */}
                    {/* <IconOrImage imgItem={item} /> */}
                    <div className={styles.itemCon}>
                      <div className={styles.numSty}>{item.num}</div>
                      <div className={styles.name}>{item.name}</div>
                    </div>
                  </div>
                </Col>
              );
            } else {
              return;
            }
          })}
          {window.cjObj.name === '湘湖景区'?'':<div className={styles.bg} />}
      </div>
    </Row>
  );
});
export default JianchazhanCard;
