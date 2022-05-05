/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'antd';
import IconOrImage from './IconOrImage';
import KeliuChart from '../keliuChart';


//定义props的类型
interface Props {
  refresh?: any;
  callBackKlNum: (klNum: number) => void;
}
declare global {
  interface Window {
    closeGraphicPark: any; // 关闭图层
  }
}

const KeliuModule: React.FC<Props> = (props) => {
  let klTimer: any = null;
  const {  refresh } = props;
  const changeChartRef = useRef<any>();
  const [khqArr, setKhqArr] = useState<any>({ name: [], value: [], num: 0 });
  const [dsArr, setDsArr] = useState<any>({ name: [], value: [], num: 0 });
  const [hsArr, setHsArr] = useState<any>({ name: [], value: [], num: 0 });
  const [hzlyArr, setHzlyArr] = useState<any>({ name: [], value: [], num: 0 });
  const [jdhygyArr, setJdhygyArr] = useState<any>({ name: [], value: [], num: 0 });
  const [dfwhArr, setDfwhArr] = useState<any>({ name: [], value: [], num: 0 });


  // 初始化获取客流数据
  const getKeliuList = async () => {
    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
    let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
    let dateStr = year + "-" + month + "-" + (day - 1);
    let khqArrs = { name: [], value: [], num: 0 };
    let dsArrs = { name: [], value: [], num: 0 };
    let hsArrs = { name: [], value: [], num: 0 };
    let hzlyArrs = { name: [], value: [], num: 0 };
    let jdhygyArrs = { name: [], value: [], num: 0 };
    let dfwhArrs = { name: [], value: [], num: 0 };
    await fetch('http://41.200.14.143:47970/zju/spot/hour?date=' + dateStr).then((response) => response.json()).then(data => {
      data.forEach(function (item: any) {
        if (item.name == '跨湖桥景区') {
          khqArrs.name.push(item.hour)
          khqArrs.value.push(item.value)
        } else if (item.name == '定山景区') {
          dsArrs.name.push(item.hour)
          dsArrs.value.push(item.value)
        } else if (item.name == '湖山景区') {
          hsArrs.name.push(item.hour)
          hsArrs.value.push(item.value)
        } else if (item.name == '杭州乐园') {
          hzlyArrs.name.push(item.hour)
          hzlyArrs.value.push(item.value)
        } else if (item.name == '极地海洋公园') {
          jdhygyArrs.name.push(item.hour)
          jdhygyArrs.value.push(item.value)
        } else if (item.name == '东方文化园') {
          dfwhArrs.name.push(item.hour)
          dfwhArrs.value.push(item.value)
        }
      })
    }).catch(e => {
    });
    await fetch('http://41.200.14.143:47970/zju/spot/current').then((response) => response.json()).then(data => {
      data.forEach(function (item: any) {
        if (item.name == '跨湖桥景区') {
          khqArrs.num += item.stay_count
        } else if (item.name == '定山景区') {
          dsArrs.num += item.stay_count
        } else if (item.name == '湖山景区') {
          hsArrs.num += item.stay_count
        } else if (item.name == '杭州乐园') {
          hzlyArrs.num += item.stay_count
        } else if (item.name == '极地海洋公园') {
          jdhygyArrs.num += item.stay_count
        } else if (item.name == '东方文化园') {
          dfwhArrs.num += item.stay_count
        }
      })
    })
    setKhqArr(khqArrs)
    setDsArr(dsArrs)
    setHsArr(hsArrs)
    setHzlyArr(hzlyArrs)
    setJdhygyArr(jdhygyArrs)
    setDfwhArr(dfwhArrs)
    // 返回实时客流总数
    props.callBackKlNum(khqArrs.num + dsArrs.num + hsArrs.num + hzlyArrs.num + jdhygyArrs.num + dfwhArrs.num)

  }
  // 定时获取客流信息
  const getKlInterval = () => {
    clearInterval(klTimer);
    klTimer = setInterval(() => {
      getKeliuList()
    }, 1000 * 18);
  }
  useEffect(() => {
    getKeliuList()
    getKlInterval()
    return () => {
      clearInterval(klTimer);
    }
  }, [])

  useEffect(() => {
    console.log('模块31刷新了');
  }, [ refresh]);
  return (
    <>
      {/* 客流 */}
      <div style={{ height: '200px' }}>
        <Carousel autoplay infinite={false} ref={changeChartRef}>
          <KeliuChart chartData={khqArr} name='跨湖桥景区' />
          <KeliuChart chartData={dsArr} name='定山景区' />
          <KeliuChart chartData={hsArr} name='湖山景区' />
          <KeliuChart chartData={hzlyArr} name='杭州乐园' />
          <KeliuChart chartData={jdhygyArr} name='极地海洋公园' />
          <KeliuChart chartData={dfwhArr} name='东方文化园' />
        </Carousel>
      </div>
    </>
  );
};
export default KeliuModule;
