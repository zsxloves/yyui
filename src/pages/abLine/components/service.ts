import { request } from 'umi';

// 查询岗点视频和设备
export async function querySolution(params?: Record<string, unknown>) {
  return request('/api/arSolution/detail', {
    method: 'POST',
    data: params,
  });
}

// gps点位查询
export async function queryLngLat(params?: Record<string, unknown>) {
  return request('/api/gps/queryByIndex', {
    method: 'POST',
    data: params,
  });
}
