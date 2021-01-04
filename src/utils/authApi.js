// 获取当前角色的接口权限
// http://148.70.150.131:9002/simple-user-center/v1.0/role/authApiByRole?id=4
// 获取系统的全部接口
// http://148.70.150.131:9002/simple-user-center/v1.0/apiResource/resource/list?page=1&pageSize=10&name=&system=GATEWAYCODE
import { $get, $post } from "@/utils/feth";
const yetApi = ['/user/findUserToken', '/user/loginOut', '/user/getUserInfo', '/role/authApiByRole', '/apiResource/resource/list'];
/**
 * 获取用户信息
 * @param token
 */
export const getUserInfo = async (token) => {
    let user = {};
    try {
        // getUserInfo
        const res = await $post('/user/findUserToken', { token: token }, 'scus');
        console.log(res);
        user = { ...res.data.data };
        console.log(user);
    }
    catch (e) {
        console.log(e);
    }
    return user;
};
/**
 * 获取资源列表
 */
export const getApiResource = async (token) => {
    let urlList = [];
    let userRole = [];
    const userInfo = await getUserInfo(token);
    try {
        const res = await $get('/role/authApiByRole', { id: userInfo.role.id }, 'scus');
        userRole = res && res.data ? res.data : [];
    }
    catch (e) {
        console.log(e);
        userRole = [];
    }
    try {
        const res = await $get('/apiResource/resource/list', { system: 'BSPCODE', page: 1, pageSize: 100 }, 'scus');
        const list = res && res.data && res.data.data ? res.data.data.data : [];
        list.forEach((item, index) => {
            if (userRole.includes(item.id)) {
                urlList.push(item.value);
            }
        });
    }
    catch (e) {
        urlList = [];
    }
    return urlList.concat(yetApi);
};
/**
 * 验证用户权限
 * @param str
 * @param list
 */
export const uniqueFethUrl = (str) => {
    // @ts-ignore
    const list = window.__BSPAPIRESURCE__ || yetApi;
    const api = str.split('?')[0];
    return list.includes(api);
};
//# sourceMappingURL=authApi.js.map