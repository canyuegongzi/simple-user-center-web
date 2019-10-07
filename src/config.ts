// @ts-ignore
import DC from 'json-loader';
// @ts-ignore
const ENV = window.ENV;

// 是否是内网环境
const innerNet =  process.env.NODE_ENV === 'dev' ? true : /^(192|0|127|172|localhost)/.test(location.hostname);

// 当前域名
let domain = ENV.domain;
if (ENV.domain) {
  domain = ENV.domain;
} else {
  domain = location.protocol + '//' + location.host;
}

// 水环境基础信息管理系统
const baseURL = /^(http:\/\/|https:\/\/)/.test(ENV.wgmsBaseWeb) ?
  getDomain(ENV.wgmsBaseWeb, innerNet) :
  domain + ENV.wgmsBaseWeb;

// 用户接口地址
const userBaseURL = /^(http:\/\/|https:\/\/)/.test(ENV.userDomain) ?
  getDomain(ENV.userDomain, innerNet) :
  domain + ENV.userDomain;

// 文件服务
const fileBaseURL = /^(http:\/\/|https:\/\/)/.test(ENV.userDomain) ?
  getDomain(ENV.userDomain, innerNet) :
  domain + ENV.userDomain;

// 权限服务地址
const permissionBaseURL = /^(http:\/\/|https:\/\/)/.test(ENV.permissionDomain) ?
  getDomain(ENV.permissionDomain, innerNet) :
  domain + ENV.permissionDomain;

// cas单点登录地址
const casBaseURL = /^(http:\/\/|https:\/\/)/.test(ENV.casDomain) ?
  getDomain(ENV.casDomain, innerNet) :
  domain + ENV.casDomain;

// 当前前端页面地址
const webHomePage = /^(http:\/\/|https:\/\/)/.test(ENV.webHomePage) ?
  getDomain(ENV.webHomePage, innerNet) :
  domain + ENV.webHomePage;

// 当前web页面访问地址
const webHomePageStr =  encodeURIComponent(webHomePage);

// 未登录，跳转到cas登录地址
const bspURL = `${casBaseURL}/login?service=${userBaseURL}/userCenter/auth/authUser?redirectUrl=${webHomePageStr}`;

export  {
  innerNet,
  domain,
  baseURL,
  casBaseURL,
  bspURL,
  userBaseURL,
  fileBaseURL,
  permissionBaseURL,
  webHomePage,
  DC,
  ENV,
};

function getDomain(domainStr: string, innerNets?: boolean): string {
  const domains = domainStr.split('|');
  return innerNet ? domains[0] : domains[1];
}
