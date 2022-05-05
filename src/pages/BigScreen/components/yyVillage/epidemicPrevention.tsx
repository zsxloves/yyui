/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import React from 'react';
const AnjianCard = React.forwardRef<any>((props, ref) => {

  return (
    <div className={styles.moduleWrapStyle}>
      <div className={styles.epidemicPrevention}>
        <div className={styles.chenckLineb}>
          <div className={styles.checkli}>
            <img className={styles.img} src="/img/imageNew/yyVillage/icon2.png" alt="" />
            <div className={styles.checkNumBox}>
              <div className={styles.num}>5000</div>
              <div className={styles.line}></div>
              <div className={styles.text}>总疫情人数</div>
            </div>
          </div>
          <div className={styles.checkli}>
            <img className={styles.img} src="/img/imageNew/yyVillage/icon2.png" alt="" />
            <div className={styles.checkNumBox}>
              <div className={styles.num}>5000</div>
              <div className={styles.line}></div>
              <div className={styles.text}>新增疫情人员</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
export default AnjianCard;
