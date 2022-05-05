import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
// import Footer from '@/components/Footer';
// import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import type { RequestConfig } from '@@/plugin-request/request';
import type { RequestOptionsInit, ResponseInterceptor, ResponseError } from 'umi-request';
import { currentUser, login } from '@/services/console/api';
// import { message } from 'antd';

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  login?: (body: API.LoginParams) => Promise<void>;
}> {
  const fetchUserInfo = async () => {
    try {
      const result = await currentUser({});

      const { loginToken } = result as any;
      if (loginToken) {
        localStorage.setItem('loginId', loginToken);
      }
      return result;
    } catch (error) {
      console.log(error)
      history.replace(loginPath);
    }
    return undefined;
  };
  const userLogin = async (body: API.LoginParams) => {
    // 登录
    const loginResult = await login(body);
    console.log('loginResult', loginResult);
    localStorage.setItem('loginId', loginResult.loginToken);
  };

  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    if (history.location.query?.Token) {
      localStorage.setItem('loginId', history.location.query?.Token as string);
    }
    const user = await fetchUserInfo();
    return {
      fetchUserInfo: fetchUserInfo as any,
      currentUser: user as API.CurrentUser,
      settings: {},
      login: userLogin,
    };
  } else {
    let a = 0;
    let user;
    if (a === 0) {
      user = await fetchUserInfo();
      a++;
    }
    return {
      fetchUserInfo: fetchUserInfo as any,
      currentUser: user as API.CurrentUser,
      settings: {},
      login: userLogin,
    };
  }
}

// 请求认证拦截
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  if (url.startsWith('/api')) {
    // const timestamp = new Date().getTime()
    const authHeader: HeadersInit = {
      Authorization: localStorage.getItem('loginId') || '',
      'Content-Type': 'application/json',
    };
    const req = {
      url: `/ARBIGdist${url}`,
      options: {
        ...options,
        interceptors: true,
        headers: { ...authHeader, ...options.headers },
      },
    };
    // console.log(req, options);
    // if (req.options.headers?.['Content-Type']?.startsWith('application/json') && typeof req.options?.data === 'object') {
    //   当body为JSON时 msgId和渠道标识应在body内
    //   req.options.data = {msgId: timestamp, transChannel: 'XCMC', ...req.options.data}
    // } else {
    //   其余类型 msgId和渠道标识应在query param内
    //   req.url = `${url}${url.includes('?') ? '&' : '?'}msgId=${timestamp}&transChannel=XCMC`
    // }
    return req;
  } else if (url.startsWith('/message/smap')) {
    const authHeader: HeadersInit = {
      Authorization: localStorage.getItem('loginId') || '',
      'Content-Type': 'application/json; charset:GBK',
    };
    const req = {
      url: `${url}`,
      options: {
        ...options,
        interceptors: true,
        headers: { ...options.headers, ...authHeader },
      },
    };
    return req;
  }
  return { url: `/ARBIGdist${url}`, options };
};
const errorHandler = (error: ResponseError<any>) => {
  const { response } = error;
  console.log(error);
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    console.log(`请求错误 ${status}: ${url}——${errorText}`);
    // message.error(`请求错误 ${status}: ${url}——${errorText}`);
  }

  if (!response) {
    if (Array.isArray(error)) throw error;
    if (error?.request?.url?.indexOf('zju') >= 0) return;
    if (error?.request?.url?.indexOf('/smap/iface/interface') >= 0) return;
    console.log(error.message || '您的网络发生异常，无法连接服务器');
    // message.error(error.message || '您的网络发生异常，无法连接服务器');
  }
  throw error;
};
const responseInterceptor: ResponseInterceptor = async (response: Response) => {
  if (response.status !== 200) {
    // message.error(response.statusText);
    return Promise.reject({
      ...response,
      message: response.statusText,
      code: response.status,
      success: false,
    });
  }
  if (response.headers['Content-Type'] == 'application/octet-stream') {
    return Promise.resolve(response);
  }
  let data;
  try {
    data = await response.clone().json();
    if (data.status === 200) data = { ...data, code: 200, success: true };
  } catch (err) {
    data = { ...response, message: response.statusText, code: response.status };
  }
  if (data.code === 200) {
    return Promise.resolve(response);
  } else {
    if (data.code === 10003) {
      localStorage.clear();
      sessionStorage.clear();
      history.replace({
        pathname: '/user/login',
      });
    }
    return Promise.reject(data);
  }
};
// 统一返回格式
const responseAdaptor = (resData: any) => {
  const success: boolean = resData?.code === 200 || resData?.status === 200;
  return {
    success,
    errorMessage: success ? null : resData.message,
    errorCode: success ? null : resData.code,
  };
};

export const request: RequestConfig = {
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [responseInterceptor],
  errorHandler,
  errorConfig: {
    adaptor: responseAdaptor,
  },
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    // footerRender: () => <Footer />,
    onPageChange: async () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.replace(loginPath);
      }
    },
    // links: isDev
    //   ? [
    //       <Link to="/umi/plugin/openapi" target="_blank">
    //         <LinkOutlined />
    //         <span>OpenAPI 文档</span>
    //       </Link>,
    //       <Link to="/~docs">
    //         <BookOutlined />
    //         <span>业务组件文档</span>
    //       </Link>,
    //     ]
    //   : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
