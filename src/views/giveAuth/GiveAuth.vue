<template lang="pug">
    .container(style="height:100%;")
        base-header(title="角色授权" :isShowTool="false" @editRow="editRow" @deleteRow="deleteRow")
        .tab(style="padding:8px 0 8px 0; border-bottom: 1px solid #dcdfe6;justify-content: space-between;display:flex")
            el-radio-group(v-model="authTypeValue" size="mini"  @change="authTypeValueChange")
                el-radio-button(label="menus") 菜单权限
                el-radio-button(label="api") 接口资源
            el-button(size="mini" type="success" @click="okAuthFun") 保存
        .content
            el-form(:model="authRole" :rules="authRoleRules" ref="form1" label-width="110px" class="input-width")
                el-form-item(label="角色：" prop="name")
                    el-select(v-model="authRole.roleId" size='mini' filterable :disabled="false" style="width:320px" @change="roleChange")
                        el-option(v-for="(item, index) in roleSelectOptions" :label="item.label" :value="item.value" :key="item.value")
                el-form-item(v-if="authTypeValue == 'menus'" :label="authTypeValue == 'menus' ? '菜单资源' : '接口资源'" prop="staffId")
                    tree-transfer(pid="parentId" :to_data='authRole.toData' :defaultCheckedKeys="defaultCheckedKeys1" :defaultTransfer="true" :from_data='authSelectOptions' :button-text="['到左边', '到右边']" :defaultProps="{key: 'id', label: 'name'}" @addBtn='add' @removeBtn='remove' height='500px' filter openAll)
                el-form-item(v-if="authTypeValue == 'api'" :label="authTypeValue == 'menus' ? '菜单资源' : '接口资源'" prop="staffId")
                    tree-transfer(pid="parentId" :to_data='authRole.toData' :defaultCheckedKeys="defaultCheckedKeys" :defaultTransfer="true" :from_data='apiAuthSelectOptions' :button-text="['到左边', '到右边']" :defaultProps="{key: 'id', label: 'name'}" @addBtn='add1' @removeBtn='remove1' height='500px' filter openAll)
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
 import {findTreeNode, listToTree, treeConvertList} from '@/utils/tree-data';
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
     private defaultCheckedKeys: any[] = [];
     private defaultCheckedKeys1: any[] = [];
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
     public apiAuthSelectOptions: SelectOption[] = [];
     public apiAuthSelectOptionsList: SelectOption[] = [];
     public roleId: any = '';
     public authTypeValue: string = 'menus';

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

     public add1(fromData: any, toData: any, obj: any) {
         console.log(fromData)
         console.log(toData)
         console.log(obj)
         this.authRole.tempIds = Array.from(new Set(obj.harfKeys.concat(obj.keys).concat(this.authRole.tempIds)));
     }

     public remove1(fromData: any, toData: any, obj: any) {
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
         this.roleSelectOptions = response.data ?
             this.dealRoleListData(response.data) :
             [];
         return false;
     }

     /**
      * 获取全部的功能(菜单)
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
      * 获取全部的功能(菜单)
      */
     public async getAuthApiList() {
         const response: any = await $get(authApi.apiAuthTree.url, {hasList: false});
         this.apiAuthSelectOptions =
             response.data && response.data.data
                 ? response.data.data.data
                 : [];
         let list: any = [];
         for (let i = 0; i < this.apiAuthSelectOptions.length; i++ ) {
             list = list.concat(treeConvertList(this.apiAuthSelectOptions[i]))
         }
         this.apiAuthSelectOptionsList = list;
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

     /**
      * 角色的菜单资源
      */
     private async getAuthRoleInfo() {
         this.defaultCheckedKeys1 = []
         const res: any = await $get(roleApi.authByRole.url, { id: this.authRole.roleId });
         const authListByRole: AuthInfo[] = res.data && res.data.data ? res.data.data[0].authority : [];
         this.authRole.tempIds = [];
         await this.getAuthList();
         authListByRole.forEach((item: AuthInfo) => {
             this.authRole.tempIds.push(item.id);
         });
         this.defaultCheckedKeys1 = this.authRole.tempIds
     }

     /**
      * 角色的接口资源
      */
     private async getAuthRoleApiInfo() {
         this.defaultCheckedKeys = []
         const res: any = await $get(roleApi.authApiByRole.url, { id: this.authRole.roleId });
         console.log(res)
         await this.getAuthApiList();
         this.authRole.tempIds = res.data
         this.defaultCheckedKeys = res.data
     }

     private async okAuthFun() {
         console.log(this.authRole)
         this.$refs.form1.validate(async (valid: boolean) => {
             if (!valid)  {
                 return false;
             }
             if (!this.authRole.roleId) {
                 return
             }
             try {
                 if (this.authTypeValue == 'menus') {
                     const res: any = await $post(roleApi.addAuthToRole.url,
                         {roleId: this.authRole.roleId, authIds: this.authRole.tempIds.length > 0
                                 ? this.authRole.tempIds :
                                 []});
                     responseMsg(
                         res.success,
                         '授权成功',
                         this.cancelFun,
                     );
                 } else {
                     const authIds: any[] = []
                     this.authRole.tempIds.forEach((item: any) => {
                         const currentNode: any = this.apiAuthSelectOptionsList.find((s: any) => {
                             return s.id == item
                         });
                         if (currentNode && currentNode.type === 3) {
                             authIds.push(currentNode.id)
                         }
                     })
                     const res: any = await $post(roleApi.addApiAuthToRole.url,
                         {roleId: this.authRole.roleId, resourceIds: authIds.length > 0
                                 ? authIds :
                                 []}, 'wbw');
                     responseMsg(
                         res.success,
                         '授权成功',
                         this.cancelFun,
                     );
                     console.log(authIds)

                 }
             }catch (e) {
                 this.$message.error('授权失败')
                 console.log(e)
             }

         });
     }

     /**
      * 资源类型修改
      * @param value
      */
     public async authTypeValueChange(value: string) {
         console.log(this.authRole.roleId);
         this.defaultCheckedKeys = []
         this.authRole.toData = []
         this.authRole.tempIds = []
         console.log(value);
         if (this.authRole.roleId) {
             await this.roleChange()
         }
     }

     /**
      * 角色修改
      * @param value
      */
     public async roleChange(value?: any) {
         this.authRole.toData = []
         this.defaultCheckedKeys1 = []
         this.defaultCheckedKeys = []
         if(this.authTypeValue === 'menus') {
             // 加载角色对应的菜单权限
             await this.getAuthRoleInfo()
         }else {
             // 加载角色对应的资源权限
             this.getAuthRoleApiInfo()
         }

     }

     private async created() {
         await this.getAuthList();
         await this.getAuthApiList();
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

