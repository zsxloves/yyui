import styles from './indexNew.less';
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Row, Col } from 'antd';
import BigImageView from './bigImageView';
import { queryCheckGroupList, queryCheckRecordList } from '@/services/bigScreen';
import { getDateDuring } from '@/utils/utilsJS';
import { getDate } from '@/utils/utilsJS';
import moment from 'moment';

const { TabPane } = Tabs;
//定义props的类型
interface Props {
  callBackHJ: (item: any) => void;
  popupData: {
    type: string;
    style: any;
    tableList: [
      {
        title: string;
        header: string[];
        attrs: string[];
      },
      {
        title: string;
        header: string[];
        attrs: string[];
      },
      {
        title: string;
        header: string[];
        attrs: string[];
      },
    ];
  };
}
declare global {
  interface Window {
    showBigImage: any;
  }
}

let isFirst: boolean = true;
const PopupAlertSecurity: React.FC<Props> = (props) => {
  const { popupData, callBackHJ } = props;
  const [itemHJ, setItemHJ] = useState<any>({});
  const startTime = useRef('');
  const endTime = useRef('');
  const [visiableBigImage, setVisiableBigImage] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>('');

  window.showBigImage = (url: string) => {
    setImgUrl(url);
    setVisiableBigImage(true);
  };

  // 点位
  const getCheckCollect = () => {
    const dataTime = getDate(0);
    const params = {
      "begin": dataTime.endDate + ' 00:00:00',
      "checkPointIdList": [],
      "end": dataTime.endDate + ' 23:59:59'
    };
    queryCheckGroupList(params)
      .then((res: any) => {
        if (res.code) {
          const list = res.result?.result || [];
          let str = '';
          if (list.length < 5) {
            setItemHJ({});
            list.forEach((item: any) => {
              str += `<div class='JQScroll'>
                <span class="li-8">${item.name}</span>
                <span class="li-4 center">${item.pedestrian}</span>
                <span class="li-4 center">${item.vehicle}</span>
                <span class="li-4 center">${item.faceAlarm}</span>
                <span class="li-4 center">${item.vehicleAlarm}</span>
              </div>`;
              if (item.name === '合计') {
                callBackHJ(item);
              }
            });
          } else {
            list.forEach((item: any) => {
              if (item.name !== '合计') {
                str += `<div class='JQScroll'>
                  <span class="li-8">${item.name}</span>
                  <span class="li-4 center">${item.pedestrian}</span>
                <span class="li-4 center">${item.vehicle}</span>
                <span class="li-4 center">${item.faceAlarm}</span>
                <span class="li-4 center">${item.vehicleAlarm}</span>
                </div>`;
              } else {
                setItemHJ(item);
                callBackHJ(item);
              }
            });
          }
          $('#JCZPERSON').html(str);
          $('#JCZPERSON').liMarquee('destroy');
          if (list.length > 5) {
            $('#JCZPERSON').addClass('canDrug');
            $('#JCZPERSON').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#JCZPERSON').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  // 人员
  const getVisitorRecords = () => {
    const dataTime = getDate(0);
    const params = {
      "begin": dataTime.endDate + ' 00:00:00',
      "checkPointIdList": [],
      "end": dataTime.endDate + ' 23:59:59',
      "page": 0,
      "size": 10,
      "type": "1"
    };
    queryCheckRecordList(params)
      .then((res: any) => {
        if (res.code === 200) {
          const list = res.result?.page?.content || [];
          let str = '';
          list.forEach((item: any) => {
            const times=moment(item?.capTime).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
            str += `<div class='JQScroll'>
              <span class="li-12">${item.channelName?item.channelName:''}</span>
              <span class="li-6 center">
                <img style="width:42px;height:42px" src="${item?.cacheFaceImgUrl
              }" onclick="showBigImage('${item?.cacheFaceImgUrl}')" />
              </span>
              <span class="li-6 center">${times?times:''}</span>
            </div>`;
          });
          $('#RenjczScrollAlert').html(str);
          $('#RenjczScrollAlert').liMarquee('destroy');
          if (list.length > 4) {
            $('#RenjczScrollAlert').addClass('canDrug');
            $('#RenjczScrollAlert').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#RenjczScrollAlert').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  // 车辆
  const getPackageRecords = () => {
    const dataTime = getDate(0);
    const params = {
      "begin": dataTime.endDate + ' 00:00:00',
      "checkPointIdList": [],
      "end": dataTime.endDate + ' 23:59:59',
      "page": 0,
      "size": 10,
      "type": "2"
    };
    queryCheckRecordList(params)
      .then((res: any) => {
        if (res.code) {
          const list = res.result?.page?.content || [];
          let str = '';
          list.forEach((item: any) => {
            const imgurl=JSON.parse(item?.imageList||"[]")
            const times=moment(item?.capTime).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
            str += `<div class='JQScroll'>
              <span class="li-8">${item.channelName?item.channelName:''}</span>
              <span class="li-4">${item.plateNum || '未知'}</span>
              <span class="li-4 center">
                <img style="width:42px;height:42px" src="${imgurl[0]?.cacheUrl
              }" onclick="showBigImage('${imgurl[0]?.cacheUrl}')" />
              </span>
              <span class="li-8 center">${times?times:''}</span>
            </div>`;
          });
          $('#ChejczScrollAlert').html(str);
          $('#ChejczScrollAlert').liMarquee('destroy');
          if (list.length > 4) {
            $('#ChejczScrollAlert').addClass('canDrug');
            $('#ChejczScrollAlert').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#ChejczScrollAlert').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  const changeTab = (key: any) => {
    if (key === '1' && isFirst) {
      getVisitorRecords();
      isFirst = false;
    } else if (key === '2' && isFirst) {
      getPackageRecords();
      isFirst = false;
    }
  };

  useEffect(() => {
    isFirst = true;
    const paramDate: any = getDateDuring(window.hdObj.startTime, window.hdObj.endTime);
    startTime.current = paramDate?.start;
    endTime.current = paramDate?.end;
    if (popupData) {
      getCheckCollect();
      getVisitorRecords();
    }
  }, [popupData]);
  return (
    <>
      <div className={styles.popupListStyle} style={popupData.style}>
        <div className={styles.tabs}>
          <div className={styles.popupTitle}>{popupData.tableList[0].title}</div>
          <div
            className={`${styles.tableBox}  ${styles.policeInfo} ${styles.popupListStylePoliceInfo}`}
          >
            {/* {config1 && <ScrollBoard config={config1} />} */}
            <Row className={styles.tableTitle}>
              <Col span={8}>检查站</Col>
              <Col span={4}>入杭人数</Col>
              <Col span={4}>入杭车辆数</Col>
              <Col span={4}>预警人数</Col>
              <Col span={4}>预警车辆数</Col>
            </Row>
            <div id="JCZPERSON" />
            {itemHJ.name && (
              <Row className={styles.tableFooter}>
                <Col span={8}>{itemHJ.name}</Col>
                <Col span={4}>{itemHJ.passengerFlow}</Col>
                <Col span={4}>{itemHJ.totalPackage}</Col>
                <Col span={4}>{itemHJ.dangerousPackage}</Col>
                <Col span={4}>{itemHJ.dangerous}</Col>
              </Row>
            )}
          </div>
        </div>
        <div className={`${styles.tabs} ${styles.policeInfo} ${styles.popupListStylePoliceInfo}`}>
          <Tabs defaultActiveKey="1" onChange={changeTab}>
            <TabPane tab="人员" key="1">
              {/* <div className="tableContent">{config2 && <ScrollBoard config={config2} />}</div> */}
              <div style={{ height: '100%', marginTop: '10px' }}>
                <Row className={styles.tableTitle}>
                  <Col span={12}>通道名称</Col>
                  <Col span={4}>照片</Col>
                  <Col span={8}>抓拍时间</Col>
                  {/* <Col span={4}>体温</Col> */}
                </Row>
                <div id="RenjczScrollAlert" />
              </div>
            </TabPane>
            <TabPane tab="车辆" key="2">
              {/* <div className="tableContent">{config3 && <ScrollBoard config={config3} />}</div> */}
              <div style={{ height: '100%', marginTop: '10px' }}>
                <Row className={styles.tableTitle}>
                  <Col span={8}>通道名称</Col>
                  <Col span={4}>车牌号</Col>
                  <Col span={4}>照片</Col>
                  <Col span={8}>抓拍时间</Col>
                </Row>
                <div id="ChejczScrollAlert" />
              </div>
            </TabPane>
          </Tabs>
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
