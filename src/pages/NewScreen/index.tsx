import styles from './index.less'
import yp from './image/yp.png'
import yzicon from './image/yzicon.png'
import ajd from './image/ajd.png'
import rylx from './image/rylx.png'
import cllx from './image/cllx.png'
import TopScreeen from './components/top'
import LeftFirst from './components/leftFirst'
import RightFirst from './components/rightFirst'
import React, {useState,useEffect} from 'react';
interface tableData{
    key: String,
    name: String,
    age: Number,
    address: String
}
const NewScreen: React.FC = () => {
    const [updataTopObj, handleUpdateTopObj] = useState<Object>({name:'详情', number:10}); 
    const [leftClass, changeLeftClass] = useState<Boolean>(false)
    const [rightOne, changeRightOne] = useState<Array<tableData>>([])
    const changeClass = () => {
        changeLeftClass(!leftClass)
    }
    const changeRightOneData = () => {
        console.log('111')
    }
    useEffect(()=>{
        const data = [
            {
              key: '1',
              name: 'John Brown',
              age: 32,
              address: 'New York No. 1 Lake Park',
            },
            {
              key: '2',
              name: 'Jim Green',
              age: 42,
              address: 'London No. 1 Lake Park',
            },
            {
              key: '3',
              name: 'Joe Black',
              age: 32,
              address: 'Sidney No. 1 Lake Park',
            },
        ]
        changeRightOne(data)
    },[])
    return(
        <div className={styles.all}>
            <TopScreeen updataTopObj = {updataTopObj} />
            <div className={styles.containBody}>
                <div className={[styles.leftContain,leftClass?styles.hidden:styles.shows].join(' ')}>
                    <LeftFirst changeClass = {changeClass} />
                </div>
                <div className={styles.rightContain}>
                    <RightFirst rightOne={rightOne} changeRightOneData = {changeRightOneData} />
                </div>
                <div className={styles.iconPf}>
                    <li>
                        <img src={yp} className={styles.topImg}/>
                        <span>验票</span>
                    </li>
                    <li>
                        <img src={yzicon} className={styles.topImg}/>
                        <span>验证</span>
                    </li>
                    <li>
                        <img src={ajd} className={styles.topImg}/>
                        <span>安检点</span>
                    </li>
                    <li>
                        <img src={rylx} style={{width: "21rem"}} />
                        <span>人员流线</span>
                    </li>
                    <li>
                        <img src={cllx} style={{width: "21rem"}} />
                        <span>车辆流线</span>
                    </li>
                </div>
            </div>
        </div>
    )
}

export default NewScreen;
