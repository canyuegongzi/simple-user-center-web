// 生产环境
window.ENV = {
    domain: 'http://127.0.0.1',
    //domain: 'http://172.19.25.6:8092',
    casDomain: ':8080', //cas服务
    wgmsBaseWeb: 'http://127.0.0.1:8881',
    envStandardManagerWebDomain: 'http://wgms.dev.fpi-inc.site/esms/api/v1.0', // 水环境标准管理系统
    envBasicInformationManagerWebDomain: 'http://wgms.dev.fpi-inc.site/basic-information-manager-server/api/v2.0', // 环境基础信息管理系统
    permissionDomain: 'http://wgms.dev.fpi-inc.site/bsp-permission-server', //权限服务
    userDomain: 'http://wgms.dev.fpi-inc.site/simple-user-center-server',//用户服务
    webHomePage: '/wgms-base-web', //cas跳转地址
    fileDomain: '/file-base-server', // 文件服务
    sysConfig: {
        factorCategoryCode : 'w'
    }
 }
