import Router from 'vue-router';
import { RouteItem } from '@/type/route';
import {Message} from 'element-ui';
import Storage from '@/utils/storage';
export const route = [
    {
      path: '/',
      redirect: {
        name: 'user-index',
      },
    },
    {
      path: '/login',
      name: 'user-login',
      component: () => import( './views/login/Index.vue'),
    },
    {
      path: '/userManage/userList',
      name: 'user-index',
      component: () => import( './views/user/Index.vue'),
    },
    {
      path: '/roleManage/roleList',
      name: 'role-index',
      component: () => import('./views/role/Index.vue'),
    },
    {
      path: '/roleManage/authList',
      name: 'role-index',
      component: () => import('./views/auth/Index.vue'),
    },
    {
        path: '/roleManage/giveAuth',
        name: 'giveAuth-index',
        component: () => import('./views/giveAuth/GiveAuth.vue'),
    },
    {
        path: '/roleManage/apiList',
        name: 'api-index',
        component: () => import('./views/apiResource/Index.vue'),
    },
    {
      path: '/organManage/organList',
      name: 'role-index',
      component: () => import('./views/organization/Index.vue'),
    },
    {
      path: '/systemManage/systemList',
      name: 'system-index',
      component: () => import('./views/system/Index.vue'),
    },
  ];

function beforeEach(to: { matched: { length: number; }; }, from: any, next: () => void) {
  if (to.matched.length > 0) {
    const location = window.location;
    const token: string =  Storage.localGet('token') || '';
    if (!token) {
      const url = location.href;
        // @ts-ignore
      window.location.replace(window.USERENV.domain + window.USERENV.casDomain + '?redirectUrl=' + url);
    } else {
      next();
    }
    next();

  } else {
    Message.error('没有相应的权限，请联系管理员！');
  }
}

export const getRouter = (allMenus: RouteItem[]) => {
  const router = new Router({routes: route});
  router.beforeEach(beforeEach);
  return router;
};

