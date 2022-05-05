import { useState, useEffect } from 'react'
import moment from 'moment'

export default function () {

  return (
    <div>
      <Time />
    </div>
  )
}

function Time () {
  const [now, setNow] = useState(moment())  // 会返回当前状态的属性 和修改状态的方法

  useEffect(() => {  // 可以在函数组件内处理生命周期事件，默认情况，每次渲染都会调用该函数
    const t = setInterval(() => {
      setNow(moment())
    }, 1000)

    return () => {  // 每次卸载都执行此函数，清楚定时器
      clearTimeout(t)
    }
  }, [])

  return (
    <div className='leftTT'>
      <span className='left'>{ now.format('M') }月{ now.format('D') }日</span>
      <span className='right'>{ now.format('HH:mm:ss') }</span>
    </div>
  )
}

