import React, { useState } from 'react';
import { Col, Input, Row, Slider, Switch } from 'antd';

//定义props的类型
declare type Props = {
  onCancel: (falg?: boolean) => void;
  cameraIndexCode: string;
};
const ControlCamera: React.FC<Props> = (props) => {
  const { onCancel } = props;
  const [presetIndex, setPresetIndex] = useState<number | string>(1)
  const [speed, setSpeed] = useState<number>(50)
  const [iconType, setIconType] = useState<string>('icon-bofang1')
  const [controls, setControls] = useState<any[]>([
    { key: 0, code: 'UP', active: false},
    { key: 1, code: 'RIGHT_UP' },
    { key: 2, code: 'RIGHT' },
    { key: 3, code: 'RIGHT_DOWN' },
    { key: 4, code: 'DOWN' },
    { key: 5, code: 'LEFT_DOWN' },
    { key: 6, code: 'LEFT' },
    { key: 7, code: 'LEFT_UP' },
  ])

  const plateControl = (type: string) => {
    console.log('speed:',speed)
    console.log('type:',type)
  }
  const startMove = (item: any) => {
    console.log('item:',item.code)
    const newControl = controls.map((it: any)=>{
      if (it.key===item.key && !it.active) {
        it.active = true
        setIconType('icon-zanting')
      }else {
        it.active = false
      }
      return it
    })
    setControls(newControl)
  }
  const stopMove = () => {
    setControls(controls.map((it: any)=>{
      if(it.active){
        it.active = false
        setIconType('icon-bofang1')
      }
      return it
    }))
  }
  return (
    <div className="contralCameraWrap">
      <div className="YYModalTitle">云台控制</div>
      <div onClick={() => onCancel(false)} className="close">
        <i className="iconfont icon-guanbi" />
      </div>
      <Row className="controlContent">
        <Col span={13} className="left">
          {controls.map((item: any) => (
            <div className='btnBox' key={item.key} style={{transform: `rotateZ(${45*item.key}deg)`}}>
              <div className={`btn ${item.active?'active':''}`} onClick={()=>{
                startMove(item)
              }}>
                <i className='iconfont icon-gjiantous' />
              </div>
            </div>
          ))}
          <div className='centerBtn' onClick={()=>{
            stopMove()
          }}><i className={`iconfont ${iconType}`}></i></div>
        </Col>
        <Col span={10} offset={1} className="right">
          <div className="swiper">
            <span className="posi">雨刷</span>
            <Switch checkedChildren="开启" unCheckedChildren="关闭" size="small" onChange={(val)=>{
              console.log('valddd:',val)
            }} />
          </div>
          <div className="swiper">
            <span className="posi">光圈</span>
            <p>
              <span className="leftIcon" title="加" onMouseDown={()=>{plateControl('IRIS_ENLARGE')}} onMouseUp={()=>{plateControl('STOP')}}><i className="iconfont icon-jia" /></span>
              <span className="rightIcon" title="减" onMouseDown={()=>{plateControl('IRIS_REDUCE')}} onMouseUp={()=>{plateControl('STOP')}}><i className="iconfont icon-jian" /></span>
            </p>
          </div>
          <div className="swiper">
            <span className="posi">焦点</span>
            <p>
              <span className="leftIcon" title="加" onMouseDown={()=>{plateControl('FOCUS_NEAR')}} onMouseUp={()=>{plateControl('STOP')}}><i className="iconfont icon-jia" /></span>
              <span className="rightIcon" title="减" onMouseDown={()=>{plateControl('FOCUS_FAR ')}} onMouseUp={()=>{plateControl('STOP')}}><i className="iconfont icon-jian" /></span>
            </p >
          </div >
          <div className="swiper">
            <span className="posi">焦距</span>
            <p>
              <span className="leftIcon" title="加" onMouseDown={()=>{plateControl('ZOOM_IN')}} onMouseUp={()=>{plateControl('STOP')}}><i className="iconfont icon-jia" /></span>
              <span className="rightIcon" title="减" onMouseDown={()=>{plateControl('ZOOM_OUT')}} onMouseUp={()=>{plateControl('STOP')}}><i className="iconfont icon-jian" /></span>
            </p >
          </div >
        </Col >
      </Row >
      <br />
      <Row>
        <Col span={11} className='swiper'>
          <span className='posi name'>预置点号:</span> 
          <div className='con'>
            <Input placeholder="请输入" value={presetIndex} onChange={(val)=>{
              setPresetIndex(val.target.value)
            }}/>
          </div>
        </Col>
        <Col span={11} offset={2} className='swiper'>
          <span className='posi name'>云台速度:</span>
          <div className='con'>
            <Slider defaultValue={50} min={1} max={100} onChange={(val)=>{
              setSpeed(val)
            }}/>
          </div>
        </Col>
      </Row>
    </div >
  );
};
export default ControlCamera;
