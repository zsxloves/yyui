/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import React from 'react';
import img1 from '../../image/icon5.png'
import img2 from '../../image/icon6.png'
const AnjianCard = React.forwardRef<any>((props, ref) => {

    return (
        <div className={styles.moduleWrapStyle}>
            <div className={styles.parkingLot}>
                <div className={styles.select}>
                    <div className={styles.color}></div><div className={styles.text}>已停车辆数</div>
                </div>
                <div className={styles.chenckLineb}>
                    <div className={styles.checkli}>
                        <div className={styles.img}>P1</div>
                        <div className={styles.checkNumBox}>
                            <span className={styles.num1}>10</span>辆/<span className={styles.num2}>40</span>
                        </div>
                    </div>
                    <div className={styles.checkli}>
                        <div className={styles.img}>P2</div>
                        <div className={styles.checkNumBox}>
                            <span className={styles.num1}>10</span>辆/<span className={styles.num2}>40</span>
                        </div>
                    </div>
                </div>
                <div className={styles.chenckLineb}>
                    <div className={styles.checkli}>
                        <div className={styles.img}>P3</div>
                        <div className={styles.checkNumBox}>
                            <span className={styles.num1}>10</span>辆/<span className={styles.num2}>40</span>
                        </div>
                    </div>
                    <div className={styles.checkli}>
                        <div className={styles.img}>P4</div>
                        <div className={styles.checkNumBox}>
                            <span className={styles.num1}>10</span>辆/<span className={styles.num2}>40</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
export default AnjianCard;
