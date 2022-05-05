import styles from './index.less';
import bt from '../image/bt.png';
import React, { useState, useEffect } from 'react';
import { message, Button, Image, Modal } from 'antd';
import { capturePage } from '@/services/bigScreen';
import VideoPlayer from '../../../components/videoPlayer/index';
import { getDate } from '@/utils/utilsJS';

interface Props {
  id: string;
  name: string;
  callback: () => any;
}
let graphicLayerFace: any = null; // 人脸抓拍轨迹图层
const FaceDetail: React.FC<Props> = (props) => {
  const { id, name, callback } = props;
  const [faceList, setFaceList] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [itemData, setItemData] = useState<any>({});
  const [url, setUrl] = useState<string>('');

  // 获取卡口数据
  const getDealRecard = () => {
    const dataT = getDate(0);
    const start = dataT.endDate + ' 00:00:00';
    const end = dataT.endDate + ' 23:59:59';
    const newId = id?.split('_')[0];
    const params = {
      condition: {
        channelCodes: [newId],
        endCapTime: end,
        startCapTime: start,
      },
      page: 1,
      pageSize: 1000,
      platform: 'DAHUA',
    };
    capturePage(params)
      .then((res: any) => {
        if (res.code === 200) {
          // const typeList = [
          //   {
          //     id: '1',
          //     imgUrl:
          //       'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          //     gender: 0,
          //     race: 1,
          //     eye: 1,
          //     age: 23,
          //     time: '2021-12-12 23:22:25',
          //     checked: false,
          //   }
          // ];
          const list = res.result?.page?.content || [];
          setFaceList(list);
        }
      })
      .catch((err: any) => {
        console.log(err.message || err)
        // message.error(err.message || err);
      });
  };

  //
  const setLocusFun = (data: any) => {
    const dataT = getDate(0);
    const start = dataT.endDate + ' 00:00:00';
    const end = dataT.endDate + ' 23:59:59';
    const params = {
      condition: {
        endCapTime: end,
        startCapTime: start,
      },
      retrieval: {
        faceImage: data?.imgUrl,
        threshold: 0.11,
      },
      page: 1,
      pageSize: 1000,
      platform: 'DAHUA',
    };
    capturePage(params)
      .then((res: any) => {
        if (res.code === 200) {
          const list = res.result?.page?.content || [];
          // const positions = [
          //   [120.2288892, 30.2349677, 0],
          //   [120.2488892, 30.2449677, 0],
          //   [120.2588892, 30.2449677, 0],
          // ];
          const positions = list.map((ite: any) => {
            return [ite.gpsX, ite.gpsY, 0];
          });

          graphicLayerFace = new mars3d.layer.GraphicLayer({
            name: '人脸轨迹',
            show: true,
          });
          window.map.addLayer(graphicLayerFace);

          const graphic = new mars3d.graphic.PolylineEntity({
            positions,
            style: {
              width: 10,
              material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.LineFlow, {
                color: '#fff',
                image: '/img/mapImg/xz256.png',
                speed: 3,
                repeat: new Cesium.Cartesian2(4.0, 1.0),
              }),
            },
          });
          graphicLayerFace.addGraphic(graphic);
          const graphic1 = new mars3d.graphic.PolylineEntity({
            positions,
            style: {
              clampToGround: true,
              width: 10,
              color: '#ff4a5f',
            },
          });
          graphicLayerFace.addGraphic(graphic1);

          list.forEach((item: any) => {
            const pos = new mars3d.LatLngPoint(item.gpsX, item.gpsY, 0);
            const primitive = new mars3d.graphic.BillboardEntity({
              position: pos,
              style: {
                image: '/img/face.png',
                scale: 0.5,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
                visibleDepth:false
              },
            });
            graphicLayerFace.addGraphic(primitive);
            const html = `<div class="marsFace">
                          <div class="rowItem">
                            <div class="name">
                              <img class="img" src="${item.imgUrl}"/>
                            </div>
                            <div class="con">
                              <div>${item.channeName}</div>
                              <div>${item.capTime}</div>
                            </div>
                          </div>
                        </div>`;
            const graphic2 = new mars3d.graphic.DivGraphic({
              position: [item.gpsX, item.gpsY],
              style: {
                html: html,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                offsetY: -20,
              },
              pointerEvents: true, // false时不允许拾取和触发任意鼠标事件，但可以穿透div缩放地球
            });
            graphicLayerFace.addGraphic(graphic2);
          });
        }
      })
      .catch((err: any) => {
        console.log(err.message || err)
        // message.error(err.message || err);
      });
  };
  const searchLocus = (item: any) => {
    const list = faceList.map((val: any) => {
      if (item.recordId === val.recordId) {
        val.checked = !val.checked;
      } else {
        val.checked = false;
      }
      return val;
    });

    // if(graphicLayerFace) window.map.removeLayer(graphicLayerFace)
    if (item.checked) {
      setLocusFun(item);
    } else {
      window.map.removeLayer(graphicLayerFace);
    }
    setFaceList(list);
  };
  const showDetail = (item: any) => {
    setVisible(true);
    setItemData(item);
  };
  useEffect(() => {
    const dataTime = getDate(0);
    setStartTime(dataTime.endDate + ' 00:00:00');
    setEndTime(dataTime.endDate + ' 23:59:59');
    getDealRecard();

    setUrl('');
    // https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8
  }, [id]);
  const returnNumToVal = (num: any, val: any, str: any) => {
    const index = num.indexOf(str);
    return val[index];
  };
  const tansString = (str: any, type: string) => {
    if (type == 'age') {
      return str;
    } else if (type == 'race') {
      const num = [0, 1, 2, 3];
      const val = ['未识别', '黄种人', '白人'];
      return returnNumToVal(num, val, str);
    } else if (type == 'fringe') {
      const num = [0, 1];
      const val = ['无', '有'];
      return returnNumToVal(num, val, str);
    } else if (type == 'eye') {
      const num = [0, 1];
      const val = ['闭眼', '睁眼'];
      return returnNumToVal(num, val, str);
    } else if (type == 'mouth') {
      const num = [0, 1];
      const val = ['闭嘴', '张嘴'];
      return returnNumToVal(num, val, str);
    } else if (type == 'beard') {
      const num = [0, 1];
      const val = ['没胡子', '有胡子'];
      return returnNumToVal(num, val, str);
    } else if (type == 'mask') {
      const num = [0, 1];
      const val = ['没戴口罩', '戴口罩'];
      return returnNumToVal(num, val, str);
    } else if (type == 'glasses') {
      const num = [0, 1, 2];
      const val = ['没眼镜', '眼镜', '墨镜'];
      return returnNumToVal(num, val, str);
    } else if (type == 'emotion') {
      const num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const val = [
        '微笑',
        '愤怒',
        '悲伤',
        '厌恶',
        '害怕',
        '惊讶',
        '正常',
        '大笑',
        '高兴',
        '困惑',
        '尖叫',
      ];
      return returnNumToVal(num, val, str);
    } else if (type == 'gender') {
      const num = [0, 1, 2, 9];
      const val = ['未知性别', '男性', '女性', '未说明的性别'];
      return returnNumToVal(num, val, str);
    } else if (type == 'capTime') {
      return (
        str[0] +
        str[1] +
        str[2] +
        str[3] +
        '-' +
        str[4] +
        str[5] +
        '-' +
        str[6] +
        str[7] +
        ' ' +
        str[9] +
        str[10] +
        ':' +
        str[11] +
        str[12] +
        ':' +
        str[13] +
        str[14]
      );
    } else if (type == 'similarity') {
      const percent = Math.round(str * 100) + '%';
      return percent;
    }
  };
  return (
    <div className={styles.bayonetBox}>
      <div className={styles.callbackBtn}>
        <Button type="primary" size="small" onClick={callback}>
          返回
        </Button>
      </div>
      <div className={styles.title}>{name}</div>
      <div className={styles.topModuleWrap}>
        <div className={styles.moduleBox}>
          <div className={styles.firstCard}>
            <img src={bt} className={styles.topImg} />
            <span className={styles.titleName}>抓拍监控</span>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.videoItem}>{url && <VideoPlayer key={url} src={url} />}</div>
        </div>
      </div>
      <div className={styles.moduleBox}>
        <div className={styles.firstCard}>
          <img src={bt} className={styles.topImg} />
          <span className={styles.titleName}>抓拍信息</span>
        </div>
      </div>
      <div className={styles.filterTime}>
        <div className={styles.dateTime}>
          开始日期：<div className={styles.time}>{startTime}</div>
        </div>
        <div className={styles.dateTime}>
          开始日期：<div className={styles.time}>{endTime}</div>
          <Button type="primary" onClick={getDealRecard} className={styles.searchBtn}>
            查询
          </Button>
        </div>
      </div>
      <div className={styles.scrollBox} style={{ marginBottom: '20px' }}>
        {faceList.length > 0 &&
          faceList.map((item: any) => (
            <div className={styles.item} key={item.id}>
              <Image
                className={styles.image}
                width={60}
                preview={false}
                src={item.imgUrl}
                onClick={() => {
                  showDetail(item);
                }}
              />
              <div className={styles.rightC}>
                <div className={styles.gender}>
                  {tansString(item.gender, 'gender')} {tansString(item.age, 'age')}
                </div>
                <div className={styles.gender}>{item.capTime}</div>
              </div>
              <div
                className={`${styles.btn} ${item.checked ? styles.checked : ''}`}
                onClick={() => searchLocus(item)}
              >
                {item.checked ? '退出' : '搜索'}
              </div>
            </div>
          ))}
        {faceList.length === 0 && <div className={styles.noDate}>暂无数据</div>}
      </div>

      <Modal
        width={900}
        mask={false}
        bodyStyle={{ padding: '0' }}
        destroyOnClose
        maskClosable={false}
        title={false}
        className="commonPopup"
        visible={visible}
        footer={false}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div className="win-box" id="captureImgInfo">
          <div className="rect-1" />
          <div className="rect-2" />
          <div className="win-title mine-move" />
          <div className="win-content" style={{ paddingTop: '0px' }}>
            <div className="fl cap-img">
              <img id="cap-img" src={itemData?.imgUrl} />
            </div>
            <div className="fl" style={{ width: '260px' }}>
              <div className="gx-title">特征</div>
              <div className="cap-attr">
                {(itemData.gender || itemData.gender == 0) && (
                  <div className="cap-li">
                    <span>性别</span>
                    <span>{tansString(itemData.gender, 'gender')}</span>
                  </div>
                )}
                {(itemData.race || itemData.race == 0) && (
                  <div className="cap-li">
                    <span>种族</span>
                    <span>{tansString(itemData.race, 'race')}</span>
                  </div>
                )}
                {(itemData.age || itemData.age == 0) && (
                  <div className="cap-li">
                    <span>年龄</span>
                    <span>{tansString(itemData.age, 'age')}</span>
                  </div>
                )}
                {(itemData.fringe || itemData.fringe == 0) && (
                  <div className="cap-li">
                    <span>刘海状态</span>
                    <span>{tansString(itemData.fringe, 'fringe')}</span>
                  </div>
                )}
                {(itemData.eye || itemData.eye == 0) && (
                  <div className="cap-li">
                    <span>眼睛状态</span>
                    <span>{tansString(itemData.eye, 'eye')}</span>
                  </div>
                )}
                {(itemData.mouth || itemData.mouth == 0) && (
                  <div className="cap-li">
                    <span>嘴巴状态</span>
                    <span>{tansString(itemData.mouth, 'mouth')}</span>
                  </div>
                )}
                {(itemData.beard || itemData.beard == 0) && (
                  <div className="cap-li">
                    <span>胡子状态</span>
                    <span>{tansString(itemData.beard, 'beard')}</span>
                  </div>
                )}
                {(itemData.mask || itemData.mask == 0) && (
                  <div className="cap-li">
                    <span>口罩状态</span>
                    <span>{tansString(itemData.mask, 'mask')}</span>
                  </div>
                )}
                {(itemData.glasses || itemData.glasses == 0) && (
                  <div className="cap-li">
                    <span>眼睛状态</span>
                    <span>{tansString(itemData.glasses, 'glasses')}</span>
                  </div>
                )}
                {(itemData.emotion || itemData.emotion == 0) && (
                  <div className="cap-li">
                    <span>表情特征</span>
                    <span>{tansString(itemData.emotion, 'emotion')}</span>
                  </div>
                )}
              </div>
              {/* <div id="cap_personlist">
                            <div className="gx-title">可疑人员</div>
                            <div className="cap-attr"></div>
                        </div> */}
            </div>
            <div className="clear" />
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default FaceDetail;
