import React,{ useState, useEffect } from 'react';
import styles from './indexNew.less'
const TopWarning = React.forwardRef<any>((props, ref) =>  {
    return (
        <div className={styles.warningList}>
            <div className={styles.warningItem}>
                <div className={styles.text}>购票异常</div>
                <div className={styles.num}>13</div>
            </div>
            <div className={styles.warningItem}>
                <div className={styles.text}>重点人</div>
                <div className={styles.num}>18</div>
            </div>
            <div className={styles.warningItem}>
                <div className={styles.text}>验票异常</div>
                <div className={styles.num}>33</div>
            </div>
            <div className={styles.warningItem}>
                <div className={styles.text}>无人机</div>
                <div className={styles.num}>3</div>
            </div>
            <div className={styles.warningItem}>
                <div className={styles.text}>安检通道异常</div>
                <div className={styles.num}>8</div>
            </div>
            <div className={styles.warningItem}>
                <div className={styles.text}>地下管网</div>
                <div className={styles.num}>1</div>
            </div>
            <div className={styles.warningItem}>
                <div className={styles.text}>警情</div>
                <div className={styles.num}>8</div>
            </div>
            <div className={styles.warningItem}>
                <div className={styles.text}>周界封控</div>
                <div className={styles.num}>1</div>
            </div>
        </div>
    )
})
export default TopWarning;


