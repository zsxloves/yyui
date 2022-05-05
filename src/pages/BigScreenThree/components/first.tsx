
import styles from './../index.less'
import React from 'react';
import ScrollBoard from '@jiaminghi/data-view-react/es/scrollBoard'
//定义props的类型
interface Props{
    
}
const FirstCard: React.FC<Props>= (props) => {
    const peopleTb = {
        header: ['<span style="color:rgba(0, 219, 255, 1);">姓名</span>', '<span style="color:rgba(0, 219, 255, 1);">时间</span>', '<span style="color:rgba(0, 219, 255, 1);">预警</span>'],
        data: [
            ['荆超莺', '09-08 12:09:30','异动预警'],
            ['荆超莺', '09-08 12:09:30','异动预警'],
            ['荆超莺', '09-08 12:09:30','异动预警'],
            ['荆超莺', '09-08 12:09:30','异动预警'],
            ['荆超莺', '09-08 12:09:30','异动预警'],
            ['荆超莺', '09-08 12:09:30','异动预警'],
        ],
        oddRowBGC: 'rgba(0,0,0,0)',
        evenRowBGC: "rgba(43, 115, 221, 0.2)",
        headerBGC:'rgba(0,0,0,0)',
        hoverPause: true,
        columnWidth: [window.setWidth(24),window.setWidth(46)],
        rowNum: 4,
        headerHeight: window.setSize(30)
    }
    return (
        <div className={styles.content}>
            <ScrollBoard config={peopleTb} className={styles.firstTb} />
        </div>
    )
}
export default FirstCard;