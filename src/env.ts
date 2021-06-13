// 生产环境
export const ENV = {
    domain: 'http://www.canyuegongzi.xyz',
    casDomain: 'http://www.canyuegongzi.xyz/user-login-cas-web', //cas服务
    userBaseWeb: 'http://www.canyuegongzi.xyz/simple-user-center/v1.0',
    pushBaseWeb: 'http://www.canyuegongzi.xyz/simple-notice-center/v1.0',
    webHomePage: '', //cas跳转地
}
// @ts-ignore
window.USERENV = ENV
