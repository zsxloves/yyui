import { request } from 'umi';

export async function fakeSubmitForm(params: any) {
  return request('/api/basicForm', {
    method: 'POST',
    data: params,
  });
}
export async function getVedio() {
  return request('//data.mars3d.cn/file/apidemo/mudi-all.json', {
    method: 'get',
  });
}
// 图层查询
export async function getModelLayer(params: any) {
  return request('/api/tArLayermanager/queryLayerTree', {
    method: 'POST',
    data: params,
  });
}
// 摄像机查询
export async function videoQuery(params: any) {
  return request('/api/arVideo/query', {
    method: 'POST',
    data: params,
  });
}
// 摄像机查询详情
export async function videoDetailQuery(params: any) {
  return request('/api/arLayerVedio/query', {
    method: 'POST',
    data: params,
  });
}
// 摄像机详情修改新增
export async function addLayerCamera(params: any) {
  return request('/api/arLayerVedio/add', {
    method: 'POST',
    data: params,
  });
}
// 删除摄像机点位
export async function removeCameraDW(params: any) {
  return request('/api/arLayerVedio/delete', {
    method: 'POST',
    data: params,
  });
}

/** 查询预案详情 POST  */
export async function queryYaDetail(param?: Record<string, unknown>) {
  return request('/api/arSolution/query', {
    method: 'POST',
    data: param,
  });
}
/** 查询预案图层json POST  */
export async function queryYaJson(param?: Record<string, unknown>) {
  return request('/api/arPlan/query', {
    method: 'POST',
    data: param,
  });
}

/** 查询安保详情 POST  */
export async function queryAb(param?: Record<string, unknown>) {
  return request('/abrz/screen/security/log/queryPage', {
    method: 'POST',
    data: param,
  });
}

// 查询字典
export async function getDictfindAll(params?: Record<string, unknown>) {
  return request('/api/dictionary/findAll', {
    method: 'POST',
    data: params,
  });
}
// 查询场景设备
export async function querySenceDevice(params?: Record<string, unknown>) {
  return request('/api/arPlan/queryDeviceListByScene', {
    method: 'POST',
    data: params,
  });
}

// 查询场景重点人员
export async function querySencePeople(params?: Record<string, unknown>) {
  return request('/api/arPlan/queryPersonListByScene', {
    method: 'POST',
    data: params,
  });
}

// 查询场景监控
export async function querySenceVideo(params?: Record<string, unknown>) {
  return request('/api/arLayerVedio/queryVideo', {
    method: 'POST',
    data: params,
  });
}

// 查询沿线监控
export async function queryCamera(params?: Record<string, unknown>) {
  return request('/abrz/screen/camera/along', {
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

// 查询警情数
export async function queryJQNum(params?: Record<string, unknown>) {
  return request('/api/arPlan/queryJQNum', {
    method: 'POST',
    data: params,
  });
}

// 人员核查
export async function ryhcPic(params?: Record<string, unknown>) {
  return request('/abrz/portrait/intelligence/capture/page', {
    method: 'POST',
    data: params,
  });
}
// 人员核查
export async function ryhcOld(params?: Record<string, unknown>) {
  return request('/newapi/zhst/v1.0/search', {
    method: 'POST',
    data: JSON.stringify(params),
    dataType: 'json',
  });
}
// 图层图源摄像机id查询
export async function queryTcty(params?: Record<string, unknown>) {
  return request('/api/arLayericonlist/queryLayerVideoIdList', {
    method: 'POST',
    data: params,
  });
}
// 预案推演详情
export async function queryYatyDetail(params: any) {
  return request('/api/arPlandeducingDetail/query', {
    method: 'POST',
    data: params,
  });
}
// 预案推演查询
export async function queryYaty(params: any) {
  return request('/api/arPlandeducing/query', {
    method: 'POST',
    data: params,
  });
}
// 图层图元列表查询
export async function queryLayerList(params: any) {
  return request('/api/arLayericonlist/query', {
    method: 'POST',
    data: params,
  });
}
// 图层图元详情查询
export async function queryArIcon(params: any) {
  return request('/api/arIconLayer/query', {
    method: 'POST',
    data: params,
  });
}
// 湘湖游船查询
export async function queryYc(params: any) {
  return request('/traffic/zju/gps', {
    method: 'GET',
    data: params,
  });
}
// 根据场景查询图层树
export async function queryTreeTc(params: any) {
  return request('/api/tArLayermanager/queryTreeByScene', {
    method: 'POST',
    data: params,
  });
}
//根据岗点查询警力
export async function bySolution(params: any) {
  return request('/api/gps/bySolution', {
    method: 'POST',
    data: params,
  });
}
// 获取图标列表
export async function getIcon(params?: Record<string, unknown>) {
  return request('/api/arSolution/query', {
    method: 'POST',
    data: params,
  });
}
