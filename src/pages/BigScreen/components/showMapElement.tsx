import React, { useState, useEffect } from 'react';
//定义props的类型
interface Props {
  popupData: {
    type: string;
    style: any;
    tableList: [
      {
        title: string;
        header: any[];
        attrs: any[];
      }
    ];
    timeStamp: string;
    icon: string;
    requestGraphic: any;
    requestPoint: any;
    requestBim: any;
    polygon: string;
  };
  popupClose: () => void;
  callBackSecurity: (obj: any) => void;
}
let graphicLayerCircle: any = null; // 圈
let graphicLayerPoint: any = null; // 点
let graphicLayerLine: any = null; // 线

const PopupAlertSecurity: React.FC<Props> = (props) => {
  const { popupData, params, popupClose, callBackSecurity } = props;
  const addFeature = (graphicLayer: any, arr: any, icon: string, type: string) => {
    window.map.addLayer(graphicLayer);
    graphicLayer.clear();
    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i];
      const primitive = new mars3d.graphic.BillboardEntity({
        position: new mars3d.LngLatPoint(item.lon, item.lat, item.height || 0),
        style: {
          image: icon,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scaleByDistance: new Cesium.NearFarScalar(1000, 0.7, 5000000, 0.3),
          visibleDepth:false,
          width: 30,
          height: 30,
        },
        attr: item
      });
      graphicLayer.addGraphic(primitive);
    }
    graphicLayer.bindTooltip(
      function (event: any) {
        const item = event.graphic?.attr;
        if (!item) {
          return false;
        }
        const innerTooltip = `<table style="width: auto;">
          <tr>
            <th scope="col" colspan="2" style="text-align:center;font-size:15px;">${item.name} </th>
          </tr>
          <tr>
            <td>时间：</td><td>${item.time}</td>
          </tr>
        </table>`;
        return innerTooltip;
      },
      {
        direction: 'top',
        offsetY: -30,
      },
    );
    graphicLayer.bindPopup(function (event: { graphic: { attr: any; }; }) {
      const item = event.graphic?.attr
      if (!item) {
        return false
      }
      if (type == '安检') {
        return false
      }
      const inthtml = `<table style="width: auto;">
                    <tr>
                      <th scope="col" colspan="2" style="text-align:center;font-size:15px;">${item.name} </th>
                    </tr>
                    <tr>
                    <td>时间：</td><td>${item.time}</td>
                    </tr>
                    <tr>
                      <td>视频：</td> <td><video src='http://data.mars3d.cn/file/video/lukou.mp4' controls autoplay style="width: 500px;" ></video></td>
                    </tr>
                  </table>`
      return inthtml
    }, {
      direction: 'top',
      offsetY: -30,
    })
    graphicLayer.on(mars3d.EventType.click, (event: any) => {
      const graphic = event.graphic;
      if (graphic) {
        // const entity = graphic?.options?.attr?.data?.entity
        //   ? JSON.parse(graphic?.options?.attr?.data?.entity)
        //   : {};
        if (type == '安检') {
          callBackSecurity({
            id: 'entity?.info?.code',
            name: '安检',
          });
        }
      } else {
        //单击了聚合的点
      }
    });
  };
  const getEvent = (graphicLayer: any, position: any) => {
    window.map.addLayer(graphicLayer)
    graphicLayer.clear()
    const graphic = new mars3d.graphic.CircleEntity({
      position: position,
      style: {
        radius: 500,
        height: 0,
        color: "#ffff00",
        opacity: 0.3,
        outline: true,
        outlineWidth: 2,
        outlineColor: "#f0f",
        clampToGround: true,
      }
    })
    graphicLayer.addGraphic(graphic)
  }
  const addDemoGraphics = (graphicLayer: { addGraphic: (arg0: any) => void }, arr: any[]) => {
    arr.forEach((item: any) => {
      const pos: any = [];
      item.info.position.map((k: any) => {
        pos.push([k.longitude, k.latitude]);
      });
      const primitive = new mars3d.graphic.PolylineEntity({
        positions: pos,
        style: {
          width: 5,
          material: mars3d.MaterialUtil.createMaterialProperty(mars3d.MaterialType.PolylineDash, {
            color: Cesium.Color.BLUE,
            gapColor: Cesium.Color.YELLOW,
            // speed: 2,
            // percent: 0.15,
            // alpha: 0.2
          })
        },
        name: item.info.link_name,
        id: 'line_' + item.link_id,
        // item: item.state,
        // attr: item.attr,
      });
      graphicLayer.addGraphic(primitive);
    });
    // graphicLayer.bindTooltip(
    //   function (event: any) {
    //     const item = event.graphic?.options;
    //     let roadColor = '#38A800';
    //     const state_index = item.item.state_index;
    //     if (state_index >= 0 && state_index < 2) {
    //       roadColor = '#38A800';
    //     } else if (state_index >= 2 && state_index < 4) {
    //       roadColor = '#8BD100';
    //     } else if (state_index >= 4 && state_index < 6) {
    //       roadColor = '#FFFF00';
    //     } else if (state_index >= 6 && state_index < 8) {
    //       roadColor = '#FF8000';
    //     } else if (state_index >= 6 && state_index < 8) {
    //       roadColor = '#FF0000';
    //     }
    //     if (!item) {
    //       return false;
    //     }
    //     const innerTooltip = `<div >
    //         <div style="color:#ffd324;font-size:18px">${item.name}</div>
    //         <div style="color:#fff;font-size:18px">通/均<span style="margin:0 8px">${item.item.avg_speed}/${item.item.free_speed}
    //         </span>拥堵指数<span style="padding:0 8px;background:${roadColor};border-radius:6px;margin-left:8px;">${item.item.state_index}</span></div>
    //         <div style="color:#fff;font-size:18px">监测时间<span style="margin-left:8px">${item.item.time_point}</span></div>
    //         </div>`;
    //     return innerTooltip;
    //   },
    //   {
    //     direction: 'top',
    //     offsetY: -30,
    //   },
    // );
  };
  const setBim = () => {
    // BIM模型处理
    const layerWorkBIM = window.map.getLayer(1987, "id")
    layerWorkBIM.style = function (event) {
      const attr = event.properties

      // 下面可以根据属性做各类判断后返回不同颜色，隐藏的可以透明度为0
      if (attr.testStyle) {
        return "rgba(0,0,0,1)"
      }
      if (attr.id === "c83f64c5409a4246a9918839bbd21f89000743e0") {
        return "rgba(0,0,0,1)"
      }
      if (attr.name === "Obj3d66-771819-1-938") {
        return "rgba(0,255,0,1)"
      }

      return "rgba(255,255,255,1)"
    }
  }
  const setCircular = () => {
    popupData.requestGraphic(params)
      .then((res: any) => {
        if (res.code) {
          const coordinates = res.result?.page?.coordinates || [];
          if (graphicLayerCircle) {
            window.map.removeLayer(graphicLayerCircle);
          }
          graphicLayerCircle = new mars3d.layer.GraphicLayer({
            name: '事件处置图层',
            zIndex: 90
          });
          getEvent(graphicLayerCircle, coordinates)
          if (graphicLayerPoint) {
            window.map.removeLayer(graphicLayerPoint);
          }
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  }
  const setPoint = () => {
    popupData.requestPoint(params)
      .then((res: any) => {
        if (res.code) {
          const point = res.result?.page?.point || [];
          if (graphicLayerPoint) {
            window.map.removeLayer(graphicLayerPoint);
          }
          // 聚合图层点位采集
          graphicLayerPoint = new mars3d.layer.GraphicLayer({
            clustering: {
              enabled: true,
              pixelRange: 20,
              name: popupData.type,
            }
          });

          addFeature(graphicLayerPoint, point, popupData.icon, popupData.type);
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });
  }
  const setLine = () => {
    popupData.requestLine(params)
      .then((res: any) => {
        if (res.code) {
          const point = res[popupData.resultLine] || [];
          if (graphicLayerLine) window.map.removeLayer(graphicLayerLine);
          graphicLayerLine = new mars3d.layer.GraphicLayer({
            clustering: {
              enabled: true,
              pixelRange: 50,
            },
            name: '交通拥堵度',
          });
          window.map.addLayer(graphicLayerLine);
          addDemoGraphics(graphicLayerLine, point);
        }
      })
      .catch((err: any) => {
        console.log(err.message || err);
      });

  }
  const cleanMap=()=>{
    if (graphicLayerCircle) {
      window.map.removeLayer(graphicLayerCircle);
    }
    if (graphicLayerPoint) {
      window.map.removeLayer(graphicLayerPoint);
    }
    if (graphicLayerLine) {
      graphicLayerLine.clear()
      window.map.removeLayer(graphicLayerLine);
    }
  }
  useEffect(() => {
    if (popupData) {
      if (graphicLayerPoint) {
        window.map.removeLayer(graphicLayerPoint);
      }
      if (graphicLayerCircle) {
        window.map.removeLayer(graphicLayerCircle);
      }
      if (graphicLayerLine) {
        window.map.removeLayer(graphicLayerLine);
      }
      if (popupData.polygon == 'circular') {
        setCircular();
      }
      if (popupData.polygon == 'point') {
        setPoint();
      }
      if (popupData.polygon == 'bim') {
        setBim();
      }
      if (popupData.polygon == 'circular&point') {
        setCircular();
        setPoint();
      }
      if (popupData.polygon == 'line&point') {
        setLine();
        setPoint();
      }
      if (popupData.polygon == 'line') {
        setLine();
      }
    }
  }, [popupData.timeStamp]);
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: '220rem',
          left: '434rem',
          width: '45rem',
          height: '45rem',
          fontSize: '12rem',
          lineHeight: '44rem',
          textAlign: 'center',
          background: " url('/img/imageNew/abcs.png') no-repeat 0 0",
          backgroundSize: '100% 100%',
          cursor: 'pointer',
          fontFamily: ' MicrosoftYaHei-Bold'
        }}
        onClick={() => {
          cleanMap()
          popupClose()
        }}
      >
        返回
      </div>
    </>
  );
};
export default PopupAlertSecurity;
