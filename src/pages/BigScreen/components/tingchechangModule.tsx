/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, message } from 'antd';
import type { ItemData } from './data';
import { innerHtml, getBit } from '@/utils/utilsJS';
import IconOrImage from './IconOrImage';
import { findElem } from '@/src/utils/utilsJS';

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
  let timer: any = null;
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
        const entity = JSON.parse(graphicLayerPark.current?.entity?.modelTreeData?.data?.entity || "{}");
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
        const entity = JSON.parse(graphicLayerPassage.current?.entity?.modelTreeData?.data?.entity || "{}");
        entity.id = graphicLayerPassage.current?.entity?.modelTreeData?.data?.id;
        entity.mark = 'main';
        loadModel(entity);
      }
      graphicLayerPassage.current.eachGraphic((graphic: any) => {
        innerHtml(graphic);
      });
    }
  };
  // 获取停车场信息
  const getPark = (config: any) => {
    fetch('http://41.200.14.143:3000/park/query').then((response) => response.json())
      .then((res) => {
        if (res.status == 'ok' && res.results.length > 0) {
          console.log('cxb00000000',res)
          let xdate: any = res.results;
          fetch('/ARBIGdist/js/park.json').then((response) => response.json())
          .then((xres) => {
            let newData: any = xres.results;
            let newxdata: any = [];
            for(let i: any=0; i<newData.length; i++){
              for(let y: any = 0; y<xdate.length; y++){
                if(newData[i].sys_code == xdate[y].sys_code){
                  newxdata.push(xdate[y]);
                }
              }
            }


            const date = newxdata;
            const posObj = {};
            let nottotal: number = 0;
            let hastotal: number = 0;
            let alltotal: number = 0;
            date.forEach((item: any) => {
              let has = parseInt(item.total_place) - parseInt(item.left_place);
              if (has < 0) has = 0;
              posObj[item.sys_code] = {
                  name: item.name,
                  sys_code: item.sys_code,
                  not: item.left_place,
                  all: item.total_place,
                  has: has
              };
              hastotal += has;
              nottotal += item.left_place;
              alltotal += item.total_place;
            });
            const newList = config.map((val: ItemData) => {
              if (val.code === 'allStopNum') {
                val.num = alltotal;
              }
              if (val.code === 'stoprate') {
                val.num = getBit((hastotal / alltotal) * 100,3) as number;
              }
              if (val.code === 'hasStopNums') {
                val.num = hastotal;
              }
              if (val.code === 'notStopNums') {
                val.num = nottotal;
              }
              return val;
            });
            console.log(newList,'数据')
            setDataList(newList);

          })


          // mapRef.current.setXhCar(newData);






        }
      })
      .catch((err) => {
        console.log(err.message || err)
        // message.error(err.message || err);
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
  // 定时
  const setIntervalFun = (config: any) => {
    clearInterval(timer);
    getPark(config);
    timer = setInterval(() => {
      getPark(config);
    }, 1000 * 60);
  };
  useEffect(() => {
    console.log('模块13刷新了');

    if (dataConfig) {
      const config = dataConfig?.list.map((item: ItemData) => {
        item.isActive = false;
        return item;
      });
      setDataList(config);
      setIntervalFun(config);
      setPark({});
      setPassage({});
    }
    return () => {
      clearTimeout(timer);
      console.log("清除")
    }
  }, [dataConfig, refresh]);



  return (
    <>
      <div>

        <Row gutter={5} className={styles.moduleWrapStyle}>
          <div className={`${styles.itemBox}`}>
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
                        <IconOrImage imgItem={item} />
                        <div className={styles.itemCon}>
                          <div className={styles.name}>{item.name}</div>
                          <div className={styles.numSty} style={{ color: item.fontColor }}>{item.num}</div>
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
      </div>
      {/* 重要停车场 */}
    </>
  );
};
export default ChangguanCard;
