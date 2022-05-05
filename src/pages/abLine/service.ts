import { request } from 'umi';

// 查询字典
export async function getDictfindAll(params?: Record<string, unknown>) {
  return request('/api/dictionary/findAll', {
    method: 'POST',
    data: params,
  });
}
// 图层图元列表
export async function getLayerList(params?: Record<string, unknown>) {
  return request('/api/arLayericonlist/query', {
    method: 'POST',
    data: params,
  });
}
// 图层图元详情查询
export async function getLayerDetail(params?: Record<string, unknown>) {
  return request('/api/arIconLayer/query', {
    method: 'POST',
    data: params,
  });
}
// 查询图元树
export async function getLayerTree(params?: Record<string, unknown>) {
  return request('/api/arLayericonlist/queryTree', {
    method: 'POST',
    data: params,
  });
}
// 查询图元视频列表
export async function getLayerVideolList(params?: Record<string, unknown>) {
  return request('/api/arLayericonlist/queryLayerVideoList', {
    method: 'POST',
    data: params,
  });
}