/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import styles from './../index.less'
import { Table } from 'antd';
import { useState ,useEffect} from 'react';
import { getTicketPageData,TicketData } from '@/services/topManage/index';
import XhEchart from './xhEcharts'
import yongdudu from '@/assest/img/yongdudu.png'
import stop from '@/assest/img/stop.png'
import attr from '@/assest/img/attr.png'
import lvguan from '@/assest/img/lvguan.png'
import chuan from '@/assest/img/chuan.png'
import lvzhou_yunying_keliu from '@/assest/img/lvzhou_yunying_keliu.png'

//定义props的类型
interface Props{
    carNum: number,
    ycNum: number,
    klNum: number,
    setXhCars: () => void,
    serXhYcs: () => void,
    setXhZd: () => void,
}
const XhModel: React.FC<Props>= (props) => {
  const [showRoad, setShowRaod] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);  // 票务弹窗状态
  const [ticketData, setTicketData] = useState<any>([]);  // 票务数据
  const [ticketTotal, setTicketTotal] = useState<any>(0);  // 票务总数据
  const [addNum, setAddNum] = useState<any>(0);
  const [xaddNum, setXaddNum] = useState<any>(0);


  const ticketColumns: any = [
    {
        title: '上报区域',
        width: 100,
        dataIndex: 'reportAreaName',
        key: 'reportAreaName',
        align: 'center'
    },
    {
        title: '已售门票',
        width: 75,
        dataIndex: 'num',
        key: 'num',
        align: 'center'
    },
    {
        title: '入园数',
        width: 75,
        dataIndex: 'addNum',
        key: 'addNum',
        align: 'center'
    },
    {
        title: '上报时间',
        width: 170,
        dataIndex: 'reportTime',
        key: 'reportTime',
        align: 'center'
    },
  ];


  useEffect(() => {
    initPage();
  },[]);

  const initPage = async ()=>{
    let xout: any = await TicketData({});
    if(xout.code !== 200){ return }
    setAddNum(xout.result.num);
    setXaddNum(xout.result.addNum);
    let out: any =  await getTicketPageData({ queryObject: { page:'0',size: 6 } });
    if(out.code == 200){
      setTicketData(out.result.page.content);
      setTicketTotal(out.result.page.totalElements);
    }
  }
  // 分页方法
  const changePage = async (xpage: any) => {
    console.log('xxxxxx',xpage)
    let out: any =  await getTicketPageData({ queryObject: { page:xpage-1,size:6 } });
    if(out.code == 200){
      setTicketData(out.result.page.content);
      setTicketTotal(out.result.page.totalElements);
    }
  }

    //票务点击方法
    const setPw = ()=>{
      setIsShow(!isShow);
    }

    const setCar = () => {
        props.setXhCars()
    }
    const setYc = () => {
        props.serXhYcs()
    }
    const columns: any = [
        {
            title: '名称',
            width: 400,
            dataIndex: 'name',
            key: 'name',
            align: 'left'
        },{
            title: '通过车辆',
            width: 80,
            dataIndex: 'carNum',
            key: 'carNum',
            align: 'left'
        },
    ]
    const jqData = [{name: 'T01 湘湖路与湘浦路路口', carNum: 0},{name: 'T02 湘湖路与跨湖桥路路口', carNum: 0},
    {name: 'T03 湘湖路与杨堤路口', carNum: 0},{name: 'T04 湘湖路与眉山路口', carNum: 0},
    {name: 'T05 湘湖路与湘虎路路口', carNum: 0},{name: 'T06 越王路与杨堤路口', carNum: 0},
    {name: 'T07 越王路与湘浦路路口', carNum: 0},{name: 'T08 湘湖路与时代大道路口', carNum: 0}]
    const roadClick = () => {
        setShowRaod(!showRoad);
        props.setXhZd();
    }
    const [showKl, setShowKl] = useState<boolean>(false)
    const [chartData, setChartData] = useState<any>({})
    const setkl = () => {
        // if (!showKl) {
        //     const data  = {
        //         num: 10,
        //         value:[2,3,4,5,6,7],
        //         name: [1,2,3,4,5,6],
        //         title: 'diyi'
        //     }
        //     setChartData(data)
        // }
        // setShowKl(!showKl)
    }
    return (
        <div className={styles.XHModal}>
          {/* 重点路口 */}
            <div className={styles.XHMapNav} onClick={roadClick}>
                <div>
                    <div className={styles.XHMapLine}
                        style={{background: "#A52A2A", padding: "2px 4px 6px"}}>
                        <img src={yongdudu} alt="" style={{width:"100%"}} />
                    </div>
                </div>
                <div style={{ margin: "0 12px 0 8px"}}>
                    <div className={styles.yddColor}>重点路口</div>
                    <div className={styles.XHMapNum} style={{color:"#A52A2A"}} id="trafficNUm">8</div>
                </div>
            </div>
            {/* 停车场 */}
            <div className={styles.XHMapNav} onClick={setCar}>
                <div>
                    <div className={styles.XHMapLine} style={{background: "#FFA500"}}>
                        <img src={stop} alt="" style={{width:"100%"}}/>
                    </div>
                </div>
                <div style={{ margin: "0 12px 0 8px"}}>
                    <div className={styles.stopColor}>停车场</div>
                    {/* {props.carNum} 翁工要求停车场数量写死35 ---黄佳豪 */}
                    <div className={styles.XHMapNum} style={{color:"#FFA500"}} id="stopNUm">35</div>
                </div>
            </div>
            {/* 游船数 */}
            <div className={styles.XHMapNav} onClick={setYc}>
                <div>
                    <div className={styles.XHMapLine} style={{background: "#8B4513"}}>
                        <img src={chuan} alt="" style={{width:"100%"}} />
                    </div>
                </div>
                <div style={{margin: "0 12px 0 8px"}}>
                    <div className={styles.boatColor}>游船数</div>
                    <div className={styles.XHMapNum} style={{color:"#8B4513"}} id="boatNUm">{props.ycNum}</div>
                </div>
            </div>
            {/* 实时客流 */}
            <div className={styles.XHMapNav} onClick={setkl}>
                <div>
                    <div className={styles.XHMapLine} style={{background: "#228B22"}}>
                        <img src={lvzhou_yunying_keliu} alt="" style={{width:"100%"}} />
                    </div>
                </div>
                <div style={{ margin: "0 12px 0 8px"}}>
                    <div className={styles.jqssklColor}>实时客流</div>
                    <div className={styles.XHMapNum} style={{color:"#228B22"}} id="passengerNum">{props.klNum}</div>
                </div>
            </div>

            {/* 票务 */}
            <div className={styles.XHMapNav} onClick={setPw}>
                <div>
                    <div className={styles.XHMapLine} style={{background: "#8552a1"}}>
                        <img src={attr} alt="" style={{width: "92%", position: "relative",left: "2px",top: "2px"}} />
                    </div>
                </div>
                <div style={{margin: "0 12px 0 8px"}}>
                    <div className={styles.ticketColor}>票务</div>
                    <div className={styles.XHMapNum} style={{color:"#8552a1"}} id="ticketNUm">{addNum}/{xaddNum}</div>
                </div>
            </div>
            {/* 旅馆入住 */}
            <div className={styles.XHMapNav}>
                <div>
                    <div className={styles.XHMapLine} style={{background: "#00CED1"}}>
                        <img src={lvguan} alt="" style={{width:"100%"}} />
                    </div>
                </div>
                <div style={{ margin: "0 12px 0 8px"}}>
                    <div>旅馆入住</div>
                    <div className={styles.XHMapNum} style={{color:"#00CED1"}} id="hotelNUm">346</div>
                </div>
            </div>
            {showRoad && <div className={styles.roadTable}>
                <p className={styles.titleName}>景区拥挤度<span className='iconfont ' /></p>
                <Table
                    columns={columns}
                    dataSource={jqData}
                    bordered
                    size="middle"
                    className={styles.xhList}
                    scroll={{ y: 250 }}
                    pagination={false}
                    />
            </div>}
            {showKl &&
                <div className={styles.timeKl}>
                    <p><span className={styles.titleName}>景区客流分析</span><span className='iconfont icon-guanbi1' /></p>
                    <div className={styles.xhEchs}>
                        <XhEchart chartData={chartData} />
                    </div>
                </div>
            }
            {/* 票务弹窗 */}
            {
              isShow && <div className={styles.roadTable}>
                <div style={{marginTop:'10px'}}>{}</div>
                <Table
                  rowKey={'id'}
                  columns={ticketColumns} dataSource={ticketData} bordered={false} size="middle"
                  className={styles.xhList} scroll={{ y: 250 }}
                  pagination={{
                    pageSize: 6,
                    total: ticketTotal,
                    onChange: changePage
                  }}
                />
              </div>
            }
        </div>
    )
}
export default XhModel;
