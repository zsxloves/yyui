import styles from './index.less';
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import BigImageView from './bigImageView';
import { getDutyPage } from '@/services/bigScreen';
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
      queryObject: {
        page: 0,
        size: 99,
        // beginLocalTime: dateStr,
        // endLocalTime: dateStr,
        ascending: false,
        propertyName: 'startTime',
        act: hdId,
      },
    };
    getDutyPage(params)
      .then((res: any) => {
        if (res.code) {
          const list = res.result?.page?.content || [];
          let str = '';
          if (list.length > 0) {
            list.forEach((item: any) => {
              str += `<div class='JQScroll'>
              <span class="li-6" title='${item.dept}'>${item.dept}</span>
              <span class="li-6">${item.num || 0}人</span>
              <span class="li-6">${item.user}</span>
              <span class="li-6">${item.phone}</span>
              </div>`;
            });
          }
          $('#ZBBPERSON').html(str);
          $('#ZBBPERSON').liMarquee('destroy');
          if (list.length > 9) {
            $('#ZBBPERSON').addClass('canDrug');
            $('#ZBBPERSON').liMarquee({
              scrollamount: 30,
              direction: 'up',
            });
          } else {
            $('#ZBBPERSON').removeClass('canDrug');
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
        <div className={styles.tabs} style={{ height: '100%' }}>
          <div className={styles.popupTitle}>{popupData.tableList[0].title}</div>
          <div
            className={`${styles.tableBox}  ${styles.policeInfo} ${styles.popupListStylePoliceInfo}`}
          >
            {/* {config1 && <ScrollBoard config={config1} />} */}
            <Row className={styles.tableTitle}>
              <Col span={6}>部门</Col>
              <Col span={6}>数量</Col>
              <Col span={6}>联系人</Col>
              <Col span={6}>联系方式</Col>
            </Row>
            <div id="ZBBPERSON" />
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
