import React from 'react';
import styles from './index.less'
import weather from './image/weather.png'
import tpln from './image/tpln.png'
import tprn from './image/tprn.png'
import btln from './image/btln.png'
import btrn from './image/btrn.png'
import tplt from './image/tplt.png'
import tprt from './image/tprt.png'
import btlt from './image/btlt.png'
import btrt from './image/btrt.png'
import tply from './image/tply.png'
import tpry from './image/tpry.png'
import btly from './image/btly.png'
import btry from './image/btry.png'
import tpl from './image/tpl.png'
import tpr from './image/tpr.png'
import btl from './image/btl.png'
import btr from './image/btr.png'
import xx from './image/xx.png'
import yy from './image/yy.png'
import zls from './image/zls.png'
import bdz from './image/bdz.png'
import jyz from './image/jyz.png'
import jqz from './image/jqz.png'
import ryzsll from './image/ryzsll.png'
import cyrykqll from './image/cyrykqll.png'
import fasl from './image/fasl.png'
import aldcqk from './image/aldcqk.png'
import wjj from './image/wjj.png'
import ry from './image/ry.png'
import sszf from './image/sszf.png'
import bdzIcon from './image/bdzIcon.png'
import jyzIcon from './image/jyzIcon.png'
import zlsIcon from './image/zlsIcon.png'
import jqzIcon from './image/jqzIcon.png'
import yyIcon from './image/yyIcon.png'
import xxIcon from './image/xxIcon.png'
import {history} from 'umi';
import { Select } from 'antd';
import FirstCard from './components/first'
import FullScreenContainer from '@jiaminghi/data-view-react/es/fullScreenContainer';
const { Option } = Select;
const BigScreenThree: React.FC = () => {
    const handleChange = (value: String) => {
        value === '1'? history.push('/screen') : (value === '2' ? history.push('/screenTwo') : '')
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
                            {/* <span className={styles.small}>社会面功能屏</span> */}
                            <Select className={styles.section} defaultValue="3" onChange={handleChange}>
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
                    <div className={[styles.firstCard,styles.firstLeft,styles.tableCard].join(' ')}>
                        <div className={styles.top}>
                            <span>重点人管控</span>
                        </div>
                        <div className={styles.check}>
                            <span>今日</span>
                        </div>
                        <div className={styles.clear}></div>
                        <div className={styles.contentOne}>
                            <li className={styles.ones}>
                                <span className={styles.tpText}>重点人底册(人)</span>
                                <br />
                                <span className={styles.numOne}>2668</span>
                                <div className={styles.tpln}><img src={tpln} /></div>
                                <div className={styles.tprn}><img src={tprn} /></div>
                                <div className={styles.btln}><img src={btln} /></div>
                                <div className={styles.btrn}><img src={btrn} /></div>
                            </li>
                            <li className={styles.twos}>
                                <span className={styles.tpText}>日常管控(次)</span>
                                <br />
                                <span className={styles.numOne}>1645</span>
                                <div className={styles.tpln}><img src={tplt}/></div>
                                <div className={styles.tprn}><img src={tprt}/></div>
                                <div className={styles.btln}><img src={btlt}/></div>
                                <div className={styles.btrn}><img src={btrt}/></div>
                            </li>
                            <li className={styles.threes}>
                                <span className={styles.tpText}>异动预警(次)</span>
                                <br/>
                                <span className={styles.numOne}>129</span>
                                <div className={styles.tpln}><img src={tply}/></div>
                                <div className={styles.tprn}><img src={tpry}/></div>
                                <div className={styles.btln}><img src={btly}/></div>
                                <div className={styles.btrn}><img src={btry}/></div>
                            </li>
                            <div className={styles.clear}></div>
                        </div>
                        <FirstCard />
                        <div className={styles.tpl}><img src={tpl} /></div>
                        <div className={styles.tpr}><img src={tpr} /></div>
                        <div className={styles.btl}><img src={btl} /></div>
                        <div className={styles.btr}><img src={btr} /></div>
                    </div>
                    <div className={[styles.firstCard,styles.secondLeft].join(' ')}>
                        <div className={styles.top}>
                            <span>易制爆物品管控</span>
                        </div>
                        <div className={styles.tpl}><img src={tpl} /></div>
                        <div className={styles.tpr}><img src={tpr} /></div>
                        <div className={styles.btl}><img src={btl} /></div>
                        <div className={styles.btr}><img src={btr} /></div>
                    </div>
                    <div className={[styles.firstCard,styles.threeLeft].join(' ')}>
                        <div className={styles.top}>
                            <span>重点单位管控</span>
                        </div>
                        <div className={styles.top}>
                            <span>重点部位管控</span>
                        </div>
                        <div className={styles.allNms}>
                            <span className={styles.bds}></span>
                            <span className={styles.text}>异常次数</span>
                        </div>
                        <div className={styles.clear}></div>
                        <div className={styles.content}>
                            <li>
                                <span className={[styles.inlines,styles.first].join(' ')}><img src={xx}/><span>学校</span></span>
                                <span className={[styles.inlines,styles.numOne].join(' ')}>24</span>
                                <span className={[styles.inlines,styles.numTwo].join(' ')}><span className={styles.yellowBd}></span><span>0</span></span>
                            </li>
                            <li>
                                <span className={[styles.inlines,styles.first].join(' ')}><img src={yy}/><span>医院</span></span>
                                <span className={[styles.inlines,styles.numOne].join(' ')}>24</span>
                                <span className={[styles.inlines,styles.numTwo].join(' ')}><span className={styles.yellowBd}></span><span>0</span></span>
                            </li>
                            <li>
                                <span className={[styles.inlines,styles.first].join(' ')}><img src={zls}/><span>自来水</span></span>
                                <span className={[styles.inlines,styles.numOne].join(' ')}>24</span>
                                <span className={[styles.inlines,styles.numTwo].join(' ')}><span className={styles.yellowBd}></span><span>0</span></span>
                            </li>
                            <li>
                                <span className={[styles.inlines,styles.first].join(' ')}><img src={bdz}/><span>变电站</span></span>
                                <span className={[styles.inlines,styles.numOne].join(' ')}>24</span>
                                <span className={[styles.inlines,styles.numTwo].join(' ')}><span className={styles.yellowBd}></span><span>0</span></span>
                            </li>
                            <li>
                                <span className={[styles.inlines,styles.first].join(' ')}><img src={jyz}/><span>加油站</span></span>
                                <span className={[styles.inlines,styles.numOne].join(' ')}>24</span>
                                <span className={[styles.inlines,styles.numTwo].join(' ')}><span className={styles.yellowBd}></span><span>0</span></span>
                            </li>
                            <li>
                                <span className={[styles.inlines,styles.first].join(' ')}><img src={jqz}/><span>加气站</span></span>
                                <span className={[styles.inlines,styles.numOne].join(' ')}>24</span>
                                <span className={[styles.inlines,styles.numTwo].join(' ')}><span className={styles.yellowBd}></span><span>0</span></span>
                            </li>
                            <div className={styles.clear}></div>
                        </div>
                        <div className={styles.tpl}><img src={tpl} /></div>
                        <div className={styles.tpr}><img src={tpr} /></div>
                        <div className={styles.btl}><img src={btl} /></div>
                        <div className={styles.btr}><img src={btr} /></div>
                    </div>
                    <div className={[styles.firstCard,styles.fourLeft].join(' ')}>
                        <div className={styles.top}>
                            <span>重点行业/场所管控</span>
                        </div>
                        <li className={styles.first}>
                            <img src={ryzsll} />
                            <p className={styles.datas}>
                                <span>人员住宿流量</span>
                                <span className={styles.number}>12869</span>
                            </p>
                            <div className={styles.clear}></div>
                            <p className={styles.line}></p>
                        </li>
                        <li className={styles.second}>
                            <img src={cyrykqll} />
                            <p className={styles.datas}>
                                <span>从业人员考勤流量</span>
                                <span className={styles.number}>2869</span>
                            </p>
                            <div className={styles.clear}></div>
                            <p className={styles.line}></p>
                        </li>
                        <li className={styles.three}>
                            <img src={fasl} />
                            <p className={styles.datas}>
                                <span>发案数量</span>
                                <span className={styles.number}>128</span>
                            </p>
                            <div className={styles.clear}></div>
                            <p className={styles.line}></p>
                        </li>
                        <li className={styles.four}>
                            <img src={aldcqk} />
                            <p className={styles.datas}>
                                <span>案件倒查情况</span>
                                <span className={styles.number}>128</span>
                            </p>
                            <div className={styles.clear}></div>
                            <p className={styles.line}></p>
                        </li>
                        <div className={styles.clear}></div>
                        <div className={styles.tpl}><img src={tpl} /></div>
                        <div className={styles.tpr}><img src={tpr} /></div>
                        <div className={styles.btl}><img src={btl} /></div>
                        <div className={styles.btr}><img src={btr} /></div>
                    </div>
                </div>
                <div className={styles.rightContain}>
                    <div className={[styles.firstCard,styles.firstRight].join(' ')}>
                        <div className={styles.top}>
                            <span>打击整治实效</span>
                        </div>
                        <li className={styles.first}>
                            <p className={styles.text}>治安拘留</p>
                            <p className={styles.firstP}><img src={wjj} /><span className={styles.numOne}>215</span></p>
                            <p className={styles.nextP}><img src={ry} /><span className={styles.numTwo}>246</span></p>
                        </li>
                        <li className={styles.first}>
                            <p className={styles.text}>刑事拘留</p>
                            <p className={styles.firstP}><img src={wjj} /><span className={styles.numOne}>215</span></p>
                            <p className={styles.nextP}><img src={ry} /><span className={styles.numTwo}>246</span></p>
                        </li>
                        <li className={styles.first}>
                            <p className={styles.text}>黄赌毒</p>
                            <p className={styles.firstP}><img src={wjj} /><span className={styles.numOne}>215</span></p>
                            <p className={styles.nextP}><img src={ry} /><span className={styles.numTwo}>246</span></p>
                        </li>
                        <li className={styles.first}>
                            <p className={styles.text}>三非</p>
                            <p className={styles.firstP}><img src={wjj} /><span className={styles.numOne}>215</span></p>
                            <p className={styles.nextP}><img src={ry} /><span className={styles.numTwo}>246</span></p>
                        </li>
                        <div className={styles.clear}></div>
                        <div className={styles.tpl}><img src={tpl} /></div>
                        <div className={styles.tpr}><img src={tpr} /></div>
                        <div className={styles.btl}><img src={btl} /></div>
                        <div className={styles.btr}><img src={btr} /></div>
                    </div>
                    <div className={[styles.firstCard,styles.secondRight].join(' ')}>
                        <div className={styles.top}>
                            <span>警情案情压制</span>
                        </div>
                        <div className={styles.numLj}>
                            <span className={styles.todayNum}></span>
                            <span>今日累计总数</span>
                            <span className={styles.yesNum}></span>
                            <span>昨日累计总数</span>
                        </div>
                        <div className={styles.clear}></div>
                        <div className={styles.tpl}><img src={tpl} /></div>
                        <div className={styles.tpr}><img src={tpr} /></div>
                        <div className={styles.btl}><img src={btl} /></div>
                        <div className={styles.btr}><img src={btr} /></div>
                    </div>
                    <div className={[styles.firstCard,styles.threeRight].join(' ')}>
                        <div className={styles.top}>
                            <span>整治实效</span>
                        </div>
                        <li>
                            <p className={styles.text}>消防检查处罚数</p>
                            <p className={styles.number}>845</p>
                        </li>
                        <p className={styles.line}></p>
                        <li>
                            <p className={styles.text}>整改火灾隐患数</p>
                            <p className={styles.number}>845</p>
                        </li>
                        <p className={styles.line}></p>
                        <li>
                            <p className={styles.text}>网络安全检查数</p>
                            <p className={styles.number}>845</p>
                        </li>
                        <li>
                            <p className={styles.text}>交通违法整治总数</p>
                            <p className={styles.number}>845</p>
                        </li>
                        <p className={styles.line}></p>
                        <li>
                            <p className={styles.text}>交通核查人次</p>
                            <p className={styles.number}>845</p>
                        </li>
                        <p className={styles.line}></p>
                        <li>
                            <p className={styles.text}>交通核查车次</p>
                            <p className={styles.number}>845</p>
                        </li>
                        <div className={styles.clear}></div>
                        <div className={styles.tpl}><img src={tpl} /></div>
                        <div className={styles.tpr}><img src={tpr} /></div>
                        <div className={styles.btl}><img src={btl} /></div>
                        <div className={styles.btr}><img src={btr} /></div>
                    </div>
                    <div className={[styles.firstCard,styles.fourRight].join(' ')}>
                        <div className={styles.top}>
                            <span>问题清单</span>
                        </div>
                        <div className={styles.title}>
                            <span className={styles.fk}></span>
                            <span className={styles.text}>市局组建的专项督导组</span>
                        </div>
                        <div className={styles.firstLi}>
                            <li>
                                <p className={styles.num}>1354</p>
                                <p className={styles.text}>问题清单</p>
                            </li>
                            <li>
                                <p className={styles.num}>1354</p>
                                <p className={styles.text}>整改清单</p>
                            </li>
                            <div className={styles.clear}></div>
                        </div>
                        <div className={styles.title}>
                            <span className={styles.fk}></span>
                            <span className={styles.text}>任务指标</span>
                        </div>
                        <div className={[styles.firstLi,styles.nextLi].join(' ')}>
                            <li>
                                <p className={styles.num}>1354</p>
                                <p className={styles.text}>数量</p>
                            </li>
                            <li>
                                <p className={styles.num}>89.7%</p>
                                <p className={styles.text}>任务完成情况</p>
                            </li>
                            <div className={styles.clear}></div>
                        </div>
                        <div className={styles.tpl}><img src={tpl} /></div>
                        <div className={styles.tpr}><img src={tpr} /></div>
                        <div className={styles.btl}><img src={btl} /></div>
                        <div className={styles.btr}><img src={btr} /></div>
                    </div>
                </div>
                <div className={styles.iconPf}>
                    <li>
                        <img src={sszf} className={styles.topImg}/>
                        <span>省市政府</span>
                    </li>
                    <li>
                        <img src={bdzIcon} className={styles.topImg}/>
                        <span>变电站</span>
                    </li>
                    <li>
                        <img src={jyzIcon} className={styles.topImg}/>
                        <span>加油站</span>
                    </li>
                    <li>
                        <img src={zlsIcon} className={styles.topImg} />
                        <span>自来水</span>
                    </li>
                    <li>
                        <img src={jqzIcon} className={styles.topImg} />
                        <span>加气站</span>
                    </li>
                    <li>
                        <img src={yyIcon} className={styles.topImg} />
                        <span>医院</span>
                    </li>
                    <li>
                        <img src={xxIcon} className={styles.topImg} />
                        <span>学校</span>
                    </li>
                </div>
            </div>
        </FullScreenContainer>
    )
}

export default BigScreenThree;
