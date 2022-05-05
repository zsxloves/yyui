import { request } from 'umi';
// 人员核查
export async function ryhcOldJSON(params?: Record<string, unknown>) {
    return request('/json/search.json', {
      method: 'GET'});
  }