// import styles from './../index.less'
import React, { useEffect } from 'react';
import styles from './index.less';
// import { formatDate } from '@/utils/utilsJS';
import { Row, Col } from 'antd';
import { getDutyPage } from '@/services/bigScreen';
//定义props的类型
interface Props {
  dataConfig: any;
  refresh: any;
}
const DepartmentDutySchedule: React.FC<Props> = (props: any) => {
  const { refresh } = props;
  // 获取值班
  const getDutyPageFun = () => {
    // const hdId = window.hdObj?.id || '';
    // const dateStr = formatDate(new Date());
    const params = {
      queryObject: {
        page: 0,
        size: 99,
        // beginLocalTime: dateStr,
        // endLocalTime: dateStr,
        ascending: false,
        propertyName: 'startTime',
        // act: hdId,
        type:true
      },
    };
    getDutyPage(params)
      .then((res: any) => {
        if (res.code === 200) {
          const list = res.result?.page?.content || [];  
          const filterList=list.filter((item:any)=>{
            return item.actName==window.cjObj.name
          })
          let str = '';
          filterList.forEach((item: any) => {
            str += `<div class='JQScroll'>
              <span class="li-6" title='${item.dept}'>${item.dept}</span>
              <span class="li-5">${item.num || 0}人</span>
              <span class="li-6" title='${item.user}'>${item.user}</span>
              <span class="li-7" title='${item.phone}'>${item.phone}</span>
            </div>`;
          });
          $('#dutyScroll').html(str);
          $('#dutyScroll').liMarquee('destroy');
          if (list.length > 2) {
            $('#dutyScroll').addClass('canDrug');
            $('#dutyScroll').liMarquee({
              scrollamount: 15,
              direction: 'up',
            });
          } else {
            $('#dutyScroll').removeClass('canDrug');
          }
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log('模块8刷新了');
    getDutyPageFun();
  }, [refresh]);
  return (
    <div className="leftOne">
      <div className={`${styles.policeInfo} ${styles.dutySty}`} style={{ height: '100%' }}>
        <Row className={styles.tableTitle}>
          <Col span={6}>部门</Col>
          <Col span={5}>数量</Col>
          <Col span={6}>联系人</Col>
          <Col span={7}>联系方式</Col>
        </Row>
        <div className={styles.tableContent} id="dutyScroll" />
      </div>
    </div>
  );
};
export default DepartmentDutySchedule;
