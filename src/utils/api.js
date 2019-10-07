
import Vue from 'vue'
import { Message } from 'element-ui'
import Qs from 'qs'
import UAParser from 'ua-parser-js'
import {baseURL, bspURL, fileBaseURL, permissionBaseURL, userBaseURL} from "../config";
const axios = require('axios')
axios.defaults.withCredentials = false;
axios.defaults.baseURL = baseURL
Vue.prototype.rootUrl = baseURL
const CACHE = new Map()
const HEADER = { CACHE: 'X-Cache', QUIET: 'X-Quiet' }

let redirected = false

let { name: browserName } = new UAParser().getBrowser()
axios.interceptors.request.use(config => {
  if (!/(arcgis|7xp3u9)/.test(config.url)) { // arcgis相关请求，不加token
    config.headers.token = localStorage.getItem('token') || ''
  }

  return config
})

// @ts-ignore
axios.interceptors.response.use(
    resp => {
      const { code, data, message } = resp.data
      const quiet = resp.config.headers[HEADER.QUIET]
      if (code === 200 || Number(code) > 600 || typeof code != 'number') {
        if (resp.config.method === 'get') {
          const cacheId = resp.config.headers[HEADER.CACHE]
          if (cacheId) {
            CACHE.set(cacheId, data)
          }
        } else if (!quiet) {

          // Message.success({ message: '操作成功', duration: 2000 })
        }
        return data ?  resp.data : resp.data
        // 特殊处理code字段
      } else if (code === 400) { //需要登录
        if (!redirected) {
          location.href = bspURL
        }
        redirected = true
      } else if (code && code < 1000) {
        !quiet && Message.info({ message: message || '数据异常，请稍后再试' })
        return Promise.reject(resp.data)
      } else {
        return Promise.resolve(resp.data)
      }
    }, ({ response }) => {
      const { status, data } = response
      if (typeof eval('handle_' + status) === 'function') {
        eval('handle_' + status)(data)
      }
      else {
        Message.error({ message: '服务异常，请稍后再试' })
      }
    }
)

const parseReq = (path, method = 'get', params = {}) => {
  let headers = {}
  if(browserName === 'IE') { //ie浏览器强行去除缓存
    params.timeStamp = new Date().getTime()
  }
  if (/^!/.test(path)) {
    if (method === 'get') {
      headers[HEADER.CACHE] = path + Qs.stringify(params)
    }
    //所有请求均添加静默请求
    headers[HEADER.QUIET] = true

  }
  return [path.replace(/^!/, ''), headers]
}

export const $get = (path, params = {}, server = 'wbw') => {
  const [url, headers] = parseReq(path, 'get', params)
  const cacheId = headers[HEADER.CACHE]
  axios.defaults.baseURL = getBaseUrl(server)
  // 调用系统用后服务，忽略token
  if(server == 'scus') {
    axios.defaults.headers.get = {'ignore-token': true}
  }
  if (cacheId && CACHE.has(cacheId)) {
    return Promise.resolve(CACHE.get(cacheId))
  } else {
    return axios({ url, params, headers })
  }
}

export const $post = (path, data = {}, server = 'wbw') => {
  const [url, headers] = parseReq(path, 'post')
  // 调用系统用后服务，忽略token
  if(server == 'scus') {
    axios.defaults.headers.post = Object.assign(axios.defaults.headers.post, {'ignore-token': true})
  }
  console.log(server)
  axios.defaults.baseURL = getBaseUrl(server)
  console.log(axios.defaults.baseURL)
  return axios({ url, data: data, method: 'post', headers })
}

export const $put = (path, data = {}, server = 'wbw') => {
  const [url, headers] = parseReq(path, 'put')
  axios.defaults.baseURL = getBaseUrl(server)
  return axios({
    url,
    data: Qs.stringify(data),
    method: 'put',
    headers
  })
}

export const $delete = (path, data = {}, server = 'wbw') => {
  const [url,
    headers
  ] = parseReq(path, 'delete')
  axios.defaults.baseURL = getBaseUrl(server)
  return axios({ url, data, method: 'delete', headers })
}
function getBaseUrl(name) {
  console.log(name)
  switch (name) {
    case 'wbw':
      return baseURL
    case 'scus':
      return `${userBaseURL}/api/v1.0`
    case 'files':
      return fileBaseURL
    case 'bsps':
      return permissionBaseURL
    default:
      return baseURL

  }
}
Vue.use({
  install(Vue) {
    Vue.prototype.$get = $get

    Vue.prototype.$post = $post

    Vue.prototype.$put = $put

    Vue.prototype.$delete = $delete
  }
})
