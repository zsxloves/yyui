/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import React, { useState, useEffect } from 'react';
import { getPage } from '@/services/bigScreen';
import { message, Pagination } from 'antd';
//定义props的类型
interface Props {
  onCancel: (falg?: boolean) => void;
  alarmDeal: (obj?: any) => void;
}

interface alarmList {
  icon: string;
  alarmTime: string;
  state: string;
  color: string;
  category: string | number;
  message: string;
  [key: string]: any;
}

const iconObj = {
  '01': 'icon-renlianshibieyujing',
  '02': 'icon-cheliangyujing',
  '16': 'icon-changguanneibuzhongdianquyuyujing',
  '05': 'icon-jinggaiweiyiyujing',
  '07': 'icon-wupinanjianyujing',
  '04': 'icon-chuanyuehulanyujing',
  '10': 'icon-wurenjifanzhi',
};
const RealTimeAlarmMore: React.FC<Props> = (props) => {
  const { onCancel, alarmDeal } = props;
  const [alarmList, setAlarmList] = useState<alarmList[]>([]); // 预警列表
  const [activeIndex, setActiveIndex] = useState<string>();
  const [total, setTotal] = useState<number>(0);

  // 获取预警类型
  const getPageFun = (page: number, size: number, isDeal?: string, isRead?: string) => {
    const params = {
      queryObject: {
        polygon: window.polygon,
        more: true,
        page,
        size,
        isDeal: isDeal,
        isRead: isRead,
        // start:'2022-01-09 00:00:00',
        // end:'2022-01-10 00:00:00'
      },
    };
    getPage(params)
      .then((res: any) => {
        if (res.code === 200) {
          const data = res?.result?.page?.content || [];
          setAlarmList(data);
          console.log(res?.result?.page?.totalElements);
          setTotal(res?.result?.page?.totalElements);
        }
      })
      .catch((err: any) => {
        console.log(err.message || err)
        // message.error(err.message || err);
      });
  };

  const filterStatus = (type: string) => {
    const newType = activeIndex === type ? '' : type;
    setActiveIndex(newType);
    getPageFun(1, 10, newType);
  };
  const filterRead = (type: string) => {
    setActiveIndex(String(Number(type) + 2));
    getPageFun(1, 10, '', type);
  };
  const onChange = (page: any, size: any) => {
    console.log(page, size);
    if (Number(activeIndex) > 1) {
      getPageFun(page, size, '', String(Number(activeIndex) - 2));
    } else {
      getPageFun(page, size, activeIndex);
    }

  };
  useEffect(() => {
    getPageFun(1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.alarmDealPopup} style={{ height: '700rem' }}>
      <i className="iconfont icon-guanbi" onClick={() => onCancel()} />
      <div className={styles.alarmContent}>
        <div className={styles.alarmMore}>
          <div className={styles.secondTitle} style={{ justifyContent: 'space-between' }}>
            <div className="title">预警列表</div>
            <div style={{ 'display': 'flex' }}>
              <div className={`${styles.btnFilter} ${styles.btnFilter1}`}>
                <div
                  className={`${styles.btn} ${activeIndex === '1' ? styles.active : ''}`}
                  onClick={() => filterStatus('1')}
                >
                  已处理
                </div>
                <div
                  className={`${styles.btn} ${activeIndex === '0' ? styles.active : ''}`}
                  onClick={() => filterStatus('0')}
                >
                  待处理
                </div>
              </div>
              <div className={`${styles.btnFilter} ${styles.btnFilter1}`}>
                <div
                  className={`${styles.btn} ${activeIndex === '3' ? styles.active : ''}`}
                  onClick={() => filterRead('1')}
                >
                  已查看
                </div>
                <div
                  className={`${styles.btn} ${activeIndex === '2' ? styles.active : ''}`}
                  onClick={() => filterRead('0')}
                >
                  待查看
                </div>
              </div>
            </div>
          </div>
          <div className={styles.alarmList}>
            {alarmList.length > 0 &&
              alarmList.map((item: any) => (
                <div
                  className={`item ${item.color + '-bg'}`}
                  key={item.id}
                  onClick={() => {
                    if (window.map) {
                      alarmDeal(item);
                    }
                  }}
                >
                  <div className="left-icon">
                    <i className={`iconfont ${iconObj[item.category]}`} />
                  </div>
                  <div className="alarm-center">
                    <div className="row1">
                      <span className="alarm-time">{item.alarmTime}</span>
                      {item.state == '0' && <span className="mark">待处理</span>}
                      {item.isRead == '0' && <span className="mark">待查看</span>}
                    </div>
                    <div className="alarm-text" title={item.message}>
                      {item.message}
                    </div>
                  </div>
                </div>
              ))}
            {alarmList.length === 0 && (
              <div
                style={{
                  marginTop: '200px',
                  textAlign: 'center',
                  fontSize: '24px',
                  color: '#d5d5d5',
                }}
              >
                暂无数据
              </div>
            )}
          </div>
          <div className={styles.popupPagination}>
            <Pagination showQuickJumper size="small" total={total} onChange={onChange} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default RealTimeAlarmMore;
