/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './indexNew.less';
import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, message } from 'antd';
import type { ItemData } from './data';
import { queryTree } from '@/services/bigScreen';
import { innerHtml } from '@/utils/utilsJS';
import IconOrImage from './IconOrImage';
import ApngComponent from 'react-apng';

//定义props的类型
interface Props {
  dataConfig: { height?: string; list: ItemData[] };
  refresh?: any;
  callBackLoadModel: (entity: any, layer: any) => void;
}
declare global {
  interface Window {
    closeGraphicPark: any; // 关闭图层
  }
}

let graphicLayerDiv1: any = null;
const ChangguanCard: React.FC<Props> = (props) => {
  const { dataConfig, refresh, callBackLoadModel } = props;
  const graphicLayerPark = useRef<any>();
  const graphicLayerPassage = useRef<any>();
  const [dataList, setDataList] = useState<ItemData[]>([]);
  const [park, setPark] = useState<any>();
  const [passage, setPassage] = useState<any>();
  // 加载3d模型
  const loadModel = (entity: any) => {
    window.layerModelLF = callBackLoadModel(entity, window.layerModelLF);
  };
  window.closeGraphicPark = () => {
    if (graphicLayerDiv1) graphicLayerDiv1.show = false;
    window.map.removeLayer(graphicLayerDiv1);
  };
  // div Popup
  const addGraphicDiv = async (data: any) => {
    const item: any = {
      typeName: '停车场',
      deviceName: 'ffsdafsa',
    };
    if (!item) return;
    window.closeGraphicPark();
    graphicLayerDiv1 = new mars3d.layer.GraphicLayer({
      name: '停车场详情',
      show: true,
      hasZIndex: true,
      zIndex: 999,
    });
    window.map.addLayer(graphicLayerDiv1);
    let html = '';
    if (item.typeName === '停车场') {
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
          <div class="arrow" onClick="closeGraphicPark()"><i class="iconfont icon-guanbi"></i></div>
      </div>`;
    }
    const position = new mars3d.LatLngPoint(
      data.position[0],
      data.position[1],
      data.position[2] || 0,
    );
    console.log('position:', position);
    const graphic = new mars3d.graphic.DivGraphic({
      position: position,
      style: {
        html: html,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        offsetX: 85,
        offsetY: -67,
      },
      pointerEvents: true, // false时不允许拾取和触发任意鼠标事件，但可以穿透div缩放地球
    });
    graphicLayerDiv1.addGraphic(graphic);
    // setTimeout(() => {
    //   if ($('.marsTiltPanel').parent('.mars3d-divGraphic')) {
    //     $('.marsTiltPanel').parent('.mars3d-divGraphic').css({
    //       zIndex: 999999999,
    //     });
    //   }
    // }, 300);
  };
  const getDetail = (code: string, type: string) => {
    if (type === 'tcc') {
      if (graphicLayerPark.current) {
        graphicLayerPark.current.clear();
        window.map.removeLayer(graphicLayerPark.current);
      }
      graphicLayerPark.current = new mars3d.layer.GraphicLayer();
      window.map.addLayer(graphicLayerPark.current);
      if (!park?.geoJSON) return;
      graphicLayerPark.current.loadGeoJSON(park?.geoJSON, {
        clear: true,
        // flyTo: true
      });
      if (graphicLayerPark.current?.entity?.modelTreeData?.data?.entity) {
        const entity = JSON.parse(graphicLayerPark.current?.entity?.modelTreeData?.data?.entity||"{}");
        entity.id = graphicLayerPark.current?.entity?.modelTreeData?.data?.id;
        entity.mark = 'main';
        loadModel(entity);
      }
      graphicLayerPark.current.eachGraphic((graphic: any) => {
        graphic.bindTooltip(
          function (event: any) {
            console.log('graphic:graphic:', event.graphic);
            const item = event?.graphic.options.attr?.data;
            const innerTooltip = `<div>${item?.name}</div>`;
            return innerTooltip;
          },
          {
            direction: 'top',
            offsetY: -20,
          },
        );
        graphic.on(mars3d.EventType.click, function (event: any) {
          const grap = event.graphic;
          if (grap.options?.edittype === 'billboard000') {
            addGraphicDiv(grap.options);
          }
        });
      });
    } else if (type === 'crtd') {
      if (graphicLayerPassage.current) {
        graphicLayerPassage.current.clear();
        window.map.removeLayer(graphicLayerPassage.current);
      }
      graphicLayerPassage.current = new mars3d.layer.GraphicLayer();
      window.map.addLayer(graphicLayerPassage.current);
      if (!passage?.geoJSON) return;
      graphicLayerPassage.current.loadGeoJSON(passage?.geoJSON, {
        clear: false,
        // flyTo: true
      });
      if (graphicLayerPassage.current?.entity?.modelTreeData?.data?.entity) {
        const entity = JSON.parse(graphicLayerPassage.current?.entity?.modelTreeData?.data?.entity||"{}");
        entity.id = graphicLayerPassage.current?.entity?.modelTreeData?.data?.id;
        entity.mark = 'main';
        loadModel(entity);
      }
      graphicLayerPassage.current.eachGraphic((graphic: any) => {
        innerHtml(graphic);
      });
    }
  };
  // 获取预案树
  const getTree = (config: any) => {
    queryTree({ sceneId: window.cjObj?.id })
      .then((res) => {
        if (res.code === 200) {
          const list = res?.data || [];
          let parkNum = 0;
          let tdNum = 0;
          list.some((item: any) => {
            const newItem = item.data;
            const entity = JSON.parse(newItem.entity||"{}");
            if (entity?.type === 'b7db8d58-46c4-41ab-b11a-b1d65100a5d5') {
              // 停车场字典ID
              parkNum = entity?.code || 0;
              setPark(newItem);
            } else if (entity?.type === 'cd7f6c90-98fc-475e-8139-e7cef5d4d113') {
              // 出入通道字典ID
              tdNum = entity?.code || 0;
              setPassage(newItem);
            }
          });
          const newList = config.map((val: ItemData) => {
            if (val.code === 'tcc') {
              val.num = parkNum;
            }
            if (val.code === 'crtd') {
              val.num = tdNum;
            }
            return val;
          });
          setDataList(newList);
        }
      })
      .catch((err) => {
        // message.error(err.message || err);
        console.log(err.message || err)
      });
  };
  const activeFun = (item: ItemData) => {
    if (!item.isClick) return;
    const newList = dataList.map((val: ItemData) => {
      if (val.name === item.name) {
        val.isActive = !val.isActive;
        if (val.isActive) {
          if (item.code === 'tcc') {
            getDetail(park?.id, item.code);
          } else if (item.code === 'crtd') {
            getDetail(passage?.id, item.code);
          }
        } else {
          if (item.code === 'tcc') {
            if (graphicLayerPark.current) {
              graphicLayerPark.current.clear();
              window.map.removeLayer(graphicLayerPark.current);
            }
            if (window.layerModelLF) {
              loadModel(false);
            }
          } else if (item.code === 'crtd') {
            if (graphicLayerPassage.current) {
              graphicLayerPassage.current.clear();
              window.map.removeLayer(graphicLayerPassage.current);
            }
            if (window.layerModelLF) {
              loadModel(false);
            }
          }
        }
      }
      return val;
    });
    setDataList(newList);
  };

  useEffect(() => {
    console.log('模块5刷新了');
    if (dataConfig) {
      const config = dataConfig?.list.map((item: ItemData) => {
        item.isActive = false;
        return item;
      });
      setDataList(config);
      // getParkList(config);
      getTree(config);
    }
  }, [dataConfig, refresh]);
  return (
    <Row gutter={5} className={styles.moduleWrapStyle}>
      <div className={`${styles.itemBox} ${styles.cgxx}`}>
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
                    <div style={{ width: '67px' }}>
                      <ApngComponent autoPlay src={require(`../image/apng/${item.icon}.png`)} />
                    </div>
                    {/* <IconOrImage imgItem={item} /> */}
                    <div className={styles.itemCon}>
                      <div className={styles.name}>{item.name}</div>
                      <div className={styles.numSty}>{item.num}</div>
                    </div>
                  </div>
                </Col>
              );
            } else {
              return;
            }
          })}
      </div>
    </Row>
  );
};
export default ChangguanCard;
