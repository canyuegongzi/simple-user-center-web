<template lang="pug">
   .container
        p 内容聚合系统
        p
            el-avatar(size="small" style="margin-top: 10px;cursor: pointer" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png")
</template>

<script lang="ts">
  import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
  @Component
  export default class Header extends Vue {
    private created() {
      console.log('组件初始化');
    }
  }
</script>

<style lang="stylus" scoped>
    .container
        height 100%
        width 100%
        display flex
        justify-content space-between
        p
            line-height 48px
            display block
            font-size 16px
</style>
