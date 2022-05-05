/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import React from 'react';
import {Select} from 'antd'
import img3 from '../../image/icon4.png'
const AnjianCard = React.forwardRef<any>((props, ref) => {

    return (
        <div className={styles.moduleWrapStyle}>
            <div className={styles.keyActivity}>
            <div className={styles.select}>
            <Select suffixIcon={<img src={img3} alt="" />}
              className={[styles.section, styles.leftActive].join(' ')}
              value={'val.id'}
              onChange={(e) => {
                // setHd(e);
              }}
            >
              <Select.Option value={'val.id'} key={'index'}>
                开幕式演练1
              </Select.Option>
            </Select>
          </div>
                <div className={styles.center}>
                    <div className={styles.name} style={{width:'30%'}}>男子篮球决赛</div>
                    <div className={styles.name}>02.21 14:00</div>
                    <div className={styles.name}>中国VS韩国</div>
                    <div className={styles.name} style={{width:'20%'}}>xx场馆</div>
                </div>
                <div className={styles.title}>
                    <div className={styles.name1}>事件</div>
                    <div className={styles.name2}>时间</div>
                    <div className={styles.name3}>位置</div>
                    <div className={styles.name4}>联系人</div>
                </div>
                <div className={styles.box}>
                    <div className={styles.item}>
                        <div className={styles.name1}>事件</div>
                        <div className={styles.name2}>时间</div>
                        <div className={styles.name3}>位置</div>
                        <div className={styles.name4}>联系人</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.name1}>事件</div>
                        <div className={styles.name2}>时间</div>
                        <div className={styles.name3}>位置</div>
                        <div className={styles.name4}>联系人</div>
                    </div>
                </div>
            </div>
        </div>
    );
});
export default AnjianCard;
