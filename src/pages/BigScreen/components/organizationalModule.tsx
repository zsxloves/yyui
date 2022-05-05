import styles from './indexNew.less';
import React from 'react';
import { Row } from 'antd';
import type { ItemData } from './data';
import img from '../image/organizational.png'

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
        <div className={styles.organizationalBox}>
          <div className={styles.organizationalImgBox}>
            <img style={{width:'100%',display:'block',height:"100%"}} src={img} alt="" />
          </div>
          <div className={styles.organizationalPersonBox}>
            <div>指挥长：<span>张建国</span></div>
            <div className={styles.organizationalText}>开幕式安保指挥部</div>
          </div>
        </div>
        <div className={styles.organizationalList}>
            <div className={styles.organizationalListli}>
              <div className={styles.line}>
                <div className={styles.lineTeam}>指挥部</div>
                <div className={styles.lineName}>副挥长：张明</div>
              </div>
            </div>
            <div className={styles.organizationalListli}>
              <div className={styles.line}>
                <div className={styles.lineTeam}>情报及现场调度分指挥部</div>
                <div className={styles.lineName}>副挥长：黄明</div>
              </div>
            </div>
            <div className={styles.organizationalListli}>
              <div className={styles.line}>
                <div className={styles.lineTeam}>场馆安保分指挥部</div>
                <div className={styles.lineName}>副挥长：薛丽</div>
              </div>
            </div>
            <div className={styles.organizationalListli}>
              <div className={styles.line}>
                <div className={styles.lineTeam}>社会面管控分指挥部</div>
                <div className={styles.lineName}>副挥长：张明金</div>
              </div>
            </div>
        </div>
      </div>
    </Row>
  );
});
export default AnbaoCard;
