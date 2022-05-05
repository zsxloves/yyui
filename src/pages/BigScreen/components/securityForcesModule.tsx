import styles from './indexNew.less';
import React, { useEffect } from 'react';
import { Row, Timeline, Select } from 'antd';
import type { ItemData } from './data';
import img1 from '../image/icon1.png'
import img2 from '../image/icon2.png'
import img3 from '../image/icon4.png'
import * as echarts from 'echarts';
// import CountUp from 'react-countup';
//定义props的类型
interface Props {
  dataConfig: { height: string; list: ItemData[] };
  refresh?: any;
  // callBackUrl: (value: string[], type: string) => void;
  // callBackFace: (value: { id: string; name: string }) => void;
  // callBackVideoAR: (item: any) => void;
}
declare global {
  interface Window {
    clickPoint_jk: any;
  }
}

interface RefTypes {
  setAbDate: (flg: any) => void;
  searchLayerTc: () => void;
  getArVideos: (ids: string[]) => void;
  itemShowFlg: (code: string) => void;
}
const AnbaoCard = React.forwardRef<RefTypes, Props>((props, ref) => {
  const { dataConfig } = props;
  const showPer = () => {
    const option = {
      title: {
        text: '民警',
        x: '38%',
        y: '11%',
        subtext: '{a|' +parseInt('4252')   + '/}{c|'+parseInt('6803')+'}',
        textStyle: {
          color: '#ffffff',
          fontSize: 16,
        },
        subtextStyle: {
          rich: {
            a: {
              fontSize: 16,
              color: '#26caf6',
            },
            c: {
              fontSize: 16,
              color: '#ffffff',
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
      // tooltip: {
      //   trigger: 'item',
      //   formatter: '{a} <br/>{b} : {c} ({d}%)',
      // },
      calculable: true,
      series: [
        {
          name: '统计',
          type: 'pie',
          center: ['20%', '50%'],
          radius: ['84%', '68%'],
          hoverAnimation: false,
          data: [
            {
              value: 10015,
              // value: 0,
              name: '到场人数',
              roundCap: true,
              itemStyle: {
                normal: {
                  color: '#26caf6',
                  shadowBiur:30,
                  shadowColor:'rgba(38,202,246,0.2)',
                  shadowOffsetX:-4,
                  shadowOffsetY:4,
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
                  color: '#1c334f',
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
    const dom: any = document.getElementById('sforces-1');
    const alarmChart = echarts.init(dom);
    alarmChart.setOption(option);
  };
  const showPer1 = () => {
    const option = {
      title: {
        text: '辅警',
        x: '38%',
        y: '11%',
        subtext: '{a|' +parseInt('4252')   + '/}{c|'+parseInt('6803')+'}',
        textStyle: {
          color: '#ffffff',
          fontSize: 16,
        },
        subtextStyle: {
          rich: {
            a: {
              fontSize: 16,
              color: '#26caf6',
            },
            c: {
              fontSize: 16,
              color: '#ffffff',
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
      // tooltip: {
      //   trigger: 'item',
      //   formatter: '{a} <br/>{b} : {c} ({d}%)',
      // },
      calculable: true,
      series: [
        {
          name: '统计',
          type: 'pie',
          center: ['20%', '50%'],
          radius: ['84%', '64%'],
          hoverAnimation: false,
          data: [
            {
              value: 10015,
              // value: 0,
              name: '到场人数',
              roundCap: true,
              itemStyle: {
                normal: {
                  color: '#26caf6',
                  shadowBiur:30,
                  shadowColor:'rgba(38,202,246,0.2)',
                  shadowOffsetX:-4,
                  shadowOffsetY:4,
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
                  color: '#1c334f',
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
    const dom: any = document.getElementById('sforces-2');
    const alarmChart = echarts.init(dom);
    alarmChart.setOption(option);
  };
  useEffect(() => {
    showPer()
    showPer1()
  }, []);
  return (
    <Row gutter={5}>
      <div
        className={`${styles.itemBox}`}
        style={{ height: dataConfig.height + 'px' }}
      >
        <div className={styles.sforcesBox}>
          <div className={styles.select}>
            <span className={styles.span}></span>执勤
          </div>
          <div className={styles.sforcesChart}>
            <div className={styles.sforcesChartBox} id="sforces-1"></div>
            <div className={styles.sforcesChartBox} id="sforces-2"></div>
          </div>
          <div className={styles.boxb}>
          <div className={styles.item}>
            <div className={styles.iconl}>
            </div>
            <div className={styles.right}>
              <span className={styles.name}>保安</span>
              <span className={styles.num}>1546</span>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.iconr}>
            </div>
            <div className={styles.right}>
              <span className={styles.name}>志愿者</span>
              <span className={styles.num}>2322</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Row>
  );
});
export default AnbaoCard;
