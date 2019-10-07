<template lang="pug">
    p
        span 这是登录页面
</template>

<script lang="ts">
  import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
  @Component
  export default class Login extends Vue {
    private created() {
      console.log('登录页面');
    }
  }
</script>

<style lang="stylus" scoped>

</style>
