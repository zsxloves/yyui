import styles from './../index.less'
import first from './../image/first.png'
import tpl from './../image/tpl.png'
import tpr from './../image/tpr.png'
import btl from './../image/btl.png'
import btr from './../image/btr.png'
import React, {useState} from 'react';

interface Props{
    changeClass: Function
}
const LeftFirst: React.FC<Props>= (props) => {
    const [checkToggle, setCheck] = useState<String>('收起侧边栏')
    const toggleLeft = () =>{
        checkToggle ==='收起侧边栏' ? setCheck('展开侧边栏') : setCheck('收起侧边栏')
        props.changeClass()
    } 
    return(
        <div className={styles.firstCard}>
            <div className={styles.top}>
            <img src={first}  className={styles.topImg} />
                <span>验票信息</span>
            </div>
            <div className={styles.middle}>
                <div className={styles.fb}>
                    <p className={styles.one}>266867</p>
                    <p>累计总票数</p>
                </div>
                <div className={styles.fb}>
                    <p className={styles.one}>266867</p>
                    <p>累计已销售</p>
                </div>
                <div className={styles.clear}></div>
            </div>
            <div className={styles.bottomOne}>
                <li>
                    <p className={styles.numberOne}>4297</p>
                    <p>今日总票数</p>
                    <p className={styles.line}></p>
                </li>
                <li>
                    <p className={styles.numberOne}>142</p>
                    <p>今日已销售</p>
                    <p className={styles.line}></p>
                </li>
                <li>
                    <p className={styles.numberOne}>46</p>
                    <p>今日验票数</p>
                    <p className={styles.line}></p>
                </li>
                <li>
                    <p className={styles.numberOne}>82%</p>
                    <p>入场率</p>
                </li>
                <div className={styles.clear}></div>
            </div>
            <div className={[styles.bottomOne,styles.bottomTwo].join(' ')}>
                <li>
                    <p className={styles.numberTwo}>46</p>
                    <p>人票合一</p>
                    <p className={styles.line}></p>
                </li>
                <li>
                    <p className={styles.numberTwo}>46</p>
                    <p>定人定位</p>
                    <p className={styles.line}></p>
                </li>
                <li>
                    <p className={styles.numberTwo}>266867</p>
                    <p>实名制到座位</p>
                    <p className={styles.line}></p>
                </li>
                <li>
                    <p className={styles.numberTwo}>13800</p>
                    <p>关联背景审查</p>
                </li>
                <div className={styles.clear}></div>
            </div>
            <div className={styles.tpl}><img src={tpl}/></div>
            <div className={styles.tpr}><img src={tpr}/></div>
            <div className={styles.btl}><img src={btl}/></div>
            <div className={styles.btr}><img src={btr}/></div>
            <div className={styles.toggleCard} onClick={toggleLeft}>
                <span>{checkToggle}</span>
            </div>
        </div>
    )
}
export default LeftFirst;