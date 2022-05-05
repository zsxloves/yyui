
import {  useEffect, useState, useImperativeHandle } from 'react';
import React from 'react';

import { Menu, Dropdown } from 'antd';
import { Drawer } from 'antd';
import { queryTcty } from './../service';
//定义props的类型
interface Props{
    // showYaty: boolean,
    // setYatyLine: Function,
    checkYjcz: Function,
    sjczMapClick: Function,
    sjczMapClickOff:Function,
    checkYaty:Function,
    zdArr: any,
    setClck: Function
}
interface RefTypes{
  handelClick: Function,
  rightSet: Function,
  yaSet: Function
}
let showRight = false
const Yjcz= React.forwardRef<RefTypes, Props>((props, ref) => {
    //将子组件的方法 暴露给父组件
  useImperativeHandle(ref, () => ({
    handelClick,
    rightSet,
    yaSet
  }))
  const handelClick = () => {
    if (showRight) {
        showRight = false
        setRightShow(false)
        setYjActive(false)
        const czMenu = czList.map((item, index) => {
          return (<Menu.Item key={index} onClick={() => clickMenu(item, index)} className= 'yjDrop'>
            <span>{item.name}</span>
          </Menu.Item>)
        })
        const yjczMenus = (<Menu className='yjczList'>{czMenu}</Menu>)
        setYjczMenu(yjczMenus)
    }
  }
  const yaSet = () => {
    setYjActive(false)
    const czMenu = czList.map((item, index) => {
      return (<Menu.Item key={index} onClick={() => clickMenu(item, index)} className= 'yjDrop'>
        <span>{item.name}</span>
      </Menu.Item>)
    })
    const yjczMenus = (<Menu className='yjczList'>{czMenu}</Menu>)
    setYjczMenu(yjczMenus)
  }
  const rightSet = () => {
    setRightShow(true)
  }
  useEffect(() => {
    setYjczMenu(yjczMenus) 
    setListLi(liseps)
  },[])
  const czList = [{ name: '重点人员预警处置', flag: false }, { name: '防爆安检预警处置', flag: false },
  { name: '无人机管控处置', flag: false }, { name: '脱环人员处置', flag: false }, { name: '预案推演', flag: false }, { name: '车辆冲卡', flag: false }]
  const czMenu = czList.map((item, index) => {
    return (<Menu.Item key={index} onClick={() => clickMenu(item, index)} className={`${item.flag ? 'actives yjDrop' : 'yjDrop'}`}>
      <span>{item.name}</span>
    </Menu.Item>)
  })
  const yjczMenus = (<Menu className='yjczList'>{czMenu}</Menu>)
  const [yjczMenu, setYjczMenu] = useState<any>('')
  const [rightShow, setRightShow] = useState<boolean>(false)
  const [topName, setTopName] = useState<string>('治安处置事件')
  const [listLi, setListLi] = useState<any>('')
  // 车辆冲卡查询
  const searchClck = () => {
    const param = {
      type: props.zdArr['应急处置车辆冲卡'],
      sceneId: window.cjObj.id
    }
    queryTcty(param).then((res: any) => {
      const result = res.data.rows
      props.setClck(result)
    })
  }
  // 应急点击
  const clickMenu = (items:any, indexs:number) => {          
    if (!items.flag) {
        props.checkYjcz(false)
        const czMenu = czList.map((item, index) => {
            if (indexs === index) {
                item.flag = true
            } else {
                item.flag = false
            }
          return (<Menu.Item key={index} onClick={() => clickMenu(item, index)} className={`${item.flag ? 'actives yjDrop' : 'yjDrop'}`}>
            <span>{item.name}</span>
          </Menu.Item>)
        })
        const yjczMenus = (<Menu className='yjczList'>{czMenu}</Menu>)
        setYjczMenu(yjczMenus)
        setYjActive(true)
        if (indexs === 4) {
          props.checkYaty(false)
          setTopName(items.name)
        } else if (indexs === 5) {
          // 车辆冲卡设置
          searchClck()
        }
         else {
          setRightShow(true)
          showRight = true
          setTopName(items.name)
          changeListLi(indexs)
        }
    }
  }
  const setListDatas = (index: any) => {
    let listDatas: any = []
    if (index === 0) {
      listDatas = [
        {name: '预警发现重点人员', id: '1', flag: false}, {name: '指令现场警力立即处置', id: '2', flag: false}, 
        {name: '及时妥善处理，将现场情况汇报指挥部', id: '3', flag: false}, {name: '人员带离，处置完毕', id: '4', flag: false}
      ]
    } else if (index === 1) {
      listDatas = [
        {name: '安检发现携带敏感国旗', id: '1', flag: false}, {name: '指令现场警力有效控制，防止人员突破安检岗位', id: '2', flag: false}, 
        {name: '及时将现场处置情况汇报指挥部', id: '3', flag: false}, {name: '通知政保警力立即现场处置', id: '4', flag: false}, 
        {name: '人员带离，处置完毕', id: '5', flag: false}
      ]
    } else if (index === 2) {
      listDatas = [
        {name: '发现黑飞无人机预警', id: '1', flag: false}, {name: '指令反制小组快速处置', id: '2', flag: false}, 
        {name: '反制小组及时赶至现场', id: '3', flag: false}, {name: '采取正确反制手段有效控制“黑飞”无人机和操作人员', id: '4', flag: false},
        {name: '将现场情况汇报指挥部', id: '5', flag: false}, {name: '无人机和操作人员带离，处置完毕', id: '6', flag: false},
      ]
    } else if (index === 3) {
      listDatas = [
        {name: '发现馆内有人突破闭环', id: '1', flag: false}, {name: '指令馆内就近警力立即协助卫健部门开展处置', id: '1', flag: false}, 
        {name: '将现场情况汇报指挥部', id: '1', flag: false}, {name: '保障卫健部门将“脱环”人员带离', id: '1', flag: false},
        {name: '处置完毕，配合隔离等相关防疫程序', id: '1', flag: false}
      ]
    }
    return listDatas
  }
  const changeListLi = (index: any) => {
    const listDatas = setListDatas(index)
    const lisepd = listDatas.map((item: any, indexs: any) => {
      return (<div className='limg' key={indexs} onClick={() => clickLi(item, indexs, index)}><li className={`${item.flag ? 'actives' : ''}`}>
        <span>{indexs + 1}、 {item.name}</span></li>
      {(index===(listDatas.length-1))?null:(<span className='iconfont icon-biaodian'></span>)}
      </div>)
    })
    setListLi(lisepd)
  }
  const listData = [{name: '发现有人打架斗殴', id: '1', flag: false}, {name: '发现有人打架斗殴', id: '1', flag: false}, 
  {name: '现场处置完毕，打架斗殴人员带至警务室', id: '1', flag: false}, {name: '发现有人打架斗殴', id: '1', flag: false}]
  const liseps = listData.map((item, index) => {
    return (<div className='limg' key={index} onClick={() => clickLi(item, index, '')}><li className={`${item.flag ? 'actives' : ''}`}>
      <span>{index + 1}、 {item.name}</span></li>
    {(index===(listData.length-1))?null:(<span className='iconfont icon-biaodian'></span>)}
    </div>)
  })
  // 应急点击
  const [yjActive, setYjActive] = useState<boolean>(false)
  const yjClick = () => {
    props.checkYjcz(yjActive)
    setYjActive(!yjActive)
    if (yjActive) {
        if (showRight) {
            setRightShow(!rightShow)
            showRight = !rightShow
        }
        const czMenu = czList.map((item, index) => {
            return (<Menu.Item key={index} onClick={() => clickMenu(item, index)} className={`${item.flag ? 'actives yjDrop' : 'yjDrop'}`}>
              <span>{item.name}</span>
            </Menu.Item>)
          })
        const yjczMenus = (<Menu className='yjczList'>{czMenu}</Menu>)
        setYjczMenu(yjczMenus)
        if (topName === "预案推演") {
          props.checkYaty(true)
        }else {
          props.sjczMapClickOff()
        }
    }
  }
  const clickLi = (items: any, indexs: number, index: any) => {
    const listData = setListDatas(index)
    const liseps = listData.map((item: any, indexd: any) => {
        if (indexs === indexd) {
            item.flag = true
        } else {
            item.flag = false
        }
      return (<div className='limg' key={indexd} onClick={() => clickLi(item, indexd, index)}><li className={`${item.flag ? 'actives' : ''}`}>
        <span>{indexd + 1}、 {item.name}</span></li>
      {(indexd===(listData.length-1))?null:(<span className='iconfont icon-biaodian' />)}
      </div>)
    })
    setListLi(liseps)
    // 掉用地图事件
    props.sjczMapClick()
  }
    return (
        <div>
            <Dropdown overlay={yjczMenu} className='yjcz' placement="topCenter">
                <a className={yjActive?'ant-dropdown-link active': 'ant-dropdown-link'} onClick={yjClick}>
                <img src={`/img/imageNew/icon/zwr.png`} className="iconImg"/>
      <img src={`/img/imageNew/icon/zwr1.png`} className="iconImgActive"/>
                    {/* <span style={{fontSize: '16rem'}}>应急处置</span> */}
                </a>
            </Dropdown>
            {rightShow?(<Drawer
                title="Drawer with extra actions"
                placement='right'
                className="hcDrawer yjDrawer"
                visible={true}
                mask={false}
                maskClosable={false}
                >
                <div className='top'>
                    <span>{topName}</span>
                </div>   
                <div className='content'>
                    {listLi}
                </div>
            </Drawer>) : null}
        </div>
    )
})
export default Yjcz;