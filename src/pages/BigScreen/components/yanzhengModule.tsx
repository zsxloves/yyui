/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './indexNew.less';
import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'antd';
import type { ItemData } from './data';
import PopupAlertTable from './popupAlertTable';
import { getDate, innerHtml } from '@/utils/utilsJS';
import { queryTree } from '@/services/bigScreen';
import IconOrImage from './IconOrImage';
import PopupAlertAJD from './popupAlertAJD';
//定义props的类型
interface Props {
  dataConfig: { height?: string; list: ItemData[] };
  refresh?: any;
}
const YanzhengCard: React.FC<Props> = (props) => {
  const { dataConfig, refresh } = props;
  const [dataList, setDataList] = useState<ItemData[]>([]);
  const [visiableDRYZ, setVisiableDRYZ] = useState<boolean>(false);
  const [visiableAJDW, setVisiableAJDW] = useState<boolean>(false);
  const [popupDataDRYZ, setPopupDataDRYZ] = useState<any>();
  const [poputData, setPopupData] = useState<any>();
  const [validationPoint, setValidationPoint] = useState<any>();
  const graphicLayerYZD = useRef<any>();
  const startTime = useRef('');
  const endTime = useRef('');

  // 加载3d模型
  // const loadModel = (entity: any) => {
  //   console.log('item-entity:', entity);
  //   window.layerModelLF = callBackLoadModel(entity, window.layerModelLF);
  // };
  const getDetail = (type: string) => {
    if (type === 'yzd') {
      if (graphicLayerYZD.current) {
        graphicLayerYZD.current.clear();
        window.map.removeLayer(graphicLayerYZD.current);
      }
      graphicLayerYZD.current = new mars3d.layer.GraphicLayer();
      window.map.addLayer(graphicLayerYZD.current);
      console.log('validationPoint:', validationPoint);
      if (!validationPoint?.geoJSON) return;
      graphicLayerYZD.current.loadGeoJSON(validationPoint?.geoJSON, {
        clear: true,
        // flyTo: true
      });
      graphicLayerYZD.current.eachGraphic((graphic: any) => {
        innerHtml(graphic);
      });
      window.changeLayer()
    }
  };
  // 获取预案树
  const getTree = (config: any) => {
    queryTree({ sceneId: window.cjObj?.id })
      .then((res) => {
        if (res.code === 200) {
          const list = res?.data || [];
          let yzdNum = 0;
          list.some((item: any) => {
            const newItem = item.data;
            const entity = JSON.parse(newItem?.entity||"{}");
            if (entity?.type === '2e6d07b1-e6c0-468e-ab9e-e8135d366141') {
              yzdNum = entity?.code || 0;
              setValidationPoint(newItem);
            }
          });
          const newList = config.map((val: ItemData) => {
            if (val.code === 'yzd') {
              val.num = yzdNum;
            }
            return val;
          });
          setDataList(newList);
        }
      })
      .catch();
  };

  const activeFun = (item: ItemData) => {
    if (!item.isClick) return;
    const newList = dataList.map((val: ItemData) => {
      if (val.name === item.name) {
        val.isActive = !val.isActive;
        if (item.code === 'dryz') {
          setVisiableDRYZ(val.isActive);
          setPopupDataDRYZ(item.popupContent);
        }
        if (val.isActive) {
          if (item.code === 'yzd') {
            setPopupData(item.popupContent);
            setVisiableAJDW(true)
            getDetail(item.code);
          }
        } else {
          if (item.code === 'yzd') {
            setVisiableAJDW(false)
            if (graphicLayerYZD.current) {
              graphicLayerYZD.current.clear();
              window.map.removeLayer(graphicLayerYZD.current);
              window.changeLayer()
            }
            // if (window.layerModelLF) {
            //   loadModel(false);
            // }
          }
        }
      }
      return val;
    });
    setDataList(newList);
  };
  useEffect(() => {
    console.log('模块3');
    const dataTime = getDate(0);
    startTime.current = dataTime.endDate + ' 00:00:00';
    endTime.current = dataTime.endDate + ' 23:59:59';
    if (dataConfig) {
      const config = dataConfig?.list.map((item: ItemData) => {
        item.isActive = false;
        return item;
      });
      setDataList(config);

      getTree(config);
    }
  }, [dataConfig, refresh]);
  return (
    <Row gutter={5} className={styles.moduleWrapStyle}>
      <div className={`${styles.itemBox} ${styles.yzxx}`}>
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
                    {/* <i className={`iconfont icon-${item.icon}`} style={{ color: item.color }} /> */}
                    {/* <IconOrImage imgItem={item} /> */}
                    <div className={styles.itemCon}>
                      <div className={styles.name}>{item.name}</div>
                      <div className={styles.numSty}>{item.num}</div>
                    </div>
                    <div style={{ width: '72px',height:'28px',margin:'6px auto 0' }}>
                        <img src={require(`../image/yzbottom.png`)} />
                    </div>
                  </div>
                </Col>
              );
            } else {
              return;
            }
          })}
      </div>
      {visiableDRYZ && <PopupAlertTable popupData={popupDataDRYZ} />}
      <PopupAlertAJD visiable={visiableAJDW} popupData={poputData} />
    </Row>
  );
};
export default YanzhengCard;
