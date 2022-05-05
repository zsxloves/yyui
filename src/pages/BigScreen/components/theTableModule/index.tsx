/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
// 从表模块
import React, { useEffect, useState } from 'react';
import Culvert from '../../image/handong.png';
import HighPoint from '../../image/high-point.png';
import Bridge from '../../image/bridge.png';
import Tunnel from '../../image/tunnel.png';
import ConstructionSite from '../../image/construction-site.png';
import HiddenDanger from '../../image/hidden-danger.png';
import './index.less';
import stylesNew from '../indexNew.less';
//定义props的类型
interface Props {
  dataConfig: { height?: string; list: any };
  refresh?: any;
  xdata: any;
}
const facilityListData = [
  {
    img: HighPoint,
    text: 104,
    name: '制高点',
  },
  {
    img: Bridge,
    text: 7,
    name: '桥梁',
  },
  {
    img: Tunnel,
    text: 22,
    name: '下穿',
  },
  {
    img: Culvert,
    text: 13,
    name: '涵洞',
  },
  // {
  //   img: ConstructionSite,
  //   text: 69,

  //   name: '施工工地',
  // },

  // {
  //   img: HiddenDanger,
  //   text: 86,
  //   name: '安全隐患',
  // },
];


const TheTableModule: React.FC<Props> = (props) => {
  const { dataConfig, refresh, xdata } = props;
  const [statisData, setStatisData] = useState<any>(''); // 统计


  useEffect(() => {
    setStatisData(xdata);
  }, [dataConfig, refresh, xdata]);

  const facilityListItem = (item: any, index: any) => {
    // if (item.name == '制高点') {
    //   item.text = statisData.制高点;
    // }
    // if (item.name == '桥梁') {
    //   item.text = statisData.桥梁;
    // }
    // if (item.name == '隧道') {
    //   item.text = statisData.隧道;
    // }
    // if (item.name == '涵洞') {
    //   item.text = statisData.涵洞;
    // }
    // if (item.name == '施工工地') {
    //   item.text = statisData.施工工地;
    // }
    // // if (item.name == '危险物品') {
    // //   item.text = statisData.危险物品;
    // // }
    // if (item.name == '安全隐患') {
    //   item.text = statisData.安全隐患;
    // }
    // if (item.name == '重点人员') {
    //   item.text = statisData.重点人员;
    // }
    return (
      <>
        <div
          style={{ background: `url(${item.img}) no-repeat ` }}
          className="facility-list"
          key={index}
          // onClick={() => {
          //   onBridge(item.name);
          // }}
        >
          <div className="facility-user-box">
            <div className="name-box">{item.name}</div>
            <div className="text-box">{item.text}</div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="the-table-module">
      {/* <div className="worker-img-box" style={{ background: `url(${VipPlace}) no-repeat ` }}>
        <div className="worker-box">
          <div className="worker-text-box">重点人员总数</div>
          <div className="worker-num-box">{statisData.重点部位}</div>
        </div>
      </div> */}
      <div style={{  display: 'flex',justifyContent:'space-around' }}>
        <img
          src={require(`/public/img/imageNew/yyVillage/icon2.png`)}
          alt=""
          className={stylesNew.img}
        />
        <img
          src={require(`/public/img/imageNew/yyVillage/icon2.png`)}
          alt=""
          className={stylesNew.img}
        />
      </div>
      <div style={{  display: 'flex',justifyContent:'space-around' }}>
        <div>重点单位 40</div>
        <div>重点人员 889</div>
      </div>
      <div className="facility-list-box">
        {facilityListData.map((item: any, index: any) => {
          return facilityListItem(item, index);
        })}
      </div>
      {/* yaohu */}
    </div>
  );
};
export default TheTableModule;
