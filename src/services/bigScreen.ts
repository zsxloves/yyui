import { request } from 'umi';

// 查询预警分类
export async function getCount(params: any) {
  return request('/abrz/base/alarm/getCount', {
    method: 'POST',
    data: { ...params },
  });
}

// 查询预警列表
export async function getPage(params: any) {
  return request('/abrz/base/alarm/getPage', {
    method: 'POST',
    data: params,
  });
}

// 获取预警图表数据
export async function getLine(params: any) {
  return request('/abrz/base/alarm/getLine', {
    method: 'POST',
    data: params,
  });
}

// 预警详情
export async function getDetail(params: any) {
  return request('/apis/base/alarm/getDetail', {
    method: 'POST',
    data: params,
  });
}

// 获取事件处理
export async function getWarnDealCfg(params: any) {
  return request('/apis/warnDealCfg/page', {
    method: 'POST',
    data: params,
  });
}

// 获取预警处置记录
export async function getWarnDealLog(params: any) {
  return request('/apis/warnDealLog/page', {
    method: 'POST',
    data: params,
  });
}

// 提交预警处置
export async function warnDealLog(params: any) {
  return request('/apis/warnDealLog/update', {
    method: 'POST',
    data: params,
  });
}
// 提交预警处置(new)
export async function warnDealLogSend(params: any) {
  return request('/apis/warnDealLog/command/send', {
    method: 'POST',
    data: params,
  });
}

// 预警处置完毕提交
export async function updateState(params: any) {
  return request('/apis/face/alarm/updateState', {
    method: 'POST',
    data: params,
  });
}

// 短信发送
export async function sendMessage(params: any) {
  return request('/message/smap/iface/interface', {
    method: 'GET',
    params: {
      usr: 'xsfjarzhabgk',
      pwd: 'xsfjarzhabgk',
      ext: 99,
      priority: 5,
      userid: 31,
      ...params,
    },
  });
}

// 警情列表
export async function getAllJJD(params: any) {
  return request('/jq/jjd/getAllJJD', {
    method: 'POST',
    data: params,
  });
}
// 警情设置已读
export async function jjdRead(params: any) {
  return request('/jq/jjd/read', {
    method: 'POST',
    data: params,
  });
}
// 获取处警反馈单
export async function getAllFKD(params: any) {
  return request('/jq/fkd/getAllFKD', {
    method: 'POST',
    data: params,
  });
}
// 获取安检点位
export async function checkCollect(params: any) {
  if(JSON.parse(window?.cjObj?.entity||'{}')?.interface==='haikang'){
    return request('/message/manager/isc/check/statistics/collect', {
      method: 'POST',
      data: params,
    });
  }else{
    return request('/abrz/manager/isc/check/statistics/collect', {
      method: 'POST',
      data: params,
    });
  }
}
// 获取安检人员
export async function visitorRecords(params: any) {
  if(JSON.parse(window?.cjObj?.entity||'{}')?.interface==='haikang'){
    return request('/message/manager/isc/check/visitor/records', {
      method: 'POST',
      data: params,
    });
  }else{
    return request('/abrz/manager/isc/check/visitor/records', {
      method: 'POST',
      data: params,
    });
  }
}
// 获取安检包裹
export async function packageRecords(params: any) {
  if(JSON.parse(window?.cjObj?.entity||'{}')?.interface==='haikang'){
    return request('/message/manager/isc/check/package/records', {
      method: 'POST',
      data: params,
    });
  }else{
    return request('/abrz/manager/isc/check/package/records', {
      method: 'POST',
      data: params,
    });
  }
}

// 获取监控点位
export async function arVideoQuery(params: any) {
  return request('/api/arVideo/query', {
    method: 'POST',
    data: params,
  });
}

// 图层监控点位查询
export async function queryVideo(params: any) {
  return request('/api/arLayerVedio/queryVideo', {
    method: 'POST',
    data: params,
  });
}

// GPS记录查询
export async function arGpsQuery(params: any) {
  return request('/api/gps/queryByIndex', {
    method: 'POST',
    data: params,
  });
}

// 停车场查询
export async function getParkPageData(params: any) {
  return request('/api/park/getPageData', {
    method: 'POST',
    data: params,
  });
}

// 查询人员
export async function personPage(params: any) {
  return request('/api/arObserveperson/queryByIndex', {
    method: 'POST',
    data: params,
  });
}

// 查询重点单位(带数据域)
export async function arCompanyPage(params: any) {
  return request('/api/arCompany/queryByIndex', {
    method: 'POST',
    data: params,
  });
}

// 查询实有房屋
export async function arHouseQuery(params: any) {
  return request('/api/arHouse/queryByIndex', {
    method: 'POST',
    data: params,
  });
}

// 查询实有房屋详情
export async function arHouseQueryDetail(params: any) {
  return request('/api/arHouse/queryDetail', {
    method: 'POST',
    data: params,
  });
}

// 查询值班列表
export async function getDutyPage(params: any) {
  return request('/api/duty/getPageData', {
    method: 'POST',
    data: params,
  });
}

