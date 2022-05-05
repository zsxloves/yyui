import styles from './indexNew.less';
import React,{useEffect } from 'react';
import { Row, Timeline, Select,DatePicker } from 'antd';
import * as echarts from 'echarts';
import type { ItemData } from './data';
import img1 from '../image/icon1.png'
import img2 from '../image/icon2.png'
import img3 from '../image/icon4.png'

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
const showPer = (echartData:any) => {
  const option = {
    color: ['#39cdd6', '#0f49e5'],
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          formatter: '',
          // formatter: '{value}',
          textStyle: {
            color: 'rgba(255,255,255,0.6)',
          },
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(98,132,146,1)',
          },
        },
        axisTick: {
          show: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        minInterval: 1,
        axisLabel: {
          show:false,
          textStyle: {
            color: 'rgba(255,255,255,0.6)',
          },
        },
        nameTextStyle: {
          color: 'rgba(255,255,255,0.5)',
          fontSize: 12,
          lineHeight: 10,
          padding: [20, 40, 0, 0],
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(32,60,51,0.6)',
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '',
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          normal: {
            color: '#3ee0e9',
          },
        },
        areaStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(62, 224, 233, 0.9)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(51, 145, 254, 0)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
        data: echartData.yAxisData1,
      },
      {
        name: '',
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          normal: {
            color: '#0e43d4',
          },
        },
        areaStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(14, 67, 212, 0.9)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(0, 255, 245, 0)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
        data: echartData.yAxisData2,
      },
    ],
  };
    const dom: any = document.getElementById('personF-1');
    const alarmChart = echarts.init(dom);
    alarmChart.setOption(option);
  };
  useEffect(() => {
    const data={
      yAxisData1:[3,1,4,5],
      yAxisData2:[2,2,6,4]
    }
    showPer(data)
  }, []);
  return (
    <Row gutter={5}>
      <div
        className={`${styles.itemBox}`}
        style={{ height: dataConfig.height + 'px' }}
      >
        <div className={styles.personFlowBox}>
          <div className={styles.select}>
            <Select suffixIcon={<img src={img3} alt="" />}
              className={[styles.section, styles.leftActive].join(' ')}
              value={'val.id'}
              onChange={(e) => {
                // setHd(e);
              }}
            >
              <Select.Option value={'val.id'} key={'index'}>
                奥体中心站
              </Select.Option>
            </Select>
          </div>
            <DatePicker className={styles.personFlowTime} showTime={true}/>
          <div className={styles.personFlowLine}>
            <div className={styles.personFlowli}>
              <div className={styles.num}>8000</div>
              <div className={styles.text}>累计进站数</div>
            </div>
            <div className={styles.personFlowli}>
              <div className={styles.num}>8000</div>
              <div className={styles.text}>累计出站数</div>
            </div>
            <div className={styles.personFlowli}>
              <div className={styles.num}>8000</div>
              <div className={styles.text}>进站数</div>
            </div>
            <div className={styles.personFlowli}>
              <div className={styles.num}>8000</div>
              <div className={styles.text}>出站数</div>
            </div>
          </div>
          <div className={styles.personFlowChart} id="personF-1"></div>
        </div>
      </div>
    </Row>
  );
});
export default AnbaoCard;
