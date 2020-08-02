/**
    组件说明： FormPageHeader form 表单页面的头部布局 包含一级目录和返回按钮
    pageTitle：一级目录的name
    @goBack: 点击返回事件
**/
<template lang="pug">
    .header.flex
        .flex
            el-breadcrumb(class="crumbs")
                el-breadcrumb-item {{pageTitle}}
            .back-button(style="margin-left: 8px;")
                el-button(size="mini" icon="el-icon-arrow-left" v-show="isShowButton" @click="goBack()") 返回列表
</template>

<script type="text/ecmascript-6">
export default {
    name: "FormPageHead",
    props: {
        pageTitle: {
            type: String,
            default: function () {
                return '新增'
            }
        },
        isShowButton: {
            type: Boolean,
            default: function () {
                return true
            }
        }
    },
    methods: {
        goBack() {
            this.$emit('goBack')
        }
    }
}
</script>

<style lang="stylus" scoped>
    .header
        margin 0 16px 0 16px
        .back-button
            margin-left 32px
            color #303133
            &:hover
                color #303133
</style>
