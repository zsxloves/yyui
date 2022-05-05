import styles from './indexNew.less';
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import BigImageView from './bigImageView';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
//定义props的类型
interface Props {
  popupData: {
    code: string;
    type: string;
    style: any;
    subscript: number;
    tableList: [
      {
        title: string;
        header: any[];
        attrs: any[];
      }
    ];
    timeStamp: string;
  };
  popupClose: () => void;
  request: any;
  params: any;
  operationCZ: string,
  callBackUrl: (value: string, type: number) => void;
}
declare global {
  interface Window {
    showBigImage: any;
  }
}

const PopupAlertSecurity: React.FC<Props> = (props) => {
  const { popupData, popupClose, request, params, operationCZ, callBackUrl } = props;
  const [visiableBigImage, setVisiableBigImage] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>('');
  const [listData, setListData] = useState<any>([]);
  window.showBigImage = (url: string) => {
    setImgUrl(url);
    setVisiableBigImage(true);
  };
  // 点位
  const getList = () => {
    // request(params)
    //   .then((res: any) => {
    //     if (res.code) {
    //       const resp = res.data || [];
    //       setListData(resp)
    //     }
    //   })
    //   .catch((err: any) => {
    //     console.log(err.message || err);
    //   });
    fetch('https://hdab.hzos.hzs.zj/api/v1'+request).then((response) => response.json())
    // fetch('http://172.31.0.222:8080/v1'+request).then((response) => response.json())
         .then((res: any) => {
        if (res.code) {
          const resp = res.data || [];
          setListData(resp)
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  useEffect(() => {
    if (popupData) {
      getList();
    }
  }, [popupData.timeStamp]);
  const timeFn = (d1: string, d2: string) => {//di作为一个变量传进来
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    let dateBegin = new Date(moment().format('YYYY-MM-DD') + ' ' + d1.replace(/-/g, "/"));//将-转化为/，使用new Date
    let dateEnd = new Date(moment().format('YYYY-MM-DD') + ' ' + d2.replace(/-/g, "/"));//将-转化为/，使用new Date
    let dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
    let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
    let leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
    let hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
    //计算相差分钟数
    let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
    let minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数
    //计算相差秒数
    let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
    let seconds = Math.round(leave3 / 1000)
    let str: any = '';
    if (dayDiff > 0) {
      console.log(hours, minutes)
      str += dayDiff + "天 "
    }
    if (hours > 0) {
      console.log(hours, minutes)
      str += hours + "小时 "
    }
    if (minutes > 0) {
      str += minutes + "分钟 "
    }
    if (seconds > 0) {
      str += seconds + "秒"
    }
    return str;
  };
  return (
    <>
      <div className={styles.popupListStyle} style={popupData.style}>
        <div className={styles.tabs} style={{ height: '100%' }}>
          <div className={styles.popupTitle}>{popupData.tableList[popupData.subscript].title}
            <div className={styles.popupClose} onClick={popupClose}><CloseOutlined /></div>
          </div>
          <div
            className={`${styles.tableBox}  ${styles.policeInfo} ${styles.popupListStylePoliceInfo}`}
          >
            <div className={styles.tableTitle} style={{ width: '96%', paddingLeft: '14px' }}>
              <Row>
                {popupData.tableList[popupData.subscript].header && popupData.tableList[popupData.subscript].header.map((item: any, i) => {
                  return (
                    <Col key={i} span={item.w}>{item.title}</Col>
                  )
                })}
              </Row>
            </div>
            <div className={styles.popupList}>
              {listData && listData.map((k: { [x: string]: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, j: React.Key | null | undefined) => {
                return (
                  <div className={styles.popupLine} key={j}>
                    <Row>
                      {popupData.tableList[popupData.subscript].attrs && popupData.tableList[popupData.subscript].attrs.map((item: any, i) => {
                        return (
                          item.isClick ?//是否可以点击
                            item.type == "img" ?//图片
                              <Col key={i} span={item.w}><img onClick={() => {
                                setImgUrl(k[item.key]);
                                setVisiableBigImage(true);
                              }} src={k[item.key]} alt="" style={{ width: '32rem', height: '32rem', padding: ' 0 0 3rem 0' }} /></Col> :
                              item.type == "operation" ?//操作
                                <Col key={i} span={item.w}><a style={{ color: '#fff' }}>{operationCZ}</a></Col> :
                                item.type == "map" ?//地图
                                  <Col key={i} span={item.w}><a style={{ color: '#fff' }} onClick={() => callBackUrl(popupData.code, 1)}>{k[item.key]}</a></Col>
                                  : <Col key={i} span={item.w}><a style={{ color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{k[item.key]}</a></Col>
                            :
                            item.type == "sjc" ?//地图
                              <Col key={i} span={item.w}><a style={{ color: '#fff' }}>{timeFn(k.startTime, k.endTime)}</a></Col> :
                              <Col key={i} span={item.w}><a style={{ color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{k[item.key]}</a></Col>
                        )
                      })}
                    </Row>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      {visiableBigImage && (
        <BigImageView
          imgUrl={imgUrl}
          onCancel={() => {
            setVisiableBigImage(false);
          }}
        />
      )}
    </>
  );
};
export default PopupAlertSecurity;
