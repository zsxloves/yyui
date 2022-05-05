/* eslint-disable @typescript-eslint/no-unused-vars */
// 大莲花模型组件
/* eslint-disable react/jsx-key */
/* eslint-disable react/no-array-index-key */
import type { FC } from 'react';
import { useEffect } from 'react';
import styles from './index.less';
import floorGraphic from '@/utils/FloorGraphic';
import classNames from 'classnames';

//定义props的类型
interface Props {
  onCancel: (falg?: boolean) => void;
}
let storeyLayer: any;
let sum: any ;
const TopCenterModule: FC<Props> = (props) => {
  const { onCancel } = props;
  useEffect(() => {
    storeyLayer = new mars3d.layer.GraphicLayer();
    window.map.addLayer(storeyLayer);
    sum = floorGraphic._models;
    storeyLayer.addGraphic(floorGraphic);
  }, []);

  const openFloorModel = () => {
    floorGraphic.openAll(50);
  };
  const mergeFloorModel = () => {
    floorGraphic.mergeAll();
  };
  const resetModel = () => {
    floorGraphic.reset();
  };
  const showFloorModel = (val: any) => {
    floorGraphic.showFloor(val);
  };
  return (
    <div className={styles.storey}>
      <i className="iconfont icon-guanbi" onClick={() => { storeyLayer.clear();onCancel()}}/>
      <p style={{marginBottom:'5px'}}>大莲花模型整体控制:</p>
      <span className={styles.box} onClick={openFloorModel}>全部展开</span>
      <span className={styles.box} onClick={mergeFloorModel}>收起</span>
      {/* <span className={styles.box} onClick={resetModel}>还原</span> */}
       {(
        <>
          <p style={{marginTop:'10px',marginBottom:'5px'}}>显示指定:</p>
          {sum?.map((_: any, index: any) => {
            return (
              <span key={index} className={classNames(index==0?styles.boxs:styles.box)} onClick={() => { showFloorModel(index + 1) }}>
                {index == 0? '负1层':index == 7?'顶层':'第'+index+'层'}
              </span>
            );
          })}
        </>
      )}
    </div>
  );
};
export default TopCenterModule;
