<template lang="pug">
    .container
        base-header(title="用户中心" @editRow="editRow" @deleteRow="deleteRow" :isDelete="true")
        base-table(:dataFormat="tableColumn" :allowDelete="true" :allowPushMessage="true" :allowDeleteData="allowDeleteData" :tableData="tableData" @editRow="editRow" @giveAllowPushMessage="giveAllowPushMessage" @deleteRow="deleteRow" :handleSelectionChange="handleSelectionChange")
            .search-items(slot="table-tools")
                .search-item
                    el-input(v-model="query.queryStr" placeholder="请输入用户名称" size="mini" clearable	)
                    el-input(v-model="query.queryNick" placeholder="请输入用户昵称" size="mini" clearable	)
                    el-input(v-model="query.queryEmail" placeholder="请输入用户邮件" size="mini" clearable	)
                    el-select(v-model="query.roleId" clearable size='mini' placeholder="请选择角色")
                        el-option(v-for="item in roleSelectOptions" :label="item.label" :value="item.value" :key="item.value")
                    el-button(icon="el-icon-search" type="primary" @click="getData('search')" size="mini") 搜索
            el-pagination(slot="table-pagination" @size-change="handleSizeChange" :current-page.sync="currentPage"
                :page-size="pageSize"  layout="total, sizes, prev, pager, next, jumper" :total="total")
        el-dialog(:visible.sync="dialogVisible"  @close="dialogClose" width="450px")
            span(slot="title") {{dialogTitle}}
            div(style="height: 320px;overflow: auto; padding: 0")
                el-scrollbar(style="height:100%;")
                    el-form(:model="userInfo" :rules="userInfoRules" ref="form" label-width="110px" class="input-width")
                        el-form-item(label="用户名：" prop="name")
                            el-input(v-model="userInfo.name" size="mini" :disabled="formEditFlag" placeholder="请输入用户名")
                        el-form-item(label="昵称：" prop="nick")
                            el-input(v-model="userInfo.nick" size="mini" placeholder="请输入昵称" )
                        el-form-item(label="年龄：" prop="age")
                            el-input(v-model="userInfo.age" size="mini"  placeholder="请输入年龄")
                        el-form-item(label="密码：" prop="password")
                            el-input(v-model="userInfo.password" size="mini"  placeholder="请输入密码")
                        el-form-item(label="角色：" prop="roleId")
                            el-select(v-model="userInfo.roleId" size='mini' style="width:100%")
                                el-option(v-for="(item, index) in roleSelectOptions" :label="item.label" :value="item.value" :key="item.value")
                        el-form-item(label="地址：" prop="address")
                            el-input(v-model="userInfo.address" size="mini" placeholder="请输入地址" )
                        el-form-item(label="邮箱：" prop="email")
                            el-input(v-model="userInfo.email" size="mini"  placeholder="请输入邮箱")
                        el-form-item(label="描述：" prop="desc")
                            el-input(v-model="userInfo.desc" size="mini" placeholder="请输入描述" )
            div(slot="footer")
                el-button(@click="cancelFun" size="mini") 取消
                el-button(type="primary" @click="okFun" size="mini") 确定
        el-dialog(:visible.sync="dialogVisible1" v-if="dialogVisible1" lock-scroll fullscreen destroy-on-close custom-class="dialogVisible1-class")
            el-scrollbar(style="height:100%;")
                compponent(is="AddTask" :currentUserInfo="currentUserRow" @successPush="successPush")

