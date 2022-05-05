import { request } from 'umi';

/** 查询场景  POST */
export async function searchVenues(param?: Record<string, unknown>) {
  return request('/api/scene/manager/page/region', {
    method: 'POST',
    data: param,
  });
}
// 根据场景查询图层
export async function selectLayer(param?: Record<string, unknown>) {
  return request('/api/cg/selectLayerBySceneId', {
    method: 'POST',
    data: param,
  });
}

/** 查询活动查询预案树 POST  */
export async function searchActives(param?: Record<string, unknown>) {
  return request('/api/arPlan/queryPlanTree', {
    method: 'POST',
    data: param,
  });
}

// 查询警情数
export async function queryJQNum(params?: Record<string, unknown>) {
  return request('/api/arPlan/queryJQNum', {
    method: 'POST',
    data: params,
  });
}

// 查询场馆图层
export async function queryCgTc(params?: Record<string, unknown>) {
  return request('/api/cg/selectLayerByGymId', {
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
// 预案推演日程查询
export async function queryRc(params: any) {
  return request('/api/arPlandeducing/queryDetail', {
    method: 'POST',
    data: params,
  });
}

//获取湘湖景区票务信息
export async function getTicketPageData(params: any) {
  return request('/api/ticketNew/getPageData', {
    method: 'POST',
    data: params,
  });
}

//获取湘湖景区票务统计
export async function TicketData(params: any) {
  return request('/api/ticketNew/querySumNum', {
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
