import Vue from 'vue';
import axios from 'axios';
// @ts-ignore
import qs from 'qs';
import { baseURL, domain, ENV, pushURL } from "../config";
import { MimeStorage } from "@/utils/localStorage";
// 取消请求
const CancelToken = axios.CancelToken;
// 是否需要拦截code==-1的状态
let isLog = false;
// 设置默认请求头
axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded',
};
axios.defaults.baseURL = baseURL;
// 请求超时的时间限制
axios.defaults.timeout = 20000;
// 开始设置请求 发起的拦截处理
// config 代表发起请求的参数的实体
let requestName;
axios.interceptors.request.use((config) => {
    const mimeStorage = new MimeStorage();
    let sessionStorageToken = mimeStorage.getItem('token') || sessionStorage.getItem('token');
    config.headers.token = sessionStorageToken;
    // 得到参数中的 requestName 字段，用于决定下次发起请求，取消对应的 相同字段的请求
    // 如果没有 requestName 就默认添加一个 不同的时间戳
    if (config.method === 'post') {
        if (config.data && qs.parse(config.data).requestName) {
            requestName = qs.parse(config.data).requestName;
        }
        else {
            requestName = new Date().getTime();
        }
        if (config.data.indexOf('isLog') !== -1) {
            isLog = true;
        }
    }
    else {
        if (config.params && config.params.requestName) {
            requestName = config.params.requestName;
        }
        else {
            requestName = new Date().getTime();
        }
        if (config.params.isLog) {
            isLog = true;
        }
    }
    // 判断，如果这里拿到的参数中的 requestName 在上一次请求中已经存在，就取消上一次的请求
    if (requestName) {
        // @ts-ignore
        if (axios[requestName] && axios[requestName].cancel) {
            // @ts-ignore
            axios[requestName].cancel('取消了请求');
        }
        config.cancelToken = new CancelToken((c) => {
            // @ts-ignore
            axios[requestName] = {};
            // @ts-ignore
            axios[requestName].cancel = c;
        });
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
const casBaseURL = /^(http:\/\/|https:\/\/)/.test(ENV.casDomain) ?
    ENV.casDomain :
    domain + ENV.casDomain;
// 请求到结果的拦截处理
axios.interceptors.response.use((config) => {
    if (config.data && config.data.code && config.data.code == 30000) {
        const url = location.origin + location.pathname;
        // @ts-ignore
        window.location.href = casBaseURL + '?redirectUrl=' + url;
    }
    return config.data;
}, (error) => {
    return Promise.reject(error);
    // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息
});
// 将axios 的 post 方法，绑定到 vue 实例上面的 $post
export const $post = (url, params, server = 'wbw') => {
    axios.defaults.baseURL = getBaseUrl(server);
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(params)).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
};
// 将axios 的 get 方法，绑定到 vue 实例上面的 $get
export const $get = (url, params, server = 'wbw') => {
    axios.defaults.baseURL = getBaseUrl(server);
    return new Promise((resolve, reject) => {
        axios.get(url, { params }).then((res) => {
            resolve(res); // 返回请求成功的数据 data
        }).catch((err) => {
            reject(err);
        });
    });
};
function getBaseUrl(name) {
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
//# sourceMappingURL=feth.js.map