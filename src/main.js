import Vue from 'vue';
import App from './App.vue';
import store from './store';
import ElementUI from 'element-ui';
import { getRouter, route as allMenus } from './router';
import "./public-path";
import Router from 'vue-router';
import './env.ts';
import '../src/utils/feth';
import session, { escapeCheckSession$ } from './session';
import 'element-ui/lib/theme-chalk/index.css';
import { global } from './utils/mixin';
import treeTransfer from 'el-tree-transfer';
import ElTreeSelect from 'el-tree-select';
import Vue2OrgTree from 'vue2-org-tree';
import 'vue2-org-tree/dist/style.css';
import iconPicker from 'vue-fontawesome-elementui-icon-picker';
// @ts-ignore
Vue.use(iconPicker);
Vue.use(ElementUI);
Vue.use(Router);
// @ts-ignore
Vue.use(ElTreeSelect);
Vue.mixin(global);
Vue.mixin(session);
Vue.config.productionTip = false;
Vue.component('tree-transfer', treeTransfer);
Vue.component('vue2-org-tree', Vue2OrgTree);
let router = null;
let instance = null;
// @ts-ignore
function render({ data = {}, container } = {}) {
    console.log(container);
    instance = new Vue({
        router: getRouter(allMenus),
        store,
        render: h => h(App),
    }).$mount("#app");
}
// @ts-ignore
if (!window.__POWERED_BY_QIANKUN__) {
    escapeCheckSession$().then((router) => {
        instance = new Vue({
            router,
            store,
            render: (h) => h(App),
        }).$mount("#app");
    });
}
//测试全局变量污染
// @ts-ignore
console.log('window.a', window.a);
export async function bootstrap() {
    console.log('vue app bootstraped');
}
export async function mount(props) {
    console.log('props from main framework');
    render(props);
}
export async function unmount() {
    instance.$destroy();
    instance.$el.innerHTML = "";
    instance = null;
    router = null;
}
//# sourceMappingURL=main.js.map