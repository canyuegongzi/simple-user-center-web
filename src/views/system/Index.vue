<template lang="pug">
    .container
        base-header(title="系统中心" @editRow="editRow" @deleteRow="deleteRow")
        base-table(:dataFormat="tableColumn" :isGiveAuth="false" :allowDeleteData="allowDeleteData" :tableData="tableData" @editRow="editRow" @deleteRow="deleteRow" :handleSelectionChange="handleSelectionChange")
            .search-items(slot="table-tools")
                .search-item
                    el-input(v-model="query.queryStr" @blur="getData('search')"  @keyup.enter.native="getData('search')" placeholder="请输入系统名称搜索" size="mini" suffix-icon="el-icon-search")
            el-pagination(slot="table-pagination" @size-change="handleSizeChange" :current-page.sync="currentPage"
                :page-size="pageSize"  layout="total, sizes, prev, pager, next, jumper" :total="total")
        el-dialog(:visible.sync="dialogVisible" @close="dialogClose" width="450px")
            span(slot="title") {{dialogTitle}}
            div(style="height: 320px;overflow: auto; padding: 0")
                el-scrollbar(style="height:100%;")
                    el-form(:model="systemInfo" :rules="systemInfoRules" ref="form" label-width="110px" class="input-width")
                        el-form-item(label="名称：" prop="name")
                            el-input(v-model="systemInfo.name" size="mini"  placeholder="请输入名称")
                        el-form-item(label="编码：" prop="code")
                            el-input(v-model="systemInfo.code" :disabled="dialogTitle.indexOf('编辑') > -1" size="mini"  placeholder="请输入系统编码")
                        el-form-item(label="系统值：" prop="value")
                            el-input(v-model="systemInfo.value" :disabled="dialogTitle.indexOf('编辑') > -1" size="mini"  placeholder="请输入系统值")
                        el-form-item(label="系统属性值：" prop="attrValue")
                            el-input(v-model="systemInfo.attrValue"  size="mini"  placeholder="请输入系统属性")
                        el-form-item(label="描述：" prop="desc")
                            el-input(v-model="systemInfo.desc" size="mini" placeholder="请输入描述" )
            div(slot="footer")
                el-button(@click="cancelFun" size="mini") 取消
                el-button(type="primary" @click="okFun" size="mini") 确定
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import BaseHeader from '@/components/table-page/BaseHeader.vue';
import BaseTable from '@/components/table-page/BaseTable.vue';
import {$get, $post} from '@/utils/feth';
import {authApi, systemApi} from '@/api/api';
import {validAlphabets, validEmail} from "@/utils/validate";
import Rule from '@/type/Rule';
import SelectOption from '@/type/SelectOption';
import {confirmDelete, responseMsg} from '@/utils/response';
import AuthRole from '@/views/role/AuthRole';
import SystemInfo from '@/views/system/SystemInfo';

@Component({
  components: {
    BaseHeader,
    BaseTable,
  },
})
export default class System extends Vue {
    private static validateValue(rule: Rule, value: string, callback: (error?: Error) => void) {
      if (!validAlphabets(value)) {
        callback(new Error('请输入合法的系统值'));
      } else {
        callback();
      }
    }
    public systemInfoRules = {
      name: [
        new Rule({message: '用户名不能为空'}),
      ],
      code: [
        new Rule({message: '编码不能为空'}),
      ],
      value: [
          new Rule({message: '系统值不能为空'}),
      ],
      attrValue: [
          new Rule({message: '系统属性不能为空'}),
      ]
    };
    public $refs!: {
      form: HTMLFormElement,
      form1: HTMLFormElement,
    };
    public  tableColumn = [
      { prop: "name", label: "名称", width: 160 },
      { prop: "code", label: "系统编码", width: 160 },
      { prop: "value", label: "系统值", width: 160 },
      { prop: "attrValue", label: "系统属性" },
      { prop: "desc", label: "描述" },
    ];
    public systemInfo = new SystemInfo();
    public authRole = new AuthRole();
    public tableData = [];
    public currentPage: number = 1;
    public selectedRow: Array<number| string> = [];
    public pageSize: number =  10;
    public total: number = 0;
    public pageTitle: string = '新增';
    public query: any = {
      queryStr:  '',
    };
    public transfer: string = 'transfer';
    public dialogVisible: boolean = false;
    public dialogTitle: string = '新增系统';
    public formEditFlag: boolean = false;
    public dialogAuthVisible: boolean = false;
    public roleSelectOptions: SelectOption[] = [];
    public authSelectOptions: SelectOption[] = [];
    public roleId: any = '';

