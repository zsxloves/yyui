import styles from './indexNew.less';
import React from 'react';
import { Row, Timeline, Select } from 'antd';
import type { ItemData } from './data';
import img1 from '../image/icon1.png'
import img2 from '../image/icon2.png'
import img3 from '../image/icon4.png'

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
        <div className={styles.busBox}>
          <div className={styles.busLeft}>
            <div className={styles.num1}>15245</div>
            <div className={styles.text}>发车量</div>
            <div className={styles.num2}>85225</div>
            <div className={styles.text}>接客量</div>
          </div>
          <div className={styles.busRight}>
            <img src="/img/imageNew/bg155.png" alt="" className={styles.img}/>
            <div className={styles.p1}>
              <div className={styles.l}>班次：102</div>
              <div className={styles.l}>接客量：565</div>
            </div>
            <div className={styles.p}>位置：</div>
            <div className={styles.p}>时间：</div>
          </div>
        </div>
      </div>
    </Row>
  );
});
export default AnbaoCard;
