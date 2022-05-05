
import styles from './../index.less'
import React from 'react';
import tpl from './../image/tpl.png'
import tpr from './../image/tpr.png'
import btl from './../image/btl.png'
import btr from './../image/btr.png'
import qtyj from './../image/qtyj.png'
import ScrollBoard from '@jiaminghi/data-view-react/es/scrollBoard'

//定义props的类型
interface Props{
    
}
const SecondCard: React.FC<Props>= (props) => {
    const configOther = {
        data: [
            ['11', '杭州奥体中心体育馆1号门客流密度异常'],
            ['12', '杭州奥体中心体育馆1号门客流密度异常'],
            ['13', '杭州奥体中心体育馆1号门客流密度异常'],
            ['14', '杭州奥体中心体育馆1号门客流密度异常'],
            ['15', '杭州奥体中心体育馆1号门客流密度异常'],
            ['16', '杭州奥体中心体育馆1号门客流密度异常'],
            ['17', '杭州奥体中心体育馆1号门客流密度异常'],
            ['18', '杭州奥体中心体育馆1号门客流密度异常'],
        ],
        oddRowBGC: "rgba(0,0,0,0)",
        evenRowBGC: 'rgba(53, 174, 211, 0.2)',
        hoverPause: true,
        columnWidth: [window.setWidth(10)],
        align: ['center','left'],
        rowNum: 6,
        headerHeight: window.setSize(30)
    }
    return (
        <div className={[styles.firstCard,styles.rightThreeCard].join(' ')}>
            <div className={styles.top}>
                <img src={qtyj} className={styles.topImg} />
                <span>其他预警</span>
            </div>
            <div className={styles.content}>
                <ScrollBoard config={configOther} className={styles.secondTb} />
            </div>
            <div className={styles.tpl}><img src={tpl} /></div>
            <div className={styles.tpr}><img src={tpr} /></div>
            <div className={styles.btl}><img src={btl} /></div>
            <div className={styles.btr}><img src={btr} /></div>
        </div>
    )
}
export default SecondCard;