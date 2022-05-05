// import styles from './../index.less'
import React, { useEffect } from 'react';
import styles from './index.less';
// import { formatDate } from '@/utils/utilsJS';
import { Row, Col } from 'antd';
import { getDateDuring } from '@/utils/utilsJS';
import { arCompetionsQuery } from '@/services/bigScreen';
//定义props的类型
interface Props {
  dataConfig: any;
  refresh: any;
}
const EventSchedule: React.FC<Props> = (props: any) => {
  const { refresh } = props;

  // 获取赛事
  const getCompetionsPageFun = () => {
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
        if (res.code === 200) {
          const list =
            res.data?.rows.map((item: any) => {
              item.startTime = item.startTime.substring(11);
              return item;
            }) || [];
          let str = '';
          list.forEach((item: any) => {
            str += `<div class='JQScroll'>
              <span class="li-6">${item.startTime}</span>
              <span class="li-8" title='${item.name}'>${item.name}</span>
              <span class="li-10" title='${item.remark ? item.remark : ''}'>${
              item.remark ? item.remark : ''
            }</span>
            </div>`;
          });
          $('#activeScroll').html(str);
          $('#activeScroll').liMarquee('destroy');
          if (list.length > 2) {
            $('#activeScroll').addClass('canDrug');
            $('#activeScroll').liMarquee({
              scrollamount: 15,
              direction: 'up',
            });
          } else {
            $('#activeScroll').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log('模块8刷新了');
    getCompetionsPageFun();
  }, [refresh]);
  return (
    <div className="leftOne">
      <div className={`${styles.policeInfo} ${styles.dutySty}`} style={{ height: '100%' }}>
        <Row className={styles.tableTitle}>
          <Col span={6}>时间</Col>
          <Col span={8}>活动名称</Col>
          <Col span={10}>活动地点</Col>
        </Row>
        <div className={styles.tableContent} id="activeScroll" />
      </div>
    </div>
  );
};
export default EventSchedule;
