import styles from './index.less'
import weather from './image/weather.png'
import tpl from './image/tpl.png'
import tpr from './image/tpr.png'
import btl from './image/btl.png'
import btr from './image/btr.png'
import fxwrj from "./image/fxwrj.png"
import czwrj from "./image/czwrj.png"
import atfxs from "./image/atfxs.png"
import echarts from "./image/echarts.png"
import xjt from "./image/xjt.png"
import sjt from "./image/sjt.png"
import fjc from "./image/fjc.png"
import xlc from "./image/xlc.png"
import jtkd from "./image/jtkd.png"
import hcz from "./image/hcz.png"
import zagt from "./image/zagt.png"
import jd from "./image/jd.png"
import gajcz from "./image/gajcz.png"
import bc from "./image/bc.png"
import zjt from "./image/zjt.png"
import zt from "./image/zt.png"
import yjt from "./image/yjt.png"
import React from 'react';
import {history} from 'umi';
import { Select } from 'antd';
import FirstCard from './components/first'
import SecondCard from './components/second'
import ThreeCard from './components/three'
import FourCard from './components/four'
import FiveCard from './components/five'
import PoliceEcharts from './components/policeEcharts'
import FullScreenContainer from '@jiaminghi/data-view-react/es/fullScreenContainer';
const { Option } = Select;
const BigScreenTwo: React.FC = () => {
    const handleChange = (value: String) => {
        value === '1'? history.push('/screen') : (value === '2' ? '' : history.push('/screenThree'))
    }
    return(
        <FullScreenContainer>
            <div className={[styles.all,styles.containBody].join(' ')}>
                <div className={styles.topContain}>
                    <div className={styles.contain}>
                        <div className={styles.topLeft}>
                            <span style={{marginLeft:'2%'}}>杭州市 滨江区 晴</span>
                            <img src={weather} />
                            <span> 32℃</span>
                        </div>
                        <div className={styles.topCenter}>
                            <span className={styles.big}>杭州市公安局2022年亚运会安保指挥平台</span>
                            {/* <span className={styles.small}> </span> */}
                            <Select className={styles.section} defaultValue="2" onChange={handleChange}>
                                <Option value="1">场馆功能屏</Option>
                                <Option value="2">展示屏</Option>
                                <Option value="3">社会面功能屏</Option>
                            </Select>
                        </div>
                        <div className={styles.topRight}>
                            <span>2022-09-20 13:56:25</span>
                        </div>
                        {/* <div onClick={toggleScreen}>点击切换大屏</div> */}
                        <div className={styles.clear}></div>
                    </div>
                </div>
                <div className={styles.leftContain}>
                    <FirstCard />
                    <SecondCard />
                    <ThreeCard />
                    <div className={[styles.firstCard,styles.fourCard].join(' ')}>
                        <div className={styles.top}>
                            <span>无人机巡控展示</span>
                        </div>
                        <div className={styles.contain}>
                            <li>
                                <p className={styles.imgP}><img src={fxwrj}/></p>
                                <p className={styles.number}>12246</p>
                                <p><span>发现无人机数</span></p>
                            </li>
                            <li>
                                <p className={styles.imgP}><img src={czwrj}/></p>
                                <p className={styles.number}>12246</p>
                                <p><span>处置无人机数</span></p>
                            </li>
                            <li>
                                <p className={styles.imgP}><img src={atfxs}/></p>
                                <p className={styles.number}>12246</p>
                                <p className={styles.twospan}><span>奥体场馆及</span><span>周边发现数</span></p>
                            </li>
                            <div className={styles.clear}></div>
                        </div>
                        <div className={styles.tpl}><img src={tpl}/></div>
                        <div className={styles.tpr}><img src={tpr}/></div>
                        <div className={styles.btl}><img src={btl}/></div>
                        <div className={styles.btr}><img src={btr}/></div>
                    </div>
                </div>
                <div className={styles.rightContain}>
                    <div className={[styles.firstCard,styles.rightOneCard].join(' ')}>
                        <div className={styles.top}>
                            <span>车流</span>
                        </div>
                        <div className={styles.contain}>
                            <div className={styles.content}>
                                <li className={styles.oneLi}>
                                    <p className={styles.number}>12246</p>
                                    <p>交通指挥</p>
                                </li>
                                <li className={styles.twoLi}>
                                    <div className={styles.title}>车辆进出情况</div>
                                    <div className={styles.titleNumber}>
                                        <p className={styles.oneP}><span>出</span><span className={styles.outNum}>2566</span><img src={xjt}/></p>
                                        <p><span>入</span><span className={styles.inNum}>4356</span><img src={sjt}/></p>
                                    </div>
                                    <div className={styles.clear}></div>
                                </li>
                                <div className={styles.clear}></div>
                            </div>
                            <div className={styles.bom}>
                                <li>
                                    <p className={styles.numberOne}>4297</p>
                                    <p>景区</p>
                                </li>
                                <li>
                                    <p className={styles.numberOne}>142</p>
                                    <p>热门商圈</p>
                                </li>
                                <li>
                                    <p className={styles.numberOne}>46</p>
                                    <p>省行政中心</p>
                                </li>
                                <li>
                                    <p className={styles.numberOne}>82%</p>
                                    <p>赛事场馆周边</p>
                                </li>
                                <div className={styles.clear}></div>
                            </div>
                        </div>
                        <div className={styles.tpl}><img src={tpl}/></div>
                        <div className={styles.tpr}><img src={tpr}/></div>
                        <div className={styles.btl}><img src={btl}/></div>
                        <div className={styles.btr}><img src={btr}/></div>
                    </div>
                    <div className={[styles.firstCard,styles.rightOneCard].join(' ')}>
                        <div className={styles.top}>
                            <span>人流</span>
                        </div>
                        <div className={styles.contain}>
                            <div className={styles.content}>
                                <li className={styles.oneLi}>
                                    <p className={styles.number}>4256332</p>
                                    <p>杭州目前在杭人数</p>
                                </li>
                                <li className={styles.twoLi}>
                                    <div className={styles.title}>人员进出情况</div>
                                    <div className={styles.titleNumber}>
                                        <p className={styles.oneP}><span>出</span><span className={styles.outNum}>2566</span><img src={xjt}/></p>
                                        <p><span>入</span><span className={styles.inNum}>4356</span><img src={sjt}/></p>
                                    </div>
                                    <div className={styles.clear}></div>
                                </li>
                                <div className={styles.clear}></div>
                            </div>
                            <div className={styles.bom}>
                                <li>
                                    <p className={styles.numberOne}>4297</p>
                                    <p>景区</p>
                                </li>
                                <li>
                                    <p className={styles.numberOne}>142</p>
                                    <p>热门商圈</p>
                                </li>
                                <li>
                                    <p className={styles.numberOne}>46</p>
                                    <p>省行政中心</p>
                                </li>
                                <li>
                                    <p className={styles.numberOne}>82%</p>
                                    <p>赛事场馆周边</p>
                                </li>
                                <div className={styles.clear}></div>
                            </div>
                        </div>
                        <div className={styles.tpl}><img src={tpl}/></div>
                        <div className={styles.tpr}><img src={tpr}/></div>
                        <div className={styles.btl}><img src={btl}/></div>
                        <div className={styles.btr}><img src={btr}/></div>
                    </div>
                    <FourCard />
                    <FiveCard />
                    <div className={[styles.firstCard,styles.tableCard,styles.rightFiveCard].join(' ')}>
                        <div className={styles.top}>
                            <span>水域</span>
                        </div>
                        <div className={styles.contain}>
                            <li className={styles.liOne}>
                                <p className={styles.number}>1356</p>
                                <p>船舶底数</p>
                            </li>
                            <li className={styles.liTwo}>
                                <img src={echarts}/>
                            </li>
                            <div className={styles.clear}></div>
                        </div>
                        <div className={styles.tpl}><img src={tpl}/></div>
                        <div className={styles.tpr}><img src={tpr}/></div>
                        <div className={styles.btl}><img src={btl}/></div>
                        <div className={styles.btr}><img src={btr}/></div>
                    </div>
                </div>
                <div className={styles.iconPf}>
                    <li>
                        <img src={fjc} className={styles.topImg} />
                        <span>飞机场</span>
                    </li>
                    <li>
                        <img src={xlc} className={styles.topImg} />
                        <span>训练场</span>
                    </li>
                    <li>
                        <img src={jtkd} className={styles.topImg} />
                        <span>交通卡点</span>
                    </li>
                    <li>
                        <img src={hcz} />
                        <span>火车站</span>
                    </li>
                    <li>
                        <img src={zagt} />
                        <span>治安岗亭</span>
                    </li>
                    <li>
                        <img src={jd} />
                        <span>酒店</span>
                    </li>
                    <li>
                        <img src={gajcz} />
                        <span>公安检查站</span>
                    </li>
                    <li>
                        <img src={bc} className={styles.bc} />
                        <span>班车</span>
                    </li>
                </div>
                <div className={styles.carmeas}>
                    <div className={styles.tpName}>
                        <span>监控视频展示</span>
                    </div>
                    <p className={styles.clickp}><img src={zjt} /></p>
                    <li>
                        <div className={styles.sp}>
                            <img src={zt}/>
                        </div>
                        <div className={styles.text}>
                            <span>场馆一</span>
                        </div>
                    </li>
                    <li>
                        <div className={styles.sp}>
                            <img src={zt}/>
                        </div>
                        <div className={styles.text}>
                            <span>场馆二</span>
                        </div>
                    </li>
                    <li>
                        <div className={styles.sp}>
                            <img src={zt}/>
                        </div>
                        <div className={styles.text}>
                            <span>场馆三</span>
                        </div>
                    </li>
                    <li>
                        <div className={styles.sp}>
                            <img src={zt}/>
                        </div>
                        <div className={styles.text}>
                            <span>场馆四</span>
                        </div>
                    </li>
                    <li>
                        <div className={styles.sp}>
                            <img src={zt}/>
                        </div>
                        <div className={styles.text}>
                            <span>场馆五</span>
                        </div>
                    </li>
                    <li style={{marginRight: "0"}}>
                        <div className={styles.sp}>
                            <img src={zt}/>
                        </div>
                        <div className={styles.text}>
                            <span>场馆六</span>
                        </div>
                    </li>
                    <p className={styles.clickp}><img src={yjt} /></p>
                </div>
                <PoliceEcharts />
            </div>
        </FullScreenContainer>
    )
}

export default BigScreenTwo;
