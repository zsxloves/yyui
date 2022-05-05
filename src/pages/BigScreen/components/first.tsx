// import styles from './../index.less'
import React, { useEffect, useState } from 'react';
// import ScrollBoard from '@jiaminghi/data-view-react/es/scrollBoard';
import * as echarts from 'echarts';
import styles from './indexNew.less';
import { getDateDuring } from '@/utils/utilsJS';
import { Row, Col, Tabs ,Select} from 'antd';
import { getGuestPage, getDutyPage, arCompetionsQuery, arBusinfoQuery } from '@/services/bigScreen';
const { TabPane } = Tabs;
import img3 from '../image/icon4.png'
//定义props的类型
interface Props {
  dataConfig: any;
  refresh: any;
}
let ind: string = '3';
const FirstCard: React.FC<Props> = (props: any) => {
  const { refresh } = props;
  const [value,setValue]=useState<any>('3')
  const showPer = (data: any) => {
    const option = {
      title: {
        // text: '{a|' + 92 + '}{c|%}',
        text: '{a|' + ((parseInt(data.a) / parseInt(data.b)) * 100).toFixed(1) + '}{c|%}',
        subtext: '{a|今日验票率}',
        x: 'center',
        y: 'center',
        textStyle: {
          rich: {
            a: {
              fontSize: 18,
              color: '#ffffff',
            },
            c: {
              fontSize: 18,
              color: '#ffffff',
            },
          },
        },
        subtextStyle: {
          rich: {
            a: {
              fontSize: 12,
              color: 'rgba(255,255,255,0.8)',
              padding: [0, 0, -60, 0],
            },
          },
        },
      },
      grid: {
        left: '1%',
        right: '1%',
        top: '1%',
        bottom: '1%',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      calculable: true,
      series: [
        {
          name: '统计',
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['75%', '86%'],
          hoverAnimation: false,
          data: [
            {
              value: 10015,
              // value: 0,
              name: '到场人数',
              roundCap: true,
              itemStyle: {
                normal: {
                  color: '#00fee8',
                },
              },
              label: {
                normal: {
                  show: false,
                },
                emphasis: {
                  show: false,
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
                emphasis: {
                  show: false,
                },
              },
            },
            {
              value: 10869 - 10015,
              // value: 0,
              name: '缺席人数',
              itemStyle: {
                normal: {
                  color: '#272d4e',
                },
              },
              label: {
                normal: {
                  show: false,
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },
            },
          ],
        },
      ],
    };
    setTimeout(() => {
      const dom: any = document.getElementById('ticketsPercent-2');
      const alarmChart = echarts.init(dom);
      alarmChart.setOption(option);
    }, 1000);
  };
  // 获取值班
  const getDutyPageFun = () => {
    const hdId = window.hdObj?.id || '';
    // const dateStr = formatDate(new Date());
    const params = {
      queryObject: {
        page: 0,
        size: 99,
        ascending: false,
        propertyName: 'startTime',
        act: hdId,
      },
    };
    getDutyPage(params)
      .then((res: any) => {
        if (res.code === 200) {
          const list = res.result?.page?.content || [];
          let str = '';
          list.forEach((item: any) => {
            str += `<div class='ZBScroll'>
              <span class="li-6">${item.user}</span>
              <span class="li-11" title='${item.name}'>${item.name}</span>
              <span class="li-7">${item.phone}</span>
            </div>`;
          });
          $('#dutyScroll').html(str);
          $('#dutyScroll').liMarquee('destroy');
          const len: number = $('#dutyScroll')?.height() / 34;
          if (list.length > len) {
            $('#dutyScroll').addClass('canDrug');
            $('#dutyScroll').liMarquee({
              scrollamount: 20,
              direction: 'up',
            });
          } else {
            $('#dutyScroll').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  // 获取嘉宾
  const getGuestPageFun = () => {
    const paramDate = getDateDuring(window.hdObj.startTime, window.hdObj.endTime);
    // const dateStr = formatDate(new Date());
    const hdId = window.hdObj?.id || '';
    const params = {
      queryObject: {
        pageNumber: 1,
        pageSize: 99,
        // now: dateStr,
        enterTimeBegin: paramDate?.start,
        enterTimeEnd: paramDate?.end,
        actIds: [hdId],
      },
    };
    getGuestPage(params)
      .then((res: any) => {
        if (res.code === 200) {
          const list = res.data?.list || [];
          let str = '';
          list.forEach((item: any) => {
            str += `<div class='ZBScroll'>
              <span class="li-6">${item.name}</span>
              <span class="li-9" title='${item.job}'>${item.job}</span>
              <span class="li-9" title='${item.content}'>${item.content}</span>
            </div>`;
          });
          $('#guestScroll').html(str);
          $('#guestScroll').liMarquee('destroy');
          const len: number = $('#guestScroll')?.height() / 34;
          if (list.length > len) {
            $('#guestScroll').addClass('canDrug');
            $('#guestScroll').liMarquee({
              scrollamount: 20,
              direction: 'up',
            });
          } else {
            $('#guestScroll').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  // 获取赛事
  const getCompetionsPageFun = () => {
    const paramDate = getDateDuring(window.hdObj.startTime, window.hdObj.endTime);
    const hdId = window.hdObj?.id || '';
    const params = {
      pageNumber: 0,
      pageSize: 99,
      sortColumn: 'startTime',
      sortOrder: 'asc',
      // timeType: '1',
      startTimeBegin: paramDate?.start,
      startTimeEnd: paramDate?.end,
      activityIdList: [hdId],
    };
    arCompetionsQuery(params)
      .then((res: any) => {
        if (res.code === 200) {
          const list =
            res.data?.rows.map((item: any) => {
            item.startTime = item.startTime.substring(10);
            return item;
          }) || [];
          let str = '';
          list.forEach((item: any) => {
            str += `<div class='SSScroll'>
              <span class="li-9" style="padding-left:45px">${item.startTime}</span>
              <span class="li-15" title='${item.name}'>${item.name}</span>
            </div>`;
          });
          $('#competionsScroll').html(str);
          $('#competionsScroll').liMarquee('destroy');
          const len: number = $('#competionsScroll')?.height() / 32;
          if (list.length > len) {
            $('#competionsScroll').addClass('canDrug');
            $('#competionsScroll').liMarquee({
              scrollamount: 20,
              direction: 'up',
            });
          } else {
            $('#competionsScroll').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  // 获取班车
  const getBusPageFun = () => {
    const paramDate = getDateDuring(window.hdObj.startTime, window.hdObj.endTime);
    const params = {
      pageNumber: 0,
      pageSize: 99,
      sortColumn: 'startTime',
      sortOrder: 'desc',
      startTimeBegin: paramDate?.start,
      startTimeEnd: paramDate?.end,
      activeId: window.hdObj?.id,
    };
    arBusinfoQuery(params)
      .then((res: any) => {
        if (res.code === 200) {
          const list =
            res.data?.rows.map((item: any) => {
              item.startTime = item.startTime.substring(10);
              return item;
            }) || [];
          let str = '';
          list.forEach((item: any) => {
            str += `<div class='ZBScroll'>
              <span class="li-6">${item.startTime}</span>
              <span class="li-9" title='${item.name}'>${item.name}</span>
              <span class="li-9" title='${item.tame}'>${item.tame}</span>
            </div>`;
          });
          const len: number = $('#busScroll')?.height() / 34;
          $('#busScroll').html(str);
          $('#busScroll').liMarquee('destroy');
          if (list.length > len) {
            $('#busScroll').addClass('canDrug');
            $('#busScroll').liMarquee({
              scrollamount: 20,
              direction: 'up',
            });
          } else {
            $('#busScroll').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const changeTab = (key: any) => {
    ind = key;
    setValue(key)
    if (key === '1') {
      getDutyPageFun();
    } else if (key === '2') {
      showPer({ a: 1000, b: 800 });
    } else if (key === '3') {
      getCompetionsPageFun();
    } else if (key === '4') {
      getGuestPageFun();
    } else if (key === '5') {
      getBusPageFun();
    }
  };
  const initFun = () => {
    if (window.hdObj.id) {
      if (ind === '1') {
        getDutyPageFun();
      } else if (ind === '2') {
        showPer({ a: 1000, b: 800 });
      } else if (ind === '3') {
        getCompetionsPageFun();
      } else if (ind === '4') {
        getGuestPageFun();
      } else if (ind === '5') {
        getBusPageFun();
      }
    } else {
      setTimeout(() => {
        initFun();
      }, 500);
    }
  };
  useEffect(() => {
    console.log('模块1刷新了');
    initFun();
  }, [refresh]);
  return (
    <div className={styles.moduleWrapStyle}>
      <div className={styles.first}>
      <div className={styles.select}>
        <Select  suffixIcon={<img src={img3} alt="" />}
            className={[styles.section, styles.leftActive].join(' ')}
            value={value}
            onChange={changeTab}
          >
            <Select.Option value={'1'}>
            值班
            </Select.Option>
            <Select.Option value={'2'}>
            票务
            </Select.Option>
            <Select.Option value={'3'}>
            赛事
            </Select.Option>
            <Select.Option value={'4'}>
            嘉宾
            </Select.Option>
            <Select.Option value={'5'}>
            班车
            </Select.Option>
          </Select>
        </div>
        {value=='1'&&
          <div
          className={`${styles.policeInfo} ${styles.dutySty}`}
          style={{ height: '100%' }}
        >
          <Row className={styles.tableTitle}>
            <Col span={6}>值班人员</Col>
            <Col span={11}>值班名称</Col>
            <Col span={7}>联系方式</Col>
          </Row>
          <div className={styles.tableContent} id="dutyScroll" />
        </div>
        }
        {value=='2'&&<div className="leftTicketBoxSty">
            <div className="leftTicketSty">
              <div className="list-item">
                <div className="name" id="allBuyTicket">
                  共购票(张)
                </div>
                <div className="con">52869</div>
              </div>
              <div className="list-item">
                <div className="name">共验票(张)</div>
                <div className="con" id="allCheckTicket">
                  42869
                </div>
              </div>
              <div className="list-item">
                <div className="name">今日购票(张)</div>
                <div className="con" id="todayBuyTicket">
                  10869
                </div>
              </div>
              <div className="list-item">
                <div className="name">今日验票(张)</div>
                <div className="con" id="todayCheckTicket">
                  10015
                </div>
              </div>
            </div>
            <div style={{ width: '100px', height: '100%',marginTop: '20px' }}>
              <div id="ticketsPercent-2" style={{ width: '100%', height: '100%' }} />
            </div>
          </div>}
          {value=='3'&&
          <div
          className={`${styles.policeInfo} ${styles.dutySty}`}
          style={{ height: '165px' }}
        >
          <div className={styles.tableContentBox} style={{ height: '100%' }}>
            <div className={styles.ssLeft}></div>
            <div className={styles.tableContent} style={{ height: '100%' }} id="competionsScroll" />
          </div></div>}
          {value=='4'&&
            <div
              className={`${styles.policeInfo} ${styles.dutySty}`}
              style={{ height: '175px' }}
            ><div className={`${styles.topName} ${styles.topNameTwo}`}>今日嘉宾</div>
              <div
                className={styles.tableContent}
                id="guestScroll"
                style={{ height: 'calc(100%)' }}
              />
            </div>}
            {value=='5'&&
            <div
            className={`${styles.policeInfo} ${styles.dutySty}`}
            style={{ height: '180px' }}
          ><div className={`${styles.topName} ${styles.topNameTwo}`}>今日班车</div>
            <div className="tableContent" style={{ height: 'calc(100% - 45px)' }}>
            <div className={styles.tableContent} style={{ height: '100%',marginTop:'4px' }} id="busScroll" />
            </div>
          </div>}
      </div>
      {/* <Tabs defaultActiveKey="3" onChange={changeTab}>
        <TabPane tab="值班" key="1" style={{ height: '100%' }}>
          <div
            className={`${styles.policeInfo} ${styles.dutySty}`}
            style={{ height: '100%', marginTop: '10px' }}
          >
            <Row className={styles.tableTitle}>
              <Col span={6}>值班人员</Col>
              <Col span={11}>值班名称</Col>
              <Col span={7}>联系方式</Col>
            </Row>
            <div className={styles.tableContent} id="dutyScroll" />
          </div>
        </TabPane>
        <TabPane tab="票务" key="2" style={{ height: '100%' }}>
          <div className="leftTicketBoxSty">
            <div className="leftTicketSty">
              <div className="list-item">
                <div className="name" id="allBuyTicket">
                  共购票(张)
                </div>
                <div className="con">52869</div>
              </div>
              <div className="list-item">
                <div className="name">共验票(张)</div>
                <div className="con" id="allCheckTicket">
                  42869
                </div>
              </div>
              <div className="list-item">
                <div className="name">今日购票(张)</div>
                <div className="con" id="todayBuyTicket">
                  10869
                </div>
              </div>
              <div className="list-item">
                <div className="name">今日验票(张)</div>
                <div className="con" id="todayCheckTicket">
                  10015
                </div>
              </div>
            </div>
            <div style={{ width: '100px', height: '100%' }}>
              <div id="ticketsPercent-2" style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        </TabPane>
        <TabPane tab="赛事" key="3" style={{ height: '100%' }}>
          <div className="topName">今日赛事</div>
          <div className="tableContent" style={{ height: 'calc(100% - 45px)' }}>
            <div className={styles.tableContent} style={{ height: '100%' }} id="competionsScroll" />
          </div>
        </TabPane>
        <TabPane tab="嘉宾" key="4" style={{ height: '100%' }}>
          <div className="topName topNameTwo">今日嘉宾</div>
          <div className="tableContent" style={{ height: 'calc(100% - 45px)' }}>
            <div
              className={`${styles.policeInfo} ${styles.dutySty}`}
              style={{ height: '100%', marginTop: '10px' }}
            >
              <div
                className={styles.tableContent}
                id="guestScroll"
                style={{ height: 'calc(100%)' }}
              />
            </div>
          </div>
        </TabPane>
        <TabPane tab="班车" key="5" style={{ height: '100%' }}>
          <div className="topName topNameTwo">今日班车</div>
          <div className="tableContent" style={{ height: 'calc(100% - 45px)' }}>
            <div className={styles.tableContent} style={{ height: '100%' }} id="busScroll" />
          </div>
        </TabPane>
      </Tabs> */}
    </div>
  );
};
export default FirstCard;
