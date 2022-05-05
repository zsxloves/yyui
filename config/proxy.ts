/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/ARBIGdist/api/': {
      target: 'http://20.0.6.253:33001',
      // target: 'http://10.1.8.6:33001',
      // target: 'http://218.108.98.98:11806',
      changeOrigin: true,
      pathRewrite: { '^/ARBIGdist/api': '' },
    },
    '/ARBIGdist/apis/': {
      target: 'http://20.0.6.253:33001',
      changeOrigin: true,
      pathRewrite: { '^/ARBIGdist/apis': '' },
    },
    '/ARBIGdist/message/': {
      target: 'http://10.1.8.6:8933',
      changeOrigin: true,
      pathRewrite: { '^/ARBIGdist/message': '' },
    },
    '/ARBIGdist/abrz/': {
      target: 'http://20.0.6.253:33008',
      changeOrigin: true,
      pathRewrite: { '^/ARBIGdist/abrz': '' },
    },
    '/ARBIGdist/jq/': {
      //警情
      target: 'http://20.0.6.182:9000',
      changeOrigin: true,
      pathRewrite: { '^/ARBIGdist/jq': '' },
    },
    '/ARBIGdist/newapi/': {
      //警情
      target: 'http://41.200.14.143',
      changeOrigin: true,
      pathRewrite: { '^/ARBIGdist/newapi': '' },
    },
    '/ARBIGdist/traffic/': {
      //拥堵度
      target: 'http://41.200.14.143:47970',
      changeOrigin: true,
      pathRewrite: { '^/ARBIGdist/traffic': '' },
    },
    '/ARBIGdist/parkcar/': {
      //拥堵度
      target: 'http://41.200.14.143:3000',
      changeOrigin: true,
      pathRewrite: { '^/ARBIGdist/parkcar': '' },
    },
    '/ARBIGdist/kbms/': {
      //开闭幕式
      target: 'http://172.31.0.222:8080',
      changeOrigin: true,
      pathRewrite: { '^/ARBIGdist/kbms': '' },
    },
  },
  test: {
    '/api/': {
      target: 'http://20.0.6.182:33001',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/apis/': {
      target: 'http://20.0.6.182:33001',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
