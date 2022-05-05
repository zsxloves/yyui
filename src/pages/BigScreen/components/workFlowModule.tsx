import styles from './indexNew.less';
import React from 'react';
import { Row, Col, Select } from 'antd';
import type { ItemData } from './data';
import img from '../image/icon3.png'
import img3 from '../image/icon4.png'

//定义props的类型
interface Props {
  dataConfig: { height: string; list: ItemData[] };
  refresh?: any;  
  callBackUrl: (value: string, type: number) => void;
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
  const { dataConfig ,callBackUrl} = props;

  return (
    <Row gutter={5}>
      <div
        className={`${styles.itemBox}`}
        style={{ height: dataConfig.height + 'px' }}
      >
        <div className={styles.workBox}>
          <div className={styles.select}>
            <Select suffixIcon={<img src={img3} alt="" />}
              className={[styles.section, styles.leftActive].join(' ')}
              value={'val.id'}
              onChange={(e) => {
                // setHd(e);
              }}
            >
              <Select.Option value={'val.id'} key={'index'}>
                实施期 09.10
              </Select.Option>
            </Select>
          </div>
          <Row className={styles.tableTitle}>
            <Col span={4}>时间</Col>
            <Col span={10}>工作任务</Col>
            <Col span={6}>地点</Col>
            <Col span={4}>操作</Col>
          </Row>
          <div className={styles.workList}>
            <Row className={styles.line}>
              <Col span={4}>14:30</Col>
              <Col span={10}>人员车辆核查</Col>
              <Col span={6}><a style={{color:'#fff'}} onClick={()=>callBackUrl('abgongzuoliucheng',1)}>核心圈</a></Col>
              <Col span={4}><img src={img} alt="" /></Col>
            </Row>
            <Row className={styles.line}>
              <Col span={4}>14:30</Col>
              <Col span={10}>人员车辆安检</Col>
              <Col span={6}><a style={{color:'#fff'}} onClick={()=>callBackUrl('abgongzuoliucheng',1)}>核心圈</a></Col>
              <Col span={4}><img src={img} alt="" /></Col>
            </Row>
            <Row className={styles.line}>
              <Col span={4}>14:30</Col>
              <Col span={10}>东区封控</Col>
              <Col span={6}><a style={{color:'#fff'}} onClick={()=>callBackUrl('abgongzuoliucheng',1)}>核心圈</a></Col>
              <Col span={4}><img src={img} alt="" /></Col>
            </Row>
            <Row className={styles.line}>
              <Col span={4}>14:30</Col>
              <Col span={10}>西区封控</Col>
              <Col span={6}>核心圈</Col>
              <Col span={4}><img src={img} alt="" /></Col>
            </Row>
            <Row className={styles.line}>
              <Col span={4}>14:30</Col>
              <Col span={10}>启动反恐点</Col>
              <Col span={6}>核心圈</Col>
              <Col span={4}><img src={img} alt="" /></Col>
            </Row>
          </div>
        </div>
      </div>
    </Row>
  );
});
export default AnbaoCard;
