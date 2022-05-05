import styles from './../index.less'
import React from 'react';
import { Select } from 'antd';
import yzicon from './../image/yzicon.png'

const { Option } = Select;

//定义props的类型
interface Props{
    updataTopObj:{
        name?:string,
        number?:number
    }
}
const TopScreeen: React.FC<Props>= (props) => {
    const handleChange = (value: any) => {
        console.log(`selected ${value}`);
    }
    const fuweiCLick = () => {
        console.log(`复位视角`);
    }
    const tucengClick = () => {
        console.log(`图层`);
    }
    const xiandingClick = () => {
        console.log(`限定视角`);
    }
    return (
        <div className={styles.topContain}>
            <div className={styles.contain}>
                <div className={styles.topLeft}>
                    <span  className={styles.detail}>{props.updataTopObj.name}</span>
                </div>
                <div className={styles.topCenter}>
                    <span className={styles.big}>杭州市公安局2022年亚运会安保指挥平台</span>
                    <span className={styles.small}>场馆功能屏</span>
                </div>
                <div className={styles.topRight}>
                    <Select className={styles.section} defaultValue="lucy" style={{ width: 120 }} onChange={handleChange}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled">
                            Disabled
                        </Option>
                        <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                    <div className={styles.topIcons}>
                        <img src={yzicon} title="复位视角" onClick={fuweiCLick} />
                        <img src={yzicon} title="图层" onClick={tucengClick}  />
                        <img src={yzicon} title="限定视角" onClick={xiandingClick}  />
                    </div>
                </div>
                <div className={styles.clear}></div>
            </div>
        </div>
    )
}
export default TopScreeen;