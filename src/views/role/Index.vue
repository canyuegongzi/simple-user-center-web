<template lang="pug">
    .container
        base-header(title="角色中心" @editRow="editRow" @deleteRow="deleteRow")
        base-table(:dataFormat="tableColumn" :isGiveAuth="true" @giveAuth="giveAuth" :allowDeleteData="allowDeleteData" :tableData="tableData" @editRow="editRow" @deleteRow="deleteRow" :handleSelectionChange="handleSelectionChange")
            .search-items(slot="table-tools")
                .search-item
                    el-input(v-model="query.queryStr" @blur="getData('search')"  @keyup.enter.native="getData('search')" placeholder="请输入角色名称搜索" size="mini" suffix-icon="el-icon-search")
            el-pagination(slot="table-pagination" @size-change="handleSizeChange" :current-page.sync="currentPage"
                :page-size="pageSize"  layout="total, sizes, prev, pager, next, jumper" :total="total")
        el-dialog(:visible.sync="dialogVisible" @close="dialogClose" width="450px")
            span(slot="title") {{dialogTitle}}
            div(style="height: 320px;overflow: auto; padding: 0")
                el-scrollbar(style="height:100%;")
                    el-form(:model="roleInfo" :rules="roleInfoRules" ref="form" label-width="110px" class="input-width")
                        el-form-item(label="名称：" prop="name")
                            el-input(v-model="roleInfo.name" :disabled="roleInfo.name == 'root' || roleInfo.name == 'user' " size="mini"  placeholder="请输入名称")
                        el-form-item(label="编码：" prop="code")
                            el-input(v-model="roleInfo.code" size="mini" :disabled="formEditFlag" placeholder="请输入编码" )
                        el-form-item(label="描述：" prop="desc")
                            el-input(v-model="roleInfo.desc" size="mini" placeholder="请输入描述" )
            div(slot="footer")
                el-button(@click="cancelFun" size="mini") 取消
                el-button(type="primary" @click="okFun" size="mini") 确定
        el-dialog(:visible.sync="dialogAuthVisible" @close="dialogClose" width="700px" class="auth-transfer")
            span(slot="title") 授权
            div(style="height: 320px;overflow: auto; padding: 0")
                el-scrollbar(style="height:100%;")
                    el-form(:model="authRole" :rules="authRoleRules" ref="form1" label-width="110px" class="input-width")
                        el-form-item(label="名称：" prop="name")
                            el-select(v-model="authRole.roleId" size='mini' filterable :disabled="true" style="width:100%" )
                                el-option(v-for="(item, index) in roleSelectOptions" :label="item.label" :value="item.value" :key="item.value")
                        el-form-item(label="组织人员：" prop="staffId")
                            tree-transfer( v-if="dialogAuthVisible" pid="parentId" :to_data='authRole.toData' :from_data='authSelectOptions' :button-text="['到左边', '到右边']" :defaultProps="{key: 'id', label: 'name'}" @addBtn='add' @removeBtn='remove' height='225px' filter openAll)
            div(slot="footer")
                el-button(@click="cancelFun" size="mini") 取消
                el-button(type="primary" @click="okAuthFun" size="mini") 确定
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import BaseHeader from '@/components/table-page/BaseHeader.vue';
  import BaseTable from '@/components/table-page/BaseTable.vue';
  import {$get, $post} from '@/utils/feth';
  import {authApi, roleApi} from '@/api/api';
  import {validEmail} from '@/utils/validate';
  import Rule from '@/type/Rule';
  import SelectOption from '@/type/SelectOption';
  import {confirmDelete, responseMsg} from '@/utils/response';
  import RoleInfo from '@/views/role/Role';
  import AuthInfo from '@/views/auth/Auth';
  import {listToTree} from '@/utils/tree-data';
  import AuthRole from '@/views/role/AuthRole';

  @Component({
    components: {
      BaseHeader,
      BaseTable,
    },
  })
export default class Role extends Vue {
    private static validateEmail(rule: Rule, value: string, callback: (error?: Error) => void) {
      if (!validEmail(value)) {
        callback(new Error('邮箱格式不正确'));
      } else {
        callback();
      }
    }
    public roleInfoRules = {
      name: [
        new Rule({message: '用户名不能为空'}),
      ],
      code: [
        new Rule({message: '编码不能为空'}),
      ],
    };
    public authRoleRules = {

    };
    public $refs!: {
      form: HTMLFormElement,
      form1: HTMLFormElement,
    };
    public  tableColumn = [
      { prop: "name", label: "角色名称", width: 120 },
      { prop: "code", label: "编码",  width: 120 },
      { prop: "desc", label: "描述" },
    ];
    public roleInfo = new RoleInfo();
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
    public dialogTitle: string = '新增用户';
    public formEditFlag: boolean = false;
    public dialogAuthVisible: boolean = false;
    public roleSelectOptions: SelectOption[] = [];
    public authSelectOptions: SelectOption[] = [];
    public roleId: any = '';

