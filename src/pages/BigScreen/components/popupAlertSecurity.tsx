import styles from './indexNew.less';
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Row, Col } from 'antd';
// import ScrollBoard from '@jiaminghi/data-view-react/es/scrollBoard';
import BigImageView from './bigImageView';
import { checkCollect, visitorRecords, packageRecords } from '@/services/bigScreen';
import { getDateDuring } from '@/utils/utilsJS';
import { checkCollectJSON, visitorRecordsJSON, packageRecordsJSON } from '../service';

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
  // const [config1, setConfig1] = useState<any>();
  // const [config2, setConfig2] = useState<any>();
  // const [config3, setConfig3] = useState<any>();
  const [itemHJ, setItemHJ] = useState<any>({});
  const startTime = useRef('');
  const endTime = useRef('');

  const [visiableBigImage, setVisiableBigImage] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>('');

  window.showBigImage = (url: string) => {
    setImgUrl(url);
    setVisiableBigImage(true);
  };

  // 获取安检点位
  const getCheckCollect = () => {
    const gateIndexCodes = JSON.parse(window.cjObj.entity||"{}").ajtd || [];
    const entity = JSON.parse(window.cjObj.entity||"{}");
    const params = {
      indexCodes: window.ajSitId,
      pageNo: 1,
      pageSize: 100,
      startTime: entity?.startTime || startTime.current,
      endTime: entity?.endTime || endTime.current,
      gateIndexCodes,
      resType: 0,
      bodyResType: '1',
    };
    checkCollect(params)
      .then((res: any) => {
        if (res.code) {
          // const configData: any = {
          //   header: popupData.tableList[0].header,
          //   data: [],
          //   headerHeight: 40,
          //   headerBGC: 'rgba(98,217,255,0.2)',
          //   oddRowBGC: 'rgba(0,0,0,0)',
          //   evenRowBGC: 'rgba(98,217,255,0.1)',
          //   hoverPause: true,
          //   rowNum: 5,
          // };
          // const data = res.result?.result?.list || [];
          // const tableData: any[] = [];
          // data.forEach((item: any) => {
          //   const arr: string[] = [];
          //   popupData.tableList[0].attrs.forEach((attr: string) => {
          //     arr.push(item[attr]);
          //   });
          //   tableData.push(arr);
          //   if (item.name == '合计') {
          //     callBackHJ(item);
          //   }
          // });
          // configData.data = tableData;
          // setConfig1(configData);

          const list = res.result?.result?.list || [];
          let str = '';
          // const isDDH = window.cjObj.name==='两会'
          if (list.length < 5) {
            setItemHJ({});
            list.forEach((item: any) => {
              str += `<div class='JQScroll'>
                <span class="li-8">${item.name}</span>
                <span class="li-4 center">${item.passengerFlow}</span>
                <span class="li-4 center">${item.totalPackage}</span>
                <span class="li-4 center">${item.dangerousPackage}</span>
                <span class="li-4 center">${item.dangerous}</span>
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
                  <span class="li-4 center">${item.passengerFlow}</span>
                  <span class="li-4 center">${item.totalPackage}</span>
                  <span class="li-4 center">${item.dangerousPackage}</span>
                  <span class="li-4 center">${item.dangerous}</span>
                </div>`;
              } else {
                const newItem = item.passengerFlow;
                setItemHJ(newItem);
                callBackHJ(item);
              }
            });
          }
          $('#AJPERSON').html(str);
          $('#AJPERSON').liMarquee('destroy');
          if (list.length > 5) {
            $('#AJPERSON').addClass('canDrug');
            $('#AJPERSON').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#AJPERSON').removeClass('canDrug');
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
      indexCodes: window.ajSitId,
      pageNo: 1,
      pageSize: 100,
      startTime: startTime.current,
      endTime: endTime.current,
    };
    visitorRecords(params)
      .then((res: any) => {
        // if (res.code) {
        //   const configData: any = {
        //     header: popupData.tableList[1].header,
        //     data: [],
        //     headerHeight: 40,
        //     headerBGC: 'rgba(98,217,255,0.2)',
        //     oddRowBGC: 'rgba(0,0,0,0)',
        //     evenRowBGC: 'rgba(98,217,255,0.1)',
        //     hoverPause: true,
        //     rowNum: 4,
        //   };
        //   const data = res.result?.result?.list || [];
        //   const tableData: any[] = [];
        //   data.forEach((item: any) => {
        //     const arr: string[] = [];
        //     const style = 'width:40px;height:40px;cursor:pointer;';
        //     popupData.tableList[1].attrs.forEach((attr: string) => {
        //       if (attr.indexOf('Url') !== -1) {
        //         arr.push(
        //           `<img style=${style} onclick="showBigImage('${item[attr][0]}')" src="${item[attr][0]}"/>`,
        //         );
        //       } else {
        //         arr.push(item[attr]);
        //       }
        //     });
        //     tableData.push(arr);
        //   });
        //   configData.data = tableData;
        //   setConfig2(configData);
        // }
        if (res.code === 200) {
          const list = res.result?.result?.list || [];
          let str = '';
          list.forEach((item: any) => {
            str += `<div class='JQScroll'>
              <span class="li-12">${item.deviceName}</span>
              <span class="li-4 center">
                <img style="width:42px;height:42px" src="${
                  item?.faceUrls?.[1] || ''
                }" onclick="showBigImage('${item?.faceUrls?.[1] || ''}')" />
              </span>
              <span class="li-4 center">
                <img style="width:42px;height:42px" src="${
                  item?.faceUrls?.[0] || ''
                }" onclick="showBigImage('${item?.faceUrls?.[0] || ''}')" />
              </span>
              <span class="li-4">${item.temperature || '未知'}</span>
            </div>`;
          });
          $('#RenScrollAlert').html(str);
          $('#RenScrollAlert').liMarquee('destroy');
          if (list.length > 4) {
            $('#RenScrollAlert').addClass('canDrug');
            $('#RenScrollAlert').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#RenScrollAlert').removeClass('canDrug');
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
      // indexCodes: ['5eaf92bdb1ac4b65828042f1f23ae3e6','8bd84d1c10d143e096625f6f32121416','64a39481ff4d4a9d888cfef0eb6c84ad','f0e2911917c4436d85c736197ff4d33c'],
      pageNo: 1,
      pageSize: 100,
      startTime: startTime.current,
      endTime: endTime.current,
    };
    packageRecords(params)
      .then((res: any) => {
        if (res.code) {
          const list = res.result?.result?.list || [];
          let str = '';
          list.forEach((item: any) => {
            str += `<div class='JQScroll'>
              <span class="li-18">${item.deviceName}</span>
              <span class="li-6 center">
                <img style="width:42px;height:42px" src="${item?.packageImgUrls[0]}" onclick="showBigImage('${item?.packageImgUrls[0]}')" />
              </span>
            </div>`;
          });
          $('#CheScrollAlert').html(str);
          $('#CheScrollAlert').liMarquee('destroy');
          if (list.length > 4) {
            $('#CheScrollAlert').addClass('canDrug');
            $('#CheScrollAlert').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#CheScrollAlert').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  // 获取安检点位
  const getCheckCollectJSON = () => {
    const gateIndexCodes = JSON.parse(window.cjObj.entity||"{}").ajtd || [];
    const entity = JSON.parse(window.cjObj.entity||"{}");
    const params = {
      indexCodes: window.ajSitId,
      pageNo: 1,
      pageSize: 100,
      startTime: entity?.startTime || startTime.current,
      endTime: entity?.endTime || endTime.current,
      gateIndexCodes,
      resType: 0,
      bodyResType: '1',
    };
    checkCollectJSON(params)
      .then((res: any) => {
        if (res.code) {
          // const configData: any = {
          //   header: popupData.tableList[0].header,
          //   data: [],
          //   headerHeight: 40,
          //   headerBGC: 'rgba(98,217,255,0.2)',
          //   oddRowBGC: 'rgba(0,0,0,0)',
          //   evenRowBGC: 'rgba(98,217,255,0.1)',
          //   hoverPause: true,
          //   rowNum: 5,
          // };
          // const data = res.result?.result?.list || [];
          // const tableData: any[] = [];
          // data.forEach((item: any) => {
          //   const arr: string[] = [];
          //   popupData.tableList[0].attrs.forEach((attr: string) => {
          //     arr.push(item[attr]);
          //   });
          //   tableData.push(arr);
          //   if (item.name == '合计') {
          //     callBackHJ(item);
          //   }
          // });
          // configData.data = tableData;
          // setConfig1(configData);

          const list = res.result?.result?.list || [];
          let str = '';
          // const isDDH = window.cjObj.name==='两会'
          if (list.length < 5) {
            setItemHJ({});
            list.forEach((item: any) => {
              str += `<div class='JQScroll'>
                <span class="li-8">${item.name}</span>
                <span class="li-4 center">${item.passengerFlow}</span>
                <span class="li-4 center">${item.totalPackage}</span>
                <span class="li-4 center">${item.dangerousPackage}</span>
                <span class="li-4 center">${item.dangerous}</span>
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
                  <span class="li-4 center">${item.passengerFlow}</span>
                  <span class="li-4 center">${item.totalPackage}</span>
                  <span class="li-4 center">${item.dangerousPackage}</span>
                  <span class="li-4 center">${item.dangerous}</span>
                </div>`;
              } else {
                const newItem = item.passengerFlow;
                setItemHJ(newItem);
                callBackHJ(item);
              }
            });
          }
          $('#AJPERSON').html(str);
          $('#AJPERSON').liMarquee('destroy');
          if (list.length > 5) {
            $('#AJPERSON').addClass('canDrug');
            $('#AJPERSON').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#AJPERSON').removeClass('canDrug');
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
      indexCodes: window.ajSitId,
      pageNo: 1,
      pageSize: 100,
      startTime: startTime.current,
      endTime: endTime.current,
    };
    visitorRecordsJSON(params)
      .then((res: any) => {
        // if (res.code) {
        //   const configData: any = {
        //     header: popupData.tableList[1].header,
        //     data: [],
        //     headerHeight: 40,
        //     headerBGC: 'rgba(98,217,255,0.2)',
        //     oddRowBGC: 'rgba(0,0,0,0)',
        //     evenRowBGC: 'rgba(98,217,255,0.1)',
        //     hoverPause: true,
        //     rowNum: 4,
        //   };
        //   const data = res.result?.result?.list || [];
        //   const tableData: any[] = [];
        //   data.forEach((item: any) => {
        //     const arr: string[] = [];
        //     const style = 'width:40px;height:40px;cursor:pointer;';
        //     popupData.tableList[1].attrs.forEach((attr: string) => {
        //       if (attr.indexOf('Url') !== -1) {
        //         arr.push(
        //           `<img style=${style} onclick="showBigImage('${item[attr][0]}')" src="${item[attr][0]}"/>`,
        //         );
        //       } else {
        //         arr.push(item[attr]);
        //       }
        //     });
        //     tableData.push(arr);
        //   });
        //   configData.data = tableData;
        //   setConfig2(configData);
        // }
        if (res.code === 200) {
          const list = res.result?.result?.list || [];
          let str = '';
          list.forEach((item: any) => {
            str += `<div class='JQScroll'>
              <span class="li-12">${item.assignAreaPath}</span>
              <span class="li-4 center">
                <img style="width:42px;height:42px" src="/img/json/${
                  item?.faceUrls[0]
                }.png" onclick="showBigImage('/img/json/${
                  item?.faceUrls[0]
                }.png')" />
              </span>
              <span class="li-4 center">
                <img style="width:42px;height:42px" src="/img/json/${
                  item?.bkgUrl[0]
                }.png" onclick="showBigImage('/img/json/${
                  item?.bkgUrl[0]
                }.png')" />
              </span>
              <span class="li-4">${item.temperature || '未知'}</span>
            </div>`;
          });
          $('#RenScrollAlert').html(str);
          $('#RenScrollAlert').liMarquee('destroy');
          if (list.length > 4) {
            $('#RenScrollAlert').addClass('canDrug');
            $('#RenScrollAlert').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#RenScrollAlert').removeClass('canDrug');
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
      // indexCodes: ['5eaf92bdb1ac4b65828042f1f23ae3e6','8bd84d1c10d143e096625f6f32121416','64a39481ff4d4a9d888cfef0eb6c84ad','f0e2911917c4436d85c736197ff4d33c'],
      pageNo: 1,
      pageSize: 100,
      startTime: startTime.current,
      endTime: endTime.current,
    };
    packageRecordsJSON(params)
      .then((res: any) => {
        if (res.code) {
          const list = res.result?.result?.list || [];
          let str = '';
          list.forEach((item: any) => {
            str += `<div class='JQScroll'>
              <span class="li-18">${item.assignAreaPath}</span>
              <span class="li-6 center">
                <img style="width:42px;height:42px" src="/img/json/${item?.packageImgUrls[0]}.png" onclick="showBigImage('/img/json/${item?.packageImgUrls[0]}.png')" />
              </span>
            </div>`;
          });
          $('#CheScrollAlert').html(str);
          $('#CheScrollAlert').liMarquee('destroy');
          if (list.length > 4) {
            $('#CheScrollAlert').addClass('canDrug');
            $('#CheScrollAlert').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#CheScrollAlert').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  const changeTab = (key: any) => {
      const entity = JSON.parse(window.cjObj.entity||"{}");
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
    isFirst = true;
    const paramDate: any = getDateDuring(window.hdObj.startTime, window.hdObj.endTime);
    startTime.current = paramDate?.start;
    endTime.current = paramDate?.end;
    const entity = JSON.parse(window.cjObj.entity||"{}");
    if (popupData) {
      // callBackHJ({
      //   passengerFlow: 100,
      //   dangerousPackage: 110,
      //   dangerous: 120,
      // });
      if(entity?.debug==1){
        getCheckCollectJSON();
        getVisitorRecordsJSON();
      }else{
        getCheckCollect();
        getVisitorRecords();
      }
      
      // getPackageRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Row className={styles.tableTitle} style={{ "textAlign": "center" }}>
              <Col span={8}>安检口</Col>
              <Col span={4}>安检人数</Col>
              <Col span={4}>过包总数</Col>
              <Col span={4}>违禁包裹总数</Col>
              <Col span={4}>违禁品总数</Col>
            </Row>
            <div id="AJPERSON" style={{ "position": "relative" }} />
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
                <Row className={styles.tableTitle} style={{ "textAlign": "center" }}>
                  <Col span={12}>通道名称</Col>
                  <Col span={4}>正面照片</Col>
                  <Col span={4}>背面照片</Col>
                  <Col span={4}>体温</Col>
                </Row>
                <div id="RenScrollAlert" />
              </div>
            </TabPane>
            <TabPane tab="包裹" key="2">
              {/* <div className="tableContent">{config3 && <ScrollBoard config={config3} />}</div> */}
              <div style={{ height: '100%', marginTop: '10px' }}>
                <Row className={styles.tableTitle}>
                  <Col span={18}>通道名称</Col>
                  <Col span={6}>照片</Col>
                </Row>
                <div id="CheScrollAlert" />
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
