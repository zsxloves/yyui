import styles from './index.less';
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import type { ItemData } from './data';
import IconOrImage from './iconOrImage';
import { queryYaDetail, querySolution } from '@/services/topManage';
import { checkPointInPolygon2D } from '@/utils/utilsJS';
//定义props的类型
interface Props {
  popupData: {
    type: string;
    title: string;
    style: any;
    data: any[];
  };
  visiable: boolean;
}
const mjPoints: any[] = [];
const jjPoints: any[] = [];
const fjPoints: any[] = [];
const baPoints: any[] = [];
let round1: any[] = []; // 封闭区
let round2: any[] = []; // 控制区
let round3: any[] = []; // 分流区
let graphicLayerABLL: any = null;
let curCode: any = null;
const PopupAlert: React.FC<Props> = (props) => {
  const { popupData, visiable } = props;
  const [dataList, setDataList] = useState<ItemData[]>([]);
  const [mjsum, setMjSum] = useState<number>(0);
  const [jjsum, setJjSum] = useState<number>(0);
  const [fjsum, setFjSum] = useState<number>(0);
  const [basum, setBaSum] = useState<number>(0);

  const activeFun = (item: ItemData) => {
    if (!item.isClick) return;
    const newList = dataList.map((val: ItemData) => {
      if (val.name === item.name) {
        val.isActive = !val.isActive;
        if (val.isActive) {
          console.log('namewss:', item);
        } else {
        }
      }
      return val;
    });
    setDataList(newList);
  };
  useEffect(() => {
    if (popupData) {
      console.log('popupDAta:', popupData);
      const config = popupData?.data?.map((item: ItemData) => {
        item.isActive = false;
        return item;
      });
      setDataList(config);
    }
  }, [popupData]);
  useEffect(() => {
    if (window?.hdObj?.id) {
      const queryObject = { activityId: window?.hdObj?.id, pageNumber: 0, PageSize: 10000 } as any;
      queryYaDetail(queryObject)
        .then((res) => {
          let mjSum: number = 0;
          let jjSum: number = 0;
          let fjSum: number = 0;
          let baSum: number = 0;
          const result = res?.data?.rows;
          result.map((item: any) => {
            const data = JSON.parse(item.entity || '{}')?.info;
            const { mjNum, fjNum, baNum, jjNum } = data||0;
            if (mjNum > 0) {
              mjPoints.push(item);
            } else if (fjNum > 0) {
              fjPoints.push(item);
            } else if (baNum > 0) {
              baPoints.push(item);
            } else if (jjNum > 0) {
              jjPoints.push(item);
            }
            mjSum = Number(mjNum || 0) + mjSum;
            fjSum = Number(fjNum || 0) + fjSum;
            jjSum = Number(jjNum || 0) + jjSum;
            baSum = Number(baNum || 0) + baSum;
          });
          setMjSum(mjSum);
          setJjSum(jjSum);
          setFjSum(fjSum);
          setBaSum(baSum);
        })
        .catch((err: any) => {
          console.log(err?.message);
          // message.error(err.message);
        });
    }
  }, [window?.hdObj?.id]);
  // 过滤撒点
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
      id: graphic.options?.attr?.id,
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
  const mapPoint = (point: any) => {
    window.map?.removeLayer(graphicLayerABLL);
    const pointArray: any[] = [];
    point?.map((iter: any) => {
      const iterLonLat = {
        longitude: iter?.lon,
        latitude: iter?.lat,
        height: 0,
      };
      // 如果没有三圈线 用视域范围
      if (round1.length === 0 && round2.length === 0 && round3.length === 0) {
        round1 = JSON.parse(window?.cjObj?.views || '{}');
      }
      if (
        checkPointInPolygon2D(iterLonLat, round1) ||
        checkPointInPolygon2D(iterLonLat, round2) ||
        checkPointInPolygon2D(iterLonLat, round3)
      ) {
        pointArray.push(iter);
      }
    });
    // 撒点
    graphicLayerABLL = new mars3d.layer.GraphicLayer({
      name: '安保力量',
      show: true,
    });
    window.map?.addLayer(graphicLayerABLL);
    pointArray?.map((itt: any) => {
      const position = new mars3d.LatLngPoint(itt?.lon, itt?.lat, Number(itt.height) || 0);
      const primitive = new mars3d.graphic.BillboardEntity({
        position: position,
        style: {
          image: itt?.minioFileUrl,
          width: 24,
          height: 24,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
          visibleDepth:false
        },
        attr: { ...itt },
        // name: `${item.vvideoId}++${item.vedioName}`,
        id: itt?.id,
      });
      graphicLayerABLL.addGraphic(primitive);
    });
    graphicLayerABLL.eachGraphic((graphic: any) => {
      const graphicData = graphic.options?.attr?.entity;
      if (graphicData) {
        const info = JSON.parse(graphicData || '{}').info?.self;
        innerHtml(info, graphic);
      }
    });
  };

  const fliterPoint = (item: any) => {
    curCode = item;
    window.sqxDataArr.forEach((sqxItem: any) => {
      if (sqxItem.name === '封闭区') {
        round1 = sqxItem.coordinates.map((a: any) => {
          return {
            x: a[0],
            y: a[1],
          };
        });
        round1.push(round1[0]);
      } else if (sqxItem.name === '控制区') {
        round2 = sqxItem.coordinates.map((a: any) => {
          return {
            x: a[0],
            y: a[1],
          };
        });
        round2.push(round2[0]);
      } else if (sqxItem.name === '分流区') {
        round3 = sqxItem.coordinates.map((a: any) => {
          return {
            x: a[0],
            y: a[1],
          };
        });
        round3.push(round3[0]);
      }
    });
    if (item?.name === '民警') {
      mapPoint(mjPoints);
    } else if (item?.name === '交警') {
      mapPoint(jjPoints);
    } else if (item?.name === '辅警') {
      mapPoint(fjPoints);
    } else if (item?.name === '保安') {
      mapPoint(baPoints);
    }
  };
  useEffect(() => {
    fliterPoint(curCode);
  }, [window.sqxDataArr]);
  useEffect(() => {
    if (!visiable) {
      window.map?.addLayer(graphicLayerABLL);
    } else {
      return;
    }
  }, [visiable]);
  return (
    <>
      {visiable && (
        <Row gutter={5} className={styles.popupListStyle} style={popupData.style}>
          <div className={styles.popupTitle}>{popupData.title}</div>
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
                        onClick={() => {
                          activeFun(item);
                          fliterPoint(item);
                        }}
                      >
                        <IconOrImage imgItem={item} />
                        <div className={styles.itemCon}>
                          <div className={styles.name}>{item.name}</div>
                          <div className={styles.numSty}>
                            {item.num}
                            {item.code === 'mj' ? `|${mjsum}` : ''}
                            {item.code === 'jj' ? `|${jjsum}` : ''}
                            {item.code === 'fj' ? `|${fjsum}` : ''}
                            {item.code === 'ba' ? `|${basum}` : ''}
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
        </Row>
      )}
    </>
  );
};
export default PopupAlert;
