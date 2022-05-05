import React, { useEffect, useState, useImperativeHandle } from 'react';

import { Slider, Checkbox, Row, Button } from 'antd';
const zgdData: any = {
  angle: 60, // 水平角度
  angle2: 30, // 垂直角度
  heading: 90,  // 四周距离
  pitch: 0,   // 俯仰角度
  distance: 80, // 投射距离
  opacity: 0.6, // 透明度
  showFrustum: true, // 是否显示视椎线
}
interface Props {
  addZgd: Function,
  clearArr: Function,
  updateParams: Function,
  selCamera: Function,
  onClickSelView: Function
}
interface RefTypes{
}
const Zgd = React.forwardRef<RefTypes, Props>((props, ref) => {
  //将子组件的方法 暴露给父组件
  // 水平张角
  const [spValue, setSpValue] = useState<any>(60)
  const changeSp = (value: any) => {
    setSpValue(value)
    zgdData.angle = value
    props.updateParams('spzj', value)
  }
  // 垂直张角
  const [czValue, setCzValue] = useState<any>(30)
  const changeCz = (value: any) => {
    setCzValue(value)
    zgdData.angle2 = value
    props.updateParams('czzj', value)
  }
  // 俯仰角度
  const [sjjl, setSjjl] = useState<any>(0)
  const changeSjjl = (value: any) => {
    setSjjl(value)
    zgdData.pitch = value
    props.updateParams('fyjd', value)
  }
  useImperativeHandle(ref, () => ({

  }))
  // 视锥框线
  const [checked, setChecked] = useState<boolean>(true)
  const onChange = (e: any) => {
    setChecked(e.target.checked)
    zgdData.showFrustum = e.target.checked
    props.updateParams('xk', e.target.checked)
  }
  const tjzgd = () => {
    props.addZgd(zgdData)
  }
  const clearZgd = () => {
    props.clearArr()
  }
  // 投射距离
  const [tsValue, setTsValue] = useState<any>(80)
  const changeTs =  (value: any) => {
    setTsValue(value)
    zgdData.distance = value
    props.updateParams('txjl', value)
  }
  // 视频透明度
  const [spOpValue, setSpOpValue] = useState<any>(0.6)
  const changeOp = (value: any) => {
    setSpOpValue(value)
    zgdData.opacity = value
    props.updateParams('sptm', value)
  }
  // 四周方向
  const [szValue, setSzValue] = useState<any>(90)
  const changeSz = (value: any) => {
    setSzValue(value)
    zgdData.heading = value
    props.updateParams('szfx', value)
  }
  const selCamera = () => {
    props.selCamera()
  }
  const onClickSelView = () => {
    props.onClickSelView()
  }
  useEffect(() => {

  }, [])
  return (<div className='zgdSet'>
    <Row style={{ margin: '0 0 10rem 82rem'}}>
      <Button type="primary" style={{marginRight: '16rem'}} onClick={tjzgd}>添加可视域</Button>
      <Button type="primary" onClick={clearZgd}>清除</Button>
    </Row>
    <Row>
      <span className='titleName'>相机位置：</span>
      <Button type="primary" onClick={selCamera}>鼠标图上点选(相机位置)</Button>
    </Row>
    <Row>
      <span className='titleName'>水平张角：</span>
      <Slider value={spValue} onChange={changeSp} min={1} max={60} step={0.1}  />
    </Row>
    <Row>
      <span className='titleName'>垂直张角：</span>
      <Slider value={czValue} onChange={changeCz} min={10} max={30} step={0.1} />
    </Row>
    <Row>
      <span className='titleName'>投射距离：</span>
      <Slider value={tsValue} onChange={changeTs} min={1} max={1000} step={0.1} />
    </Row>
    <Row>
      <span className='titleName'>四周方向：</span>
      <Slider value={szValue} min={0} max={360} step={0.1} onChange={changeSz} />
      <Button type="primary" onClick={onClickSelView}>图上点选</Button>
    </Row>
    <Row>
      <span className='titleName'>俯仰角度：</span>
      <Slider value={sjjl} onChange={changeSjjl} min={-180} max={180} step={0.1} />
    </Row>
    <Row>
      <span className='titleName' style={{marginRight: '10rem'}}>视椎线框:</span>
      <Checkbox onChange={onChange} checked={checked} style={{color: '#fff'}}>显示框线</Checkbox>
    </Row>
    <Row>
      <span className='titleName'>视频透明度：</span>
      <Slider value={spOpValue} onChange={changeOp} min={0} max={1} step={0.1} />
    </Row>
  </div>)
})

export default Zgd;