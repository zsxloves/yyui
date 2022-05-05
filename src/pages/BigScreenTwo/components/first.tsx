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
const FirstCard: React.FC<Props>= (props) => {
    const configSs = {
        header: ['<span style="color:rgba(0, 219, 255, 1);">时间</span>', '<span style="color:rgba(0, 219, 255, 1);">项目</span>', '<span style="color:rgba(0, 219, 255, 1);">场馆</span>','<span style="color:rgba(0, 219, 255, 1);">明星运动员</span>','<span style="color:rgba(0, 219, 255, 1);">气象信息</span>'],
        data: [
            ['09-08 09:30', '足球', '黄龙体育场','荆超莺','多云'],
            ['09-08 09:31', '足球', '黄龙体育场','荆超莺','多云'],
            ['09-08 09:32', '足球', '黄龙体育场','荆超莺','多云'],
            ['09-08 09:33', '足球', '黄龙体育场','荆超莺','多云'],
            ['09-08 09:34', '足球', '黄龙体育场','荆超莺','多云'],
            ['09-08 09:35', '足球', '黄龙体育场','荆超莺','多云'],
            ['09-08 09:36', '足球', '黄龙体育场','荆超莺','多云'],
            ['09-08 09:37', '足球', '黄龙体育场','荆超莺','多云'],
            ['09-08 09:38', '足球', '黄龙体育场','荆超莺','多云'],
            ['09-08 09:39', '足球', '黄龙体育场','荆超莺','多云']
        ],
        oddRowBGC: 'rgba(0,0,0,0)',
        evenRowBGC: "rgba(43, 115, 221, 0.2)",
        headerBGC:'rgba(0,0,0,0)',
        hoverPause: true,
        columnWidth: [window.setWidth(23),window.setWidth(10),window.setWidth(25),window.setWidth(23)],
        rowNum: 6,
        headerHeight: window.setSize(30)
    }
    return (
        <div className={[styles.firstCard,styles.tableCard].join(' ')}>
            <div className={styles.top}>
                <span>赛事信息</span>
            </div>
            <div className={styles.content}>
                <ScrollBoard config={configSs} className={styles.firstTb} />
            </div>
            <div className={styles.tpl}><img src={tpl}/></div>
            <div className={styles.tpr}><img src={tpr}/></div>
            <div className={styles.btl}><img src={btl}/></div>
            <div className={styles.btr}><img src={btr}/></div>
        </div>
    )
}
export default FirstCard;