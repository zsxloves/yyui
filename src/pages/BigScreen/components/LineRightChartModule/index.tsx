/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import './index.less';
const LineRightChartModule: React.FC = () => {
  let myChart: echarts.ECharts;

  // const data = [
  //   {
  //     value: 14000,
  //     name: '04-09',
  //   },
  //   {
  //     value: 8000,
  //     name: '04-11',
  //   },
  //   {
  //     value: 10000,
  //     name: '04-13',
  //   },
  //   {
  //     value: 6000,
  //     name: '04-15',
  //   },
  // ];

  const getChartData = () => {
   const option = {
    textStyle: {
      fontSize: '1',
      color: '#fff'
  },
      // title: {
      //   text: ' ',
      //   color: '#fff'
      // },
      // tooltip: {
      //   trigger: 'axis',
      //   axisPointer: {
      //     type: 'shadow'
      //   }
      // },
      // legend: {},
     
      grid: {
        left: '1%',
        right: '6%',
        bottom: '3%',
        top:'3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: ['7-8小时', '5-6小时', '3-4小时', '2-3小时', '1-2小时', '1小时以内']
      },
      series: [
        {
          name: '2011',
          type: 'bar',
          data: [1203, 2489, 2934, 4970, 7440, 9230],
          label: {
            show: true,
            position: 'insideRight',
            fontSize:10
          }
        },
      ]
    };

    return option;
  };

  useEffect(() => {
    const element = document.getElementById('lines');
    myChart = echarts.init(element as HTMLDivElement);
    myChart.setOption(getChartData());
  }, []);
  return (
    <div className="line-containers">
      停车场车辆停留时长分析
      <div id="lines" className="chart"  />
    </div>
  );
};
export default LineRightChartModule;
