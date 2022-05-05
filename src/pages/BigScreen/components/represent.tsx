/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import type { ItemData } from './data';
//定义props的类型
interface Props {
  dataConfig: { height?: string; list: ItemData[] };
  refresh?: any;
}

// let isFirstLoad = true;
const Represent = React.forwardRef<any,Props>((props) => {
  const { dataConfig, refresh } = props;
  const [dataList, setDataList] = useState<ItemData[]>([]);

  useEffect(() => {
    console.log('代表团刷新了');
    if (dataConfig) {
      const config = dataConfig?.list.map((item: ItemData) => {
        item.isActive = false;
        return item;
      });
      setDataList(config);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataConfig, refresh]);
  return (
    <Row gutter={5} className={styles.moduleWrapStyle}>
      <div className={`${styles.itemBox} ${styles.represent}`}>
        {dataList.length > 0 &&
          dataList.map((item: ItemData) => {
            if (item.show) {
              return (
                <Col
                  key={item.name}
                  span={12}
                  className={`${styles.nthList} ${item.isClick ? styles.isClick : ''}`}
                >
                  <div
                    className={`${styles.item} ${item.isActive ? styles.active : ''}`}
                  >
                    <span>{item.name}</span><span className={styles.font}>{item.num}</span><span>{item.unit}</span>
                  </div>
                </Col>
              );
            } else {
              return;
            }
          })}
      </div>
    </Row>
  );
});
export default Represent;
