import styles from './indexNew.less';
import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
//定义props的类型
interface Props {
  popupData: {
    type: string;
    title: string;
    style: any;
    header: string[];
    attrs: string[];
  };
}

const PopupAlertTable: React.FC<Props> = (props) => {
  const { popupData } = props;

  useEffect(() => {
    console.log('popupData:', popupData);
    if (popupData) {
      const list = [
        { name: '安检口1', num1: 1, num2: 1, num3: 3, num4: 4, num5: 5 },
        { name: '安检口2', num1: 1, num2: 1, num3: 3, num4: 4, num5: 5 },
        { name: '安检口3', num1: 1, num2: 1, num3: 3, num4: 4, num5: 5 },
        { name: '安检口4', num1: 1, num2: 1, num3: 3, num4: 4, num5: 5 },
        { name: '安检口5', num1: 1, num2: 1, num3: 3, num4: 4, num5: 5 },
        { name: '安检口5', num1: 1, num2: 1, num3: 3, num4: 4, num5: 5 },
        { name: '安检口5', num1: 1, num2: 1, num3: 3, num4: 4, num5: 5 },
        { name: '安检口6', num1: 1, num2: 1, num3: 3, num4: 4, num5: 5 },
      ];
      let str = '';
      list.forEach((item: any) => {
        str += `<div class='JQScroll'>
              <span class="li-9">${item.name}</span>
              <span class="li-3 center">${item.num1}</span>
              <span class="li-3 center">${item.num2}</span>
              <span class="li-3 center">${item.num3}</span>
              <span class="li-3 center">${item.num4}</span>
              <span class="li-3 center">${item.num5}</span>
            </div>`;
      });
      $('#dryzTable').html(str);
      $('#dryzTable').liMarquee('destroy');
      if (list.length > 6) {
        $('#dryzTable').addClass('canDrug');
        $('#dryzTable').liMarquee({
          scrollamount: 30,
          direction: 'up',
        });
      } else {
        $('#dryzTable').removeClass('canDrug');
      }
    }
  }, [popupData]);
  return (
    <>
      <div className={styles.popupListStyle} style={popupData.style}>
        <div className={styles.popupTitle}>{popupData.title}</div>
        <div
          className={`${styles.tableBox}  ${styles.policeInfo} ${styles.popupListStylePoliceInfo}`}
        >
          <Row className={styles.tableTitle}>
            <Col span={9}>安检口</Col>
            <Col span={3}>客流量</Col>
            <Col span={3}>温度异常数</Col>
            <Col span={3}>温度异常率</Col>
            <Col span={3}>金属告警数</Col>
            <Col span={3}>金属告警率</Col>
          </Row>
          <div style={{ height: '300px' }} id="dryzTableBox">
            <div id="dryzTable" />
          </div>
        </div>
      </div>
    </>
  );
};
export default PopupAlertTable;
