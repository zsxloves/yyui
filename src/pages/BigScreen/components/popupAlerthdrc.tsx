import styles from './index.less';
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import BigImageView from './bigImageView';
import { arCompetionsQuery } from '@/services/bigScreen';
import { getDateDuring } from '@/utils/utilsJS';

//定义props的类型
interface Props {
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

const PopupAlertSecurity: React.FC<Props> = (props) => {
  const { popupData } = props;
  const [visiableBigImage, setVisiableBigImage] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>('');

  window.showBigImage = (url: string) => {
    setImgUrl(url);
    setVisiableBigImage(true);
  };

  // 点位
  const getCheckCollect = () => {
    const hdId = window.hdObj?.id || '';
    const paramDate = getDateDuring(window.hdObj.startTime, window.hdObj.endTime);
    const params = {
      pageNumber: 0,
      pageSize: 99,
      sortColumn: 'startTime',
      sortOrder: 'asc',
      startTimeBegin: paramDate?.start,
      startTimeEnd: paramDate?.end,
      activityIdList: [hdId],
    };
    arCompetionsQuery(params)
      .then((res: any) => {
        if (res.code) {
          const list = res.data?.rows || [];
          let str = '';
          if (list.length > 0) {
            list.forEach((item: any) => {
              str += `<div class='JQScroll'>
                <span class="li-8">${item.startTime}</span>
                <span class="li-8 center">${item.name}</span>
                <span class="li-8 center">${item.remark?item.remark:''}</span>
              </div>`;
            });
          }
          $('#HDRCPERSON').html(str);
          $('#HDRCPERSON').liMarquee('destroy');
          if (list.length > 9) {
            $('#HDRCPERSON').addClass('canDrug');
            $('#HDRCPERSON').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#HDRCPERSON').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  };
  useEffect(() => {
    if (popupData) {
      getCheckCollect();
    }
  }, [popupData]);
  return (
    <>
      <div className={styles.popupListStyle} style={popupData.style}>
        <div className={styles.tabs} style={{height:'100%'}}>
          <div className={styles.popupTitle}>{popupData.tableList[0].title}</div>
          <div
            className={`${styles.tableBox}  ${styles.policeInfo} ${styles.popupListStylePoliceInfo}`}
          >
            {/* {config1 && <ScrollBoard config={config1} />} */}
            <Row className={styles.tableTitle}>
              <Col span={8}>时间</Col>
              <Col span={8}>活动名称</Col>
              <Col span={8}>活动地点</Col>
            </Row>
            <div id="HDRCPERSON" />
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
