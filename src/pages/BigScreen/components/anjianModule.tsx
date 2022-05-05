/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './indexNew.less';
import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { Row, Col } from 'antd';
import type { ItemData } from './data';
import { getDateDuring } from '@/utils/utilsJS';
import IconOrImage from './IconOrImage';
import PopupAlertContraband from './popupAlertContraband';
import { checkCollect, queryTree, arIconLayerQuery } from '@/services/bigScreen';
import { checkCollectJSON, queryTreeJSON } from '../service';
//定义props的类型
interface Props {
  dataConfig: { height?: string; list: ItemData[] };
  refresh?: any;
  itemDate?: any;
  callBackLoadModel: (entity: any, layer: any) => void;
  callBackSecurity: (obj: any) => void;
  callBackImageUrl: (obj: any) => void;
}

interface RefTypes {
  getCheckCollect: (ids?: string[]) => void;
  setCheckDetail: (data: any) => void;
}

let list: any = [];
// let isFirstLoad = true;
const AnjianCard = React.forwardRef<RefTypes, Props>((props, ref) => {
  const { dataConfig, refresh, callBackLoadModel, callBackSecurity, callBackImageUrl } = props;
  const [dataList, setDataList] = useState<ItemData[]>([]);
  const [popupData, setPopupData] = useState<any>();
  const [popupDataType, setPopupDataType] = useState<any>();
  const [visiable, setVisiable] = useState<boolean>(false);
  const [visiableType, setVisiableType] = useState<boolean>(false);
  const ajItem = useRef<any>(null);
  const graphicLayer = useRef<any>();

  // 加载3d模型
  const loadModel = (entity: any) => {
    window.layerModelLF = callBackLoadModel(entity, window.layerModelLF);
  };
  // 显示安检点信息
  const showAnJingInfo = () => {
    if (window.layerModelLF) window.map.removeLayer(window.layerModelLF);
    if (ajItem?.current?.geoJSON) {
      if (ajItem.current?.entity?.modelTreeData?.data?.entity) {
        const entity = JSON.parse(ajItem.current?.entity?.modelTreeData?.data?.entity || "{}");
        entity.id = ajItem.current?.entity?.modelTreeData?.data?.id;
        entity.mark = 'main';
        loadModel(entity);
      }
      if (graphicLayer.current) {
        graphicLayer.current.clear();
        window.map.removeLayer(graphicLayer.current);
      }
      graphicLayer.current = new mars3d.layer.GraphicLayer();
      window.map.addLayer(graphicLayer.current);
      graphicLayer.current.loadGeoJSON(ajItem.current.geoJSON, {
        clear: true,
        // flyTo: true
      });
      graphicLayer.current.on(mars3d.EventType.click, (event: any) => {
        const graphic = event.graphic;
        if (graphic) {
          const entity = graphic?.options?.attr?.data?.entity
            ? JSON.parse(graphic?.options?.attr?.data?.entity || "{}")
            : {};
          callBackSecurity({
            id: entity?.info?.code,
            name: entity?.info?.name,
          });
        } else {
          //单击了聚合的点
        }
      });
      graphicLayer.current.bindTooltip(
        function (event: any) {
          const item = event.graphic;
          if (!item.options.attr?.data?.entity) {
            return;
          }
          const entity = JSON.parse(item.options.attr?.data?.entity || {});
          const innerTooltip = `<div class="popupTooltip_self">${entity?.info?.name}</div>`;
          return innerTooltip;
        },
        {
          direction: 'top',
          offsetY: -30,
          template: false,
        },
      );
      window.changeLayer();
    }
  };
  const setCheckDetail = (itemDate: any) => {
    if (itemDate) {
      const config = list.map((item: ItemData) => {
        // const isDDH = window.cjObj.name==='两会'
        if (item.code === 'ajrs') item.num = itemDate.passengerFlow;
        if (item.code === 'wjbgzs') item.num = itemDate.dangerousPackage;
        if (item.code === 'wjpzs') item.num = itemDate.dangerous;
        return item;
      });
      setDataList(config);
      list = config;
    }
  };
  // 获取安检点位安检信息
  const getCheckCollect = (ids?: string[]) => {
    const paramDate = getDateDuring(window.hdObj.startTime, window.hdObj.endTime);
    const gateIndexCodes = JSON.parse(window.cjObj.entity || "{}").ajtd || [];
    const entity = JSON.parse(window.cjObj.entity || "{}");
    const params = {
      indexCodes: ids || window.ajSitId,
      pageNo: 1,
      pageSize: 100,
      startTime: entity?.startTime || paramDate?.start,
      endTime: entity?.endTime || paramDate?.end,
      gateIndexCodes,
      resType: 0,
      bodyResType: '1',
    };
    checkCollect(params)
      .then((res: any) => {
        if (res.code) {
          const data = res.result?.result?.list || [];
          data.forEach((item: any) => {
            if (item.name == '合计') {
              setCheckDetail(item);
            }
          });
        }
      })
      .catch((err: any) => {
        console.log(err?.message || err);
      });
  };
  const activeFun = (item: ItemData) => {
    if (!item.isClick) return;
    const newList = dataList.map((val: ItemData) => {
      if (val.name === item.name) {
        val.isActive = !val.isActive;
        if (item.code === 'ajdw') {
          if (val.isActive) {
            showAnJingInfo();
          } else {
            if (graphicLayer.current) {
              graphicLayer.current.clear();
              window.map.removeLayer(graphicLayer.current);
              window.changeLayer();
            }
            if (window.layerModelLF) {
              loadModel(false);
            }
          }
        }
        if (item.code === 'wjbgzs') {
          setPopupData(item.popupContent);
          setVisiable(val.isActive);
        }
        if (item.code === 'wjpzs') {
          setPopupDataType(item.popupContent);
          setVisiableType(val.isActive);
        }
      }
      return val;
    });
    setDataList(newList);
    list = newList;
  };

  const getArIconLayerQuery = (id: string) => {
    arIconLayerQuery({ listId: id })
      .then((res: any) => {
        const lis = res?.data?.rows || [];
        const ids = lis
          .map((item: any) => {
            item.entity = JSON.parse(item.entity);
            if (item.entity?.info?.code) {
              return item.entity?.info?.code;
            }
          })
          .filter((val: any) => {
            return !!val;
          });
        window.ajSitId = ids;
        getCheckCollect(ids);
      })
      .catch();
  };
  // 获取安检点
  const getCheckSit = () => {
    const config0 = list.map((ite: ItemData) => {
      ite.isActive = false;
      if (ite.code === 'ajdw') ite.num = 0;
      return ite;
    });
    setDataList(config0);
    list = config0;
    queryTree({ sceneId: window.cjObj?.id })
      .then((res) => {
        if (res.code === 200) {
          res?.data?.forEach((item: any) => {
            const newItem = item.data;
            const entity = JSON.parse(newItem?.entity);
            newItem.entity = entity;
            newItem.num = entity?.code || '';
            if (entity?.type === '5a1f020c-8c03-4395-a093-af57d9c8cc28') {
              ajItem.current = newItem;
              const config = list.map((ite: ItemData) => {
                ite.isActive = false;
                if (ite.code === 'ajdw') ite.num = newItem.num;
                return ite;
              });
              setDataList(config);
              list = config;
              getArIconLayerQuery(newItem.id);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err?.message || err);
      });
  };
  const getCheckCollectJSON = (ids?: string) => {
    checkCollectJSON({})
      .then((res: any) => {
        if (res.code === 200) {
          const data = res.result?.result?.list || [];
          data.forEach((item: any) => {
            if (item.name == '合计') {
              setCheckDetail(item);
            }
          });
        }
      })
      .catch((err: any) => {
        console.log(err?.message || err);
      });
  };
  const getCheckSitJSON = () => {
    const config0 = list.map((ite: ItemData) => {
      ite.isActive = false;
      if (ite.code === 'ajdw') ite.num = 0;
      return ite;
    });
    setDataList(config0);
    list = config0;
    queryTreeJSON({})
      .then((res) => {
        if (res.code === 200) {
          res?.data?.forEach((item: any) => {
          const newItem = item.data;
          if (window.cjObj.id === 'de7cb93e-ace1-4120-baca-815b70ea93de'){
              const config = list.map((ite: ItemData) => {
                ite.isActive = false;
                if (ite.code === 'ajdw') ite.num = newItem[1].num;
                return ite;
              });
              ajItem.current = newItem[1];
            setDataList(config);
          }else{
              const config = list.map((ite: ItemData) => {
                ite.isActive = false;
                if (ite.code === 'ajdw') ite.num = newItem[0].num;
                return ite;
              });
              ajItem.current = newItem[0];
            setDataList(config);
          }
            // list = config;
            getCheckCollectJSON(newItem.id);
          });
        }
      })
      .catch((err) => {
        console.log(err?.message || err);
      });
  };
  //将子组件的方法 暴露给父组件
  useImperativeHandle(ref, () => ({
    getCheckCollect,
    setCheckDetail,
  }));
  useEffect(() => {
    console.log('4刷新了',window.cjObj);
    const entity = window.cjObj.entity&&JSON.parse(window.cjObj.entity);
    if(entity?.debug==1){
      getCheckSitJSON()
    }else{
      getCheckSit();
    }
    if (dataConfig) {
      const config = dataConfig?.list.map((item: ItemData) => {
        item.isActive = false;
        return item;
      });
      setDataList(config);
      list = config;
      // getCheckCollect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataConfig, refresh]);
  return (
    <Row gutter={5} className={styles.moduleWrapStyle}>
      <div className={`${styles.itemBox} ${styles.ajxx}`}>
        {dataList.length > 0 &&
          dataList.map((item: ItemData) => {
            if (item.show) {
              return (
                <Col
                  key={item.name}
                  span={6}
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
                      <div className={styles.name} style={{color:item.color}}>{item.name}</div>
                    </div>
                  </div>
                </Col>
              );
            } else {
              return;
            }
          })}
      </div>
      {/* 违禁包裹照片 */}
      {visiable && (
        <PopupAlertContraband
          popupData={popupData}
          popupType="wjbgzs"
          backPreViewImage={(val: string) => {
            callBackImageUrl(val);
          }}
        />
      )}
      {/* 违禁品种类 */}
      {visiableType && (
        <PopupAlertContraband
          popupData={popupDataType}
          popupType="wjpzs"
          backPreViewImage={(val: string) => {
            callBackImageUrl(val);
          }}
        />
      )}
    </Row>
  );
});
export default AnjianCard;
