import { getRouter, route as allMenus } from './router';
import {getURLParameters} from '@/utils/url-params';
import Storage from '@/utils/storage';

export const session$ = {
    token: '',
    menus: [],
    hideMenus: false,
};

export const escapeCheckSession$ = () =>  {
    const params: any = getURLParameters(window.location.href);
    const sessionStorageToken: any = sessionStorage.getItem('token') || localStorage.getItem('token');
    // if (sessionStorageToken === "null" || !sessionStorageToken) {
    //     if (params.token) {
    //         sessionStorageToken = params.token;
    //     } else {
    //         const url = location.href;
    //         // @ts-ignore
    //         window.location.replace(window.ENV.domain + window.ENV.casDomain + '?redirectUrl=' + url);
    //     }
    // }
    console.log(sessionStorageToken);
    return new Promise((resolve) => {
        const token = sessionStorageToken;
        Object.assign(session$, { hideMenus: false });
        Object.assign(session$, { token });
        localStorage.setItem('token', sessionStorageToken);
        resolve(getRouter(allMenus));
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
