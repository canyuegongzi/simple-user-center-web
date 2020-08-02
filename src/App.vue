<style lang="stylus">
</style>
<template lang="pug">
  div(id="root-view")
    el-container(style="height: 100%")
      el-aside(width="200px" style="height: 100%" v-if="showMenus" :class="{absolute: /^\\/map/.test($route.path)}")
        Aside(:menus="menus")
      el-container()
        el-header#root-header(v-if="showMenus" :class="{absolute: /^\\/map/.test($route.path)}")
            Header()
        el-main(style="padding: 0")
            el-scrollbar(style="height:100%;" class="fpi-scroll")
                router-view(id="root-main")
</template>
<script lang="ts">
  import "@/styles/app.styl";
  import "@/styles/yf.styl";
  import { Component, Vue } from 'vue-property-decorator';
  import Aside from '@/components/aside/Index.vue';
  import Header from '@/components/header/Index.vue';
  import {data} from "@/components/aside/nav";
  import {$post} from "@/utils/feth";
  import {MimeStorage} from "@/utils/localStorage";
  @Component({
    components: {
      Aside,
      Header,
    },
  })
  export default class App extends Vue {
    public menus: any = data.list;
    private token: any;
    public async getUserInfo() {
        try {
            const res: any = await $post('/user/findUserToken', {token: this.token})
            Vue.prototype._user = res.data.data
            Vue.prototype.user = res.data.data
        }catch (e) {
            console.log(e);
        }
    }
    public get showMenus() {
        // @ts-ignore
        if (window.__POWERED_BY_QIANKUN__ !== undefined) {
            // @ts-ignore
            return !window.__POWERED_BY_QIANKUN__
        }
        // @ts-ignore
        return (!this.session$.hideMenus)
    }
    private created() {
        const mimeStorage = new MimeStorage();
        const token: any = mimeStorage.getItem('token');
        this.token = token
        this.getUserInfo()
    }
  }
</script>
<style lang="stylus" scoped>
    .fade-enter-active .fade-leave-active
        transition opacity .5s
    .fade-enter .fade-leave-active
        opacity 0

    .transitionRouter-enter-active .transitionRouter-leave-active
        transition all 0.4s
    .transitionRouter-enter .transitionRouter-leave
        transform translate3d(100%, 0, 0)
</style>

