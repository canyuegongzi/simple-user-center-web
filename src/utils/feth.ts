import Vue from 'vue';
import axios from 'axios';
// @ts-ignore
import qs from 'qs';
// @ts-ignore
import UAParser from 'ua-parser-js';
import {baseURL, domain, ENV, pushURL} from "../config";
import {MimeStorage} from "@/utils/localStorage";
import {uniqueFethUrl} from "@/utils/authApi";
// 取消请求
const CancelToken = axios.CancelToken;
// 是否需要拦截code==-1的状态
let isLog: boolean = false;
// 设置默认请求头
axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest',
   //  'Content-Type': 'application/x-www-form-urlencoded',
};
axios.defaults.baseURL = baseURL;
// 请求超时的时间限制
axios.defaults.timeout = 20000;
// 开始设置请求 发起的拦截处理
// config 代表发起请求的参数的实体
let requestName: any;
axios.interceptors.request.use((config: any) => {
    const mimeStorage = new MimeStorage();
    let sessionStorageToken: any = mimeStorage.getItem('token') || sessionStorage.getItem('token');
    config.headers.token = sessionStorageToken;
    if (process.env.NODE_ENV !== 'production') {
        config.headers.ignoreToken = 'true'
    }
    // 得到参数中的 requestName 字段，用于决定下次发起请求，取消对应的 相同字段的请求
    // 如果没有 requestName 就默认添加一个 不同的时间戳
    if (config.method === 'post') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'

    }
    return config;
}, (error: any) => {
    return Promise.reject(error);
});
const casBaseURL = /^(http:\/\/|https:\/\/)/.test(ENV.casDomain) ?
    ENV.casDomain :
    domain + ENV.casDomain;
// 请求到结果的拦截处理
axios.interceptors.response.use( (config: any) => {
    if (config.data && config.data.code && config.data.code == 30000) {
        const url = location.origin + location.pathname;
        // @ts-ignore
        window.location.href = casBaseURL + '?redirectUrl=' + url;
    }
    return config.data;
}, (error: any) => {
    if (error.message = 'NO API PERMISSION') {
        return Vue.prototype.$Message({
            type: 'waring',
            message: '抱歉，您暂无该接口资源权限，请联系管理员'
        })
    }
    return Promise.reject(error);
    // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
});
// 将axios 的 post 方法，绑定到 vue 实例上面的 $post
export const $post = async (url: any, params: any, server: any =  'wbw') => {
    const flag = await alowFeth(url);
    axios.defaults.baseURL = getBaseUrl(server);
    return new Promise((resolve, reject) => {
        if (!flag) {
            // reject(new Error('NO API PERMISSION'));
            return Vue.prototype.$message({
                type: 'waring',
                message: '抱歉，您暂无该接口资源权限，请联系管理员'
            })
        }
        axios.post(url, qs.stringify(params)).then((res: any) => {
            resolve(res);
        }).catch((err: any) => {
            reject(err);
        });
    });
};
// 将axios 的 get 方法，绑定到 vue 实例上面的 $get
export const $get =  (url: any, params: any, server: any =  'wbw') => {
    axios.defaults.baseURL = getBaseUrl(server);
    return new Promise((resolve, reject) => {
        axios.get(url, { params }).then((res: any) => {
            resolve(res); // 返回请求成功的数据 data
        }).catch((err: any) => {
            reject(err);
        });
    });
};

// 将axios 的 get 方法，绑定到 vue 实例上面的 $get
export const $getFile =  (url: any, params: any, server: any =  'wbw') => {
    axios.defaults.baseURL = getBaseUrl(server);
    return new Promise((resolve, reject) => {
        axios.get(url, { params, responseType: 'arraybuffer', }).then((res: any) => {
            resolve(res); // 返回请求成功的数据 data
        }).catch((err: any) => {
            reject(err);
        });
    });
};
/**
 * 接口验证
 * @param verificationUrl
 */
const alowFeth = (verificationUrl: string) => {
    return new Promise(((resolve, reject) => {
        const flag = uniqueFethUrl(verificationUrl);
        console.log(verificationUrl)
        resolve(flag);
    }))

}
function getBaseUrl(name: string) {
    switch (name) {
        case 'wbw':
            return baseURL;
        case 'push':
            return pushURL;
        default:
            return baseURL;
    }
}
Vue.prototype.$post = $post;
Vue.prototype.$get = $get;
