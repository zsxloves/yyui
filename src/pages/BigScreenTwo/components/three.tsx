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
const ThreeCard: React.FC<Props>= (props) => {
    const configBc = {
        header: ['<span style="color:rgba(0, 219, 255, 1);">序号</span>', '<span style="color:rgba(0, 219, 255, 1);">班车名称</span>', '<span style="color:rgba(0, 219, 255, 1);">起始站</span>','<span style="color:rgba(0, 219, 255, 1);">终点站</span>','<span style="color:rgba(0, 219, 255, 1);">车辆状态</span>'],
        data: [
            ['01', '运动员班车①', '运动员村','游泳馆','即将发车'],
            ['02', '运动员班车①', '运动员村','游泳馆','即将发车'],
            ['03', '运动员班车①', '运动员村','游泳馆','即将发车'],
            ['04', '运动员班车①', '运动员村','游泳馆','即将发车'],
            ['05', '运动员班车①', '运动员村','游泳馆','即将发车'],
            ['06', '运动员班车①', '运动员村','游泳馆','即将发车'],
            ['07', '运动员班车①', '运动员村','游泳馆','即将发车'],
            ['08', '运动员班车①', '运动员村','游泳馆','即将发车'],
        ],
        oddRowBGC: 'rgba(0,0,0,0)',
        evenRowBGC: "rgba(43, 115, 221, 0.2)",
        headerBGC:'rgba(0,0,0,0)',
        hoverPause: true,
        columnWidth: [window.setWidth(10),window.setWidth(32),window.setWidth(21),window.setWidth(17)],
        align: ['center','left','left','center','center'],
        rowNum: 6,
        headerHeight: window.setSize(30)
    }
    return (
        <div className={[styles.firstCard,styles.tableCard,styles.threeCard].join(' ')}>
            <div className={styles.top}>
                <span>班车信息</span>
            </div>
            <div className={styles.content}>
                <ScrollBoard config={configBc} className={styles.threeTb} />
            </div>
            <div className={styles.tpl}><img src={tpl}/></div>
            <div className={styles.tpr}><img src={tpr}/></div>
            <div className={styles.btl}><img src={btl}/></div>
            <div className={styles.btr}><img src={btr}/></div>
        </div>
    )
}
export default ThreeCard;