/* eslint-disable @typescript-eslint/no-empty-interface */
import React, {  useEffect } from 'react';
import * as echarts from 'echarts';
import moment from 'moment';
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
        
        if(xData.length>22) xData.splice(21)
        if (moment().hour()) {
            xData.splice(moment().hour()-1)
        }
        
        const yData=chartData.value
        if(yData.length>22) yData.splice(21)
        
        const option = {
            tooltip: {},
            title: {
                text: name+ ': ' +chartData.num,
                left:'center',
                textStyle: {
                    color: '#ddd',
                    fontSize: 18,
                },
            },
            backgroundColor: "transparent",
            grid: {
                top: 30,
                bottom: 30,
                left: 10,
                right: 15
            },
            xAxis: {
                type:'category',
                data: xData,
                boundaryGap:false,
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
                        show: false,
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
                            label:{
                                show:true,
                                textStyle: {
                                    color: "#A3C0DF" // X轴文字颜色
                                }
                            },
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
                    areaStyle:{
                        opacity:0.7,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: "#00FFE3"
                        },
                        {
                            offset: 1,
                            color: "#4693EC"
                        }
                        ])
                    },
                    smooth:true,
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
