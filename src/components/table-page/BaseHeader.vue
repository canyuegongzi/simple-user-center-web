<template lang="pug">
    .header.flex
        .flex
            el-breadcrumb(class="crumbs")
                el-breadcrumb-item {{title}}
        div(v-if="isShowTool")
            el-button(size="mini" type="success"  @click="editRow") 新增
            el-button(v-if="isDelete" size="mini" type="danger" @click="deleteRow") 删除所选
        div(v-if="isCustomTool")
            el-button(size="mini" :type="customConfig.type"  @click="customEvent") {{customConfig.desc}}
</template>

<script lang="ts">
  import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
  @Component
  export default class BaseHeader extends Vue {
    @Prop({ default: '' })
    public title: string | undefined;
    @Prop({ default: true })
    public isShowTool: boolean | undefined;
    @Prop({ default: true })
    public isDelete: boolean | undefined;
    @Prop({ default: false })
    public isCustomTool: boolean | undefined;
    @Prop({ default: () => ({ desc: '保存', type: 'success'}) })
    public customConfig: any;

    @Emit('editRow')
    public editRow(): any {
      return 'editRow';
    }

    @Emit('deleteRow')
    public deleteRow(): any {
      return 'deleteRow';
    }

    @Emit('customEvent')
    public customEvent(msg: string): any {
      return msg;
    }
  }
</script>

<style lang="stylus" scoped>
    .header
        padding 0 0 0 8px
</style>
