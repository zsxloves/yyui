
import React, { useEffect, useState, useRef } from 'react';
import styles from './styles.less';
import Mars3DMap from './components/mars3d'
import { Select, Input, Button, Steps, message } from 'antd';
import { getLayerTree, getLayerVideolList } from './service';
import VideoPlayer from '@/components/videoPlayer/indexMore'; // 海康视频播放
import DahuaVideo from '@/components/dahuaVideo'; // 大华视频播放
import {
  selectLayer,
} from '@/services/topManage/index';
const { Option } = Select;
const { Step } = Steps;
let leftArr: any = []
const AbLine: React.FC = () => {
  const [pageTitle, setPageTitle] = useState<string>('');
  const [cgValue, changeCgValue] = useState<string>('');
  const [cgOptions, setCgOptions] = useState<any>('');
  const [category, setCateGory] = useState<any>('');
  const [progressMenu, setProgressMenu] = useState<any>(<div />)
  const [showLeftObj, setShowLeftObj] = useState<any>(false)
  const [avtiveMn, setActiveMn] = useState<boolean>(false)
  const [avtiveGz, setActiveGz] = useState<boolean>(false)
  const [avtiveMy, setAvtiveMy] = useState<boolean>(false)
  const [videoUrlHK, setVideoUrlHK] = useState<string[]>([]); // 海康视频地址
  const [videoUrlDH, setVideoUrlDH] = useState<string[] | string>([]); // 海康视频地址
  const [nameModel, setNameModel] = useState<any>("自动")
  const changeCategory = (e: any) => {
    setCateGory(e.target.value)
  }
  // 3d地图ref
  const mapRef: any = useRef(null);
  
  // 左侧滚动
  const leftScroll = (index: any) => {
    if ($(".stepsNow")[0]) {
      const topPX = index * 48
      $(".stepsNow")[0].scrollTop = topPX
    } else {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        leftScroll(index)
      }, 100)
    }
  }
  const setLeftMenu = (arr?: any, index?: any) => {
      let newArr = []
      if (arr && arr.length) {
        newArr = arr
      } else {
        if (leftArr?.length) {
            newArr = leftArr
        }
      }
      if (newArr.length) {
        let currentNum = 0 
        if (index) {
            currentNum = index
        }
        const menu = newArr.map((item: any) => {
            return (<Step title={item.videoName}  key={item.id} />)
        })
        const newMenu = (<Steps progressDot current={currentNum} direction="vertical"  className="stepsNow">
            <Step title='' />{menu}</Steps>)
        setProgressMenu(newMenu)
        if (currentNum > 4) {
          leftScroll(currentNum - 4)
        }
      }
  }
  //  className={styles.stepsNow}
  const getLeftObj = (value: any) => {
    const param = {
        id: value
    }
    getLayerVideolList(param).then((res: any) => {
        console.log(res)
        const result = res.data.rows
        if (result.length) {
            mapRef.current.setLine(result)
        }
    })
  }
  const setMap = (value: any) => {
    setActiveMn(false)
    setActiveGz(false)
    setAvtiveMy(false)
    setShowLeftObj(false)
    mapRef.current.clearAllya()
    changeCgValue(value)
    getLeftObj(value)
  }
  const getLayerTreeData = (id: any) => {
    const param = {
        'sceneId': id
    }
    getLayerTree(param).then((res: any) => {
      if (res && res.data.length) {
        res.data.some((item: any) => {
            if (item.title === '线路安保') {
                if (item?.children?.length) {
                    const list = item.children
                    const cgOptionsNew = list.map((items: any) => {
                        return (
                        <Option value={items.key} key={items.key}>
                            {items.title}
                        </Option>
                        );
                    });
                    setCgOptions(cgOptionsNew);
                    setMap(list[0].key)
                } else {
                  // console.log('无安保路线,请后台配置')
                    message.warn('无安保路线,请后台配置')
                }
                return true
            } else {
                return false
            }
        })
      }
    })
  }
  const setLeftObj = (arr: any) => {
    leftArr = arr
    setLeftMenu(arr)
    setShowLeftObj(true)
  }
  const clickGz = () => {
    if (!category) {
      message.error("请输入车辆编号")
      return
    }
    if (avtiveGz) {
      return
    }
    setActiveMn(false)
    setActiveGz(true)
    setAvtiveMy(false)
    mapRef.current.clearLines()
    mapRef.current.setGzxl(category)
  }
  const clickMn = () => {
    // setVideoUrlDH( [
    //   'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    //   'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    // ]);
      setActiveMn(true)
      setActiveGz(false)
      setAvtiveMy(false)
      mapRef.current.setMndh()
  }
  // 漫游
  const clickMy = () => {
    if (avtiveMy) {
      return
    }
    setActiveMn(false)
    setActiveGz(false)
    setAvtiveMy(true)
    mapRef.current.clearOtherMy()
    mapRef.current.setMy()
  }
  // 模拟开启视频
  const videoSet = (index: any, arr: any, type: any, src?: any) => {
    if (index) {
        setLeftMenu([], index)
    }
    if (type !== '1' || src) {
      if (arr.dhSrc.length) setVideoUrlDH(arr.dhSrc);
      if (arr.hkSrc.length) setVideoUrlHK(arr.hkSrc);
    }
  }
  // 地图加载
  const setBgLayer = (val: any) => {
    const param = {
      id: val,
      pageSize: 999,
      pageNumber: 1,
    };
    selectLayer(param).then((res: any) => {
      mapRef?.current?.setBgLayer(res);
    })
  }
  const changeSj = () => {
    mapRef.current.changeCar()
  }
  document.onkeydown = (e) => {
    console.log(e)
    if (!avtiveMy) return
    const keyCode = e.keyCode
    if (keyCode === 38) {
      // 上键
      mapRef.current.setSp('up')
    } else if (keyCode === 40) {
      // 下键
      mapRef.current.setSp('down')
    }
  }
  const changeMS = () => {
    if (nameModel === '自动') {
      setNameModel("手动")
      mapRef.current.changeType('1')

    } else {
      setNameModel("自动")
      mapRef.current.changeType('0')
    }
  }
  useEffect(() => {
    // 获取信息
    const obj = window.location.search.split('?')[1].split('&');
    const title = decodeURI(obj[1].split('=')[1])
    const id = obj[0].split('=')[1]
    getLayerTreeData(id)
    setPageTitle(title)
    setBgLayer(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      setVideoUrlDH([])
      setVideoUrlHK([])
    };
  }, [])
  return (
    <div className={[styles.all, styles.containBody].join(' ')}>
        <Mars3DMap ref={mapRef} setLeftObj={setLeftObj} videoSet={videoSet} />
        <div className={styles.topContain}>
          <div className={styles.contain}>
            <div className={styles.topCenter}>
              <span className={styles.big}>{pageTitle}</span>
              <span className={styles.small}> 线路安保</span>
            </div>
            <div className={styles.topLeft}>
                <span style={{letterSpacing: '2px'}}>GPS</span><Input value={category} onChange={changeCategory} />
                <Button type="primary" className={avtiveGz?styles.activeBtn:''} style={{marginLeft: '10rem'}} onClick={clickGz}>跟踪</Button>
                {/* <Button type="primary" className={avtiveMn?styles.activeBtn:''} style={{marginLeft: '16rem'}} onClick={clickMn}>模拟</Button> */}
                <Button type="primary" className={avtiveMy?styles.activeBtn:''} style={{marginLeft: '16rem'}} onClick={clickMy}>漫游</Button>
            </div>
            <div className={styles.topRight}>
                <Button type="primary" style={{marginRight: '16rem'}} onClick={changeMS}>{nameModel}</Button>
                <Button type="primary" style={{marginRight: '16rem'}} onClick={changeSj}>切换视角</Button>
                <Select className={styles.section} value={cgValue} onChange={setMap}>
                    {cgOptions}
                </Select>
            </div>
            <div className={styles.clear} />
          </div>
        </div>
        {showLeftObj &&<div className={styles.leftTep}>
            <div className={styles.leftContent}>
                <div className={[styles.tpBd, styles.passed].join(' ')}>已通过</div>
                <div className={[styles.tpBd, styles.arrived].join(' ')}>即将抵达</div>
                {progressMenu}
                <div className={[styles.leftTop, styles.bord].join(' ')} />
                <div className={[styles.leftBom, styles.bord].join(' ')} />
                <div className={[styles.rightTop, styles.bord].join(' ')} />
                <div className={[styles.rightBom, styles.bord].join(' ')} />
            </div>
        </div>}
        {/* 海康视频播放 */}
        {videoUrlHK.length > 0 && (
          <div className={styles.newHk}>
            <VideoPlayer
              // key={videoUrlHK}
              viderUrls={videoUrlHK}
              onCancel={() => {
                setVideoUrlHK([]);
              }}
            />
          </div>
        )}
        {/* 大华视频播放 */}
        {videoUrlDH.length > 0 && (
          <div className={styles.newDH}>
            <DahuaVideo
              viderUrls={videoUrlDH}
              onCancel={() => {
                setVideoUrlDH([]);
              }}
            />
          </div>
        )}
    </div>
  )
};

export default AbLine;