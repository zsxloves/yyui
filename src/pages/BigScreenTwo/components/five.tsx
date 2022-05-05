import styles from './../index.less'
import React from 'react';
import tpl from './../image/tpl.png'
import tpr from './../image/tpr.png'
import btl from './../image/btl.png'
import btr from './../image/btr.png'
import ScrollBoard from '@jiaminghi/data-view-react/es/scrollBoard'

//定义props的类型
interface Props{
    
}
const FiveCard: React.FC<Props>= (props) => {
    const configDt = {
        header: ['<span style="color:rgba(0, 219, 255, 1);">地铁路线</span>', '<span style="color:rgba(0, 219, 255, 1);">运行状况</span>', '<span style="color:rgba(0, 219, 255, 1);">车流量</span>'],
        data: [
            ['一号线', '良好','拥挤'],
            ['2号线', '良好','拥挤'],
            ['3号线', '良好','拥挤'],
            ['4号线', '良好','拥挤'],
            ['5号线', '良好','拥挤'],
            ['6号线', '良好','拥挤'],
            ['7号线', '良好','拥挤'],
        ],
        oddRowBGC: 'rgba(0,0,0,0)',
        evenRowBGC: "rgba(43, 115, 221, 0.2)",
        headerBGC:'rgba(0,0,0,0)',
        hoverPause: true,
        columnWidth: [window.setWidth(40),window.setWidth(30)],
        rowNum: 4,
        headerHeight: window.setSize(30)
    }
    return (
        <div className={[styles.firstCard,styles.tableCard,styles.rightFourCard].join(' ')}>
            <div className={styles.top}>
                <span>地铁</span>
            </div>
            <div className={styles.content}>
                <ScrollBoard config={configDt} className={styles.fiveTb} />
            </div>
            <div className={styles.checkBtn}>
                <span>发案情况</span>
            </div>
            <div className={styles.tpl}><img src={tpl}/></div>
            <div className={styles.tpr}><img src={tpr}/></div>
            <div className={styles.btl}><img src={btl}/></div>
            <div className={styles.btr}><img src={btr}/></div>
        </div>
    )
}
export default FiveCard;