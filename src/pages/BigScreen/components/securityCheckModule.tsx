import styles from './indexNew.less';
import React from 'react';
import { Row } from 'antd';
import type { ItemData } from './data';
import img1 from '../image/icon5.png'
import img2 from '../image/icon6.png'
import img3 from '../image/icon7.png'

//定义props的类型
interface Props {
  dataConfig: { height: string; list: ItemData[] };
  refresh?: any;
  // callBackUrl: (value: string[], type: string) => void;
  // callBackFace: (value: { id: string; name: string }) => void;
  // callBackVideoAR: (item: any) => void;
}
declare global {
  interface Window {
    clickPoint_jk: any;
  }
}

interface RefTypes {
  setAbDate: (flg: any) => void;
  searchLayerTc: () => void;
  getArVideos: (ids: string[]) => void;
  itemShowFlg: (code: string) => void;
}
const AnbaoCard = React.forwardRef<RefTypes, Props>((props, ref) => {
  const { dataConfig } = props;

  return (
    <Row gutter={5}>
      <div
        className={`${styles.itemBox}`}
        style={{ height: dataConfig.height + 'px' }}
      >
        <div className={styles.checkBox}>
          <div className={styles.chenckLine}>
            <div className={styles.checkli}>
              <div className={styles.num}>8000</div>
              <div className={styles.text}>安检人员数</div>
            </div>
            <div className={styles.checkli}>
              <div className={styles.num}>8000</div>
              <div className={styles.text}>安检物品数</div>
            </div>
            <div className={styles.checkli}>
              <div className={styles.num}>8000</div>
              <div className={styles.text}>违禁物品数</div>
            </div>
          </div>
          <div className={styles.chenckLineb}>
            <div className={styles.checkli}>
              <img className={styles.img} src={img1} alt="" />
              <div className={styles.checkNumBox}>
                <div className={styles.num}>5000</div>
                <div className={styles.text}>安检口1</div>
              </div>
            </div>
            <div className={styles.checkli}>
              <img className={styles.img} src={img2} alt="" />
              <div className={styles.checkNumBox}>
                <div className={styles.num}>5000</div>
                <div className={styles.text}>安检口2</div>
              </div>
            </div>
            <div className={styles.checkli}>
              <img className={styles.img} src={img3} alt="" />
              <div className={styles.checkNumBox}>
                <div className={styles.num}>5000</div>
                <div className={styles.text}>安检口3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Row>
  );
});
export default AnbaoCard;
