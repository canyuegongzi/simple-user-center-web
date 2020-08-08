// 生产环境
export const ENV = {
    domain: '',
    casDomain: '', //cas服务
    wgmsBaseWeb: '/simple-user-center/v1.0',
    // wgmsBaseWeb: 'http://127.0.0.1:8881/simple-user-center/v1.0',
    pushBaseWeb: '/simple-notice-center/v1.0',
    webHomePage: '/wgms-base-web', //cas跳转地
}
// @ts-ignore
window.USERENV = ENV
