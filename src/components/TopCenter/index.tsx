import { useEffect, useState, useRef } from 'react';
import type { FC } from 'react';
import styles from './index.less';
import { Image, message, Tooltip } from 'antd';
// import jsonloop from 'jsonloop';
import { queryTree, arIconLayerQuery } from '@/services/bigScreen';
import iconRen from '@/assest/img/icon_ren.png';
import iconPhone from '@/assest/img/icon_phone.png';
import zdfk from './img/zdfk.png';
import fqgk from './img/fqgk.png';
import xcgk from './img/xcgk.png';
import rclx from './img/rclx.png';
import mjcl from './img/mjcl.png';
import dmajcl from './img/dmajcl.png';
import dxajcl from './img/dxajcl.png';
import qtry from './img/qtry.png';
import qylx from './img/qylx.png';
import fbaj from './img/fbaj.png';
import yjct from './img/yjct.png';
import jtbz from './img/jtbz.png';
import xfgl from './img/xfgl.png';
import xsgl from './img/xsgl.png';
import kmyl from './img/kmyl.png';
import zdfk1 from './img/zdfk-h.png';
import fqgk1 from './img/fqgk-h.png';
import xcgk1 from './img/xcgk-h.png';
import rclx1h0 from './img/rclx1-h.png';
import rclx1h1 from './img/rclx2-h.png';
import rclx1h2 from './img/rclx3-h.png';
import rclx1h3 from './img/rclx4-h.png';
import rclx1h4 from './img/rclx5-h.png';
import mjcl1 from './img/mjcl-h.png';
import dmajcl1 from './img/dmajcl-h.png';
import dxajcl1 from './img/dxajcl-h.png';
import qtry1 from './img/qtry-h.png';
import qylx1 from './img/qylx-h.png';
import fbaj1 from './img/fbaj-h.png';
import yjct1 from './img/yjct-h.png';
import jtbz1 from './img/jtbz-h.png';
import xfgl1 from './img/xfgl-h.png';
import xsgl1 from './img/xsgl-h.png';
import kmyl1 from './img/kmyl-h.png';
import { innerHtml } from '@/utils/utilsJS';
//定义props的类型
interface Props {
  onCancel: (falg?: boolean) => void;
  callBackLoadModel: (entity: any, layer: any) => void;
  callBackIsHide: (flg: boolean) => void;
  callBackIsCheckTop: (flg: boolean) => void;
}
const iconObj = {
  zdfk: zdfk,
  fqgk: fqgk,
  xcgk: xcgk,
  rclx: rclx,
  mjcl: mjcl,
  dmajcl: dmajcl,
  dxajcl: dxajcl,
  qtry: qtry,
  qylx: qylx,
  fbaj: fbaj,
  yjct: yjct,
  jtbz: jtbz,
  xfgl: xfgl,
  xsgl: xsgl,
  kmyl: kmyl,
  zdfk1: zdfk1,
  fqgk1: fqgk1,
  xcgk1: xcgk1,
  rclx1h0: rclx1h0,
  rclx1h1: rclx1h1,
  rclx1h2: rclx1h2,
  rclx1h3: rclx1h3,
  rclx1h4: rclx1h4,
  mjcl1: mjcl1,
  dmajcl1: dmajcl1,
  dxajcl1: dxajcl1,
  qtry1: qtry1,
  qylx1: qylx1,
  fbaj1: fbaj1,
  yjct1: yjct1,
  jtbz1: jtbz1,
  xfgl1: xfgl1,
  xsgl1: xsgl1,
  kmyl1: kmyl1,
};

