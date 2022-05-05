/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import React, { useState, useEffect } from 'react';
import type { ItemData } from './data';
import { Row, Col } from 'antd';
import img1 from '../../image/icon5.png'
import img2 from '../../image/icon6.png'


//定义props的类型
interface Props {
    dataConfig: { height?: string; list: ItemData[] };
    refresh?: any;
}
// 获取防疫数据
const getCheckSit = () => {
    const config0 = list.map((ite: ItemData) => {
        ite.isActive = false;
        if (ite.code === 'ajdw') ite.num = 0;
        return ite;
    });
    setDataList(config0);
    list = config0;
    queryTree({ sceneId: window.cjObj?.id })
        .then((res) => {
            if (res.code === 200) {
                res?.data?.forEach((item: any) => {
                    const newItem = item.data;
                    const entity = JSON.parse(newItem?.entity || "{}");
                    newItem.entity = entity;
                    newItem.num = entity?.code || '';
                    if (entity?.type === '5a1f020c-8c03-4395-a093-af57d9c8cc28') {
                        ajItem.current = newItem;
                        const config = list.map((ite: ItemData) => {
                            ite.isActive = false;
                            if (ite.code === 'ajdw') ite.num = newItem.num;
                            return ite;
                        });
                        setDataList(config);
                        list = config;
                        getArIconLayerQuery(newItem.id);
                    }
                });
            }
        })
        .catch((err) => {
            console.log(err?.message || err);
        });
};
const Protect = React.forwardRef<any, Props>((props, ref) => {
    const { dataConfig, refresh } = props;
    const [dataList, setDataList] = useState<ItemData[]>([]);
    useEffect(() => {
        console.log('4刷新了');
        // getCheckSit();
        if (dataConfig) {
            const config = dataConfig?.list.map((item: ItemData) => {
                item.isActive = false;
                return item;
            });
            setDataList(config);
            //   list = config;
            // getCheckCollect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataConfig, refresh]);

    return (
        <Row className={styles.moduleWrapStyle}>
            <div className={`${styles.itemBox} ${styles.protectList}`}>
                {dataList.length > 0 &&
                    dataList.map((item: ItemData) => {
                        if (item.show) {
                            return (
                                <Col
                                    key={item.name}
                                    span={6}
                                    className={`${styles.protect}`}
                                >
                                    <div
                                        className={`${styles.protectItem}`}
                                    >
                                        <p className={styles.font}>{item.num}{item.unit}</p>
                                        <p>{item.name}</p>
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
export default Protect;
