<template lang="pug">
    .content
        slot(name="table-tools")
        .content-title {{tableTitle}}
        .content-main
            el-table(:data="tableData" border size="mini" v-if="!customTable" ref="dataTable" @selection-change="handleSelectionChange")
                el-table-column(type="selection" v-if="allowDelete" width="50" align="center" :selectable="allowDeleteData")
                el-table-column( v-if="allowIndex" width="80" align="center" label="序号")
                    template(slot-scope="scope")
                        span {{scope.$index + 1}}
                template(v-for="item in dataFormat")
                    el-table-column(:label="item.label" :prop="item.prop" :width="item.width" align="center" )
                        template(slot-scope="scope")
                            template(v-if="item.prop==='color'")
                                template(v-if="scope.row.color != null")
                                    div(class='color-box' :style='`background-color:${scope.row.color}`')
                            template(v-else)
                                div(v-if="filters[item.prop]") {{scope.row[item.prop]}}
                                div(v-else) {{scope.row[item.prop]}}
                el-table-column(label="操作"  align="center" width="140" v-if="isHandle")
                    template( slot-scope="scope")
                        a( v-show="allowEdit" class="operate edit" @click="editRow(scope)") 编辑
                        a(v-show="allowDeleteData(scope.row)" class="operate delete" @click="deleteRow(scope)") 删除
                        a(v-show="isGiveAuth" class="operate delete" @click="giveAuth(scope)") 授权
                        a(v-show="isPerson" class="operate delete" @click="givePerson(scope)") 成员
            template(v-if="customTable")
                slot(name="custom-table")
        .pagination.txt-right
            slot(name="table-pagination")
</template>
<script lang="ts">
  import {Vue, Prop, Watch, Emit, Component, Ref} from 'vue-property-decorator';
  @Component
  export default class BaseTable extends Vue {
    @Prop({ default: 'id' })
    public checkedLabel!: string;
    @Prop()
    public dataFormat: [] | undefined;
    @Prop({ default: [] })
    public tableData: any;
    @Prop({ default: () => true })
    public allowDelete!: boolean;
    @Prop({ default: '' })
    public tableTitle!: string;
    @Prop({ default: () => false })
    public allowIndex!: boolean;
    @Prop({ default: () => true })
    public isHandle!: boolean;
    @Prop({ default: () => true })
    public allowEdit!: boolean;
    @Prop({ default: () => false })
    public customTable!: boolean;
    @Prop({ default: false })
    public isGiveAuth!: boolean;
    @Prop({ default: false })
    public isPerson!: boolean;
    @Prop({ default: () => ({}) })
    public filters: any ;
    @Prop({ type: Function, default: () => { return {}; }})
    public handleSelectionChange: any;
    @Prop({ type: Function, default: () => true })
    public allowDeleteData: any;
    @Prop({ type: Array, default: () => { return []; }})
    public checkedArr: any;

    private tableDataOptions = [];

    @Watch('tableData', { deep: true, immediate: false })
    public tableDataChange(val: any, oldVal: any) {
      this.tableDataOptions = val;
      this.checked();
    }

    @Watch('checkedArr', { deep: true, immediate: false })
    public checkedArrChange(val: any, oldVal: any) {
      this.checkedArr = val;
      if (val.length === 0) {
        this.clearChecked();
      }
    }

    @Emit('editRow')
    public editRow(data: any): any {
      return data;
    }

    @Emit('givePerson')
    public givePerson(data: any): any {
      return data;
    }

    @Emit('deleteRow')
    public deleteRow(data: any): any {
      return data;
    }

    @Emit('giveAuth')
    public giveAuth(data: any): any {
      return data;
    }

    /**
     * 选中
     */
    private checked() {
      const data = this.tableDataOptions;
      const checkedArr = this.checkedArr;
      this.$nextTick(() => {
        data.forEach((item: any, index: number) => {
          for (let i = 0, len = checkedArr.length; i < len; i++) {
            if (Number(checkedArr[i]) == Number(item[this.checkedLabel])) {
              const ref: any = this.$refs.dataTable;
              ref.toggleRowSelection(this.tableDataOptions[index]);
            }
          }
        });
      });
    }

    /**
     * 清楚选中
     */
    private clearChecked() {
      this.$nextTick(() => {
        const ref: any = this.$refs.dataTable;
        ref.clearSelection();
      });
    }

    private created() {
      console.log('组件初始化');
    }

    private mounted() {
      this.$nextTick(() => {
        if (this.checkedArr.length !== 0) {
          this.checked();
        }
      });
    }
  }
</script>

<style lang="stylus" scoped>
    .content
        .content-title
            padding-left 8px
        .color-box
            width 20px
            height 20px
            margin 0 auto
        .search-items
            display flex
            justify-content space-between
            .search-item
                display flex
            .el-select
            .el-input
                margin-right 8px
            .el-input
                width 200px
            .el-select
                width 144px
    .pagination
        margin: 16px 0 0 0
</style>