let prevFlg = false;
const TopCenterModule: FC<Props> = (props) => {
  const { onCancel, callBackLoadModel, callBackIsHide, callBackIsCheckTop } = props;
  const tuceng = useRef<any>();
  const [list, setList] = useState<any[]>([]);
  const [childrenList, setChildrenList] = useState<any[]>([]);
  const [showChildren, setShowChildren] = useState<boolean>(false);
  const [childIndex, setChildIndex] = useState<number>(0);

  // 加载3d模型
  const loadModel = (entity: any) => {

    window.layerModelLF = callBackLoadModel(entity, window.layerModelLF);
  };
  const clearTc = (flg?: boolean) => {
    if (tuceng.current) {
      tuceng.current.clear();
      window.map.removeLayer(tuceng.current);
    }
    if (!flg) {
      window.changeLayer();
    }
  };
  const layerRander = (data: any) => {
    clearTc(true);
    tuceng.current = new mars3d.layer.GraphicLayer();
    window.map.addLayer(tuceng.current);
    if (!data) return;
    const graphics: any[] = [];
    data?.map((item: any) => {
      try {
        if (item.entity !== '') {
          const entity = JSON.parse(item.entity || '{}');
          const graphic = entity?.GeoJSON
            ? mars3d.Util.geoJsonToGraphics(entity?.GeoJSON)[0]
            : undefined;
          if (graphic) {
            graphic.attr.data = item;
            graphics.push(graphic);
          } else {
            const e = '解析失败';
            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw e;
          }
        }
      } catch (err: any) {
        console.log(err);
        // message.error(err.message||err)
      }
    });
    graphics.map((item) => {
      tuceng.current.addGraphic(item);
    });
    tuceng.current.eachGraphic((graphic: any) => {
      innerHtml(graphic);
    });
    window.changeLayer();
  };
  // 获取预案树
  const getTree = () => {
    queryTree({ sceneId: window.cjObj?.id })
      .then((res) => {
        if (res.code === 200) {
          const dealDate: any[] = [];
          res?.data?.forEach((item: any) => {
            const newItem = item.data;
            const entity = JSON.parse(newItem?.entity||'{}');
            newItem.entity = entity;
            newItem.icon = entity?.code || '';
            newItem.tip = entity?.name || '';
            if (newItem.icon && entity?.type === '67903d9b-7bf2-4591-b153-42e4f55716af') {
              if (item.children) {
                const childList = item.children?.map((val: any) => {
                  const da = val.data;
                  const entity2 = JSON.parse(da.entity);
                  da.icon = entity2?.code || '';
                  da.tip = entity?.name || '';
                  return da;
                });
                dealDate.push({
                  ...newItem,
                  children: childList,
                });
              } else {
                dealDate.push(newItem);
              }
            }
          });
          console.log('dealDate:', dealDate);
          setList(dealDate);
          callBackIsHide(dealDate.length > 0);
        }
      })
      .catch((err) => {
        console.log(err.message || err)
        // message.error(err.message || err);
      });
  };
  const getDetail = (code: string) => {
    const queryObject = {
      listId: code,
    };
    arIconLayerQuery(queryObject)
      .then((res) => {
        if (res.code == 200) {
          const data = res.data.rows;

          // setMarkList(data);
          layerRander(data);
        }
      })
      .catch((err) => {
        if (err?.message) {
          console.log(err.message || err)
          // message.error(err.message || err);
        }
      });
  };
  const clickFirstFun = (item: any) => {
    if (window.layerModelLF) {
      loadModel(false);
    }
    

    if (item?.entity?.modelTreeData?.data?.entity && !item.checked) {
      const entity = JSON.parse(item?.entity?.modelTreeData?.data?.entity||"{}");
      entity.id = item?.entity?.modelTreeData?.data?.id;
      entity.mark = 'main';
      loadModel(entity);
    }
    const newList = list.map((val: any) => {
      if (item.id === val.id && !item.checked) {
        val.checked = !val.checked;
        if (val.children) {
          let ind = 0;
          val.children.forEach((element: any, index: number) => {
            if (element.checked) {
              ind = index;
              getDetail(element.id);
              setChildIndex(index);
            }
          });
          val.icon = item.icon + '1h' + ind;
          setShowChildren(true);
          const hasCheck = item.children.filter((val1: any) => {
            return val1.checked;
          });
          if (hasCheck.length > 0) {
            setChildrenList(item.children);
            const modelTreeData=JSON.parse(hasCheck[0]?.entity||"{}").modelTreeData||{}
            if (modelTreeData?.data?.entity && hasCheck[0].checked) {
              const entity = JSON.parse(modelTreeData?.data?.entity||"{}");
              entity.id = modelTreeData?.data?.id;
              entity.mark = 'main';
              loadModel(entity);
            }
          } else {
            const dat = item.children.map((val2: any, index: number) => {
              if (index === 0) {
                setChildIndex(0);
                val2.checked = true;
                val2.icon = val2.icon + '1';
                getDetail(val2.id);
              }
              return val2;
            });
            const modelTreeData=JSON.parse(dat[0]?.entity||"{}").modelTreeData||{}
            if (modelTreeData?.data?.entity && dat[0].checked) {
              const entity = JSON.parse(modelTreeData?.data?.entity||"{}");
              entity.id =modelTreeData?.data?.id;
              entity.mark = 'main';
              loadModel(entity);
            }
            setChildrenList(dat);
          }

        } else {
          val.icon = item.icon + '1';
          setShowChildren(false);
          getDetail(item.id);
        }
      } else {
        val.checked = false;
        val.icon = val.icon.split('1')[0];
        clearTc();
      }
      return val;
    });
    setList(newList);
  };
  const clickChildrenFun = (item: any) => {

    if (window.layerModelLF) {
      loadModel(false);
    }
  
    const modelTreeData=JSON.parse(item.entity||"{}").modelTreeData||{}
    if (modelTreeData.data?.entity && !item.checked) {
      const entity = JSON.parse(modelTreeData.data?.entity||"{}");
      entity.id = item?.entity?.modelTreeData?.data?.id;
      entity.mark = 'main';
      loadModel(entity);
    }
    const newList = childrenList.map((val: any, index: number) => {
      if (item.id === val.id && !item.checked) {
        val.checked = !item.checked;
        val.icon = val.icon + '1';
        setChildIndex(index);
        getDetail(val.id);
      } else {
        val.checked = false;
        val.icon = val.icon.split('1')[0];
        clearTc();
      }
      return val;
    });
    const lis = newList.filter((a: any) => {
      return a.checked;
    });
    if (lis.length === 0) {
      setChildIndex(-1);
    }
    setChildrenList(newList);
  };
  // 放回
  const back = () => {
    const newList = list.map((val: any) => {
      if (val.checked) {
        // const iconN = val.icon.split('1')[0];
        const iconN = 'rclx';
        console.log('iconN:', iconN);
        if (childIndex === -1) {
          val.icon = val.icon.split('1')[0];
          val.checked = false;
        } else {
          val.icon = iconN + '1h' + childIndex;
        }
      }
      return val;
    });
    setList(newList);
    setShowChildren(false);
  };
  useEffect(() => {});
  useEffect(() => {
    if (window.cjObj?.id) {
      getTree();
      setShowChildren(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.cjObj]);

  useEffect(() => {
    let flg = false;
    if (showChildren) {
      childrenList.forEach((item: any) => {
        if (item.checked) {
          flg = true;
        }
      });
    } else {
      list.forEach((item: any) => {
        if (item.checked) {
          flg = true;
        }
      });
    }
    if (flg !== prevFlg) {
      callBackIsCheckTop(flg);
      prevFlg = flg;
    } else {
      prevFlg = flg;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, childrenList]);

  return (
    <div className={styles.contentWrap}>
      <div className={styles.contentBox}>
        <i
          className="iconfont icon-guanbi"
          onClick={() => {
            clearTc();
            if (window.layerModelLF) {
              loadModel(false);
            }
            onCancel();
            callBackIsCheckTop(false);
          }}
        />
        <div className={styles.content}>
          <div className={styles.first}>
            {!showChildren &&
              list.map((item: any) => (
                <div
                  key={item.id}
                  className={styles.item}
                  onClick={() => {
                    clickFirstFun(item);
                  }}
                >
                  <div style={{ height: '36px', textAlign: 'center' }}>
                    <Image width={36} preview={false} src={iconObj[item.icon]} />
                  </div>
                  <div className={`${styles.title} ${item.checked ? styles.checked : ''}`}>
                    {item.name}
                  </div>
                  <div className={styles.tipBox}>
                    <div className={styles.row}>
                      <Image width={12} preview={false} src={iconRen} />
                      <span>{item.entity?.name || '无'}</span>
                    </div>
                    <div className={styles.row}>
                      <Image width={12} preview={false} src={iconPhone} />
                      <span>{item.entity?.tel || '无'}</span>
                    </div>
                  </div>
                </div>
              ))}
            {showChildren && (
              <div className={styles.second}>
                {childrenList.map((item: any) => (
                  <div key={item.id} className={styles.item}>
                    <Tooltip placement="top" title={item.tip}>
                      <div style={{ height: '36px', textAlign: 'center' }}>
                        <Image
                          width={36}
                          preview={false}
                          src={iconObj[item.icon]}
                          onClick={() => {
                            clickChildrenFun(item);
                          }}
                        />
                      </div>
                      <div className={`${styles.title} ${item.checked ? styles.checked : ''}`}>
                        {item.name}
                      </div>
                    </Tooltip>
                  </div>
                ))}
                <div
                  className={styles.back}
                  onClick={() => {
                    back();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopCenterModule;
