import { ENV } from './env';
// 是否是内网环境
const innerNet = process.env.NODE_ENV === 'dev' ? true : /^(192|0|127|172|localhost)/.test(location.hostname);
// 当前域名
let domain = ENV.domain;
if (ENV.domain) {
    domain = ENV.domain;
}
else {
    domain = location.protocol + '//' + location.host;
}
// 基础地址
const baseURL = /^(http:\/\/|https:\/\/)/.test(ENV.wgmsBaseWeb) ?
    ENV.wgmsBaseWeb :
    domain + ENV.wgmsBaseWeb;
// 基础地址
const pushURL = /^(http:\/\/|https:\/\/)/.test(ENV.pushBaseWeb) ?
    ENV.pushBaseWeb :
    domain + ENV.pushBaseWeb;
// cas单点登录地址
const casBaseURL = /^(http:\/\/|https:\/\/)/.test(ENV.casDomain) ?
    getDomain(ENV.casDomain, innerNet) :
    domain + ENV.casDomain;
// 当前前端页面地址
const webHomePage = /^(http:\/\/|https:\/\/)/.test(ENV.webHomePage) ?
    getDomain(ENV.webHomePage, innerNet) :
    domain + ENV.webHomePage;
// 当前web页面访问地址
const webHomePageStr = encodeURIComponent(webHomePage);
export { innerNet, domain, baseURL, casBaseURL, pushURL, ENV, };
function getDomain(domainStr, innerNets) {
    const domains = domainStr.split('|');
    return innerNet ? domains[0] : domains[1];
}
//# sourceMappingURL=config.js.map