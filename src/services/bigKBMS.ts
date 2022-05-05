import { request } from 'umi';

// 组织架构
export async function getOrganizationList (params: any) {
  return request('/kbms/v1/kbms/commanders', {
    method: 'GET',
  });
}
// 安保流程
export async function getActivityFlowList (params: any) {
  return request('/kbms/v1/kbms/activityFlow?id=' + params.id, {
    method: 'GET',
  });
}
export async function getAnbaoFlowMap (params: any) {
  return request('../../json/ablc.json', {
    method: 'GET',
    // data: { ...params },
  });
}
export async function getroadJam_points (params: any) {
  return request('../../json/roadJam_points.json', {
    method: 'GET',
    // data: { ...params },
  });
}
// 安检
export async function getAnjianList (params: any) {
  return request('/kbms/v1/kbms/securityInfo', {
    method: 'GET',
  });
}
// 班车
export async function arVehicleList (params?: Record<string, unknown>) {
  return request('/kbms/v1/kbms/vehicleInfo', {
    method: 'GET',
  });
}
// 民警
export async function arPoliceCount (params?: Record<string, unknown>) {
  return request('/kbms/v1/kbms/securityCount/policeInfo', {
    method: 'GET',
  });
}
// 辅警
export async function arAuxiliaryCount (params?: Record<string, unknown>) {
  return request('/kbms/v1/kbms/securityCount/auxiliaryPolice', {
    method: 'GET',
  });
}
// 保安
export async function arGuardCount (params?: Record<string, unknown>) {
  return request('/kbms/v1/kbms/securityCount/guard', {
    method: 'GET',
  });
}
// 检票信息
export async function arCheckTickets (params?: Record<string, unknown>) {
  return request('/kbms/v1/kbms/checkTickets/check_info', {
    method: 'GET',
  });
}
// 验证信息
export async function arCheckCertificates (params?: Record<string, unknown>) {
  return request('/kbms/v1/kbms/checkCertificates/certInfo', {
    method: 'GET',
  });
}
// 违禁品
export async function arSecurityInfo (params?: Record<string, unknown>) {
  return request('/kbms/v1/kbms/securityInfo/items', {
    method: 'GET',
  });
}
// 已读
export async function read (params: any) {
  return request('/abrz/base/alarm/read', {
    method: 'POST',
    data: params,
  });
}


