/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import React from 'react';
import { Progress } from 'antd'
const AnjianCard = React.forwardRef<any>((props, ref) => {

    return (
        <div className={styles.moduleWrapStyle}>
            <div className={styles.trafficSituation}>
                <div className={styles.title}>
                    <div className={styles.item}>
                        <div className={styles.name1}>道路名称</div>
                        <div className={styles.name2}>
                            <Progress percent={50} strokeWidth={4} steps={3} showInfo={false} strokeColor='#ee2929' trailColor='#2c619d' /></div>
                        <div className={styles.name3}>匀速</div>
                        <div className={styles.name4}>延误指数</div>
                        <div className={styles.name5}>交通量</div>
                    </div>
                </div>
                <div className={styles.box}>
                    <div className={styles.item}>
                        <div className={styles.name1}>天城路</div>
                        <div className={styles.name22}>
                            <img src="/img/imageNew/yyVillage/pbg2.png" alt="" className={styles.img} />
                            <Progress style={{ position: 'relative', top: '-2px' }} percent={40} strokeWidth={4} steps={31} showInfo={false} size="small" strokeColor="#ffc946" trailColor='rgba(0,0,0,0)' /></div>
                        <div className={styles.name3}>18.6</div>
                        <div className={styles.name4}>1.15</div>
                        <div className={styles.name5}>105488</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.name1}>天城路</div>
                        <div className={styles.name21}>
                            <img src="/img/imageNew/yyVillage/pbg1.png" alt="" className={styles.img} />
                            <Progress style={{ position: 'relative', top: '-2px' }} percent={40} strokeWidth={4} steps={31} showInfo={false} size="small" strokeColor="#46ff90" trailColor='rgba(0,0,0,0)' /></div>
                        <div className={styles.name3}>18.6</div>
                        <div className={styles.name4}>1.15</div>
                        <div className={styles.name5}>105488</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.name1}>天城路</div>
                        <div className={styles.name22}>
                            <img src="/img/imageNew/yyVillage/pbg2.png" alt="" className={styles.img} />
                            <Progress style={{ position: 'relative', top: '-2px' }} percent={40} strokeWidth={4} steps={31} showInfo={false} size="small" strokeColor="#ffc946" trailColor='rgba(0,0,0,0)' /></div>
                        <div className={styles.name3}>18.6</div>
                        <div className={styles.name4}>1.15</div>
                        <div className={styles.name5}>105488</div>
                    </div>
                </div>
            </div>
        </div>
    );
});
export default AnjianCard;
