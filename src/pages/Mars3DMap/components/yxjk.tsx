import React, { useEffect, useState, useImperativeHandle } from 'react';

import { Slider, InputNumber, Row, Button } from 'antd';
interface Props {
    setYxjkRadius: (val: any) => void
}
interface RefTypes{
}
const Yxjk = React.forwardRef<RefTypes, Props>((props, ref) => {
    const [spOpValue, setSpOpValue] = useState<any>(50) 
    const changeOp = (val: any) => {
        let num = val
        if (!val) {
            num = 50
        }
        setSpOpValue(num)
        // console.log(val)
        props.setYxjkRadius(num)
    }
  useEffect(() => {

  }, [])
  return (<div className='yxjk'>
    <Row style={{ margin: '10rem'}}>
      <span className='titleName'>监控距离：</span>
      <Slider value={typeof spOpValue === 'number' ? spOpValue : 50} onChange={changeOp} min={50} max={1000} step={10} />
      <InputNumber
            min={50}
            max={1000}
            style={{ margin: '0 16px' }}
            value={spOpValue}
            onChange={changeOp}
          />
    </Row>
  </div>)
})

export default Yxjk;