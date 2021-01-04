// 生产环境
export const ENV = {
    domain: 'http://148.70.150.131',
    casDomain: 'http://canyuegongzi.xyz/user-login-cas-web', //cas服务
    userBaseWeb: 'http://148.70.150.131:9002/simple-user-center/v1.0',
    // userBaseWeb: 'http://127.0.0.1:8881/simple-user-center/v1.0',
    pushBaseWeb: 'http://148.70.150.131:9002/simple-notice-center/v1.0',
    webHomePage: '/wgms-base-web', //cas跳转地
}
// @ts-ignore
window.USERENV = ENV
