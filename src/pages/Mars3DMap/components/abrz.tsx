import React, { useEffect, useState, useImperativeHandle } from 'react';

import { Table, Checkbox } from 'antd';
import { queryAb } from './../service';
interface Props {
  hideAb: Function,
  abCode: string
}
interface RefTypes{
}
const Abrz = React.forwardRef<RefTypes, Props>((props, ref) => {
  
  useImperativeHandle(ref, () => ({
  }))
  // 日程表格
  const columns: any = [
    {
      title: '时间',
      width: 200,
      dataIndex: 'time',
      key: 'time',
      align: 'center'
    },
    {
      title: '类别',
      width: 100,
      dataIndex: 'categoryName',
      key: 'categoryName',
      align: 'center'
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content'
    },
  ];
  const closeTable = () => {
    props.hideAb()
  }
  const [data, setData] = useState<any>([])
  const [checkValue, setCheckValue] = useState<any>(['0', '1', '3', '6', '50', '51'])
  // 转换时间
  const CheckDateTime = (now: any) => {
    const year = now.getFullYear();       //年
    const month = now.getMonth() + 1;     //月
    const day = now.getDate();            //日
  
    const hh = now.getHours();            //时
    const mm = now.getMinutes();          //分
    const ss = now.getSeconds();          //秒

    let clock = year + "-";
  
    if(month < 10)
        clock += "0";
  
    clock += month + "-";
  
    if(day < 10)
        clock += "0";
      
    clock += day + " ";
  
    if(hh < 10)
        clock += "0";
      
    clock += hh + ":";
    if (mm < 10) clock += '0'; 
    clock += mm + ":";
    if (ss < 10) clock += '0'; 
    clock += ss;
    return(clock); 
  } 
  const option = [{ label: '人脸预警', value: '0' },
  { label: '车辆预警', value: '1' },
  { label: '警情', value: '6' }, 
  { label: '井盖预警', value: '3' },
  { label: '巡线', value: '50' },
  { label: '应急处置', value: '51' },]
  // 查询
  const [loading, setLoad] = useState<boolean>(false)
  const [pagination, setPagination] = useState<any>({ current: 1, pageSize: 10, total: 10 })
  // 0-人脸预警，1-车辆预警，3-井盖，6-警情，50-巡线，51-应急处置
  const queryData = (typeList: any, obj: any, val?: any) => {
    setLoad(true)
    const curDate = new Date();
    const preDate = new Date(curDate.getTime() - 24*60*60*1000); //前一天
    const end = CheckDateTime(new Date())
    const begin = CheckDateTime(preDate)
    let current = 1
    let pageSize = 1
    if (obj) {
      if (obj.pageSize !== pagination.pageSize) {
        current = 1
      } else {
        current = obj.current
      }
      pageSize = obj.pageSize
    } else if (val) {
      current = 1
      pageSize = pagination.pageSize
    } else {
      current = pagination.current
      pageSize = pagination.pageSize
    }
    let position = "[]"
    if (window.cjObj.views) {
      position = window.cjObj.views
    }
    const param = {
      "page": current,
      "size": pageSize,
      "typeList": typeList,
      "begin": begin,
	    "end": end,
      "polygon": JSON.parse(position),
      "deptList": props.abCode
    }
    queryAb(param).then((res: any) => {
      // console.log(res)
      const result = res.result.page.content
      setData(result)
      const paginations = {
        current: current,
        pageSize: pageSize,
        total: res.result.page.totalElements
      }
      setPagination(paginations)
      setLoad(false)
    })
  }
  const handleTableChange = (paginations: any) => {
    queryData(checkValue, paginations)
  };
  const onChange = (checkedValue: any) => {
    setCheckValue(checkedValue)
    queryData(checkedValue, null, true)
  }
  useEffect(() => {
    queryData(['0', '1', '3', '6', '50', '51'], null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (<div className='abrzTable'>
      <div className='titles'>安保日志</div>
      <div className='closeBtn' onClick={closeTable}><span className='iconfont icon-guanbi' /></div>
      <div>
        <span>筛查</span>
        <Checkbox.Group
          options={option}
          defaultValue={['0']}
          value={checkValue}
          onChange={onChange}
          className='abCheck'
        />
      </div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          bordered
          size="middle"
          className='yaListTable'
          scroll={{ y: 250 }}
          onChange={handleTableChange}
          pagination={pagination}
        />
  </div>)
})

export default Abrz;