/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import React, { useState, useEffect } from 'react';
import { Button, Collapse, Tabs, Row, Col } from 'antd';
import BigImageView from './bigImageView';
import { queryCheckGroupList, queryCheckRecordList, queryCheckList } from '@/services/bigScreen';
import { getDate } from '@/utils/utilsJS';
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
  const [visible, setVisible] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>('');
  const [itemData, setItemData] = useState<any>({});
  const [equipmentData, setequipmentData] = useState<any>([])
  const jczType = {
    1: '固定',
    2: '移动',
    3: '水上',
    4: '其他'
  }
  window.showDetailImageFun = (url: any) => {
    setVisible(true);
    setImgUrl(url);
  };
  // 检查站抓拍预警统计
  const getCheckCollect = () => {
    const dataTime = getDate(0);
    const params = {
      "begin": dataTime.endDate + ' 00:00:00',
      // "checkPointIdList": ['1001'],
      "checkPointIdList": [bayonetId],
      "end": dataTime.endDate + ' 23:59:59'
    };
    queryCheckGroupList(params)
      .then((res: any) => {
        if (res.code) {
          const data = res.result?.result || [];
          if (data.length > 0) {
            setItemData(data[0]);
          } else {
            setItemData({});
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
      "checkPointIdList": [bayonetId],
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
            str += `<div class='JQScroll'>
              <span class="li-20">${item.channelName?item.channelName:''}</span>
              <span class="li-4 center">
                <img style="width:42px;height:42px" src="${item?.cacheFaceImgUrl
              }" onclick="showDetailImageFun('${item?.cacheFaceImgUrl}')" />
              </span>
            </div>`;
          });
          $('#RenjczScroll').html(str);
          $('#RenjczScroll').liMarquee('destroy');
          if (list.length > 4) {
            $('#RenjczScroll').addClass('canDrug');
            $('#RenjczScroll').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#RenjczScroll').removeClass('canDrug');
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
      "checkPointIdList": [bayonetId],
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
            const imgurl = JSON.parse(item?.imageList||"[]")
            str += `<div class='JQScroll'>
              <span class="li-20">${item.channelName?item.channelName:''}</span>
              <span class="li-4 center">
                <img style="width:42px;height:42px" src="${imgurl[0]?.cacheUrl
              }" onclick="showDetailImageFun('${imgurl[0]?.cacheUrl}')" />
              </span>
            </div>`;
          });
          $('#ChejczScroll').html(str);
          $('#ChejczScroll').liMarquee('destroy');
          if (list.length > 4) {
            $('#ChejczScroll').addClass('canDrug');
            $('#ChejczScroll').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#ChejczScroll').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  // 检查站列表
  const getCheckList = () => {
    const dataTime = getDate(0);
    const params = {
      "begin": dataTime.endDate + ' 00:00:00',
      "checkPointIdList": [bayonetId],
      "end": dataTime.endDate + ' 23:59:59',
    };
    queryCheckList(params)
      .then((res: any) => {
        if (res.code) {
          const list = res?.result?.result || [];
          const obj = list.length > 0 ? list[0] : {}
          setequipmentData(obj)
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  const getDetailInfo = () => {
    isFirst = true;
    getCheckCollect();
    getCheckList();
    if (ind === '1') {
      getVisitorRecords();
    } else {
      getPackageRecords();
    }
  };
  const changeTab = (key: any) => {
    ind = key;
    console.log(key, isFirst);
    if (key === '1' && isFirst) {
      getVisitorRecords();
      isFirst = false;
    } else if (key === '2' && isFirst) {
      getPackageRecords();
      isFirst = false;
    }
  };
  useEffect(() => {
    getDetailInfo();
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
      <div className={styles.yrydBox}>
        <div className={styles.secondTitle} style={{marginBottom:'1px'}}>基本信息</div>
        <Collapse
          accordion
          expandIconPosition="right"
          className="selfCollapse"
          collapsible={'disabled'}
          expandIcon={() => <span></span>}
        >
          <Panel header={`检查站类型：${jczType[equipmentData.type] ? jczType[equipmentData.type] : '无'}`} key="1" extra={`检查站等级：${equipmentData.level ? equipmentData.level : "无"}级`}>
          </Panel>
          <Panel header={`地址名称：${equipmentData.address ? equipmentData.address : '无'}`} key="2" extra="">
          </Panel>
          <Panel header={`联系电话：${equipmentData.tel ? equipmentData.tel : '无'}`} key="3" extra="">
          </Panel>
          <Panel header={`归属单位名称：${equipmentData.org_name ? equipmentData.org_name : '无'}`} key="4" extra="">
          </Panel>
          <Panel header={`主要负责人：${equipmentData.head_name ? equipmentData.head_name : '无'}`} key="5" extra="">
          </Panel>
          <Panel header={`负责人联系电话：${equipmentData.head_tel ? equipmentData.head_tel : '无'}`} key="5" extra="">
          </Panel>
        </Collapse>
      </div>
      <div className={`${styles.yrydBox} ${styles.yrydBoxBox}`}>
        <div className={styles.secondTitle}>设备信息</div>
        <div className={styles.yrydDetail}>
          <div className={styles.con}>
            <div className={styles.name}
              style={{ borderLeft: 'none',width:'100%',display:'flex',alignItems: 'center',
              justifyContent: 'space-between' }}>车道数量：
              <span style={{fontFamily:'none'}}>{equipmentData.checkPointCrossVO && equipmentData.checkPointCrossVO.lane || 0}</span></div>
          </div>
          <div className={styles.con}>
            <div className={styles.name}
              style={{ borderLeft: 'none',width:'100%',display:'flex',alignItems: 'center',
              justifyContent: 'space-between' }}>工位数量/车道：
              <span style={{fontFamily:'none'}}>{equipmentData.checkPointCrossVO && equipmentData.checkPointCrossVO.station || 0}</span></div>
          </div>
          <div className={styles.con}>
            <div className={styles.name}
              style={{ borderLeft: 'none',width:'100%',display:'flex',alignItems: 'center',
              justifyContent: 'space-between' }}>车辆抓拍机：
              <span style={{fontFamily:'none'}}>{equipmentData.checkPointCrossVO && equipmentData.checkPointCrossVO.vehicleSnapper || 0}</span></div>
          </div>
          <div className={styles.con}>
            <div className={styles.name}
              style={{ borderLeft: 'none',width:'100%',display:'flex',alignItems: 'center',
              justifyContent: 'space-between' }}>人脸抓拍机：
              <span style={{fontFamily:'none'}}>{equipmentData.checkPointCrossVO && equipmentData.checkPointCrossVO.faceSnapper || 0}</span></div>
          </div>
          <div className={styles.con}>
            <div className={styles.name}
              style={{ borderLeft: 'none',width:'100%',display:'flex',alignItems: 'center',
              justifyContent: 'space-between' }}>安检机：
              <span style={{fontFamily:'none'}}>{equipmentData.checkPointCrossVO && equipmentData.checkPointCrossVO.securityCheck || 0}</span></div>
          </div>
          <div className={styles.con}>
            <div className={styles.name}
              style={{ borderLeft: 'none',width:'100%',display:'flex',alignItems: 'center',
              justifyContent: 'space-between' }}>车底设备：
              <span style={{fontFamily:'none'}}>{equipmentData.checkPointCrossVO && equipmentData.checkPointCrossVO.chassisSystem || 0}</span></div>
          </div>
          <div className={styles.con}>
            <div className={styles.name}
              style={{ borderLeft: 'none',width:'100%',display:'flex',alignItems: 'center',
              justifyContent: 'space-between' }}>人证设备：
              <span style={{fontFamily:'none'}}>{equipmentData.checkPointCrossVO && equipmentData.checkPointCrossVO.certificate || 0}</span></div>
          </div>
          <div className={styles.con}>
            <div className={styles.name}
              style={{ borderLeft: 'none',width:'100%',display:'flex',alignItems: 'center',
              justifyContent: 'space-between' }}>车辆道闸：
              <span style={{fontFamily:'none'}}>{equipmentData.checkPointCrossVO && equipmentData.checkPointCrossVO.barrier || 0}</span></div>
          </div>

          <div className={styles.con}>
            <div className={styles.name}
              style={{ borderLeft: 'none',width:'100%',display:'flex',alignItems: 'center',
              justifyContent: 'space-between' }}>升降柱设备：
              <span style={{fontFamily:'none'}}>{equipmentData.checkPointCrossVO && equipmentData.checkPointCrossVO.lifting || 0}</span></div>
          </div>
          <div className={styles.con}>
            <div className={styles.name}
              style={{ borderLeft: 'none',width:'100%',display:'flex',alignItems: 'center',
              justifyContent: 'space-between' }}>Led屏：
              <span style={{fontFamily:'none'}}>{equipmentData.checkPointCrossVO && equipmentData.checkPointCrossVO.led || 0}</span></div>
          </div>
        </div>
      </div>
      <div className={styles.yrydBox}>
        <div className={styles.secondTitle}>检查站</div>
        <div className={styles.yrydDetail}>
          <div className={styles.con}>
            <div className={styles.name}>入杭人数</div>
            <span>{itemData.pedestrian || 0}</span>
          </div>
          <div className={styles.con}>
            <div className={styles.name}>入杭车辆数</div>
            <span>{itemData.vehicle || 0}</span>
          </div>
          <div className={styles.con} style={{ marginBottom: '0' }}>
            <div className={styles.name}>预警人数</div>
            <span style={{ color: '#f0bb04' }}>{itemData.faceAlarm || 0}</span>
          </div>
          <div className={styles.con} style={{ marginBottom: '0' }}>
            <div className={styles.name}>预警车辆数</div>
            <span style={{ color: '#ff0000' }}>{itemData.vehicleAlarm || 0}</span>
          </div>
        </div>
      </div>
      <div className={styles.securityScroll} style={{ marginBottom: '10px' }}>
        <Tabs defaultActiveKey="1" onChange={changeTab}>
          <TabPane tab="人员" key="1">
            <div style={{ height: '100%', marginTop: '10px' }}>
              <Row className={styles.tableTitle}>
                <Col span={20}>通道名称</Col>
                <Col span={4}>照片</Col>
                {/* <Col span={8}>抓拍时间</Col> */}
              </Row>
              <div className={styles.tableContent} id="RenjczScroll" style={{height:'180px'}}>
              </div>
            </div>
          </TabPane>
          <TabPane tab="车辆" key="2">
            <div style={{ height: '100%', marginTop: '10px' }}>
              <Row className={styles.tableTitle}>
                <Col span={20}>通道名称</Col>
                <Col span={4}>照片</Col>
              </Row>
              <div className={styles.tableContent} id="ChejczScroll" style={{height:'180px'}}>
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
