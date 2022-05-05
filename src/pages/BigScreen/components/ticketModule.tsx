import styles from './indexNew.less';
import React from 'react';
import { Row, Radio } from 'antd';
import type { ItemData } from './data';
import img1 from '../image/icon1.png'
import img2 from '../image/icon2.png'
import img3 from '../image/icon4.png'
// import CountUp from 'react-countup';

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
        <div className={styles.ticketBox}>
          <div className={styles.tab}>
            <Radio.Group defaultValue={'large'} size="small">
              <Radio.Button value="large">累计</Radio.Button>
              <Radio.Button value="default">实时</Radio.Button>
            </Radio.Group>
          </div>
          <div className={styles.ticketContent}>
            <div className={styles.line}>
              <div style={{ width: '25%' }}>
                <div className={styles.num}>
                  {/* <CountUp end={5000} /> */}
                  5000
                  </div>
                <div className={styles.text}>总票数</div>
              </div>
              <div style={{ width: '25%' }}>
                <div className={styles.num}>3000</div>
                {/* <div className={styles.num}><CountUp end={3000} /></div> */}
                <div className={styles.text}>已售票数</div>
              </div>
              <div style={{ width: '25%' }}>
                {/* <div className={styles.num}><CountUp end={1000} /></div> */}
                <div className={styles.num}>1000</div>
                <div className={styles.text}>验票数</div>
              </div>
              <div style={{ width: '25%' }}>
                <div className={styles.num}>50</div>
                <div className={styles.text}>验证数</div>
              </div>
            </div>
            <div className={styles.progressBox}>
              <div className={styles.progressbg}>
                <div className={styles.progressLeft}>入场率</div>
                <div className={styles.progressright}>80%</div>
                <div style={{ width: '20%' }} className={styles.progressline}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Row>
  );
});
export default AnbaoCard;
