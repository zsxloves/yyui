import styles from './../index.less'
import tpl from './../image/tpl.png'
import tpr from './../image/tpr.png'
import btl from './../image/btl.png'
import btr from './../image/btr.png'
import clyj from './../image/clyj.png'
import React, {useState} from 'react';
import { Table, Tag, Space } from 'antd';

interface tableData{
    key: String,
    name: String,
    age: Number,
    address: String
}
interface Props{
    rightOne: Array<tableData>,
    changeRightOneData: Function
}
const LeftFirst: React.FC<Props>= (props) => {
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        }]
    return(
        <div className={[styles.firstCard,styles.rightTwoCard].join(' ')}>
            <div className={styles.top}>
                <img src={clyj} className={styles.topImg} />
                <span>车辆预警</span>
            </div>
            <div className={styles.content}>
                <Table columns={columns} dataSource={props.rightOne} />
            </div>
            <div className={styles.tpl}><img src={tpl} /></div>
            <div className={styles.tpr}><img src={tpr} /></div>
            <div className={styles.btl}><img src={btl} /></div>
            <div className={styles.btr}><img src={btr} /></div>
        </div>
    )
}
export default LeftFirst;