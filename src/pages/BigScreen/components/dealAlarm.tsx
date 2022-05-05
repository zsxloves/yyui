/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import React, { useState, useEffect } from 'react';
// import ScrollBoard from '@jiaminghi/data-view-react/es/scrollBoard';
import { Image, Input, Radio, Button, Row, Col, message } from 'antd';
// import ReactSeamlessScroll from 'react-seamless-scroll';
import bofang from '../../../assest/alarm/bofang.png';
import {
  // getDetail,
  getWarnDealCfg,
  getWarnDealLog,
  warnDealLogSend,
  sendMessage,
  updateState,
  preview,
} from '@/services/bigScreen';
import { isJSON } from '@/utils/utilsJS';

//定义props的类型
interface Props {
  onCancel: (falg?: boolean) => void;
  callBackUrl: (value: string[], type: string) => void;
  eventPerimeterData?: any;
  dataConfig: {
    message: string;
    id: string;
    category: string;
    [key: string]: any;
  };
}

const { TextArea } = Input;
const DealAlarm: React.FC<Props> = (props) => {
  const { dataConfig, eventPerimeterData, onCancel, callBackUrl } = props;
  const [showType, setShowType] = useState<number>(1);
  const [videoData, setVideoData] = useState<any[]>([]);
  const [policeData, setPoliceData] = useState<any[]>([]);
  const [carData, setCarData] = useState<any[]>([]);
  const [eventDealStep, setEventDealStep] = useState<any[]>([]); // 事件处置
  const [dealRecardList, setDealRecardList] = useState<any[]>([]); // 预警处置记录
  const [alarmType, setAlarmType] = useState<string>();
  const [visibleDealOver, setVisibleDealOver] = useState<boolean>(false); // 是否显示预警处置完毕弹出
  const [dealOrder, setDealOrder] = useState<string>();
  const [imageList, setImageList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectIds, setSelectIds] = useState<string[]>([]);
  // const [eventDealList, setEventDealList] = useState<any[]>([]);

  // 短信发送
  const sendMessageFun = (phone: string) => {
    const stateText = urlencode(dealOrder, 'gbk');
    sendMessage({ phone, con: stateText })
      .then((res: any) => {
        if (res.code === 200) {
          // message.success('指令下发成功')
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const dealOverFun = () => {
    setVisibleDealOver(true);
  };
  // 处置完毕
  const dealSendFun = () => {
    const policeArr: string[] = [];
    const phoneArr: string[] = [];
    const personList: any[] = [];
    policeData.forEach((item: any) => {
      if (item.checked) {
        policeArr.push(item.personName);
        phoneArr.push(item.phoneNumber);
        personList.push({
          name: item.personName,
          phoneNumber: item.phoneNumber,
        });
      }
    });
    carData.forEach((item: any) => {
      if (item.checked) {
        policeArr.push(item.personName);
        phoneArr.push(item.phoneNumber);
        personList.push({
          name: item.personName,
          phoneNumber: item.phoneNumber,
        });
      }
    });
    if (policeArr.length <= 0) {
      console.log('请至少选择一名警力')
      // message.error('请至少选择一名警力');
      return;
    }
    if (!dealOrder) {
      console.log('请输入下发指令')
      // message.error('请输入下发指令');
      return;
    }
    // const params = {
    //   data: {
    //     warnId: dataConfig.id,
    //     dealContent: JSON.stringify({
    //       personName: policeArr.join('、'),
    //       content: dealOrder,
    //     }),
    //   },
    // };
    const params = {
      alarmId: dataConfig.id,
      category: dataConfig.category,
      content: dealOrder,
      personList,
    };
    warnDealLogSend(params)
      .then((res: any) => {
        if (res.code === 200) {
          message.success('指令下发成功');
        }
      })
      .catch((err: any) => {
        console.log(err);
      });

    // 发送短信
    phoneArr.forEach((item) => {
      sendMessageFun(item);
    });
  };
  const addId = (list: string[], id: string, flg: boolean) => {
    let listNew = list;
    if (flg) {
      listNew.push(id);
    } else {
      listNew = listNew.filter((val: string) => {
        return val !== id;
      });
    }
    setSelectIds(listNew);
  };
  const setAlarmListStatue = (item: any, type: string) => {
    if (type === '1') {
      const newList = videoData.map((val: any) => {
        if (item.id === val.id) {
          val.checked = !val.checked;
          addId(selectIds, item.id, val.checked);
        }
        return val;
      });
      setVideoData(newList);
    } else if (type === '2') {
      const newList = policeData.map((val: any) => {
        if (item.id === val.id) {
          val.checked = !val.checked;
          addId(selectIds, item.id, val.checked);
        }
        return val;
      });
      setPoliceData(newList);
    } else {
      const newList = carData.map((val: any) => {
        if (item.id === val.id) {
          val.checked = !val.checked;
          addId(selectIds, item.id, val.checked);
        }
        return val;
      });
      setCarData(newList);
    }
  };
  // 获取预警详情
  // const getAlarmDetail = () => {
  //   const params = {
  //     category: dataConfig.category,
  //     id: dataConfig.id,
  //   };
  //   getDetail(params)
  //     .then((res: any) => {
  //       if (res.code === 200) {
  //         const imgArr = res.result?.result?.imageArray || [];
  //         const arr: string[] = [];
  //         imgArr.forEach((item: { url: string }) => {
  //           if (item.url) {
  //             arr.push(item.url);
  //           }
  //         });
  //         setImageList(arr);
  //       }
  //     })
  //     .catch((err: any) => {
  //       console.log(err);
  //     });
  // };
  // 获取预警处置记录
  const getDealRecard = () => {
    const params = {
      queryObject: {
        page: '0',
        size: 99999,
        warnId: dataConfig.id,
      },
    };
    getWarnDealLog(params)
      .then((res: any) => {
        if (res.code === 200) {
          const typeList = res.result?.page?.content || [];
          setDealRecardList(typeList);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  // 获取事件处置列表
  const getEventDealTxt = () => {
    const params = {
      queryObject: {
        page: '0',
        size: '99999',
        warnType: dataConfig.category,
      },
    };
    getWarnDealCfg(params)
      .then((res: any) => {
        if (res.code === 200) {
          const typeList = res.result?.page?.content || [];
          setEventDealStep(typeList);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const lookFlowFun = (type: number) => {
    setShowType(type);
    if (type === 2) {
      getDealRecard();
    }
  };

  useEffect(() => {
    console.log('eventPerimeterData:', eventPerimeterData);
    if (eventPerimeterData) {
      const { position } = eventPerimeterData;
      const configData =
        eventPerimeterData?.video?.map((item: any) => {
          if (selectIds.includes(item.id)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
          const distance = mars3d.MeasureUtil.getDistance([
            new mars3d.LatLngPoint(item.lon, item.lat, 0),
            new mars3d.LatLngPoint(position.lng, position.lat, 0),
          ]);
          item.distance = Math.floor(distance);

          return item;
        }) || [];
      setVideoData(configData);
      const configData2 =
        eventPerimeterData?.police?.map((item: any) => {
          if (selectIds.includes(item.id)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
          const distance = mars3d.MeasureUtil.getDistance([
            new mars3d.LatLngPoint(item.lon, item.lat, 0),
            new mars3d.LatLngPoint(position.lng, position.lat, 0),
          ]);
          item.distance = Math.floor(distance);
          return item;
        }) || [];
      setPoliceData(configData2);
      const configData3 =
        eventPerimeterData?.car?.map((item: any) => {
          if (selectIds.includes(item.id)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
          return item;
        }) || [];
      setCarData(configData3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventPerimeterData]);
  useEffect(() => {
    if (dataConfig.id) {
      // getAlarmDetail();
      const arr = dataConfig.img.split(',') || [];
      setImageList(arr);
      getEventDealTxt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataConfig.id]);
  return (
    <div className={styles.alarmDealPopup}>
      <i className="iconfont icon-guanbi" onClick={() => onCancel()} />
      <div className={styles.alarmContent}>
        <div className={`${styles.colSty} eventDetail`}>
          <div className="title">事件详情</div>
          <div className="detail">
            <div className="left-con">
              <i className="iconfont icon-xingzhuang" />
              <span className="time">{dataConfig.alarmTime}</span>
              <div className="introduce">{dataConfig.message}</div>
            </div>
            <div className="right-img-box">
              <Image
                width={96}
                height={96}
                preview={false}
                src={imageList[0]}
                onClick={() => {
                  if (imageList[0]) {
                    setShowType(3);
                  }
                }}
              />
            </div>
          </div>
          <div
            className={`btn-show-detail ${showType === 1 ? 'active' : ''}`}
            onClick={() => lookFlowFun(1)}
          >
            预警处置
          </div>
          <div
            className={`btn-show-detail ${showType === 2 ? 'active' : ''}`}
            onClick={() => lookFlowFun(2)}
          >
            查看流程
          </div>
        </div>
        {showType === 1 && (
          <div className={styles.rowSty}>
            <div className={styles.culmos}>
              <div className={styles.colSty}>
                <div className="title">周边视频</div>
                <div className="tableBox">
                  <Row className="tableHeader">
                    <Col span={14}>名称</Col>
                    <Col span={4}>距离</Col>
                    <Col span={6}>操作</Col>
                  </Row>
                  <div className="scrollBox">
                    <div className={styles.listItemBox}>
                      {videoData.map((item: any) => (
                        <Row className="scrollItem" key={item.id}>
                          <Col span={14}>
                            <div
                              className={item.checked ? 'checked hasCheck' : 'hasCheck'}
                              onClick={() => {
                                setAlarmListStatue(item, '1');
                              }}
                            >
                              {item.vedioName}
                            </div>
                          </Col>
                          <Col span={4}>{item.distance}</Col>
                          <Col span={6}>
                            <Image
                              width={20}
                              src={bofang}
                              preview={false}
                              onClick={() => {
                                const list = videoData.filter((res: any) => {
                                  return res.checked;
                                });
                                if (list.length === 0) {
                                  if (
                                    item.videoType === 'f0f9ed28-133a-4a02-a8c2-a56873106ee3' ||
                                    item.videoType === 'dhlw'
                                  ) {
                                    callBackUrl(item.vvideoId, '大华');
                                  } else {
                                    const platform = item.source === '1' ? 'ISC' : 'IOT';
                                    // preview({ data: { cameraIndexCode: item.vedioID } })
                                    preview({
                                      data: {
                                        cameraId: item.vedioID,
                                        platform: platform,
                                        protocol: 'hls',
                                        expand: 'transcode=1&videotype=h264',
                                      },
                                    })
                                      .then((res: any) => {
                                        callBackUrl([res.result.result], '海康');
                                      })
                                      .catch((err: any) => {
                                        console.log(err);
                                      });
                                  }
                                } else {
                                  const dh: string[] = [];
                                  let hk: string[] = [];
                                  Promise.all(
                                    list
                                      .map((lis: any) => {
                                        if (
                                          lis.videoType ===
                                            'f0f9ed28-133a-4a02-a8c2-a56873106ee3' ||
                                          lis.videoType === 'dhlw'
                                        ) {
                                          dh.push(lis.vvideoId);
                                          return undefined;
                                        } else if (
                                          lis.videoType === 'b76a4c09-35a5-4f83-ae4f-315860ad3680'
                                        ) {
                                          const platform = lis.source === '1' ? 'ISC' : 'IOT';
                                          return preview({
                                            data: {
                                              cameraId: lis.vedioID,
                                              platform: platform,
                                              protocol: 'hls',
                                              expand: 'transcode=1&videotype=h264',
                                            },
                                          });
                                        }
                                      })
                                      .filter(Boolean),
                                  )
                                    .then((res) => {
                                      console.log('res---dh-hk:', res);
                                      hk = res
                                        .map((ite: any) => {
                                          return ite.result.result;
                                        })
                                        .filter(Boolean);
                                      if (hk.length > 0) {
                                        callBackUrl(hk, '海康');
                                      }
                                      if (dh.length > 0) {
                                        callBackUrl(dh, '大华');
                                      }
                                    })
                                    .catch((res) => {
                                      console.log('catchres---dh-hk:', res);
                                      hk = res
                                        .map((ite: any) => {
                                          return ite.result.result;
                                        })
                                        .filter(Boolean);
                                      if (hk.length > 0) {
                                        callBackUrl(hk, '海康');
                                      }
                                      if (dh.length > 0) {
                                        callBackUrl(dh, '大华');
                                      }
                                    });
                                  // list.forEach(async (res: any, index: number) => {
                                  //   if (
                                  //     res.videoType === 'f0f9ed28-133a-4a02-a8c2-a56873106ee3' ||
                                  //     item.videoType === 'dhlw'
                                  //   ) {
                                  //     dh.push(res.vvideoId);
                                  //   } else {
                                  //     const platform = res.source === '1' ? 'ISC' : 'IOT';
                                  //     await preview({
                                  //       data: {
                                  //         cameraId: res.vedioID,
                                  //         platform: platform,
                                  //         protocol: 'hls',
                                  //         expand: 'transcode=1&videotype=h264',
                                  //       },
                                  //     })
                                  //       .then(() => {
                                  //         hk.push(res.result.result);
                                  //       })
                                  //       .catch((err: any) => {
                                  //         console.log(err);
                                  //       });
                                  //   }
                                  //   console.log('dh-hk:', dh, hk);
                                  //   if (index === list.length - 1) {
                                  //     if (hk.length > 0) {
                                  //       callBackUrl(hk, '海康');
                                  //     }
                                  //     if (dh.length > 0) {
                                  //       callBackUrl(dh, '大华');
                                  //     }
                                  //   }
                                  // });
                                }
                              }}
                            />
                          </Col>
                        </Row>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.colSty}>
                <div className="title">周边警力</div>
                <div className="tableBox">
                  {/* <ScrollBoard config={policeData} /> */}
                  <Row className="tableHeader">
                    <Col span={8}>姓名</Col>
                    <Col span={8}>手机号</Col>
                    <Col span={8}>距离</Col>
                  </Row>
                  <div className="scrollBox">
                    <div className={styles.listItemBox}>
                      {policeData.map((item: any) => (
                        <Row className="scrollItem" key={item.id}>
                          <Col span={8}>
                            <div
                              className={item.checked ? 'checked hasCheck' : 'hasCheck'}
                              style={{ display: 'flex', alignItems: 'center' }}
                              onClick={() => {
                                setAlarmListStatue(item, '2');
                              }}
                            >
                              <Image width={20} height={20} preview={false} src={item.iconUrl} />
                              {item.personName}
                            </div>
                          </Col>
                          <Col span={8}>{item.phoneNumber}</Col>
                          <Col span={8}>{item.distance}</Col>
                        </Row>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.colSty}>
                <div className="title">周边车辆</div>
                <div className="tableBox">
                  {/* <ScrollBoard config={carData} /> */}
                  <Row className="tableHeader">
                    <Col span={8}>车牌</Col>
                    <Col span={8}>姓名</Col>
                    <Col span={8}>手机号</Col>
                  </Row>
                  <div className="scrollBox">
                    <div className={styles.listItemBox}>
                      {carData.map((item: any) => (
                        <Row className="scrollItem" key={item.id}>
                          <Col span={8}>
                            <div
                              className={item.checked ? 'checked hasCheck' : 'hasCheck'}
                              onClick={() => {
                                setAlarmListStatue(item, '3');
                              }}
                            >
                              {item.deviceName}
                            </div>
                          </Col>
                          <Col span={8}>{item.personName}</Col>
                          <Col span={8}>{item.phoneNumber}</Col>
                        </Row>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.culmos}>
              <div className={styles.colSty} style={{ height: '200px', overflow: 'auto' }}>
                <div className="title">事件处置</div>
                <div className="step-line">
                  {eventDealStep?.length > 0 &&
                    eventDealStep.map((item: any, index: number) => {
                      return (
                        <div className="step" key={index} style={{ height: '68px' }}>
                          <div className="number">{index + 1}</div>
                          <div className="content">{item.content}</div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className={styles.colSty} style={{ height: 'auto' }}>
                <div className="title">指令下达</div>
                <TextArea
                  value={dealOrder}
                  onChange={(val) => {
                    setDealOrder(val.target.value);
                  }}
                  autoSize
                  className="textareaSty"
                />
                <div className="footer-btn">
                  <div className="btns btn-over" onClick={dealOverFun}>
                    处置完毕
                  </div>
                  <div className="btns btn-send" onClick={dealSendFun}>
                    发送
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showType === 2 && (
          <div
            className={styles.rowSty}
            style={{ padding: '40px 20px 20px', backgroundColor: '#1a214acc' }}
          >
            <div className={`step-line-detail`}>
              {dealRecardList.length > 0 ? (
                dealRecardList.map((item) => {
                  const json = isJSON(item.dealContent) ? JSON.parse(item.dealContent||"{}") : {};
                  let person: any = '';
                  let personAllName: string[] = [];
                  if (json.personList) {
                    person = json.personList[0] || {};
                    personAllName = json.personList
                      .map((ite: any) => {
                        return ite.name;
                      })
                      .join('、');
                  }
                  return (
                    <div className="step" key={item.id}>
                      <div className="number">
                        <i className="iconfont icon-xingzhuang" />
                        <div className="name">{person?.name}</div>
                        <div className="time">{item.insertTime}</div>
                      </div>
                      <div className="content">
                        <div className="text">
                          <span className="labelName">下发指令：</span>
                          <span className="con">{json.content || ''}</span>
                        </div>
                        <div className="text">
                          <span className="labelName">处理人员：</span>
                          <span className="con">{personAllName}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-deal-recard" style={{ marginLeft: '115px' }}>
                  暂无处置记录
                </div>
              )}
            </div>
          </div>
        )}
        {showType === 3 && (
          <div
            className={styles.bigImageWrap}
            style={{ padding: '20px', backgroundColor: '#1a214acc' }}
          >
            <div
              className={`${styles.prevImg} ${currentIndex === 0 ? styles.disabled : ''}`}
              onClick={() => {
                const index = currentIndex < 1 ? 0 : currentIndex - 1;
                setCurrentIndex(index);
              }}
            >
              <i className="iconfont icon-jiantouzuo" />
            </div>
            <div className={styles.imageBox}>
              <div
                className={styles.scrollImg}
                style={{ width: imageList.length * 630 + 'rem', left: -626 * currentIndex + 'rem' }}
              >
                {imageList.map((item: string) => (
                  <Image preview={false} height={570} width={626} src={item} key="img" />
                ))}
              </div>
            </div>
            <div
              className={`${styles.nextImg} ${
                currentIndex === imageList.length - 1 ? styles.disabled : ''
              }`}
              onClick={() => {
                const index =
                  currentIndex > imageList.length - 2 ? imageList.length - 1 : currentIndex + 1;
                setCurrentIndex(index);
              }}
            >
              <i className="iconfont icon-jiantouyou" />
            </div>
          </div>
        )}
      </div>
      {/* 处置完毕弹出 */}
      {visibleDealOver && (
        <div className={styles.dealOverPopup}>
          <i
            className="iconfont icon-guanbi"
            onClick={() => {
              setVisibleDealOver(false);
            }}
          />
          <Radio.Group
            onChange={(val) => {
              setAlarmType(val.target.value);
            }}
            value={alarmType}
          >
            <Radio value="1">普通预警</Radio>
            <Radio value="2">误报</Radio>
          </Radio.Group>
          <Button
            type="primary"
            onClick={() => {
              updateState({
                data: {
                  id: dataConfig.id,
                  state: alarmType,
                },
              })
                .then((res: any) => {
                  if (res.code === 200) {
                    message.success('处置完成');
                    onCancel(true);
                  }
                })
                .catch((err: any) => {
                  console.log(err);
                });
            }}
          >
            提交
          </Button>
        </div>
      )}
    </div>
  );
};
export default DealAlarm;
