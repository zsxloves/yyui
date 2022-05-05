/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from './index.less';
import React from 'react';
import { Row } from 'antd';
const AnbaoCard = React.forwardRef<any>((props, ref) => {
  return (
    <Row gutter={5}>
      <div className={styles.moduleWrapStyle}>
        <div className={styles.organizational}>
          <div className={styles.box}>
            <div className={styles.item}>
              <div className={styles.itemt}>
                <img src={'/img/imageNew/yyVillage/quan2.png'} alt="" className={styles.icon} />
                <div className={styles.person}>
                  <div className={styles.p1}>张宏光</div>
                  <div className={styles.p2}>15567859982</div>
                </div>
              </div>
              <div className={styles.text}>安保指挥长</div>
            </div>
            <div className={styles.item}>
              <div className={styles.itemt}>
                <img src={'/img/imageNew/yyVillage/quan2.png'} alt="" className={styles.icon} />
                <div className={styles.person}>
                  <div className={styles.p1}>张宏光</div>
                  <div className={styles.p2}>15567859982</div>
                </div>
              </div>
              <div className={styles.text}>安保指挥长</div>
            </div>
          </div>
          <div className={styles.list} style={{ height: '82rem' }}>
            <div className={styles.item}>
              <div className={styles.line}>
                <div className={styles.lineTeam}>奥体体育场</div>
                <div className={styles.lineName}>
                  丁鲁冰<span style={{ marginLeft: '10px' }}>15835982342</span>
                </div>
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.line}>
                <div className={styles.lineTeam}>奥体网球中心</div>
                <div className={styles.lineName}>
                  王 诚<span style={{ marginLeft: '10px' }}>15987343352</span>
                </div>
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.line}>
                <div className={styles.lineTeam}>滨江体育馆</div>
                <div className={styles.lineName}>
                  孔 涛<span style={{ marginLeft: '10px' }}>15184874487</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Row>
  );
});
export default AnbaoCard;