    @Watch('currentPage', { deep: true, immediate: false })
    public currentPageChange(val: any, oldVal: any) {
      this.getData();
    }
    public async editRow(data: any) {
      this.dialogVisible = true;
      this.dialogTitle = data != 'editRow' ? '编辑角色' : '新增角色';
      if (data != 'editRow') {
        this.roleId = data.row.id;
        this.formEditFlag = true;
        await this.getRoleInfo();
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
      confirmDelete(roleApi.deleteRole.url, this.getData, {id: ids});
    }

    public add(fromData: any, toData: any, obj: any) {
      this.authRole.tempIds = Array.from(new Set(obj.harfKeys.concat(obj.keys).concat(this.authRole.tempIds)));
    }

    public remove(fromData: any, toData: any, obj: any) {
      obj.keys.forEach((item: number) => {
        this.authRole.tempIds.splice(this.authRole.tempIds.indexOf(item), 1);
        });
      }

    public async giveAuth(data: any) {
      this.dialogAuthVisible = true;
      this.roleId = data.row.id;
      this.authRole.roleId  = data.row.id;
      this.dialogTitle = '授权';
      await this.getAuthRoleInfo();
    }
    /**
     * 当前行是否可删除
     * @param row {object}
     * @returns {boolean}
     */
    public allowDeleteData(row: any) {
      if (row.name == 'root' || row.name == 'user') {
        return false;
      }
      return true;
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
      const response: any = await $get(roleApi.roleList.url, {
        page: this.currentPage,
        pageSize: this.pageSize,
        name: this.query.queryStr,
      });
      this.total = response.data && response.data.data.count || 0;
      this.tableData = response.data && response.data.data ?  response.data.data.data : [];
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
     * 获取角色
     * @param flag
     */
    public async getRoleList() {
      const response: any = await $get(roleApi.allRoleList.url, {});
      this.roleSelectOptions = response.data && response.data.data ?
        this.dealRoleListData(response.data.data) :
        [];
      return false;
    }

    /**
     * 获取全部的功能
     */
    public async getAuthList() {
      const response: any = await $get(authApi.authTree.url, {});
      this.authSelectOptions =
        response.data && response.data.res
          ? response.data.res.data
          : [];
      return false;
    }

    /**
     * 处理功能列表
     */
    private dealAuthListData(data: any) {
      const res = data.map((item: AuthInfo) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      return res;
    }
    /**
     * pageSize修改
     * @param val
     */
    private handleSizeChange(val: number) {
      this.pageSize = val;
      this.getData();
      return false;
    }

    /**
     * 处理角色列表
     */
    private dealRoleListData(data: any) {
      const res = data.map((item: RoleInfo) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      return res;
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
      this.roleInfo = new RoleInfo();
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
    private async okFun() {
      let params: any;
      let api: string = '';
      if (this.dialogTitle.indexOf('新增') > -1) {
        params = {...this.roleInfo};
        api = roleApi.addRole.url;
      } else {
        params = {...this.roleInfo, id: this.roleId};
        api = roleApi.updateRole.url;
      }
      this.$refs.form.validate(async (valid: boolean) => {
        if (!valid)  {
          return false;
        }
        const res: any = await $post(api, params);
        responseMsg(
          res.data.success,
          this.dialogTitle,
          this.cancelFun,
        );
      });
    }

    private async getRoleInfo() {
      const res: any = await $get(roleApi.getInfo.url, { id: this.roleId });
      const role: any = res.data && res.data.data ? res.data.data : new RoleInfo();
      this.roleInfo = {
        name: role.name,
        desc: role.desc,
        code: role.code,
      };
    }

    private async getAuthRoleInfo() {
      await this.getAuthList();
      const res: any = await $get(roleApi.authByRole.url, { id: this.roleId });
      const authListByRole: AuthInfo[] = res.data && res.data.data ? res.data.data.data[0].authority : [];
      this.authRole.tempIds = [];
      authListByRole.forEach((item: AuthInfo) => {
        console.log(item);
        this.authRole.tempIds.push(item.id);
      });
      const treeData = listToTree(authListByRole, 'id', 'parentId', 'children');
      this.authRole.toData = treeData;
    }

    private async okAuthFun() {
      this.$refs.form1.validate(async (valid: boolean) => {
        if (!valid)  {
          return false;
        }
        const res: any = await $post(roleApi.addAuthToRole.url,
          {roleId: this.authRole.roleId, authIds: this.authRole.tempIds.length > 0
              ? this.authRole.tempIds :
              []});
        responseMsg(
          res.data.success,
          this.dialogTitle,
          this.cancelFun,
        );
      });
    }

    private async created() {
      await this.getData();
      await this.getAuthList();
      await this.getRoleList();
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

