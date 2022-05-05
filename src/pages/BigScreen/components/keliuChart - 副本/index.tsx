/* eslint-disable @typescript-eslint/no-empty-interface */
import React, {  useEffect } from 'react';
import * as echarts from 'echarts';
//定义props的类型
interface Props {
    chartData: any;
    name:string
}
const KeliuChart: React.FC<Props> = (props) => {  
    const { chartData,name} = props;
    const setAlarmChart = () => {
        const dom: any = document.getElementById(name+'Chart');
        const alarmChart = echarts.init(dom);
        const xData=chartData.name
        const yData=chartData.value
        
        const option = {
            tooltip: {},
            title: {
                text: name+ ' - ' +chartData.num,
                left: 0,
                top: 0,
                textStyle: {
                    color: '#ddd',
                    fontSize: 12,
                },
                right: 10
            },
            backgroundColor: "transparent",
            grid: {
                top: 30,
                bottom: 10,
                left: 5,
                right: 5
            },
            xAxis: {
                data: xData,
                axisLine: {
                    show: true, // 隐藏X轴轴线
                    lineStyle: {
                        color: 'rgba(255,255,255,0.1)'
                    }
                },
                axisTick: {
                    show: true // 隐藏X轴刻度
                },
                axisLabel: {
                    show: true,
                    margin: 12,
                    fontSize: 12,
                    textStyle: {
                        color: "#A3C0DF" // X轴文字颜色
                    }
                },
            },
            yAxis: [
                {
                    type: "value",
                    gridIndex: 0,
                    min: 0,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: 'rgba(255,255,255,0.1)',
                            width: 2
                        },
                    },
                    axisTick: {
                        show: true
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#2D455A'
                        }
                    },
                    axisLabel: {
                        show: true,
                        margin: 12,
                        fontSize: 12,
                        textStyle: {
                            color: "#A3C0DF" // X轴文字颜色
                        }
                    },
                },
            ],
            series: [
                {
                    name: "客流",
                    type: "line",
                    barWidth: 14,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: "#00FFE3"
                            },
                            {
                                offset: 1,
                                color: "#4693EC"
                            }
                            ])
                        }
                    },
                    data: yData,
                    z: 10,
                    zlevel: 0,
                },
            ]
        }

        alarmChart.clear();
        alarmChart.setOption(option);
    };

    useEffect(() => {
        setAlarmChart();
    }, [chartData]);
    //   useEffect(() => {
    //     if (chartData) {
    //       setAlarmChart(chartData);
    //     }
    //   }, [chartData]);
    return <div id={name+'Chart'} style={{ height: '240px', width: '100%' }}/>;
};
export default KeliuChart;
