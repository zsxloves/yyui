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
const FourCard: React.FC<Props>= (props) => {
    const configGj = {
        header: ['<span style="color:rgba(0, 219, 255, 1);">类型</span>', '<span style="color:rgba(0, 219, 255, 1);">底数</span>', '<span style="color:rgba(0, 219, 255, 1);">运行状况</span>','<span style="color:rgba(0, 219, 255, 1);">车流量</span>'],
        data: [
            ['公交车1', '12133', '良好','拥挤'],
            ['公交车2', '12133', '良好','拥挤'],
            ['公交车3', '12133', '良好','拥挤'],
            ['公交车4', '12133', '良好','拥挤'],
            ['公交车5', '12133', '良好','拥挤'],
            ['公交车6', '12133', '良好','拥挤'],
            ['公交车7', '12133', '良好','拥挤'],
        ],
        oddRowBGC: 'rgba(0,0,0,0)',
        evenRowBGC: "rgba(43, 115, 221, 0.2)",
        headerBGC:'rgba(0,0,0,0)',
        hoverPause: true,
        columnWidth: [window.setWidth(20),window.setWidth(25),window.setWidth(30)],
        rowNum: 3,
        headerHeight: window.setSize(30)
    }
    return (
        <div className={[styles.firstCard,styles.tableCard,styles.rightThreeCard].join(' ')}>
            <div className={styles.top}>
                <span>公交</span>
            </div>
            <div className={styles.content}>
                <ScrollBoard config={configGj} className={styles.fourTb} />
            </div>
            <div className={styles.checkBtn}>
                <span>检查情况</span>
            </div>
            <div className={styles.tpl}><img src={tpl}/></div>
            <div className={styles.tpr}><img src={tpr}/></div>
            <div className={styles.btl}><img src={btl}/></div>
            <div className={styles.btr}><img src={btr}/></div>
        </div>
    )
}
export default FourCard;