</template>
<script lang="ts">
  import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
  import BaseHeader from '@/components/table-page/BaseHeader.vue';
  import BaseTable from '@/components/table-page/BaseTable.vue';
  import AddTask from './AddTask.vue'
  import {$post, $get } from '@/utils/feth';
  import {userApi, roleApi} from '@/api/api';
  import {validEmail} from '@/utils/validate';
  import UserInfo from '@/views/user/User';
  import Rule from '@/type/Rule';
  import SelectOption from '@/type/SelectOption';
  import RoleInfo from '@/views/user/Role';
  import {confirmDelete, responseMsg} from '@/utils/response';
  @Component({
    components: {
      BaseHeader,
      BaseTable,
      AddTask
    },
  })
  export default class User extends Vue {

    private static validateEmail(rule: Rule, value: string, callback: (error?: Error) => void) {
      if (!validEmail(value)) {
        callback(new Error('邮箱格式不正确'));
      } else {
        callback();
      }
    }
    public currentUserRow: UserInfo = new UserInfo();
    public userInfoRules = {
      name: [
        new Rule({message: '用户名不能为空'}),
      ],
      nick: [
        new Rule({message: '昵称不能为空'}),
      ],
      password: [
        new Rule({message: '密码不能为空'}),
      ],
      age: [
        new Rule({message: '年龄不能为空'}),
      ],
      email: [
        new Rule({message: '邮箱不能为空'}),
        new Rule({}, User.validateEmail),
      ],
      roleId: [
        new Rule({message: '角色不能为空'}),
      ],
    };
    public $refs!: {
      form: HTMLFormElement,
    };
    public  tableColumn = [
      { prop: "name", label: "用户名称" },
      { prop: "nick", label: "昵称" },
      { prop: "age", label: "年龄" },
      { prop: "email", label: "邮箱" },
      { prop: "desc", label: "描述" },
      { prop: "address", label: "地址" },
      { prop: "ors", label: "所属组织" },
      { prop: "roleName", label: "角色" },
    ];
    public userInfo = new UserInfo();
    public tableData = [];
    public currentPage: number = 1;
    public selectedRow: Array<number| string> = [];
    public pageSize: number =  10;
    public total: number = 0;
    public dialogVisible1: boolean = false
    public pageTitle: string = '新增';
    public query: any = {
      queryStr:  '',
      queryEmail: '',
      queryNick: '',
      roleId: '',
    };
    public dialogVisible: boolean = false;
    public dialogTitle: string = '新增用户';
    public formEditFlag: boolean = false;
    public roleSelectOptions: SelectOption[] = [];
    public userId: any = '';

    @Watch('currentPage', { deep: true, immediate: false })
    public currentPageChange(val: any, oldVal: any) {
      this.getData();
    }
    /**
     * 消息推送
     */
    public async giveAllowPushMessage(data: any) {
        const row = data.row
        if (!row.verification) {
            this.$message.warning('该用户未完成身份认证')
            return
        }
        this.dialogVisible1 = true
        console.log(data)
        this.currentUserRow = data.row
        console.log(this.currentUserRow)
    }

    public successPush() {
        this.dialogVisible1 = false
        this.currentUserRow = new UserInfo()
    }
    public async editRow(data: any) {
        this.dialogVisible = true;
        this.userInfo = new UserInfo();
        this.dialogTitle = data != 'editRow' ? '编辑用户' : '新增用户';
        if (data != 'editRow') {
          this.userId = data.row.id;
          this.formEditFlag = true;
          await this.getUserInfo();
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
      confirmDelete(userApi.deleteUser.url, this.getData, {ids: ids});
    }

    /**
     * 当前行是否可删除
     * @param row {object}
     * @returns {boolean}
     */
    public allowDeleteData(row: any) {
      if (row.organizations && row.organizations.length > 0) {
        return false;
      }
      if (row.role.name === 'root') {
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
      const response: any = await $get(userApi.userList.url, {
        page: this.currentPage,
        pageSize: this.pageSize,
        name: this.query.queryStr,
        nick: this.query.queryNick,
        email: this.query.queryEmail,
        roleId: this.query.roleId
      });
      this.total = response.data && response.data.data.count || 0;
      this.tableData = response.data && response.data.data ?  this.dealTableData(response.data.data.data) : [];
      await this.getRoleList();
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
      this.roleSelectOptions = response.data && response.data.data ?  this.dealRoleListData(response.data.data) : [];
      return false;
    }

    /**
     * pageSize修改
     * @param val
     */
    public async handleSizeChange(val: number) {
      this.pageSize = val;
      await this.getData();
      return false;
    }

    /**
     * 处理数据
     * @param data
     */
    private dealTableData(data: any) {
      const res: any = data;
      const dealName = (arr: any) => {
        const name: any[] | string[] = [];
        arr.forEach((item1: any) => {
          name.push(item1.name);
        });
        return name;
      };
      res.forEach((item: any) => {
        item.ors = dealName(item.organizations).join(',');
        item.roleName = item.role.name;
      });
      return res;
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
      this.userId = '';
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
      this.userId = '';
      this.formEditFlag = false;
      this.userInfo = new UserInfo();
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
          params = {...this.userInfo};
          api = userApi.addUser.url;
        } else {
          params = {...this.userInfo, id: this.userId};
          api = userApi.updateUser.url;
        }
        this.$refs.form.validate(async (valid: boolean) => {
          if (!valid)  {
            return false;
          }
          const res: any = await $post(api, params);
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '操作成功',
            });
          } else {
            this.$message({
              type: 'error',
              message: res.data.message,
            });
          }
          await this.cancelFun();
        });
    }

    private async getUserInfo() {
      const res: any = await $get(userApi.getInfo.url, { id: this.userId });
      const user: any = res.data && res.data.data ? res.data.data : new UserInfo();
      console.log(user);
      this.userInfo = {
        name: user.name,
        phone: user.phone,
        nick: user.nick,
        age: user.age,
        email: user.email,
        desc: user.desc,
        address: user.address,
        password: user.password,
        roleId: user.role.id,
      };
    }

    private created() {
      this.getData();
    }
  }
</script>

<style lang="stylus">
.dialogVisible1-class
    height 100%
    >>>.el-dialog__body
          padding 0 0 !important
</style>
