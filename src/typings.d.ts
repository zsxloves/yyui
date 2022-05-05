declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';
declare module '@jiaminghi/data-view-react/es/scrollBoard';
declare module '@jiaminghi/data-view-react/es/fullScreenContainer';
declare module 'js-md5';
declare module 'jsonloop';
declare module 'react-grid-layout';
declare module 'react-apng';

declare interface Window {
  Hls: any;
  clickBtn: (videoId: any) => void;
}
// declare module 'postcss-px2rem';
declare let mars3d;
declare let Cesium;

declare let urlencode;
declare let liMarquee;
// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design Dedicated environment variable, please do not use it in your project.
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;
