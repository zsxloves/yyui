import styles from './index.less';
import React, { useEffect, useRef } from 'react';
import { Row, Col } from 'antd';
import { packageRecords } from '@/services/bigScreen';
import { getDateDuring } from '@/utils/utilsJS';

//定义props的类型
interface Props {
  backPreViewImage: (url: string) => void;
  popupType: string;
  popupData: {
    type: string;
    title: string;
    style: any;
  };
}
declare global {
  interface Window {
    showBigImage: any;
  }
}

const PopupAlertContraband: React.FC<Props> = (props) => {
  const { popupData, popupType, backPreViewImage } = props;
  const startTime = useRef('');
  const endTime = useRef('');

  window.showBigImage = (url: string) => {
    backPreViewImage(url);
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
    // const list = [
    //   {assignAreaPath:'1发生纠纷哈吉斯',packageImgUrls:'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp'},
    //   {assignAreaPath:'2发生纠纷哈吉斯',packageImgUrls:'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp'},
    //   {assignAreaPath:'3发生纠纷哈吉斯',packageImgUrls:'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp'},
    //   {assignAreaPath:'3发生纠纷哈吉斯',packageImgUrls:'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp'},
    //   {assignAreaPath:'3发生纠纷哈吉斯',packageImgUrls:'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp'},
    //   {assignAreaPath:'4发生纠纷哈吉斯',packageImgUrls:'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp'}
    // ];
    //       let str = '';
    //       list.forEach((item: any) => {
    //         str += `<div class='JQScroll'>
    //           <span class="li-18">${item.assignAreaPath}</span>
    //           <span class="li-6 center">
    //             <img style="width:42px;height:42px" src="${item?.packageImgUrls}" onclick="showBigImage('${item?.packageImgUrls}')" />
    //           </span>
    //         </div>`;
    //       });
    //       $('#ContrabandScrollAlert').html(str);
    //       $('#ContrabandScrollAlert').liMarquee('destroy');
    //       if (list.length > 4) {
    //         $('#ContrabandScrollAlert').addClass('canDrug');
    //         $('#ContrabandScrollAlert').liMarquee({
    //           scrollamount: 30,
    //           direction: 'up',
    //         });
    //       } else {
    //         $('#ContrabandScrollAlert').removeClass('canDrug');
    //       }
    // return
    packageRecords(params)
      .then((res: any) => {
        if (res.code) {
          const list = res.result?.result?.list || [];
          let str = '';
          list.forEach((item: any) => {
            str += `<div class='JQScroll'>
              <span class="li-18">${item.assignAreaPath}</span>
              <span class="li-6 center">
                <img style="width:42px;height:42px" src="${item?.packageImgUrls[0]}" onclick="showBigImage('${item?.packageImgUrls[0]}')" />
              </span>
            </div>`;
          });
          $('#ContrabandScrollAlert').html(str);
          $('#ContrabandScrollAlert').liMarquee('destroy');
          if (list.length > 4) {
            $('#ContrabandScrollAlert').addClass('canDrug');
            $('#ContrabandScrollAlert').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#ContrabandScrollAlert').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  // 获取安检包裹
  const getPackageType = () => {
    // const params = {
    //   // indexCodes: ['5eaf92bdb1ac4b65828042f1f23ae3e6','8bd84d1c10d143e096625f6f32121416','64a39481ff4d4a9d888cfef0eb6c84ad','f0e2911917c4436d85c736197ff4d33c'],
    //   pageNo: 1,
    //   pageSize: 100,
    //   startTime: startTime.current,
    //   endTime: endTime.current,
    // };
    const list = [
      { id: 1, type: '刀具', num: 10 },
      { id: 2, type: '火药', num: 10 },
      { id: 3, type: '铁器', num: 10 },
      { id: 4, type: '丰大厦股份', num: 10 },
      { id: 5, type: '其他', num: 10 },
    ];
    let str = '';
    list.forEach((item: any) => {
      str += `<div class='JQScroll'>
              <span class="li-16">${item.type}</span>
              <span class="li-8 center">${item?.num}</span>
            </div>`;
    });
    $('#ContrabandScrollType').html(str);
    $('#ContrabandScrollType').liMarquee('destroy');
    if (list.length > 4) {
      $('#ContrabandScrollType').addClass('canDrug');
      $('#ContrabandScrollType').liMarquee({
        scrollamount: 30,
        direction: 'up',
      });
    } else {
      $('#ContrabandScrollType').removeClass('canDrug');
    }
    // packageRecords(params)
    //   .then((res: any) => {
    //     if (res.code) {
    //       const list = res.result?.result?.list || [];
    //       let str = '';
    //       list.forEach((item: any) => {
    //         str += `<div class='JQScroll'>
    //           <span class="li-18">${item.assignAreaPath}</span>
    //           <span class="li-6 center">
    //             <img style="width:42px;height:42px" src="${item?.packageImgUrls[0]}" onclick="showBigImage('${item?.packageImgUrls[0]}')" />
    //           </span>
    //         </div>`;
    //       });
    //       $('#ContrabandScrollAlert').html(str);
    //       $('#ContrabandScrollAlert').liMarquee('destroy');
    //       if (list.length > 4) {
    //         $('#ContrabandScrollAlert').addClass('canDrug');
    //         $('#ContrabandScrollAlert').liMarquee({
    //           scrollamount: 30,
    //           direction: 'up',
    //         });
    //       } else {
    //         $('#ContrabandScrollAlert').removeClass('canDrug');
    //       }
    //     }
    //   })
    //   .catch((err: any) => {
    //     console.log(err.message || err);
    //   });
  };

  useEffect(() => {
    const paramDate: any = getDateDuring(window.hdObj.startTime, window.hdObj.endTime);
    startTime.current = paramDate?.start;
    endTime.current = paramDate?.end;
    if (popupType === 'wjbgzs') {
      getPackageRecords();
    } else if (popupType === 'wjpzs') {
      getPackageType();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupType]);
  return (
    <div>
      {popupType === 'wjbgzs' ? (
        <div className={styles.popupListStyle} style={popupData.style}>
          <div style={{ height: '100%' }}>
            <div className={styles.popupTitle}>{popupData.title}</div>
            <div
              className={`${styles.tableBox}  ${styles.policeInfo} ${styles.popupListStylePoliceInfo}`}
            >
              <div style={{ height: '100%' }}>
                <Row className={styles.tableTitle}>
                  <Col span={18}>通道名称</Col>
                  <Col span={6}>照片</Col>
                </Row>
                <div id="ContrabandScrollAlert" style={{ height: 'calc(100% - 40px)' }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.popupListStyle} style={popupData.style}>
          <div style={{ height: '100%' }}>
            <div className={styles.popupTitle}>{popupData.title}</div>
            <div
              className={`${styles.tableBox}  ${styles.policeInfo} ${styles.popupListStylePoliceInfo}`}
            >
              <div style={{ height: '100%' }}>
                <Row className={styles.tableTitle}>
                  <Col span={16}>种类</Col>
                  <Col span={8}>数量</Col>
                </Row>
                <div id="ContrabandScrollType" style={{ height: 'calc(100% - 40px)' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PopupAlertContraband;
