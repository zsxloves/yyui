
import {  useEffect, useState, useImperativeHandle, useRef } from 'react';
import React from 'react';

import { Menu, Dropdown, message } from 'antd';
import { Drawer,
   Button } from 'antd';

import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { queryTcty } from './../service';
//定义props的类型
interface Props{
  checkQy: (val: any) => void,
  zdArr: any,
  setZdqyTc: (val: any) => void,
  changeTableKey: (val: any) => void,
  setPlsp: (val: any) => void,
  setoneSp: (val: any) => void
}
interface RefTypes{
}
let showRight = false
let czList: any = []
const Zdqy= React.forwardRef<RefTypes, Props>((props, ref) => {
  const [checkKey, setCheckKey] = useState<any>([]);
  const [tableData, setTableDatas] = useState<any>([])
  const setTableData = (items: any) => {
    const type = props.zdArr[items.name]
    if (!type) return
    const param = {
      type: type,
      sceneId: window.cjObj.id
    }
    queryTcty(param).then((res: any) => {
      const result = res.data.rows
      if (result.length) {
        const newResult = result.filter((item: any) => {
          return item.iconTitle !== "文字"
        })
        setTableDatas(newResult)
        props.setZdqyTc(newResult)
        setCheckKey(newResult.map( (item: any) => { return item.id }))
      } else {
        setTableDatas([])
        props.setZdqyTc([])
        setCheckKey([])
      }
    })
  } 
  const actionRef: any = useRef<ActionType>();
  // const [czList, setCzList] = useState<any>([])
  const [yjczMenu, setYjczMenu] = useState<any>('')
  const [yjActive, setYjActive] = useState<boolean>(false)
  const [rightShow, setRightShow] = useState<boolean>(false)
  const clickMenu = (items: any, indexs: any) => {
    if (!items.flag) {
      setTableData(items)
      props.checkQy(false)
      const czMenu = czList.map((item: any, index: any) => {
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
      setRightShow(true)
      showRight = true
    }
  }
  const yjClick = () => {
    if (yjActive) {
      props.checkQy(false)
      if (showRight) {
        setRightShow(!rightShow)
        showRight = !rightShow
      }
      const czMenus = czList.map((item: any, index: any) => {
        return (<Menu.Item key={index} onClick={() => clickMenu(item, index)} className='yjDrop'>
          {/* className={`${item.flag ? 'actives yjDrop' : 'yjDrop'}`} */}
          <span>{item.name}</span>
        </Menu.Item>)
      })
      const yjczMenuss = (<Menu className='yjczList'>{czMenus}</Menu>)
      setYjczMenu(yjczMenuss)
    }
    setYjActive(!yjActive)
  }
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (_, record, index) => index + 1,
      width: 50,
      search: false,
      key: 'index',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      search: false,
      width: 90,
      render: (text: any, record) => [
        // <a
        //     key="point"
        //     onClick={() => {
        //       // setShowYaManage(true)
        //       console.log(text, record)
        //     }}
        //     style={{ marginRight: '6px' }}
        //   >
        //     点位
        //   </a>,
        (text.videoIdList &&
        <a
          key="video"
          onClick={() => {
            console.log(text, record)
            props.setoneSp(text.videoIdList)
          }}
          style={{ marginRight: '6px' }}
        >
        视频
      </a>)
      ]
    }
  ]
  useEffect(() => {
    const allName = JSON.parse(window.cjObj?.entity || "{}")?.zdqy
    if (allName) {
      const arr: any = []
      allName.forEach((item: any) => {
        const param = {
          name: item,
          flag: false
        }
        arr.push(param)
      })
      czList = arr
      const czMenu = arr.map((item: any, index: any) => {
        return (<Menu.Item key={index} onClick={() => clickMenu(item, index)} className={`${item.flag ? 'actives yjDrop' : 'yjDrop'}`}>
          <span>{item.name}</span>
        </Menu.Item>)
      })
      const yjczMenus = (<Menu className='yjczList'>{czMenu}</Menu>)
      setYjczMenu(yjczMenus)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[window.cjObj])
  //将子组件的方法 暴露给父组件
  useImperativeHandle(ref, () => ({
  }))
    return (
        <div>
            <Dropdown overlay={yjczMenu} className='yjcz' placement="topCenter">
                <a className={yjActive?'ant-dropdown-link active': 'ant-dropdown-link'} onClick={yjClick}>
                <img src={`/img/imageNew/icon/zdb.png`} className="iconImg"/>
      <img src={`/img/imageNew/icon/zdb1.png`} className="iconImgActive"/>
                    {/* <span style={{fontSize: '16rem'}}>应急处置</span> */}
                </a>
            </Dropdown>
            {rightShow?(<Drawer
                title="Drawer with extra actions"
                placement='right'
                className="hcDrawer zdqyDrawer"
                visible={true}
                mask={false}
                maskClosable={false}
                >
                <ProTable
                  scroll={{ y: 'auto', x: '100%' }}
                  className="rightNewTable"
                  actionRef={actionRef}
                  columns={columns}
                  dataSource={tableData}
                  rowKey={'id'}
                  search={false}
                  form={{
                    // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                    syncToUrl: (values, type) => {
                      if (type === 'get') {
                        return {
                          ...values,
                          created_at: [values.startTime, values.endTime],
                        };
                      }
                      return values;
                    },
                  }}
                  pagination={false}
                  dateFormatter="string"
                  options={false}
                  headerTitle=""
                  toolBarRender={() => [
                      // <Button
                      //   key="xjbtn"
                      //   type="primary"
                      //   onClick={() => {
                      //     if (checkKey.length === 0) {
                      //       message.error('请至少选择一条数据');
                      //       return;
                      //     }
                      //   }}
                      // >
                      //   批量点位
                      // </Button>,
                      <Button
                        key="plsp"
                        type="primary"
                        onClick={() => {
                          if (checkKey.length === 0) {
                            message.error('请至少选择一条数据');
                            return;
                          }
                          props.setPlsp(checkKey)
                        }}
                      >
                        批量视频
                      </Button>
                  ]}
                  tableAlertRender={false}
                  rowSelection={{
                    fixed: true,
                    onChange: (keys) => {
                      setCheckKey(keys);
                      props.changeTableKey(keys);
                    },
                    selectedRowKeys: checkKey
                }}
              />
            </Drawer>) : null}
        </div>
    )
})
export default Zdqy;