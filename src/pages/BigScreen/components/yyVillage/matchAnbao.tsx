/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-empty-interface */
import styles from './index.less';
import React, {useState} from 'react';
const AnjianCard = React.forwardRef<any>((props, ref) => {

  const [jscgLayer, setJscgLayer] = useState<any>();


  //在地图上添加div
  const addDiv = (graphicLayer: any, arr: any) => {
    for (let i = 0, len = arr.length; i < len; i++) {
      const item = arr[i];
      const pos = item.position;
      const position = new mars3d.LatLngPoint(pos.longitude, pos.latitude, pos.height || 0);
      let html = '';
      console.log('item?.attr?.src:',item?.attr)
      if (item?.attr['图标']) {
        html = `<div class="marsBlueGradientPnlBg">
                  <div class="icon"><img src=${item?.attr['图标']}></div>
                  <div class="name">${item.name}</div>
                </div>`
      }else {
        html = `<div class="marsBlueGradientPnl">
                  <div>${item.name}</div>
                </div>`
      }
      const graphic = new mars3d.graphic.DivGraphic({
        position: position,
        style: {
          html,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
      });
      graphic.bindPopup(
        function () {
          const attr = item?.attr || {};
          const htmls = `<div class="popupHouse">
                          <div class='rowItem'>
                              <span class="title">地址：</span>
                              <span class="con">${attr['地址']}</span>
                          </div>
                          <div class='rowItem'>
                              <span class="title">安保联系人：</span>
                              <span class="con">${attr['安保联系人']}</span>
                          </div>
                          <div class='rowItem'>
                              <span class="title">类型：</span>
                              <span class="con">${attr['类型']}</span>
                          </div>
                          <div class='rowItem'>
                              <span class="title">联系电话：</span>
                              <span class="con">${attr['联系电话']}</span>
                          </div>
                          <div class='btnBox ${attr['大屏地址']?'':'hide'}'><div class="btn" onClick="goDetailFun('${attr['大屏地址']}')">跳转大屏</div></div>
                      </div>`;
          return htmls;
        },
        {
          direction: 'top',
          offsetY: -50,
        },
      );
      graphicLayer.addGraphic(graphic);
    }
  };


  // 创建竞赛场馆标注图层
  const ceartJSCG = (xname: any)=>{
    let json: any = '';
    try {
      json = JSON.parse(window.cjObj?.entity||"{}");
    } catch (error) {
      console.log(error, 'json解析失败');
      return;
    }
    // 删除图层
    if(jscgLayer){
      window.map.removeLayer(jscgLayer);
      setJscgLayer(null);
    }
    console.log('123123123',json);
    if (json['标注']) {
      let graphicLayerBZ: any = new mars3d.layer.GraphicLayer({name:xname ,show: true});
      setJscgLayer(graphicLayerBZ);
      window.map.addLayer(graphicLayerBZ);
      let jsonArr: any = [];
      for(let i: any=0; i<json['标注'].length; i++){
        if(json['标注'][i].attr.类型 == xname){
          jsonArr.push(json['标注'][i]);
        }
      }
      if(!jsonArr.length){
        console.log('没有竞赛场馆');
        return;
      }
      addDiv(graphicLayerBZ, jsonArr);
    }

  }

  return (
    <div className={styles.moduleWrapStyle}>
      <div className={styles.matchAnbao}>
        <div className={styles.item} style={{ cursor:'pointer'}}  onClick={()=>{ceartJSCG('竞赛场馆')}}>
            <div>竞赛场馆</div>
            <div className={styles.num}>3</div>
            <div className={styles.bg}></div>
        </div>
        <div className={styles.item} style={{ cursor:'pointer'}} onClick={()=>{ceartJSCG('非竞赛场馆')}}>
            <div>非竞赛场馆</div>
            <div className={styles.num}>2</div>
            <div className={styles.bg}></div>
        </div>
        <div className={styles.item}>
            <div>签约酒店</div>
            <div className={styles.num}>6</div>
            <div className={styles.bg}></div>
        </div>
      </div>
    </div>
  );
});
export default AnjianCard;


