/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import React from 'react';
const AnjianCard = React.forwardRef<any>((props, ref) => {

  return (
    <div className={styles.moduleWrapStyle}>
      <div className={styles.checkIn}>
        <div className={styles.box}>
          <div className={styles.item}>
            <div className={styles.name}>中高风险来杭</div>
            <div className={styles.num}>8000</div>
          </div>
          <div className={styles.item}>
            <div className={styles.name}>健康码检测数</div>
            <div className={styles.num}>23</div>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.item}>
            <div className={styles.name}>境内</div>
            <div className={styles.num}>14</div>
          </div>
          <div className={styles.item}>
            <div className={styles.name}>境外</div>
            <div className={styles.num}>2</div>
          </div>
        </div>
        <div className={styles.center}>
            <div className={styles.mj}></div>
            <div className={styles.name}>代表团入住人员结构</div>
            <div className={styles.num}>日本1900人</div>
        </div>
        <div className={styles.chenckLineb}>
            <div className={styles.checkli}>
              <img className={styles.img} src={'/img/imageNew/yyVillage/icon.png'} alt="" />
              <div className={styles.checkNumBox}>
                <div className={styles.num}>5000</div>
                <div className={styles.text}>入住数</div>
              </div>
            </div>
            <div className={styles.checkli}>
              <img className={styles.img} src={'/img/imageNew/yyVillage/icon.png'} alt="" />
              <div className={styles.checkNumBox}>
                <div className={styles.num}>5000</div>
                <div className={styles.text}>未入住数</div>
              </div>
            </div>
            <div className={styles.checkli}>
              <img className={styles.img} src={'/img/imageNew/yyVillage/icon.png'} alt="" />
              <div className={styles.checkNumBox}>
                <div className={styles.num}>5000</div>
                <div className={styles.text}>已离开</div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
});
export default AnjianCard;
