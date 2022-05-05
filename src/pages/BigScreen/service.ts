import { request } from 'umi';
// 人员核查
export async function checkCollectJSON(params?: Record<string, unknown>) {
    return request('/json/anjian.json', {
      method: 'GET'});
  }
  export async function queryTreeJSON(params?: Record<string, unknown>) {
    return request('/json/tree.json', {
      method: 'GET'});
  }
  export async function visitorRecordsJSON(params?: Record<string, unknown>) {
    return request('/json/person.json', {
      method: 'GET'});
  }
  export async function packageRecordsJSON(params?: Record<string, unknown>) {
    return request('/json/package.json', {
      method: 'GET'});
  }