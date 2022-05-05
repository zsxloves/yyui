/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-empty-interface */
import stylesNew from './indexNew.less';
import styles from './index.less';
import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import LineChart from './LineChart';
import { getCount, getPage, getLine } from '@/services/bigScreen';
import { Popover } from 'antd';
import { checkPointInPolygon2D } from '@/utils/utilsJS';
import ApngComponent from 'react-apng';
//定义props的类型
interface Props {
  showDealMore: (falg?: boolean) => void;
  alarmDeal: (obj?: any) => void;
  dataConfig: any;
  refresh?: string | number;
}
interface alarmType {
  icon: string;
  categoryName: string;
  quantity: number;
  color: string;
  category: string;
  [key: string]: any;
}
interface alarmList {
  icon: string;
  alarmTime: string;
  state: string;
  color: string;
  category: string | number;
  message: string;
  [key: string]: any;
}
declare global {
  interface Window {
    alarmDealWin: any;
  }
}
const iconObj = {
  '01': 'icon-renlianshibieyujing',
  '02': 'icon-cheliangyujing',
  '16': 'icon-changguanneibuzhongdianquyuyujing',
  '05': 'icon-jinggaiweiyiyujing',
  '07': 'icon-wupinanjianyujing',
  '04': 'icon-chuanyuehulanyujing',
  '10': 'icon-wurenjifanzhi',
};
let timer: any = null;
interface RefTypes {
  getPageFun: () => void;
}
const RealTimeAlarm = React.forwardRef<RefTypes, Props>((props, ref) => {

  const { dataConfig, alarmDeal, showDealMore, refresh } = props;
  const [alarmType, setAlarmType] = useState<alarmType[]>([]); // 所有预警类型
  const [alarmList, setAlarmList] = useState<alarmList[]>([]); // 预警列表
  const [alarmFirst, setAlarmFirst] = useState<any>(); // 预警列表第一条
  const [chartData, setChartData] = useState<any>();

  const category = useRef<string>(); // 预警类型
  const isDeal = useRef<string>(); //预警状态
  const isRead = useRef<string>(); //预警状态


  window.alarmDealWin = (id: string) => {
    const item = alarmList.find((val) => {
      return val.id === id;
    });
    alarmDeal(item);
  };
  // 获取预警类型
  const getCountFun = () => {
    const params = {
      queryObject: {
        polygon: window.polygon,
        // start: '2022-01-09 00:00:00',
        // end: '2022-01-10 00:00:00',
      },
    };
    getCount(params)
      .then((res: any) => {
        if (res.code === 200) {
          const data = res?.result?.result || [];
          const newData = dataConfig.list.map((item: alarmType) => {
            const currObj = data.find((val: alarmType) => {
              return val.category === item.category;
            });
            if (currObj) {
              item.hasUnread = currObj?.hasUnread;
              item.quantity = currObj.quantity;
              if (category.current === currObj.category) {
                item.active = true;
              } else {
                item.active = false;
              }
            }
            if (item.category === '01' && currObj && Array.isArray(currObj?.colorGroup)) {
              currObj.colorGroup.forEach((ite: any) => {
                if (ite.color === 'red') {
                  item.quantity1 = ite.quantity;
                } else if (ite.color === 'yellow') {
                  item.quantity2 = ite.quantity;
                } else if (ite.color === 'green') {
                  item.quantity3 = ite.quantity;
                }
              });
            }
            return item;
          });
          setAlarmType(newData);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  // 获取预警类型
  const getPageFun = () => {
    const params = {
      queryObject: {
        page: 1,
        size: 1000,
        polygon: window.polygon,
        category: category.current,
        isDeal: isDeal.current,
        isRead: isRead.current
        // start: '2022-01-09 00:00:00',
        // end: '2022-01-10 00:00:00',
      },
    };

    getPage(params)
      .then((res: any) => {
        if (res.code === 200) {
          const data = res?.result?.page?.content || [];
          setAlarmList(data.slice(1));
          let str = '';
          $('#alarmListScroll').empty();
          let round1: any[] = []; // 封闭区
          let round2: any[] = []; // 控制区
          let round3: any[] = []; // 分流区
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
          const firstD = data[0] || {};
          const posF = {
            longitude: firstD?.lon,
            latitude: firstD?.lat,
            height: 0,
          };
          if (checkPointInPolygon2D(posF, round1)) {
            firstD.color = 'red-sqx';
          } else if (checkPointInPolygon2D(posF, round2)) {
            firstD.color = 'yellow-sqx';
          } else if (checkPointInPolygon2D(posF, round3)) {
            firstD.color = 'blue-sqx';
          }
          if (data.length === 0) {
            setAlarmFirst(false);
          } else {
            setAlarmFirst(firstD);
          }
          data.slice(1).forEach((item: any) => {
            // let colorBg = item.color
            let colorBg = '';
            const pos = {
              longitude: item?.lon,
              latitude: item?.lat,
              height: 0,
            };
            if (checkPointInPolygon2D(pos, round1)) {
              colorBg = 'red-sqx';
            } else if (checkPointInPolygon2D(pos, round2)) {
              colorBg = 'yellow-sqx';
            } else if (checkPointInPolygon2D(pos, round3)) {
              colorBg = 'blue-sqx';
            } else {
              colorBg = item.color;
            }
            str += `<div
                      class="item ${colorBg + '-bg'}"}
                      onClick="alarmDealWin('${item.id}')"
                    >
                      <div class="left-icon">
                        <i class="iconfont ${iconObj[item.category]}" />
                      </div>
                      <div class="alarm-center">
                        <div class="row1">
                          <span class="alarm-time">${item.alarmTime}</span>
                          <span class="mark" style="display:${item.state == '0' ? 'inline-block' : 'none'
              }">待处理</span>
              <span class="mark" style="display:${item.isRead == '0' ? 'inline-block' : 'none'
              }">待查看</span>
                        </div>
                        <div class="alarm-text" title="${item.message}">
                          ${item.message}
                        </div>
                      </div>
                    </div>`;
            // str += `<div
            //           class="item ${colorBg + '-bg'}"}
            //           onClick="alarmDealWin('${item.id}')"
            //         >
            //           <div class="alarm-center">
            //             <div class="row1">
            //               <span class="alarm-time">${item.alarmTime}</span>
            //             </div>
            //             <div class="alarm-text" title="${item.message}">
            //               <span class="alarm-text-min">${item.message}</span>
            //               <span class="mark" style="display:${
            //                 item.state == '0' ? 'inline-block' : 'none'
            //               }">待处理</span>
            //             </div>
            //           </div>
            //         </div>`;
          });
          $('#alarmListScroll').append(str);
          setTimeout(() => {
            $('#alarmListScroll').liMarquee('destroy');
            const len: number = $('#alarmListScroll')?.height() / 58;
            if (data.length > len) {
              $('#alarmListScroll').addClass('canDrug');
              $('#alarmListScroll').liMarquee({
                scrollamount: 15,
                direction: 'up',
              });
            } else {
              $('#alarmListScroll').removeClass('canDrug');
            }
          }, 1000);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  useImperativeHandle(ref, () => ({
    getPageFun,
  }));
  // 获取预警图表数据
  const getAlarmChartData = () => {
    const params = {
      queryObject: {
        polygon: window.polygon,
        category: category.current,
        // start: '2022-01-09 00:00:00',
        // end: '2022-01-10 00:00:00',
      },
    };
    getLine(params)
      .then((res: any) => {
        if (res.code === 200) {
          const data = res?.result?.result;
          const dataLen: string[] = [];
          let yAxisData1: number[] = [];
          let yAxisData2: number[] = [];
          data?.data.forEach(
            (item: { label: string; id: string; quantity: number[] }, index: number) => {
              dataLen.push(item.label);
              if (index === 0) {
                yAxisData1 = item.quantity;
              } else if (index === 1) {
                yAxisData2 = item.quantity;
              }
            },
          );
          setChartData({
            dataLen,
            xAxisData: data.time,
            yAxisData1,
            yAxisData2,
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const initAlarm = () => {
    getCountFun();
    getPageFun();
    getAlarmChartData();
  };
  const initAlarmFirst = () => {
    if (window.cjObj.id) {
      setTimeout(() => {
        getCountFun();
        getPageFun();
        getAlarmChartData();
      }, 200);
    } else {
      setTimeout(() => {
        initAlarmFirst();
      }, 300);
    }
  };
  // 定时
  const setIntervalFun = () => {
    clearInterval(timer);
    timer = setInterval(() => {
      initAlarm();
    }, 1000 * 1000000);
  };
  const activeFun = (itemObj: any) => {
    const type = itemObj.category;
    const newList = JSON.parse(JSON.stringify(alarmType));
    const newCategory = category.current === type ? null : type;
    category.current = newCategory;
    setAlarmType(
      newList.map((item: any) => {
        item.active = newCategory === null ? false : item.category === type;
        return item;
      }),
    );
    getPageFun();
    getAlarmChartData();
    setIntervalFun();
  };
  const filterStatus = (type: string) => {
    isRead.current = '';
    const newType = isDeal.current === type ? '' : type;
    isDeal.current = newType;
    getPageFun();
    setIntervalFun();
  };
  const filterRead = (type: string) => {
    isDeal.current = '';
    isRead.current = type;
    getPageFun();
    setIntervalFun();
  };

  useEffect(() => {
    setAlarmType(dataConfig.list);
    initAlarmFirst();
    setIntervalFun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);
  return (
    <div
      key={refresh}
      className={stylesNew.moduleWrapStyle}
      style={{ height: 'calc(100% - 42px)', display: 'flex', flexDirection: 'column' }}
    >
      <div className={stylesNew.faceAlarmNum}>
        {alarmType.length > 0 &&
          alarmType.map((item: alarmType, index: number) => {
            if (item.show) {
              if (item.category === '0') {
                return (
                  <Popover
                    key={index}
                    placement="rightTop"
                    title=""
                    color="rgba(3, 10, 52, 0.87)"
                    overlayClassName="facePopover"
                    content={() => {
                      return (
                        <>
                          <div className="item first">{item.quantity1}</div>
                          <div className="item two">{item.quantity2}</div>
                          <div className="item three">{item.quantity3}</div>
                        </>
                      );
                    }}
                  >
                    <div
                      className={`${stylesNew.alarm} ${item.active ? stylesNew.active : ''}`}
                      onClick={() => activeFun(item)}
                    >
                      {/* <i
                        className={`${item.icon} iconfont ${styles.icon}`}
                        style={{ color: item.color }}
                      /> */}
                      <div style={{ width: '46px', position: 'relative' }}>
                        <img
                          src={require(`../image/${item.icon}.png`)}
                          alt=""
                          className={stylesNew.img}
                        />
                        <ApngComponent autoPlay src={require(`../image/apng/bg.png`)} />
                      </div>
                      <div className={stylesNew.itemCon}>
                        <div className={stylesNew.name}>{item.categoryName}</div>
                        <div className={stylesNew.numSty}>{item.quantity}</div>
                      </div>
                    </div>
                  </Popover>
                );
              } else {
                return (
                  <div
                    key={index}
                    className={`${stylesNew.alarm} ${item.active ? stylesNew.active : ''}`}
                    onClick={() => activeFun(item)}
                  >
                    {/* <i
                      className={`${item.icon} iconfont ${styles.icon}`}
                      style={{ color: item.color }}
                    /> */}
                    <div style={{ width: '46px', position: 'relative' }}>
                      <img
                        src={require(`../image/${item.icon}.png`)}
                        alt=""
                        className={stylesNew.img}
                      />
                      <ApngComponent autoPlay src={require(`../image/apng/bg.png`)} />
                    </div>
                    <div className={stylesNew.itemCon}>
                      <div className={stylesNew.name}>{item.categoryName}
                        {item?.hasUnread &&
                          <span style={{ 'marginLeft': '5px', 'lineHeight': '20px', 'display': 'inline-block', 'width': '7px', 'height': '7px', 'borderRadius': '50%', 'background': 'red' }} />}
                      </div>
                      <div className={stylesNew.numSty}>{item.quantity}</div>
                    </div>
                  </div>
                );
              }
            } else {
              return;
            }
          })}
      </div>
      <div className={styles.secondTitle}>
        <span>预警列表</span>
        <span
          className={styles.more}
          onClick={() => {
            showDealMore(false);
          }}
        >
          更多
        </span>
        <div className={`${styles.btnFilter} ${styles.btnFilter1}`}>
          <div
            className={`${styles.btn} ${isDeal.current === '1' ? styles.active : ''}`}
            onClick={() => filterStatus('1')}
          >
            已处理
          </div>
          <div
            className={`${styles.btn} ${isDeal.current === '0' ? styles.active : ''}`}
            onClick={() => filterStatus('0')}
          >
            待处理
          </div>
        </div>
        <div className={`${styles.btnFilter} ${styles.btnFilter1}`} style={{ 'marginLeft': '2px' }}>
          <div
            className={`${styles.btn} ${isRead.current === '1' ? styles.active : ''}`}
            onClick={() => filterRead('1')}
          >
            已查看
          </div>
          <div
            className={`${styles.btn} ${isRead.current === '0' ? styles.active : ''}`}
            onClick={() => filterRead('0')}
          >
            待查看
          </div>
        </div>
      </div>
      <div className={styles.alarmList}>
        {alarmFirst?.message && (
          <div
            style={{ marginBottom: '10px' }}
            className={alarmFirst?.state == '0' ? 'firstMark1' : ''}
          >
            <div
              className={`item ${alarmFirst.color + '-bg'}`}
              onClick={() => {
                if (window.map) {
                  alarmDeal(alarmFirst);
                }
              }}
            >
              <div className="left-icon">
                <i className={`iconfont ${iconObj[alarmFirst.category]}`} />
              </div>
              <div className="alarm-center">
                <div className="row1">
                  <span className="alarm-time">{alarmFirst.alarmTime}</span>
                  {alarmFirst.state == '0' && <span className="mark">待处理</span>}
                  {alarmFirst.isRead == '0' && <span className="mark">待查看</span>}
                </div>
                <div className="alarm-text" title={alarmFirst.message}>
                  <span className="alarm-text-min">{alarmFirst.message}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div id="alarmListScroll" />
      </div>
      {dataConfig.showChart && (
        <div className={styles.alarmChart} style={{ paddingBottom: '5px', height: '130px' }}>
          <LineChart chartData={chartData} />
        </div>
      )}
    </div>
  );
});
export default RealTimeAlarm;
