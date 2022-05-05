import styles from './index.less';
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import type { ItemData } from './data';
import IconOrImage from './iconOrImage';
import { queryYaDetail } from '@/services/topManage';
//定义props的类型
interface Props {
  popupData: {
    type: string;
    title: string;
    style: any;
    data: any[];
  };
  visiable: boolean;
}
const PopupAlertAJD: React.FC<Props> = (props) => {
  const { popupData, visiable } = props;
  const [dataList, setDataList] = useState<ItemData[]>([]);
  const [mjsum, setMjSum] = useState<number>(0);
  const [jjsum, setJjSum] = useState<number>(0);
  const [fjsum, setFjSum] = useState<number>(0);
  const [basum, setBaSum] = useState<number>(0);

  const activeFun = (item: ItemData) => {
    if (!item.isClick) return;
    const newList = dataList.map((val: ItemData) => {
      if (val.name === item.name) {
        val.isActive = !val.isActive;
        if (val.isActive) {
          console.log('namewss:', item);
        } else {
        }
      }
      return val;
    });
    setDataList(newList);
  };
  useEffect(() => {
    if (popupData) {
      console.log('popupDAta:', popupData);
      const config = popupData?.data?.map((item: ItemData) => {
        item.isActive = false;
        return item;
      });
      setDataList(config);
    }
  }, [popupData]);
  useEffect(() => {
    if (window?.hdObj?.id) {
      const queryObject = { activityId: window?.hdObj?.id, pageNumber: 0, PageSize: 10 } as any;
      queryYaDetail(queryObject)
        .then((res) => {
          let mjSum: number = 0;
          let jjSum: number = 0;
          let fjSum: number = 0;
          let baSum: number = 0;
          const result = res?.data?.rows;
          result.map((item: any) => {
            const data=JSON.parse(item.entity || '{}')?.info
            const{mjNum,fjNum,baNum,jjNum,xfNum}=data||0
            mjSum =Number(mjNum || 0) + mjSum;
            fjSum = Number(fjNum || 0)  + fjSum;
            jjSum = Number(jjNum || 0)  +jjSum;
            baSum =Number(baNum || 0) +baSum;
          });
          setMjSum(mjSum);
          setJjSum(jjSum);
          setFjSum(fjSum);
          setBaSum(baSum);
        })
        .catch((err: any) => {
          console.log(err?.message);
          // message.error(err.message);
        });
    }
  }, [window?.hdObj?.id]);
  return (
    <>
      {visiable && (
        <Row gutter={5} className={styles.popupListStyle} style={popupData.style}>
          <div className={styles.popupTitle}>{popupData.title}</div>
          <div className={`${styles.itemBox}`}>
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
                        onClick={() => activeFun(item)}
                      >
                        {/* <i className={`iconfont icon-${item.icon}`} style={{ color: item.color }} /> */}
                        <IconOrImage imgItem={item} />
                        <div className={styles.itemCon}>
                          <div className={styles.name}>{item.name}</div>
                          <div className={styles.numSty}>
                            {item.num}
                            {item.code === 'mj' ? `|${mjsum}` : ''}
                            {item.code === 'jj' ? `|${jjsum}` : ''}
                            {item.code === 'fj' ? `|${fjsum}` : ''}
                            {item.code === 'ba' ? `|${basum}` : ''}
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                } else {
                  return;
                }
              })}
          </div>
        </Row>
      )}
    </>
  );
};
export default PopupAlertAJD;
