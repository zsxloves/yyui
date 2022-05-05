/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-empty-interface */
import stylesNew from '../indexNew.less';
import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { getCount, getPage, getLine, preview, getCameraIdsByGroup, queryCountpeople } from '@/services/bigScreen';
import { Popover, Tooltip } from 'antd';
import { queryTcty } from '@/pages/Mars3DMap/service';
import { getDate } from '@/utils/utilsJS';
//定义props的类型
interface Props {
  refresh?: string | number;
  callbackOnMap: (result: any) => void,
}
interface alarmType {
  icon: string;
  categoryName: string;
  quantity: number;
  color: string;
  category: string;
  [key: string]: any;
}
let videoObj: any = {};
interface alarmList {
  icon: string;
  alarmTime: string;
  state: string;
  color: string;
  category: string | number;
  message: string;
  [key: string]: any;
}
declare global {
  interface Window {
    alarmDealWin: any;
  }
}
const iconObj = {
  '01': 'icon-renlianshibieyujing',
  '02': 'icon-cheliangyujing',
  '16': 'icon-changguanneibuzhongdianquyuyujing',
  '05': 'icon-jinggaiweiyiyujing',
  '07': 'icon-wupinanjianyujing',
  '04': 'icon-chuanyuehulanyujing',
  '10': 'icon-wurenjifanzhi',
};
let timer: any = null;
interface RefTypes {
  getPageFun: () => void;
}
const ImportantScenic = React.forwardRef<any>((props, ref) => {
  let rlTimer: any = null;

  const { alarmDeal, refresh, callBackUrl, reloadVideo, callbackOnMap } = props;
  const [alarmList, setAlarmList] = useState<alarmList[]>([]); // 预警列表
  const [videoList, setvideoList] = useState<any>(window.videoList);
  const [keyName, setKeyName] = useState<any>([])
  const [curentData, setCurrent] = useState({})
  const [sumData, setSum] = useState({})
  const [sumNum, setNum] = useState(0)
  const [sumCurrentNum, setSumCurrentNum] = useState(0)
  const [peopleCount,setPeopleCount]=useState<any>([
    // {name:'森泊乐园',sum:0,current:0},
    // {name:'杭州乐园',sum:0,current:0},
    // {name:'湖山广场',sum:0,current:0},
    {name:'极地海洋世界',sum:0,current:0},
    // {name:'城山广场',sum:0,current:0},
    // {name:'陈家埠帐篷区域',sum:0,current:0},
    // {name:'山里人家',sum:0,current:0},
    // {name:'小黄鸭',sum:0,current:0},
    // {name:'定山广场',sum:0,current:0},
    // {name:'花海',sum:0,current:0},
    // {name:'金沙戏水',sum:0,current:0},
    // {name:'德风岛帐篷区域',sum:0,current:0},
  ])

  window.alarmDealWin = (id: string) => {
    const item = alarmList.find((val) => {
      return val.id === id;
    });
    alarmDeal(item);
  };


  useEffect(() => {
    setvideoList(window.videoList)
    getPersonCount()
    clearInterval(rlTimer);
    rlTimer = setInterval(() => {     
      getPersonCount()
    }, 1000 * 10);
    return () => {
      clearInterval(rlTimer);
    }
  }, []);

  // 获取人流量
  const getPersonCount=async ()=>{
    try {
      const json = JSON.parse(props?.personNumId||"{}") || {};

      const res = await getCameraIdsByGroup({
        "group_ids": [json.personNumId||'1213']
        // "group_ids": [100]
      })
        
      const date: any[] = res.group_item || [];
      const arr = date.length > 0 ? date[0].camera_ids : []
      const dataTime = getDate(0);
      const entity = JSON.parse(window.cjObj.entity||"{}")
      const params0 = {
        start_timestamp: new Date().getTime() - 15*1000,
        end_timestamp:  new Date().getTime(),
        camera_ids: arr,
      }
            queryCountpeople(params0)
              .then((res1: any) => {
                if (res1.status == 200) {
                  const dealDate: any[] = res1.results || [];
                  let data = {}
                  let num = 0
                  dealDate.map((item) => {
                    if (item.total_count) {
                      data[item.camera_id] = item.total_count
                      num += Number(item.total_count)
                    }
                  })
                  setSumCurrentNum(num)
                  setCurrent(data)
                }
              })
              .catch((err) => {
                console.log(err.message || err);
              });
  
            
            const params = {
              start_timestamp:  (entity?.rlStartTime && new Date(entity?.rlStartTime).getTime()) || new Date(dataTime.endDate + ' 00:00:00').getTime() ,
              end_timestamp:  (entity?.rlEndTime && new Date(entity?.rlEndTime).getTime()) || new Date(dataTime.endDate + ' 23:59:59').getTime() ,
              camera_ids: arr,
            }
            queryCountpeople(params)
              .then((res2: any) => {
                if (res2.status == 200) {
                  const dealDate: any[] = res2.results || [];
                  let num = 0
                  let data = {}
                  dealDate.map((item) => {
                    if (item.total_count) {
                      data[item.camera_id] = item.total_count
                      num += Number(item.total_count)
                    }
                  })

                  setNum(num)
                  setSum(data)
                }
              })
              .catch((err) => {
                console.log(err.message || err);
              });
    } catch (error) {
      
    }
    
  }

  //视频广场按钮
  const showVideoPlaza = (e: any) => {
    // let val = e.target.firstElementChild.innerText.slice(1,3)
    let val = e.target.parentNode.parentNode.firstElementChild.innerText
    const param = {
      type: '386ee878-bc63-4b83-b7d3-1bec34dda281',
      sceneId: '835c9690-1703-4f0d-83da-b4c78a1909c7'
    }
    queryTcty(param).then((res: any) => {
      let arr: any = []
      const result = res.data.rows
      result.forEach((item: any) => {
        let obj = JSON.parse(item.entity).GeoJSON.properties.style.text
        if (val.indexOf(obj) != -1) {
          arr.push(item)
        }
      });
      // // console.log(videoList, '视频数据');
      // let videoObj: any = window.videoList
      // let arr1: any = []
      // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', videoObj);
      // videoObj.forEach((item: any) => {
      //   if (item.vedioName.indexOf(val) != -1) {
      //     //if (item.vedioName.indexOf('定山') != -1) {
      //     arr1.push(item.vvideoId)
      //   }
      // })
      if (arr[0].videoIdList) {
        reloadVideo()
        searchVideo(arr[0].videoIdList)
      }
    }).catch(e => {
      console.log(e, '123123');
    })
  }

  //视频
  const searchVideo = (vvideoId: any) => {
    callBackUrl(vvideoId, '大华');
  };

  const activeFun = (volue: any) => {
    const param = {
      type: '386ee878-bc63-4b83-b7d3-1bec34dda281',
      sceneId: '835c9690-1703-4f0d-83da-b4c78a1909c7'
    }
    queryTcty(param).then((res: any) => {
      let arr: any = []
      const result = res.data.rows
      result.forEach((item: any) => {
        let obj = JSON.parse(item.entity).GeoJSON.properties.style.text
        if (volue.text.indexOf(obj) != -1) {
          arr.push(item)
        }
      });
      result.forEach((item:any) => {
        if (item.planID===arr[0].planID && item.name!=='文字') {
          arr.push(item)
        }
      });
      
      if (arr.length) {
        callbackOnMap(arr)
      } else {
        callbackOnMap([])
      }
    }).catch(e => {
      console.log(e, '123123');
    })
  }
  useEffect(() => {
    const param = {
      type: '386ee878-bc63-4b83-b7d3-1bec34dda281',
      sceneId: '835c9690-1703-4f0d-83da-b4c78a1909c7'
    }
    queryTcty(param).then((res: any) => {
      let arr: any = []
      const result = res.data.rows
      result.forEach((item: any) => {
        let obj = JSON.parse(item.entity).GeoJSON.properties.style
        const code =JSON.parse(item.entity).info.code.split(',')
        obj.code = code;
        if (obj.text) {
          arr.push(obj)
        }
      });
      console.log('asd', arr);
      setKeyName(arr)
    }).catch(e => {
      console.log(e, '123123');
    })
  }, [])
  
  return (
    <div
      key={refresh}
      className={`${stylesNew.moduleWrapStyle}`}
      style={{ height: 'calc(100% - 42px)', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{fontSize:'14px',fontWeight:'bold'}}>人流量 : {sumCurrentNum} | {sumNum}</div>
      <div className={`${stylesNew.faceAlarmNum} ${stylesNew.moduleWrapStyler}`}>
        {/* {alarmType.length > 0 &&
          alarmType.map((item: alarmType, index: number) => { */}
        {keyName.length > 0 &&
          keyName.map((item: any, index: number) => {
            let _current = 0
            let _sum = 0
            if (item) {
              const code = item?.code || []
              code.map(i => {
                if(curentData[i]){
                  _current =_current+Number(curentData[i])
                }
                if(sumData[i]){
                  _sum =_sum+Number(sumData[i])
                }
                // sumData[i] && _sum +=sumData[i]
              })
              return (
                <div
                  key={index}
                  className={`${stylesNew.alarm} ${stylesNew.alarmBorder} ${item.text ? stylesNew.active : ''}`}
                  onClick={() => activeFun(item)}
                >
                  <div className={stylesNew.stress}>
                    {/* <div  className={stylesNew.videoPlaza}> */}
                    <Tooltip title={item.text}>
                      <div className={stylesNew.scenicSpots}>{item.text}</div>
                    </Tooltip>
                    <div>{_current} | {_sum}</div>
                    <div><a onClick={(e) => showVideoPlaza(e)}>视频广场<span style={{ display: 'none' }}>{item.name}</span></a></div>
                  </div>
                  {/* </div> */}
                </div>
              );
            }
          })}
      </div>
    </div>
  );
});
export default ImportantScenic;
