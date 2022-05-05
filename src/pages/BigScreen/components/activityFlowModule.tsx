import styles from './indexNew.less';
import React,{useEffect, useState} from 'react';
import { Row, Timeline, Select } from 'antd';
import type { ItemData } from './data';
import img3 from '../image/icon4.png'
import { getActivityFlowList } from '@/services/bigKBMS';
import { getDateDuring } from '@/utils/utilsJS';

//定义props的类型
interface Props {
  dataConfig: { height: string; list: ItemData[] };
  refresh?: any;
  callBackUrl: (value: string, type: number) => void;
  // callBackFace: (value: { id: string; name: string }) => void;
  // callBackVideoAR: (item: any) => void;
}
interface RefTypes {
  setAbDate: (flg: any) => void;
  searchLayerTc: () => void;
  getArVideos: (ids: string[]) => void;
  itemShowFlg: (code: string) => void;
}
const AnbaoCard = React.forwardRef<RefTypes, Props>((props, ref) => {
  const { dataConfig,callBackUrl ,refresh} = props;
  const [dataList,setDataList]=useState<any>([])
  // 获取赛事
  const getCompetionsPageFun = () => {
    const paramDate = getDateDuring(window.hdObj.startTime, window.hdObj.endTime);
    const hdId = window.hdObj?.id || '';
    const params = {
      pageNumber: 0,
      pageSize: 99,
      sortColumn: 'startTime',
      sortOrder: 'asc',
      // timeType: '1',
      startTimeBegin: paramDate?.start,
      startTimeEnd: paramDate?.end,
      activityIdList: [hdId],
    };
    getActivityFlowList({id:''})
      .then((res: any) => {
        if (res.code === 200) {
          // const list =
          //   res.data?.rows.map((item: any) => {
          //     item.startTime = item.startTime.substring(10);
          //     return item;
          //   }) || [];
            setDataList(res.data||[])
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getCompetionsPageFun();
  }, [refresh]);
  return (
    <Row gutter={5}>
      <div
        className={`${styles.itemBox}`}
        style={{ height: dataConfig.height + 'px' }}
      >
        <div className={styles.flowBox}>
          <img src="/img/imageNew/ssbg1.png" alt="" style={{position:'absolute',left:'8px',top:'15px',height:'155px'}} />
          <div className={styles.select}>
            <Select suffixIcon={<img src={img3} alt="" />}
              className={[styles.section, styles.leftActive].join(' ')}
              value={'val.id'}
              onChange={(e) => {
                // setHd(e);
              }}
            >
              <Select.Option value={'val.id'} key={'index'}>
                开幕式演练1
              </Select.Option>
            </Select>
          </div>
          <div className={styles.flowScroll}>
            <Timeline pending={false}>
              {dataList&&dataList.map((item:any,i:any)=>{
                return(
                  <Timeline.Item key={i} style={{ color: '#fff',cursor:'pointer' }} dot={<span></span>}>
                    <div onClick={()=>callBackUrl('huodongliucheng',1)} style={{display:'flex'}}><div>{item.startTime} </div>
                    <div title={item.name} style={{marginLeft:'6px', width:'78%',overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap',display: 'block'}}>{item.name}</div></div></Timeline.Item>
                )
              })}
            </Timeline>
          </div>
        </div>
      </div>
    </Row>
  );
});
export default AnbaoCard;
