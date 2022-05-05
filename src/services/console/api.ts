// @ts-ignore
/* eslint-disable */
import {request} from 'umi';
import {xcrequest} from "@/services/xc/request";


/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(data: any) {
  return xcrequest<XC.Response.SingleResult<API.CurrentUser>>('/api/user/getCurrentUser', {
    method: 'POST',
    data
  }).then(resp => resp);
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams) {
  return xcrequest<API.LoginResult>('/api/user/login', {
    method: 'POST',
    data: body,
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}
