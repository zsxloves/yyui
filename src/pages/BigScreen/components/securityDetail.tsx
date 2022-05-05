/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import React, { useState, useEffect } from 'react';
import { Button, Collapse, Tabs, Row, Col } from 'antd';
import BigImageView from './bigImageView';
import { checkCollect, visitorRecords, packageRecords } from '@/services/bigScreen';
import { getDate, getDateDuring } from '@/utils/utilsJS';
import { checkCollectJSON, visitorRecordsJSON, packageRecordsJSON } from '../service';
//定义props的类型
interface Props {
  bayonetId: string;
  bayonetName: string;
  callback: () => any;
}

declare global {
  interface Window {
    showDetailImageFun: any;
  }
}
const { Panel } = Collapse;
const { TabPane } = Tabs;
let isFirst: boolean = true;
let ind: string = '1';
const SecurityDetail: React.FC<Props> = (props) => {
  const { bayonetId, bayonetName, callback } = props;
  // const [renList, setRenList] = useState<any[]>([]);
  // const [baoList, setBaoList] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>('');
  const [itemData, setItemData] = useState<any>({});
  const baseInfo = {
    allnum: 20,
    num: 10,
  };
  const paramDate = getDateDuring(window.hdObj.startTime, window.hdObj.endTime);

  window.showDetailImageFun = (url: any) => {
    setVisible(true);
    setImgUrl(url);
  };
  // 获取安检点位
  const getCheckCollect = () => {
    const gateIndexCodes = JSON.parse(window.cjObj.entity).ajtd || [];
    const entity = JSON.parse(window.cjObj.entity);
    const params = {
      indexCodes: bayonetId ? [bayonetId] : [],
      pageNo: 1,
      pageSize: 100,
      startTime: entity?.startTime || paramDate?.start,
      endTime: entity?.endTime || paramDate?.end,
      gateIndexCodes,
      resType: 0,
      bodyResType: '1',
    };
    checkCollect(params)
      .then((res: any) => {
        if (res.code) {
          const data =
            res.result?.result?.list.filter((item: any) => {
              return item.name == '合计';
            }) || [];
          if (data.length > 0) {
            // const isDDH = window.cjObj.name==='两会'
            const dat = data[0];
            setItemData(dat);
          } else {
            setItemData({});
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  // 获取安检人员
  const getVisitorRecords = () => {
    const params = {
      // indexCodes: [bayonetId],
      resList: [
        {
          resCode: bayonetId,
          resType: '',
        },
      ],
      pageNo: 1,
      pageSize: 100,
      startTime: paramDate?.start,
      endTime: paramDate?.end,
    };
    visitorRecords(params)
      .then((res: any) => {
        if (res.code === 200) {
          const list = res.result?.result?.list || [];
          let str = '';
          list.forEach((item: any) => {
            str += `<div class='JQScroll'>
              <span class="li-12">${item.deviceName}</span>
              <span class="li-4 center">
                <img style="width:32px;height:32px" src="${
                  item?.faceUrls?.[1] || ''
                }" onclick="showDetailImageFun('${item?.faceUrls?.[1] || ''}')" />
              </span>
              <span class="li-4 center">
                <img style="width:32px;height:32px" src="${
                  item?.faceUrls?.[0] || ''
                }" onclick="showDetailImageFun('${item?.faceUrls?.[0] || ''}')" />
              </span>
              <span class="li-4">${item.temperature || '未知'}</span>
            </div>`;
          });
          $('#RenScroll').html(str);
          $('#RenScroll').liMarquee('destroy');
          if (list.length > 4) {
            $('#RenScroll').addClass('canDrug');
            $('#RenScroll').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#RenScroll').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  // 获取安检包裹
  const getPackageRecords = () => {
    const params = {
      resList: [
        {
          resCode: bayonetId,
          resType: '',
        },
      ],
      pageNo: 1,
      pageSize: 100,
      startTime: paramDate?.start,
      endTime: paramDate?.end,
    };
    packageRecords(params)
      .then((res: any) => {
        if (res.code) {
          const list = res.result?.result?.list || [];
          // setBaoList(list);
          let str = '';
          list.forEach((item: any) => {
            str += `<div class='JQScroll'>
              <span class="li-20">${item.deviceName}</span>
              <span class="li-4 center">
                <img style="width:32px;height:32px" src="${item?.packageImgUrls[0]}" onclick="showDetailImageFun('${item?.packageImgUrls[0]}')" />
              </span>
            </div>`;
          });
          $('#CheScroll').html(str);
          $('#CheScroll').liMarquee('destroy');
          if (list.length > 4) {
            $('#CheScroll').addClass('canDrug');
            $('#CheScroll').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#CheScroll').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };

  // 获取安检点位
  const getCheckCollectJSON = () => {
    const gateIndexCodes = JSON.parse(window.cjObj.entity).ajtd || [];
    const entity = JSON.parse(window.cjObj.entity);
    const params = {
      indexCodes: bayonetId ? [bayonetId] : [],
      pageNo: 1,
      pageSize: 100,
      startTime: entity?.startTime || paramDate?.start,
      endTime: entity?.endTime || paramDate?.end,
      gateIndexCodes,
      resType: 0,
      bodyResType: '1',
    };
    checkCollectJSON(params)
      .then((res: any) => {
        if (res.code) {
          const data =
            res.result?.result?.list.filter((item: any) => {
              return item.name == '合计';
            }) || [];
          if (data.length > 0) {
            // const isDDH = window.cjObj.name==='两会'
            const dat = data[0];
            setItemData(dat);
          } else {
            setItemData({});
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  // 获取安检人员
  const getVisitorRecordsJSON = () => {
    const params = {
      // indexCodes: [bayonetId],
      resList: [
        {
          resCode: bayonetId,
          resType: '',
        },
      ],
      pageNo: 1,
      pageSize: 100,
      startTime: paramDate?.start,
      endTime: paramDate?.end,
    };
    visitorRecordsJSON(params)
      .then((res: any) => {
        if (res.code === 200) {
          const list = res.result?.result?.list || [];
          let str = '';
          list.forEach((item: any) => {
            str += `<div class='JQScroll'>
              <span class="li-12">${item.assignAreaPath}</span>
              <span class="li-4 center">
                <img style="width:32px;height:32px" src="/img/json/${
                  item?.faceUrls[0]
                }.png" onclick="showDetailImageFun('/img/json/${
                  item?.faceUrls[0]
                }.png')" />
              </span>
              <span class="li-4 center">
                <img style="width:32px;height:32px" src="/img/json/${
                  item?.bkgUrl[0]
                }.png" onclick="showDetailImageFun('/img/json/${
                  item?.bkgUrl[0]
                }.png')" />
              </span>
              <span class="li-4">${item.temperature || '未知'}</span>
            </div>`;
          });
          $('#RenScroll').html(str);
          $('#RenScroll').liMarquee('destroy');
          if (list.length > 4) {
            $('#RenScroll').addClass('canDrug');
            $('#RenScroll').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#RenScroll').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  // 获取安检包裹
  const getPackageRecordsJSON = () => {
    const params = {
      resList: [
        {
          resCode: bayonetId,
          resType: '',
        },
      ],
      pageNo: 1,
      pageSize: 100,
      startTime: paramDate?.start,
      endTime: paramDate?.end,
    };
    packageRecordsJSON(params)
      .then((res: any) => {
        if (res.code) {
          const list = res.result?.result?.list || [];
          // setBaoList(list);
          let str = '';
          list.forEach((item: any) => {
            str += `<div class='JQScroll'>
              <span class="li-20">${item.assignAreaPath}</span>
              <span class="li-4 center">
                <img style="width:32px;height:32px" src="/img/json/${item?.packageImgUrls[0]}.png" onclick="showDetailImageFun('/img/json/${item?.packageImgUrls[0]}.png')" />
              </span>
            </div>`;
          });
          $('#CheScroll').html(str);
          $('#CheScroll').liMarquee('destroy');
          if (list.length > 4) {
            $('#CheScroll').addClass('canDrug');
            $('#CheScroll').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#CheScroll').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  const getDetailInfo = () => {
    isFirst = true;
    const entity = JSON.parse(window.cjObj.entity);
    if(entity?.debug==1){
      getCheckCollectJSON();
    if (ind === '1') {
      getVisitorRecordsJSON();
    } else {
      getPackageRecordsJSON();
    }
    }else{
      getCheckCollect();
    if (ind === '1') {
      getVisitorRecords();
    } else {
      getPackageRecords();
    }
    }
    
  };

  // const showDetail = (url: any) => {
  //   setVisible(true);
  //   setImgUrl(url);
  // };
  const changeTab = (key: any) => {
    ind = key;
    const entity = JSON.parse(window.cjObj.entity);
    if (key === '1' && isFirst) {
    if(entity?.debug==1){
      getVisitorRecordsJSON();
    }else{
      getVisitorRecords();
    }
      isFirst = false;
    } else if (key === '2' && isFirst) {
      if(entity?.debug==1){
      getPackageRecordsJSON();
      }else{
      getPackageRecords();

      }
      isFirst = false;
    }
  };
  useEffect(() => {
    const dataTime = getDate(0);
    setStartTime(dataTime.endDate + ' 00:00:00');
    setEndTime(dataTime.endDate + ' 23:59:59');
    getDetailInfo();
    // setRenList([
    //   {id:1,assignAreaPath:'assignAreaPath',faceUrls:['https://img1.baidu.com/it/u=4253631480,3888815458&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500'],bkgUrl:['https://img1.baidu.com/it/u=4253631480,3888815458&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500'],temperature:'temperature'},
    //   {id:2,assignAreaPath:'assignAreaPath',faceUrls:['https://img1.baidu.com/it/u=4253631480,3888815458&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500'],bkgUrl:['https://img1.baidu.com/it/u=4253631480,3888815458&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500'],temperature:'temperature'},
    // ])
    // setBaoList([
    //   {id:1,assignAreaPath:'assignAreaPath',packageImgUrls:['https://img1.baidu.com/it/u=4253631480,3888815458&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500']},
    //   {id:2,assignAreaPath:'assignAreaPath',packageImgUrls:['https://img1.baidu.com/it/u=4253631480,3888815458&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500']},
    // ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bayonetId]);
  return (
    <div className={styles.bayonetBox}>
      <div className={styles.securityTop}>
        <div className={styles.title1}>{bayonetName}</div>
        <div className={styles.callbackBtn}>
          <Button type="primary" size="small" onClick={callback}>
            返回
          </Button>
        </div>
      </div>
      <div className={styles.filterTime}>
        <div className={styles.dateTime}>
          开始日期：<div className={styles.time}>{startTime}</div>
        </div>
        <div className={styles.dateTime}>
          开始日期：<div className={styles.time}>{endTime}</div>
          <Button type="primary" onClick={getDetailInfo} className={styles.searchBtn}>
            查询
          </Button>
        </div>
      </div>
      <div className={styles.selfCollapseWrap}>
        <Collapse
          accordion
          expandIconPosition="right"
          className="selfCollapse"
          defaultActiveKey="1"
        >
          <Panel header={`负责人 ${baseInfo.num}/${baseInfo.allnum}`} key="1" extra="到岗情况">
            <div className={styles.detailBox}> </div>
          </Panel>
          <Panel header={`车检特保 ${baseInfo.num}/${baseInfo.allnum}`} key="2" extra="到岗情况">
            <div className={styles.detailBox}> </div>
          </Panel>
          <Panel header={`安检人员 ${baseInfo.num}/${baseInfo.allnum}`} key="3" extra="到岗情况">
            <div className={styles.detailBox}> </div>
          </Panel>
          <Panel header={`巡逻特保 ${baseInfo.num}/${baseInfo.allnum}`} key="4" extra="到岗情况">
            <div className={styles.detailBox}> </div>
          </Panel>
          <Panel header={`设备 ${baseInfo.num}/${baseInfo.allnum}`} key="5" extra="设备详情">
            <div className={styles.detailBox}> </div>
          </Panel>
        </Collapse>
      </div>
      <div className={styles.yrydBox}>
        <div className={styles.secondTitle}>一人一档</div>
        <div className={styles.yrydDetail}>
          <div className={styles.con}>
            <div className={styles.name}>安检人数</div>
            <span>{itemData.passengerFlow || 0}</span>
          </div>
          <div className={styles.con}>
            <div className={styles.name}>过包总数</div>
            <span>{itemData.totalPackage || 0}</span>
          </div>
          <div className={styles.con}>
            <div className={styles.name}>违禁包裹总数</div>
            <span style={{ color: '#f0bb04' }}>{itemData.dangerousPackage || 0}</span>
          </div>
          <div className={styles.con}>
            <div className={styles.name}>违禁品总数</div>
            <span style={{ color: '#ff0000' }}>{itemData.dangerous || 0}</span>
          </div>
        </div>
      </div>

      <div className={styles.securityScroll} style={{ marginBottom: '10px' }}>
        <Tabs defaultActiveKey="1" onChange={changeTab}>
          <TabPane tab="人员" key="1">
            <div style={{ height: '100%', marginTop: '10px' }}>
              <Row className={styles.tableTitle}>
                <Col span={12}>通道名称</Col>
                <Col span={4}>正面照片</Col>
                <Col span={4}>背面照片</Col>
                <Col span={4}>体温</Col>
              </Row>
              <div className={styles.tableContent} id="RenScroll">
                {/* {renList.map((item: any) => (
                  <Row className={styles.rowItem} key={item.id}>
                    <Col span={12}>{item.assignAreaPath}</Col>
                    <Col span={4} className={styles.alginCenter}>
                      <Image
                        width={36}
                        src={item?.faceUrls[0]}
                        preview={false}
                        onClick={() => {
                          showDetail(item?.faceUrls[0]);
                        }}
                      />
                    </Col>
                    <Col span={4} className={styles.alginCenter}>
                      <Image
                        width={36}
                        src={item.bkgUrl[0]}
                        preview={false}
                        onClick={() => {
                          showDetail(item.bkgUrl[0]);
                        }}
                      />
                    </Col>
                    <Col span={4}>{item.temperature}</Col>
                  </Row>
                ))} */}
              </div>
            </div>
          </TabPane>
          <TabPane tab="包裹" key="2">
            <div style={{ height: '100%', marginTop: '10px' }}>
              <Row className={styles.tableTitle}>
                <Col span={20}>通道名称</Col>
                <Col span={4}>照片</Col>
              </Row>
              <div className={styles.tableContent} id="CheScroll">
                {/* {baoList.map((item: any) => (
                  <Row className={styles.rowItem} key={item.id}>
                    <Col span={20}>{item.assignAreaPath}</Col>
                    <Col span={4} className={styles.alginCenter}>
                      
                      <Image
                        width={36}
                        src={item.packageImgUrls[0]}
                        preview={false}
                        onClick={() => {
                          showDetail(item.packageImgUrls[0]);
                        }}
                      />
                    </Col>
                  </Row>
                ))} */}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
      {visible && (
        <BigImageView
          imgUrl={imgUrl}
          onCancel={() => {
            setVisible(false);
          }}
        />
      )}
    </div>
  );
};
export default SecurityDetail;
