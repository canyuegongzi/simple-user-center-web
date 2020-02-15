<style lang="stylus">
</style>
<template lang="pug">
  div(id="root-view")
    el-container(style="height: 100%")
      el-aside(width="200px" style="height: 100%" v-if="!session$.hideMenus" :class="{absolute: /^\\/map/.test($route.path)}")
        Aside(:menus="menus")
      el-container()
        el-header#root-header(v-if="!session$.hideMenus" :class="{absolute: /^\\/map/.test($route.path)}")
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
  @Component({
    components: {
      Aside,
      Header,
    },
  })
  export default class App extends Vue {
    public menus: any = data.list;
    private created() {
      console.log('app组价初始化');
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

