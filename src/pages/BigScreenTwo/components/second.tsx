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
const SecondCard: React.FC<Props>= (props) => {
    const configPw = {
        header: ['<span style="color:rgba(0, 219, 255, 1);">序号</span>', '<span style="color:rgba(0, 219, 255, 1);">比赛名称</span>', '<span style="color:rgba(0, 219, 255, 1);">比赛场馆</span>','<span style="color:rgba(0, 219, 255, 1);">总票数</span>','<span style="color:rgba(0, 219, 255, 1);">售票数</span>'],
        data: [
            ['01', '足球', '杭州国际博览中心','99999','99999'],
            ['02', '足球', '杭州国际博览中心','99999','99999'],
            ['03', '足球', '杭州国际博览中心','99999','99999'],
            ['04', '足球', '杭州国际博览中心','99999','99999'],
            ['05', '足球', '杭州国际博览中心','99999','99999'],
            ['06', '足球', '杭州国际博览中心','99999','99999'],
            ['07', '足球', '杭州国际博览中心','99999','99999'],
            ['08', '足球', '杭州国际博览中心','99999','99999'],
        ],
        oddRowBGC: 'rgba(0,0,0,0)',
        evenRowBGC: "rgba(43, 115, 221, 0.2)",
        headerBGC:'rgba(0,0,0,0)',
        hoverPause: true,
        columnWidth: [window.setWidth(10),window.setWidth(20),window.setWidth(36),window.setWidth(17)],
        align: ['center','left','left','center','center'],
        rowNum: 6,
        headerHeight: window.setSize(30)
    }
    return (
        <div className={[styles.firstCard,styles.tableCard,styles.secondCard].join(' ')}>
            <div className={styles.top}>
                <span>票务信息</span>
            </div>
            <div className={styles.content}>
                <ScrollBoard config={configPw} className={styles.secondTb} />
            </div>
            <div className={styles.tpl}><img src={tpl}/></div>
            <div className={styles.tpr}><img src={tpr}/></div>
            <div className={styles.btl}><img src={btl}/></div>
            <div className={styles.btr}><img src={btr}/></div>
        </div>
    )
}
export default SecondCard;