// 根据活动查询嘉宾列表
export async function getGuestPage(params: any) {
  return request('/api/guest/queryGuestByAct', {
    method: 'POST',
    data: params,
  });
}
// 获取组织详情
export async function getOrgDetail(params?: Record<string, unknown>) {
  return request('/api/org/detail', {
    method: 'POST',
    data: params,
  });
}
// 获取海康视频流
export async function preview(params?: Record<string, unknown>) {
  return request('/message/manager/isc/camera/info/preview', {
    method: 'POST',
    data: params,
  });
}

// 查询人脸抓拍记录
export async function capturePage(params?: Record<string, unknown>) {
  return request('/abrz/portrait/intelligence/capture/page', {
    method: 'POST',
    data: params,
  });
}
// 根据场景查询

export async function queryTree(params?: Record<string, unknown>) {
  return request('/api/arLayericonlist/queryTree', {
    method: 'POST',
    data: params,
  });
}
// 获取图图层图元
export async function arIconLayerQuery(params?: Record<string, unknown>) {
  return request('/api/arIconLayer/query', {
    method: 'POST',
    data: params,
  });
}
// 赛事信息表查询
export async function arCompetionsQuery(params?: Record<string, unknown>) {
  return request('/api/arCompetions/query', {
    method: 'POST',
    data: params,
  });
}
// 班车信息查询
export async function arBusinfoQuery(params?: Record<string, unknown>) {
  return request('/api/arBusinfo/query', {
    method: 'POST',
    data: params,
  });
}
// 卡口信息查询
export async function arViasQuery(params?: Record<string, unknown>) {
  return request('/api/arVias/query', {
    method: 'POST',
    data: params,
  });
}
// 查询卡口抓拍记录
export async function snapSearch(params?: Record<string, unknown>) {
  return request('/message/manager/isc/vehicle/snap/search', {
    method: 'POST',
    data: params,
  });
}
// 查询轨迹
export async function vehicleTracking(params?: Record<string, unknown>) {
  return request('/abrz/app/vehicle/tracking', {
    method: 'POST',
    data: params,
  });
}

// 查询活动
export async function activityPage(params?: Record<string, unknown>) {
  return request('/api/activity/getPageData', {
    method: 'POST',
    data: params,
  });
}

// 查询岗点视频和设备
export async function querySolution(params?: Record<string, unknown>) {
  return request('/api/arSolution/detail', {
    method: 'POST',
    data: params,
  });
}

//检查站汇总统计
export async function queryCheckCount(params?: Record<string, unknown>) {
  return request('/apis/check/point/count', {
    method: 'POST',
    data: params,
  });
}

//检查站列表
export async function queryCheckList(params?: Record<string, unknown>) {
  return request('/apis/check/point/list', {
    method: 'POST',
    data: params,
  });
}

//检查站抓拍预警统计
export async function queryCheckGroupList(params?: Record<string, unknown>) {
  return request('/apis/check/point/group/point', {
    method: 'POST',
    data: params,
  });
}

//预警抓拍列表
export async function queryCheckRecordList(params?: Record<string, unknown>) {
  return request('/apis/check/point/record/page', {
    method: 'POST',
    data: params,
  });
}

//人流量
export async function getCameraIdsByGroup(params?: Record<string, unknown>) {
  return request('/newapi/zhst/v1.0/getCameraIdsByGroup', {
    method: 'POST',
    data: params,
  });
}
export async function queryCountpeople(params?: Record<string, unknown>) {
  return request('/newapi/zhst/v1.0/statisticsDigestByCameraId', {
    method: 'POST',
    data: params,
  });
}

//交通拥堵度
export async function queryLinkstatenow(params?: Record<string, unknown>) {
  console.log(params);
  return request('/traffic/zju/linkstatenow', {
    method: 'GET',
  });
}

// 拖到配置保存
export async function updateConfig(params: Record<string, unknown>) {
  return request('/api/scene/manager/updateConfig', {
    method: 'POST',
    data: params,
  });
}

// 查询三圈线
export async function querySQX(params: Record<string, unknown>) {
  return request('/api/arPlan/querySQX', {
    method: 'POST',
    data: params,
  });
}
// 查询酒店详情
export async function guestStatistics(params: Record<string, unknown>) {
  return request('/apis/hotel/guest/statistics', {
    method: 'POST',
    data: params,
  });
}

// 查询停车场/客流
export async function queryPark(params: Record<string, unknown>) {
  console.log(params);
  return request('/parkcar/park/query', {
    method: 'GET',
  });
}

// 房屋
export async function queryHouse(params: Record<string, unknown>) {
  console.log(params);
  return request('/abrz/bs/house/getForData', {
    method: 'POST',
    data: params,
  });
}

// 图层图源摄像机id查询
export async function queryTcty(params?: Record<string, unknown>) {
  return request('/api/arLayericonlist/queryLayerVideoIdList', {
    method: 'POST',
    data: params,
  });
}

// 300米周边信息
export async function queryByLine(params?: Record<string, unknown>) {
  return request('/api/arCompany/queryByLine', {
    method: 'POST',
    data: params,
  });
}
