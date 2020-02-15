import Vue from 'vue';
import App from './App.vue';
import store from './store';
import ElementUI from 'element-ui';
import Router from 'vue-router';
import './env.js';
import '../src/utils/feth';
import session, { escapeCheckSession$ } from './session';
import 'element-ui/lib/theme-chalk/index.css';
import { global } from './utils/mixin';
import treeTransfer from 'el-tree-transfer';
import ElTreeSelect from 'el-tree-select';
import Vue2OrgTree from 'vue2-org-tree';
Vue.use(ElementUI);
Vue.use(Router);
// @ts-ignore
Vue.use(ElTreeSelect);
Vue.mixin(global);
Vue.mixin(session);
Vue.config.productionTip = false;
Vue.component('tree-transfer', treeTransfer);
Vue.component('vue2-org-tree', Vue2OrgTree);
escapeCheckSession$().then((router: any) => {
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
});

