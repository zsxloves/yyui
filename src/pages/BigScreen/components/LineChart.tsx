/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { useEffect } from 'react';
import * as echarts from 'echarts';
//定义props的类型
interface Props {
  chartData: any;
}
interface echartData {
  xAxisData: string[];
  yAxisData1: string[];
  yAxisData2: string[];
  dataLen: string[];
}
const LineChart: React.FC<Props> = (props) => {
  const { chartData } = props;
  const setAlarmChart = (echartData: echartData) => {
    if (!Array.isArray(echartData.xAxisData)) {
      return;
    }
    const option = {
      color: ['#3292FE', '#00FEE8'],
      legend: {
        left: 'right',
        top: 0,
        data: echartData.dataLen,
        icon: 'rect',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: '#fff',
          padding: 0,
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        top: 40,
        bottom: 0,
        right: '3%',
        left: '8%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: 'rgba(255,255,255,0.6)',
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.3)',
            },
          },
          axisTick: {
            show: false,
          },
          data: echartData.xAxisData,
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '单位：次',
          minInterval: 1,
          axisLabel: {
            textStyle: {
              color: 'rgba(255,255,255,0.6)',
            },
          },
          nameTextStyle: {
            color: 'rgba(255,255,255,0.5)',
            fontSize: 12,
            lineHeight: 10,
            padding: [20, 30, 0, 0],
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.1)',
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
          name: echartData.dataLen[0],
          type: 'line',
          showSymbol: false,
          lineStyle: {
            normal: {
              color: '#3292FE',
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
                    color: 'rgba(51, 145, 254, 0.2)', // 0% 处的颜色
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
          name: echartData.dataLen[1],
          type: 'line',
          showSymbol: false,
          lineStyle: {
            normal: {
              color: '#00FEE8',
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
                    color: 'rgba(0, 254, 232, 0.2)', // 0% 处的颜色
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
    setTimeout(() => {
      const dom: any = document.getElementById('alarmChart');
      const alarmChart = echarts.init(dom);
      alarmChart.setOption(option);
    }, 1000);
  };

  useEffect(() => {
    if (chartData) {
      setAlarmChart(chartData);
    }
  }, [chartData]);
  return <div id="alarmChart" style={{ height: '100%', width: '100%' }} />;
};
export default LineChart;
