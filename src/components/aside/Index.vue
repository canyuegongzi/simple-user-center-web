<template lang="pug">
    .container
        el-scrollbar(style="height:100%;" class="fpi-scroll")
            el-menu(default-active="0" class="el-menu-vertical-demo" @select="menuSelected" background-color="#19202e"
                text-color="#ffffff" active-text-color="#1989f8")
                SlideTree(:navMenus="menus")
</template>

<script lang="ts">
  import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
  import SlideTree from '@/components/aside/SlideTree.vue';
  @Component({
    components: {
      SlideTree,
    },
  })
  export default class Aside extends Vue {
    @Prop({
      default: [],
    })
    private menus: any;

    private created() {
      console.log('组件初始化');
    }

    private menuSelected(val: (number | string), indexPath: string[] ) {
      try {
        if (this.$route.path != '/' + indexPath.join('/')) {
          this.$router.push('/' + indexPath.join('/'));
        }
      } catch (e) {
        return true;
      }
    }
  }
</script>

<style lang="stylus" scoped>
.container
    height 100%
    width 100%
    background-color #19202e
    .el-menu-vertical-demo
        height 100%
</style>
