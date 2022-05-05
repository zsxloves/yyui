import styles from './../index.less'
import React, {useState,useEffect} from 'react';

//定义props的类型
interface Props{
    
}
const PoliceEcharts: React.FC<Props>= (props) => {
    const [showJq, setJq] = useState<Boolean>(false)
    const toggleJq = ()=> {
        setJq(!showJq)
    }
    return (
        <div className={styles.policeEcharts}>
            <div className={styles.allNums} onClick={toggleJq}>
                <span>警情</span>
                <span className={styles.nums}>32</span>
            </div>
            <div className={[styles.tableData,showJq?styles.shows:''].join(' ')}>
                <div className={styles.top}>
                    <span className={styles.imgs}></span>
                    <span>警情信息</span>
                </div>
                <div className={[styles.leftData,styles.tableCard].join(' ')}>
                    <div className={styles.content}>
                        <table>
                            <thead>
                                <tr>
                                    <th>类别</th>
                                    <th>数量</th>
                                    <th>分布</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>举报</td>
                                    <td>344</td>
                                    <td>滨江区</td>
                                </tr>
                                <tr>
                                    <td>纠纷</td>
                                    <td>344</td>
                                    <td>滨江区</td>
                                </tr>
                                <tr>
                                    <td>刑事</td>
                                    <td>344</td>
                                    <td>滨江区</td>
                                </tr>
                                <tr>
                                    <td>治安</td>
                                    <td>344</td>
                                    <td>滨江区</td>
                                </tr>
                                <tr>
                                    <td>交通</td>
                                    <td>344</td>
                                    <td>滨江区</td>
                                </tr>
                                <tr>
                                    <td>求助</td>
                                    <td>344</td>
                                    <td>滨江区</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={styles.rightData}></div>
                <div className={styles.clear}></div>
            </div>
            <div className={styles.clear}></div>
        </div>
    )
}
export default PoliceEcharts;