    @Watch('currentPage', { deep: true, immediate: false })
    public async currentPageChange(val: any, oldVal: any) {
      await this.getData();
    }
    public async editRow(data: any) {
      this.dialogVisible = true;
      this.dialogTitle = data != 'editRow' ? '编辑系统' : '新增系统';
      if (data != 'editRow') {
        this.roleId = data.row.id;
        this.formEditFlag = true;
        await this.getSystemInfo();
      }

    }

    public deleteRow(data: any) {
      const ids = data == 'deleteRow' ? this.selectedRow : [data.row.id];
      if (ids.length < 1 || ids === null) {
        this.$message({
          message: "请先选择要删除的数据！",
          type: "warning",
        });
        return false;
      }
      $post(systemApi.delete.url, {id: ids}).then((response: any) => {
            responseMsg(response.success, "删除", this.getData);
      });
    }

    public add(fromData: any, toData: any, obj: any) {
      this.authRole.tempIds = Array.from(new Set(obj.harfKeys.concat(obj.keys).concat(this.authRole.tempIds)));
    }

    public remove(fromData: any, toData: any, obj: any) {
      obj.keys.forEach((item: number) => {
        this.authRole.tempIds.splice(this.authRole.tempIds.indexOf(item), 1);
        });
      }

    /**
     * 当前行是否可删除
     * @param row {object}
     * @returns {boolean}
     */
    public allowDeleteData(row: any) {
      return true
    }

    /**
     * 多选
     * @param val
     * @returns {string}
     */
    public handleSelectionChange(val: any) {
      const selectedIds: Array<string | number> = [];
      for (let i = 0; i < val.length; i++) {
        selectedIds.push(val[i].id);
      }
      this.selectedRow = selectedIds;
      return selectedIds.join(",");
    }

    /**
     * 获取数据
     * @param flag
     */
    public async getData(flag?: string) {
      if (flag == "search") {
        this.currentPage = 1;
      }
      const response: any = await $get(systemApi.list.url, {
        page: this.currentPage,
        pageSize: this.pageSize,
        name: this.query.queryStr,
      });
      this.total = response.data && response.data.count || 0;
      this.tableData = response.data ?  response.data.data : [];
      const totalPageNumber = Math.ceil(this.total / this.pageSize);
      if (totalPageNumber < this.currentPage && this.total !== 0) {
        this.currentPage = totalPageNumber;
        await this.getData();
      } else if (this.total === 0) {
        this.currentPage = 1;
      }
      return false;
    }

    /**
     * pageSize修改
     * @param val
     */
    private async handleSizeChange(val: number) {
      this.pageSize = val;
      await this.getData();
      return false;
    }

    /**
     * 弹窗关闭
     */
    private dialogClose() {
      this.dialogVisible = false;
      this.dialogAuthVisible = false;
      this.roleId = '';
      this.formEditFlag = false;
      try {
        this.$refs.form.resetFields()
      }catch (e) {
        return true;
      }
    }

    /**
     * 弹窗取消
     */
    private async cancelFun() {
      this.dialogVisible = false;
      this.dialogAuthVisible = false;
      this.roleId = '';
      this.formEditFlag = false;
      this.systemInfo = new SystemInfo();
      await this.getData();
      try {
        this.$refs.form.resetFields()
      }catch (e) {
        return true;
      }
    }

    /**
     * 弹窗确认
     */
    public async okFun() {
      let params: any;
      let api: string = '';
      if (this.dialogTitle.indexOf('新增') > -1) {
        params = {...this.systemInfo};
        params.value = this.systemInfo.name;
        api = systemApi.add.url;
      } else {
        params = {...this.systemInfo, id: this.roleId};
        api = systemApi.update.url;
      }
      this.$refs.form.validate(async (valid: boolean) => {
        if (!valid)  {
          return false;
        }
        const res: any = await $post(api, params);
        responseMsg(
          res.success,
          this.dialogTitle,
          this.cancelFun,
        );
      });
    }

    private async getSystemInfo() {
      const res: any = await $get(systemApi.info.url, { id: this.roleId });
      const system: SystemInfo = res.data && res.data ? res.data : new SystemInfo();
      this.systemInfo = {
        name: system.name,
        desc: system.desc,
        value: system.value,
        code: system.code,
        attrValue: system.attrValue
      };
    }

    private async created() {
      await this.getData();
    }
  }
</script>

<style lang="stylus" scoped>
.auth-transfer
    padding 13px
    .scroll-con
        position relative
    .child-flag
        position absolute
        top 14px
        left 129px
    .transfer-con
        >>>.el-transfer-panel__body .el-transfer-panel__filter .el-input__inner
            width 150px !important
        >>>.el-input__prefix
            left -8px !important
</style>

