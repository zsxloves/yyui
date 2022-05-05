/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import './index.less';
const LineChartModule: React.FC = () => {
  let myChart: echarts.ECharts;

  const data = [
    {
      value: 14000,
      name: '04-09',
    },
    {
      value: 8000,
      name: '04-11',
    },
    {
      value: 10000,
      name: '04-13',
    },
    {
      value: 6000,
      name: '04-15',
    },
  ];
  const getChartData = () => {
    const option = {
      color: '#00c1ff',
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '6%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        axisTick: {
          inside: true,
          alignWithLabel: true,
        },
        data: data?.map((item) => item.name),
        axisLine: {
          lineStyle: {
            color: '#fff',
          },
        },
        axisLabel: {
          color: '#fff',
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            color: '#fff',
            opacity: 0.3,
          },
        },
        splitNumber:6,
        axisLabel: {
          color: '#5394c7',
        },
      },
      series: [
        {
          type: 'line',
          data: data?.map((item) => item.value),
        },
      ],
    };

    return option;
  };

  useEffect(() => {
    const element = document.getElementById('line');
    myChart = echarts.init(element as HTMLDivElement);
    myChart.setOption(getChartData());
  }, []);
  return (
    <div className="line-container">
       停车场流量统计
      <div id="line" className="chart"  />
    </div>
  );
};
export default LineChartModule;
