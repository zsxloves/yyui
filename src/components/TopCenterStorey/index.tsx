/* eslint-disable @typescript-eslint/no-unused-vars */
// 大莲花模型组件
/* eslint-disable react/jsx-key */
/* eslint-disable react/no-array-index-key */
import { FC, memo, useState } from 'react';
import { useEffect } from 'react';
import styles from './index.less';
import floorGraphic from '@/utils/FloorGraphic';
import classNames from 'classnames';
import { queryYaJson } from '@/pages/Mars3DMap/service';
import Draggable from 'react-draggable';
import yuanPopup from './popup';

let modelControllLayerArr: any = []   // 模型控制的图层数组
const mars3D = mars3d;// 存储地图点击坐标
const yatytcObj: any = {}; // 预案推演图层存储

declare global {
  interface Window {
    isClickMap: boolean; // 是否点击的是地图?还是图标
  }
}

//定义props的类型
interface Props {
  onCancel: (falg?: boolean) => void;
  leftTreeData: any;
  callBackUrl: (value: string[], type: string) => void,
}
let storeyLayer: any;

// 模型是否展开
let isModelOpen: any = false

/**
 * 
  组件开始
*/
const TopCenterModule: FC<Props> = (props) => {
  // 层级显示
  const [sum, setSum] = useState<any>([])
  const { onCancel, callBackUrl } = props;
  // 初始化
  useEffect(() => {
    storeyLayer = new mars3d.layer.GraphicLayer();
    window.map.addLayer(storeyLayer);
    storeyLayer.addGraphic(floorGraphic);
    setSum(floorGraphic._models)
    handleModelClick(storeyLayer)
    // 处理与路径规划点击的冲突
    window.isClickMap = false
    return () => {
      window.isClickMap = true
    }
  }, []);


  // 模型点击事件,每层高度间距50
  const handleModelClick = (layer: any) => {
    layer.on(mars3d.EventType.click, (event: any) => {
      event.stopPropagation()
      if (isModelOpen) {
        const alt = event.graphic.point.alt
        if (alt < 0) return showSingleFloorModel(1)
        if (alt > 0 && alt < 50)  return showSingleFloorModel(2)
        if (alt > 50 && alt < 100)  return showSingleFloorModel(3)
        if (alt > 100 && alt < 150)  return showSingleFloorModel(4)
        if (alt > 150 && alt < 200)  return showSingleFloorModel(5)
        if (alt > 200 && alt < 250)  return showSingleFloorModel(6)
        if (alt > 250 && alt < 300)  return showSingleFloorModel(7)
      }
    })
  }
  // 展开模型
  const openFloorModel = () => {
    isModelOpen = true
    floorGraphic.openAll(50);
    props.leftTreeData.forEach((item: { key: any; }) => {
      modelControll2Abya(item.key)
    })
  };

  // 合并模型
  const mergeFloorModel = () => {
    floorGraphic.mergeAll();
    isModelOpen = false
    clearMCLayerArr(modelControllLayerArr)
  };

  // 点击控制台，展示层级模型
  const showFloorModel = (val: any) => {
    floorGraphic.showFloor(val)
    isModelOpen = false
    // 展示安保预案
    modelControll2Abya(getId(val))
  };

  // 点击模型的层，展示单个层级
  const showSingleFloorModel = (val: any) => {
    floorGraphic.showSingleFloor(val)
    // 展示安保预案
    modelControll2Abya(getId(val))
  };

  // 安保方案的关联
  // 删除多个图层
  const clearMCLayerArr = (layer: any) => {
    if (layer.length > 0) {
      layer.forEach((item: any) => {
        window.map.removeLayer(item)
      })
      layer = []
    }
  }
  // 获取预案的id,预案的名称需要和后台配置的一致
  const getId = (index: number): any => {
    const idMap = new Map([
      [1, '大莲花B1'], [2, '大莲花1F'], [3, '大莲花2F'],
      [4, '大莲花3F'], [5, '大莲花4F'], [6, '大莲花5F'],
      [7, '大莲花6F'], [8, '大莲花顶层'],
    ])
    if (props.leftTreeData && props.leftTreeData.length > 0) {
      return props.leftTreeData.filter((item: any) => {
        return item.title == idMap.get(index)
      })[0]?.key
    }
  }
  // 根据id获取预案数据
  const modelControll2Abya = (id: string) => {
    clearMCLayerArr(modelControllLayerArr)
    if (id) {
      queryYaJson({ id }).then((res: any) => {
        const result = res.data.rows;
        if (result.length) {
          const json =JSON.parse(result[0].geoJson) ;
          if (isModelOpen) {           
            json.features.forEach((item: any) => {
              item.properties.style.clampToGround = false
            })
          }
          // 建立图层
          yatytcObj[id] = new mars3D.layer.GraphicLayer({
            name: result[0].name,
          });
          // 存储图层，方便其他事件操作图层
          modelControllLayerArr.push(yatytcObj[id])
          // 加载图层到地图
          window.map.addLayer(yatytcObj[id]);
          if (json) {
            // 加载图层数据
            const graphics = yatytcObj[id].loadGeoJSON(json, {clear: true});
            // 点击事件,引起冒泡,路径规划也一起显示了
            graphics.map((item: any) => {
              handleGraphicClick(item, json)
            })
          }
        }
      }).catch(e => {
        console.log(e);
      });
    }
  }

  // 图标的点击事件
  const handleGraphicClick = (graphic: any, json: any) => {
    const type = graphic.options.attr.data.name
    graphic.on(mars3d.EventType.click, function (event: any) {
      if (type == '枪机' || type == '半球') {
        callBackUrl(['111'], '海康')
      } else {
        graphic.bindPopup(yuanPopup(json), {
          anchor: [0, -10],
        })
      }
    })
  }
  // 安保方案的关联结束

  // 退出
  const onExitClick = () => {
    storeyLayer.clear()
    onCancel()
    clearMCLayerArr(modelControllLayerArr)
  }


  return (
    <Draggable>
      <div className={styles.storey}>
        <i className="iconfont icon-guanbi" onClick={onExitClick} />
        <p style={{ marginBottom: '5px' }}>大莲花模型整体控制:</p>
        <span className={styles.box} onClick={openFloorModel}>全部展开</span>
        <span className={styles.box} onClick={mergeFloorModel}>收起</span>
        {/* <span className={styles.box} onClick={resetModel}>还原</span> */}
        {(
          <>
            <p style={{ marginTop: '10px', marginBottom: '5px' }}>显示指定:</p>
            {sum?.map((_: any, index: any) => {
              return (
                <span key={index} className={classNames(index == 0 ? styles.boxs : styles.box)} onClick={() => { showFloorModel(index + 1) }}>
                  {index == 0 ? '负1层' : index == 7 ? '顶层' : '第' + index + '层'}
                </span>
              );
            })}
          </>
        )}
      </div>
    </Draggable>

  );
};
export default memo(TopCenterModule);
