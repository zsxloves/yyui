export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: '登录',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  // {
  //   path: '/welcome',
  //   name: 'welcome',
  //   icon: 'smile',
  //   component: './Welcome',
  // },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //     {
  //       component: './404',
  //     },
  //   ],
  // },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  {
    name: '首页',
    icon: 'table',
    path: '/screen',
    component: './BigScreen',
    layout: false,
  },
  {
    name: 'list.new-screen',
    icon: 'table',
    path: '/newscreen',
    component: './NewScreen',
    layout: false,
  },
  {
    name: 'list.big-screenTwo',
    icon: 'table',
    path: '/screenTwo',
    component: './BigScreenTwo',
    layout: false,
  },
  {
    name: 'list.big-screenThree',
    icon: 'table',
    path: '/screenThree',
    component: './BigScreenThree',
    layout: false,
  },
  // {
  //   name: 'list.test-demo',
  //   icon: 'table',
  //   path: '/demo',
  //   component: './TestDemo',
  // },
  {
    path: '/',
    redirect: '/screen',
  },
  {
    name: '线路安保',
    icon: '',
    path: '/abLine',
    component: './AbLine',
    layout: false,
    // 隐藏菜单栏
    menuRender: false,
    // 隐藏菜单
    hideInMenu: true,
  },
  {
    component: './404',
  },
];
