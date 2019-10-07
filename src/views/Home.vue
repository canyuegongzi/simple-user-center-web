<template lang="pug">
  el-container
    el-aside(width="200px") 边侧
    el-container()
      el-header#root-header 头部
      el-main(style="width: calc(100% - 200px")
        router-view#root-main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {}
</script>
