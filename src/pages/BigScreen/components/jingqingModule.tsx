/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import '@/style/common.less';
// import CommonStyle from '@/components/styleCommon'
import React, { useState, useEffect } from 'react';
import { Row, Col, Modal } from 'antd';
// import $ from "jquery"
import { getAllJJD, getAllFKD, getOrgDetail, jjdRead } from '@/services/bigScreen';
import { getBJLXLB, checkPointInPolygon2D } from '@/utils/utilsJS';
import { DatePicker } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
//定义props的类型
interface Props {
  dataConfig: any;
  refresh: number;
}
declare global {
  interface Window {
    flyToAlarmJQ: any;
    handleDetailJQ: any;
    setGraphicLayerJQ: any;
  }
}
const itemObj: any = {};
let timer: any = null;
let graphicLayerJQ: any = null; // 警情图层
const JingqingCard: React.FC<Props> = (props) => {
  const { refresh } = props;
  const [poloceList, setPoliceList] = useState<any[]>([]);
  const [centerView, setCenterView] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [cjList, setCjList] = useState<any[]>([]); // 处警
  const [alarmInfo, setAlarmInfo] = useState<any>({});
  const [alarmFirst, setAlarmFirst] = useState<any>(); // 警情列表第一条
  const [selfTime, setSelfTime] = useState<any>([]);
  const [noReadNum, setNoReadNum] = useState<number>(0);

  window.flyToAlarmJQ = (lng: any, lat: any) => {
    window.map.centerAt({ ...centerView, lat, lng });
  };
  window.handleDetailJQ = (id: string) => {
    const params = {
      jjdbh: itemObj[id].jjdbh,
    };
    getAllFKD(params)
      .then((res: any) => {
        if (res.code === 200) {
          const typeList = res.result.result || [];
          setCjList(typeList);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
    setVisible(true);
    setAlarmInfo(itemObj[id]);
  };

  // 数据处理
  const dataDeal = (list: any[], listFirst?: any) => {
    const newList: any[] = [];
    if (listFirst) {
      setAlarmFirst(listFirst);
      $('#scrollFirst').html(`<div class="JQScroll jingqingScroll" onClick="setGraphicLayerJQ('${
        listFirst.jjdbh
      }')">
        <span class="li-3 colIndex">
          <span>${listFirst.index}</span>
        </span>
        <span class="li-5">${listFirst.bjsj?.split(' ')[1] || ''}</span>
        <span class="li-6">${listFirst.bjlbmc}</span>
        <span class="li-10 colItem" title="${listFirst.bjnr}">${listFirst.bjnr}</span>
      </div>`);
      newList.push(listFirst);
      itemObj[listFirst.jjdbh] = listFirst;
    } else {
      $('#scrollFirst').empty();
    }
    list.forEach((item: any) => {
      itemObj[item.jjdbh] = item;
    });
    list.forEach((item: any, index: number) => {
      let flg = false;
      if (index === 0) {
        const tim = item.bjsj?.split(' ')[0];
        const val = {
          isTitle: true,
          title: tim,
          index: tim,
        };
        newList.push(val);
      } else if (index < list.length - 1) {
        if (list[index].bjsj.split(' ')[0] !== list[index - 1].bjsj.split(' ')[0]) {
          flg = true;
        }
      }
      if (flg && list[index]) {
        const tim = list[index].bjsj?.split(' ')[0];
        const val = {
          isTitle: true,
          title: tim,
          index: tim,
        };
        newList.push(val);
      }
      newList.push(item);
    });
    setPoliceList(newList);
    let str = '';
    newList.forEach((item: any) => {
      if (!item.isTitle) {
        str += `<div class="ZBScroll jingqingScroll pointer" onClick="setGraphicLayerJQ('${
          item.jjdbh
        }')">
          <span class="li-3 colIndex">
            <span>${item.index}</span>
          </span>
          <span class="li-5">${item.bjsj?.split(' ')[1] || ''}</span>
          <span class="li-6">${item.bjlbmc}</span>
          <span class="li-10 colItem" title="${item.bjnr}">${item.bjnr}</span>
        </div>`;
      } else {
        str += `<div class="ZBScroll jingqingTip"}>
          <span class="li-24" style="font-size: 14px">
            以下是<span class="tipColor"> ${item.title} </span>数据
          </span>
        </div>`;
      }
    });
    $('#scroll').html(str);
    $('#scroll').liMarquee('destroy');
    const len: number = $('#scroll')?.height() / 34;
    if (newList.length > len) {
      $('#scroll').addClass('canDrug');
      $('#scroll').liMarquee({
        scrollamount: 30,
        direction: 'up',
      });
    } else {
      $('#scroll').removeClass('canDrug');
    }
  };
  // 获取警情列表
  const getDealRecard = (dwdmList: string[]) => {
    console.log('dwdmList', dwdmList);
    const params: any = {
      day: 1,
      dwdmList, //: ['330109840000'], //管辖单位
    };
    if (selfTime[0]) {
      params.begin = selfTime[0];
      params.end = selfTime[1];
    }
    getAllJJD(params)
      .then((res: any) => {
        if (res.code === 200) {
          const newType: any[] = [];
          let keyIndex = 0;
          res.result?.result?.map((item: any) => {
            item.bjlbmc = getBJLXLB(item.bjlbdm);
            item.bjlxmc = getBJLXLB(item.bjlxdm);
            const pos = {
              longitude: item.dhdwjd,
              latitude: item.dhdwwd,
              height: 0,
            };
            //前台判断点
            if (checkPointInPolygon2D(pos, window.polygon)) {
              keyIndex++;
              item.index = keyIndex;
              newType.push(item);
            }
            return item;
          });
          const len = newType.filter((ite: any) => {
            return ite.state === '0';
          }).length;
          setNoReadNum(len);
          dataDeal(newType.slice(1), newType[0]);
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
        // console.log(err)
      });
  };
  const initFun = () => {
    if (window.cjObj.organizationId) {
      const organizationId = window.cjObj.organizationId;
      if (organizationId) {
        getOrgDetail({ id: organizationId })
          .then((res) => {
            if (res.code === 200) {
              const info = res.result.detail || {};
              const stop = info.code.length - 2;
              const code = info.code.substring(0, stop);

              getDealRecard([code]);
            }
          })
          .catch((err) => {
            console.log(err.message)
            // message.error(err.message);
          });
      }
    } else {
      setTimeout(() => {
        initFun();
      }, 1000);
    }
  };
  // 定时
  const setIntervalFun = () => {
    clearInterval(timer);
    initFun();
    timer = setInterval(() => {
      initFun();
    }, 1000 * 60 * 10);
  };
  const addFeature = (graphicLayer: any, arr: any, ite?: any) => {
    graphicLayer.on(mars3d.EventType.click, function (event: any) {
      const graphic = event.graphic;
      if (graphic.attr?.jjdbh) {
        jjdRead({ refId: graphic.attr?.jjdbh })
          .then(() => {
            setIntervalFun();
          })
          .catch();
      }
    });
    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i];
      if (item.isTitle || !item.dhdwjd || !item.dhdwwd) {
        continue;
      }
      const position = new mars3d.LatLngPoint(item.dhdwjd, item.dhdwwd, item.height || 0);
      const primitive = new mars3d.graphic.BillboardEntity({
        position: position,
        style: {
          image: '/img/jingqing.png',
          scale: 0.5,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
          visibleDepth:false
        },
        attr: item,
        id: item.id,
      });

      graphicLayer.bindPopup(
        function (event: any) {
          const attr = event.graphic?.attr;
          const html = `<div class="popupJQ">
                          <div class="row"><span class="name">报警电话：</span><span class="con">${attr.bjdh}</span></div>
                          <div class="row"><span class="name">报警时间：</span><span class="con">${attr.bjsj}</span></div>
                          <div class="row"><span class="name">报警类别：</span><span class="con">${attr.bjlbmc}</span></div>
                          <div class="row"><span class="name">报警类型：</span><span class="con">${attr.bjlxmc}</span></div>
                          <div class="row"><span class="name">报警内容：</span><span class="con">${attr.bjnr}</span></div>
                          <div class="footerBtn">
                            <div class="btn btnDetail" onclick="handleDetailJQ('${attr.jjdbh}')">详情</div>
                            <div class="btn btnDW" onclick="flyToAlarmJQ('${attr.dhdwjd}','${attr.dhdwwd}')">定位</div>
                          </div>
                        </div>`;
          return html;
        },
        {
          direction: 'top',
          offsetY: -30,
        },
      );
      graphicLayer.addGraphic(primitive);
      if (ite && item.index === ite.index) {
        primitive.openPopup();
        window.map.centerAt({ ...centerView, lat: item.dhdwwd, lng: item.dhdwjd });
      }
    }
    window.changeLayer();
    // graphicLayer.bindTooltip(
    //   function (event: any) {
    //     const item = event.graphic?.attr;
    //     if (!item) {
    //       return false;
    //     }
    //     const innerTooltip = `<div>${item.deviceName}</div>`;
    //     return innerTooltip;
    //   },
    //   {
    //     direction: 'top',
    //     offsetY: -30,
    //   },
    // );
  };
  window.setGraphicLayerJQ = (id?: any) => {
    const item = id ? itemObj[id] : null;
    console.log('jjdbh:', id, item);
    if (!$('.isClick[data-code="jingqingxinxi"]').hasClass('visiableSecurity')) {
      $('.isClick[data-code="jingqingxinxi"]').addClass('visiableSecurity');
    }
    if (graphicLayerJQ) window.map.removeLayer(graphicLayerJQ);
    graphicLayerJQ = new mars3d.layer.GraphicLayer({
      clustering: {
        enabled: false,
      },
      name: '警情',
      show: true,
    });
    window.map.addLayer(graphicLayerJQ);
    // setCenterView(window.map.getCameraView());
    setCenterView(JSON.parse(window.cjObj.views||"[]"));
    addFeature(graphicLayerJQ, poloceList, item);
    if (id) {
      jjdRead({ refId: item?.jjdbh })
        .then(() => {
          setIntervalFun();
        })
        .catch();
    }
  };

  // useEffect(() => {
  //   const list = [
  //     {
  //       index: 1,
  //       bjsj: '2021-12-16 12:22:33',
  //       bjlbdm: '治安',
  //       bjlbmc: '治安',
  //       bjlxdm: '类型',
  //       bjlxmc: '类型',
  //       bjnr: '内容方法士大夫快进到和撒娇开发0',
  //       bjdh: 18799090909,
  //       jjdbh: '330109032',
  //       dhdwjd: 120.233532,
  //       dhdwwd: 30.23578,
  //       xxaj: 1,
  //     },
  //     {
  //       index: 2,
  //       bjsj: '2021-12-17 22:12:12',
  //       bjlbdm: '治安',
  //       bjlbmc: '治安',
  //       bjlxdm: '类型',
  //       bjlxmc: '类型',
  //       bjnr: '内容方法士大夫快进到和撒娇开发0',
  //       bjdh: 18799090909,
  //       jjdbh: '330109032',
  //       dhdwjd: 120.234532,
  //       dhdwwd: 30.23578,
  //       xxaj: 1,
  //       state: '0',
  //     },
  //     {
  //       index: 3,
  //       bjsj: '2021-12-17 12:24:21',
  //       bjlbdm: '治安',
  //       bjlbmc: '治安',
  //       bjlxdm: '类型',
  //       bjlxmc: '类型',
  //       bjnr: '内容方法士大夫快进到和撒娇开发0',
  //       bjdh: 18799090909,
  //       jjdbh: '330109032',
  //       dhdwjd: 120.235532,
  //       dhdwwd: 30.23578,
  //       xxaj: 1,
  //     },
  //     {
  //       index: 4,
  //       bjsj: '2021-12-18 12:24:21',
  //       bjlbdm: '治安',
  //       bjlbmc: '治安',
  //       bjlxdm: '类型',
  //       bjlxmc: '类型',
  //       bjnr: '内容方法士大夫快进到和撒娇开发0',
  //       bjdh: 18799090909,
  //       jjdbh: '330109032',
  //       dhdwjd: 120.236532,
  //       dhdwwd: 30.23578,
  //       xxaj: 1,
  //     },
  //     {
  //       index: 5,
  //       bjsj: '2021-12-18 12:24:21',
  //       bjlbdm: '治安',
  //       bjlbmc: '治安',
  //       bjlxdm: '类型',
  //       bjlxmc: '类型',
  //       bjnr: '内容方法士大夫快进到和撒娇开发0',
  //       bjdh: 18799090909,
  //       jjdbh: '330109032',
  //       dhdwjd: 120.234532,
  //       dhdwwd: 30.23578,
  //       xxaj: 1,
  //     },
  //     {
  //       index: 6,
  //       bjsj: '2021-12-19 12:24:21',
  //       bjlbdm: '治安',
  //       bjlbmc: '治安',
  //       bjlxdm: '类型',
  //       bjlxmc: '类型',
  //       bjnr: '内容方法士大夫快进到和撒娇开发0',
  //       bjdh: 18799090909,
  //       jjdbh: '330109032',
  //       dhdwjd: 120.234532,
  //       dhdwwd: 30.23578,
  //       xxaj: 1,
  //     },
  //   ];
  //   const len = list.filter((ite: any) => {
  //     return ite.state === '0';
  //   }).length;
  //   setNoReadNum(len);
  //   dataDeal(list.slice(1), list[0]);
  // }, []);
  useEffect(() => {
    console.log('模块7刷新了');
    setIntervalFun();
    if ($('.isClick[data-code="jingqingxinxi"]').hasClass('visiableSecurity')) {
      window.setGraphicLayerJQ();
    } else {
      if (graphicLayerJQ) window.map.removeLayer(graphicLayerJQ);
      window.changeLayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);
  useEffect(() => {
    if (selfTime.length > 0) {
      setIntervalFun();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfTime]);
  const level = {
    1: '一般',
    2: '紧急',
    3: '危急',
  };
  return (
    <>
      <div className={styles.JQTop}>
        <div className={styles.left}>
          <div className={styles.all}>总：{poloceList.length}</div>
          <div className={styles.read}>待：{noReadNum}</div>
        </div>
        <div className={styles.timeFilter}>
          <div className={styles.text}>
            时间选择
            <CaretDownOutlined style={{ marginLeft: '5px' }} />
          </div>
          <RangePicker
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              opacity: 0,
              cursor: 'pointer',
            }}
            showTime
            onChange={(val, str) => {
              setSelfTime(str);
            }}
          />
        </div>
      </div>
      <div className={styles.policeInfo} style={{ height: 'calc(100% - 42px)' }}>
        <Row className={styles.tableTitle}>
          <Col span={3} className={styles.colIndex}>
            序号
          </Col>
          <Col span={5}>报警时间</Col>
          <Col span={6}>类别</Col>
          <Col span={10}>报警内容</Col>
        </Row>
        <div id="scrollFirst" className={alarmFirst?.state === '0' ? 'firstMark' : ''} />
        <div className={styles.tableContent} id="scroll" />
        <Modal
          width={1000}
          mask={false}
          bodyStyle={{ padding: '0' }}
          style={{ top: '20vh' }}
          destroyOnClose
          maskClosable={false}
          title={false}
          className="bigPopup"
          visible={visible}
          footer={false}
          onCancel={() => {
            setVisible(false);
          }}
        >
          <div className="info-detail_drag">
            {/* <CommonStyle /> */}

            <div className="left">
              <div className="title">接警详情</div>
              <div className="leftContent">
                <div className="info_key">
                  <span>级别：</span>
                  <span>{level[alarmInfo.xxaj] || '一般'}</span>
                </div>
                <div className="info_key">
                  <span>警情号码：</span>
                  <span>{alarmInfo.jqhm || '无'}</span>
                </div>
                <div className="info_key">
                  <span>接警单位：</span>
                  <span>{alarmInfo.jjdwmc || '无'}</span>
                </div>
                <div className="info_key">
                  <span>接警员：</span>
                  <span>{alarmInfo.jjyxm || '无'}</span>
                </div>
                <div className="line" />
                <div className="info_key">
                  <span>报警电话：</span>
                  <span>{alarmInfo.bjdh || '无'}</span>
                </div>
                <div className="info_key">
                  <span>报警时间：</span>
                  <span>{alarmInfo.bjsj || '无'}</span>
                </div>
                <div className="info_key">
                  <span>报警类别：</span>
                  <span>{alarmInfo.bjlbmc}</span>
                </div>
                <div className="info_key">
                  <span>报警类型：</span>
                  <span>{alarmInfo.bjlxmc}</span>
                </div>
                <div className="info_key">
                  <span>报警内容：</span>
                  <span>{alarmInfo.bjnr}</span>
                </div>
              </div>
            </div>
            <div className="right" style={{ height: '60vh' }}>
              <div className="title">处警反馈详情</div>
              <div className="rightContent">
                {cjList.length > 0 &&
                  cjList.map((item: any) => (
                    <div className="rightContentItem" key={item.name}>
                      <div className="info_key">
                        <span>反馈单位：</span>
                        <span>{item.fkdwmc || '无'}</span>
                      </div>
                      <div className="info_key">
                        <span>反馈人：</span>
                        <span>{item.fkrxm || '无'}</span>
                      </div>
                      <div className="info_key">
                        <span>反馈时间：</span>
                        <span>{item.fksj || '无'}</span>
                      </div>
                      <div className="info_key">
                        <span>处警情况：</span>
                        <span>{item.cjqk || '无'}</span>
                      </div>
                    </div>
                  ))}
                {cjList.length === 0 && <div className="no-date">暂无处警信息</div>}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
export default JingqingCard;
