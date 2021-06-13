import { getRouter, route as allMenus } from './router';
import { getURLParameters } from '@/utils/url-params';
import { MimeStorage } from '@/utils/localStorage';
import QS from 'query-string';
import { getApiResource } from "@/utils/authApi";
export const session$ = {
    token: '',
    menus: [],
    hideMenus: false,
};
// @ts-ignore
const casBaseURL = window.USERENV.casDomain;
export const router = getRouter(allMenus);
export const escapeCheckSession$ = () => {
    return new Promise(async (resolve) => {
        const mimeStorage = new MimeStorage();
        const params = getURLParameters(window.location.href);
        const uriSplit = decodeURI(location.href).split('?token=');
        const [href, search] = location.href.split('?');
        const { hideMenus } = QS.parse(search);
        Object.assign(session$, { hideMenus: hideMenus === 'true' });
        console.log(session$);
        let sessionStorageToken = mimeStorage.getItem('token') || sessionStorage.getItem('token');
        const arr = location.href.split('?token');
        if (uriSplit[1]) {
            sessionStorageToken = uriSplit[1].indexOf('#/') > -1 ? uriSplit[1].split('#/')[0] : uriSplit[1];
            mimeStorage.setItem({ name: 'token', value: sessionStorageToken, expires: 120 * 60 * 1000 });
            Object.assign(session$, { token: sessionStorageToken });
            location.href = uriSplit[0];
        }
        if (sessionStorageToken === "null" || !sessionStorageToken) {
            debugger;
            const url = location.origin + location.pathname;
            const sss = casBaseURL + '?redirectUrl=' + url;
            console.log(sss);
            // @ts-ignore
            window.location.href = sss;
        }
        const token = sessionStorageToken;
        const apiUrl = await getApiResource(token);
        // @ts-ignore
        window.__BSPAPIRESURCE__ = Object.freeze(apiUrl);
        Object.assign(session$, { hideMenus: hideMenus === 'true' });
        Object.assign(session$, { token });
        mimeStorage.setItem({ name: 'token', value: sessionStorageToken, expires: 120 * 60 * 1000 });
        resolve(router);
        Object.assign(session$, { menus: allMenus });
    });
};
export default {
    data() {
        return {
            session$,
        };
    },
};
//# sourceMappingURL=session.js.map