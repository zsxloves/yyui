/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-empty-interface */
import stylesNew from './indexNew.less';
import styles from './index.less';
import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import moment from 'moment';
import LineChartModule from './LineChartModule'
import LineRightChartModule from "./LineRightChartModule";


const XRealTimeCar: React.FC<any> = (props) => {

  const {refresh } = props;
  let myChart: echarts.ECharts;

  const getChartData = () => {
    const h = moment().get('hour')
    const option = {
      color:['skyblue','tomato'],
      legend:{
        icon:'circle',
        data:['进场','出场'],
        textStyle:{
          color:'white'
        }
    },     
        grid: {
          left: '3%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['0时','2时','4时','6时','8时','10时','12时','14时','16时'],
            axisLabel:{
              color:'white'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel:{
              color:'white'
            }
          }
        ],
        series: [
          {
            name: '进场',
            type: 'line',
            stack: 'car',
            symbol: 'none',
            lineStyle:{
              color:'skyblue'
            },
            areaStyle: {
              color:'skyblue'
            },
            emphasis: {
              focus: 'series'
            },
            data: ['0','10','20','40','1000','4000','8000','11000','14000'],
            smooth:true,
          },
          {
            name: '出场',
            type: 'line',
            stack: 'car',
            areaStyle: {
              color:'tomato'
            },
            lineStyle:{
              color:'tomato'
            },
            symbol: 'none',
            emphasis: {
              focus: 'series'
            },
            data: ['0','5','15','30','900','3000','7000','10000','13000'],
            smooth:true,
          },
        ]
      };

    return option;
  };
  useEffect(() => {
    const element = document.getElementById('carInOut');
    myChart = echarts.init(element as HTMLDivElement);
    myChart.setOption(getChartData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);
  return (
    <div
      key={refresh}
      className={stylesNew.moduleWrapStyle}
      style={{ height: 'calc(100% - 42px)', display: 'flex', flexDirection: 'column' }}
    >
    <div style={{width:'100%',height:'300px'}}>
      <div id="carInOut" style={{width:'100%',height:'300px'}} />
    </div>
    <LineChartModule />
    <LineRightChartModule />
    </div>
  );
};
export default XRealTimeCar;
