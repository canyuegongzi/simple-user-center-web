<template lang="pug">
    .container
        base-header(title="资源中心" @editRow="editRow" @deleteRow="deleteRow")
        base-table(:dataFormat="tableColumn" :allowDeleteData="allowDeleteData" :tableData="tableData" @editRow="editRow" @deleteRow="deleteRow" :handleSelectionChange="handleSelectionChange")
            .search-items(slot="table-tools")
                .search-item
                    el-input(v-model="query.queryStr" @blur="getData('search')"  @keyup.enter.native="getData('search')" placeholder="请输入资源名称搜索" size="mini" suffix-icon="el-icon-search")
                    el-input(v-model="query.system" @blur="getData('search')"  @keyup.enter.native="getData('search')" placeholder="请输入系统名称搜索" size="mini" suffix-icon="el-icon-search")
                el-button(size="mini" type="primary" @click="openChartAuth") 资源架构
            el-pagination(slot="table-pagination" @size-change="handleSizeChange" :current-page.sync="currentPage"
                :page-size="pageSize"  layout="total, sizes, prev, pager, next, jumper" :total="total")
        el-dialog(:visible.sync="dialogVisible" @close="dialogClose" width="450px")
            span(slot="title") {{dialogTitle}}
            div(style="height: 370px;overflow: auto; padding: 0")
                el-scrollbar(style="height:100%;")
                    el-form(:model="authInfo" :rules="authInfoRules" ref="form" label-width="110px" class="input-width")
                        el-form-item(label="名称：" prop="name")
                            el-input(v-model="authInfo.name" size="mini"  placeholder="请输入名称")
                        el-form-item(label="编码：" prop="code")
                            el-input(v-model="authInfo.code" size="mini" :disabled="formEditFlag" placeholder="请输入编码" )
                        el-form-item(label="路径：" prop="path")
                            el-input(v-model="authInfo.path" size="mini"  placeholder="请输入路径" )
                        el-form-item(label="系统：" prop="system")
                            el-input(v-model="authInfo.system" size="mini"  placeholder="请输入所属系统" )
                        el-form-item(label="icon：" prop="icon")
                            el-input(v-model="authInfo.icon" size="mini" placeholder="请输入图标" )
                        el-form-item(label="父级：" prop="parentId")
                            el-select(v-model="authInfo.parentId" size='mini' filterable style="width:100%")
                                el-option(v-for="(item, index) in authSelectOptions" :label="item.label" :value="item.value" :key="item.value")
                        el-form-item(label="描述：" prop="desc")
                            el-input(v-model="authInfo.desc" size="mini" placeholder="请输入描述" )
            div(slot="footer")
                el-button(@click="cancelFun" size="mini") 取消
                el-button(type="primary" @click="okFun" size="mini") 确定
        el-dialog(:visible.sync="dialogChartAuth" @close="dialogClose" width="800px")
            span(slot="title") 资源架构
            div(style="height: 370px;overflow: auto; padding: 0")
                el-scrollbar(style="height:100%;")
                    vue2-org-tree(:render-content="renderContent" @on-node-click="onNodeClick" name="test" :horizontal="horizontal" :collapsable="collapsable"  @on-expand="onExpand" :data="authTreeData" :prop="{label: 'name', children: 'children', expand: 'expand'}")
</template>

<script lang="ts">
import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
import BaseHeader from "@/components/table-page/BaseHeader.vue";
import BaseTable from "@/components/table-page/BaseTable.vue";
import { $post, $get } from "@/utils/feth";
import { roleApi, authApi } from "@/api/api";
import { validEmail } from "@/utils/validate";
import Rule from "@/type/Rule";
import SelectOption from "@/type/SelectOption";
import { confirmDelete, responseMsg } from "@/utils/response";
import RoleInfo from "@/views/role/Role";
import AuthInfo from "@/views/auth/Auth";
import {listToTree} from '@/utils/tree-data';
@Component({
  components: {
    BaseHeader,
    BaseTable,
  },
})
export default class Auth extends Vue {
  private static validateEmail(
    rule: Rule,
    value: string,
    callback: (error?: Error) => void,
  ) {
    if (!validEmail(value)) {
      callback(new Error("邮箱格式不正确"));
    } else {
      callback();
    }
  }
  public authInfoRules = {
    name: [new Rule({ message: "名称不能为空" })],
    code: [new Rule({ message: "编码不能为空" })],
    path: [new Rule({ message: "路径不能为空" })],
    parentId: [new Rule({ message: "上级不能为空" })],
    system: [new Rule({message: "所属系统不能为空"})],
  };
  public $refs!: {
    form: HTMLFormElement;
  };
  public tableColumn = [
    { prop: "name", label: "名称", width: 120 },
    { prop: "code", label: "编码", width: 120 },
    { prop: "system", label: "系统", width: 120 },
    { prop: "path", label: "地址" },
    { prop: "icon", label: "图标" },
    { prop: "desc", label: "描述" },
    { prop: "parentName", label: "上级菜单" },
  ];
  public authInfo = new AuthInfo();
  public tableData = [];
  public currentPage: number = 1;
  public selectedRow: Array<number | string> = [];
  public pageSize: number = 10;
  public total: number = 0;
  public pageTitle: string = "新增";
  public query: any = {
    queryStr: "",
    system: '',
  };
  public dialogVisible: boolean = false;
  public dialogChartAuth: boolean = false;
  public dialogTitle: string = "新增资源";
  public formEditFlag: boolean = false;
  public authSelectOptions: SelectOption[] = [];
  public roleSelectOptions: SelectOption[] = [];
  public authId: any = "";
  public authTreeData: any = [];
  public horizontal: boolean =  false;
  public collapsable: boolean = true;
  public expandAll: boolean = false;
  public resList: SelectOption[] = [];

  @Watch("currentPage", { deep: true, immediate: false })
  public currentPageChange(val: any, oldVal: any) {
    this.getData();
  }
  public editRow(data: any) {
    this.dialogVisible = true;
    this.dialogTitle = data != "editRow" ? "编辑资源" : "新增资源";
    if (data != "editRow") {
      this.authId = data.row.id;
      this.formEditFlag = true;
      this.getAuthInfo();
    }
  }

  public deleteRow(data: any) {
    const ids = data == "deleteRow" ? this.selectedRow : [data.row.id];
    if (ids.length < 1 || ids === null) {
      this.$message({
        message: "请先选择要删除的数据！",
        type: "warning",
      });
      return false;
    }
    console.log(ids);
    confirmDelete(authApi.deleteAuth.url, this.getData, { id: ids });
  }

  /**
   * 当前行是否可删除
   * @param row {object}
   * @returns {boolean}
   */
  public allowDeleteData(row: any) {
    if (row.parentId === -1) {
      return false;
    } else {
      return true;
    }

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
    const response: any = await $get(authApi.authList.url, {
      page: this.currentPage,
      pageSize: this.pageSize,
      name: this.query.queryStr,
      system: this.query.system,
    });
    this.total = (response.data && response.data.data.count) || 0;
    this.tableData =
      response.data && response.data.data ? response.data.data.data : [];
    this.getAuthList();
    const totalPageNumber = Math.ceil(this.total / this.pageSize);
    if (totalPageNumber < this.currentPage && this.total !== 0) {
      this.currentPage = totalPageNumber;
      this.getData();
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
    const response: any = await $get(roleApi.roleList.url, {
      page: 1,
      pageSize: 100000,
      name: "",
    });
    this.roleSelectOptions =
      response.data && response.data.data
        ? this.dealRoleListData(response.data.data.data)
        : [];
    return false;
  }

  /**
   * 获取全部的功能
   */
  public async getAuthList() {
    const response: any = await $get(authApi.authList.url, {
      page: 1,
      pageSize: 100000,
      name: "",
      system: '',
    });
    this.authSelectOptions =
      response.data && response.data.data
        ? this.dealAuthListData(response.data.data.data)
        : [];
    const treeData = response.data && response.data.data
    ? listToTree(response.data.data.data, 'id', 'parentId', 'children')
    : [];
    this.authTreeData = treeData.length > 0 ? treeData[0] : {};
    return false;
  }

  /**
   * pageSize修改
   * @param val
   */
  public handleSizeChange(val: number) {
    this.pageSize = val;
    this.getData();
    return false;
  }

  /**
   * 处理角色列表
   */
  private dealRoleListData(data: any) {
    const res = data.map((item: AuthInfo) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    return res;
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
   * 弹窗关闭
   */
  private dialogClose() {
    this.dialogVisible = false;
    this.dialogChartAuth = false;
    this.authId = "";
    this.formEditFlag = false;
  }

  /**
   * 弹窗取消
   */
  private cancelFun() {
    this.dialogVisible = false;
    this.authId = "";
    this.formEditFlag = false;
    this.authInfo = new AuthInfo();
    this.getData();
  }

  /**
   * 弹窗确认
   */
  private async okFun() {
    let params: any;
    let api: string = "";
    if (this.dialogTitle.indexOf("新增") > -1) {
      params = { ...this.authInfo };
      api = authApi.addAuth.url;
    } else {
      params = { ...this.authInfo, id: this.authId };
      api = authApi.updateAuth.url;
    }
    this.$refs.form.validate(async (valid: boolean) => {
      if (!valid) {
        return false;
      }
      const res: any = await $post(api, params);
      responseMsg(res.data.success, this.dialogTitle, this.cancelFun);
    });
  }

  private async getAuthInfo() {
    const res: any = await $get(authApi.getInfo.url, { id: this.authId });
    const auth: any =
      res.data && res.data.data ? res.data.data : new AuthInfo();
    console.log(auth);
    this.authInfo = {
      name: auth.name,
      desc: auth.desc,
      code: auth.code,
      parentId: auth.parentId,
      parentName: auth.parentName,
      icon: auth.icon,
      path: auth.path,
      system: auth.system,
    };
  }

  private openChartAuth() {
    this.dialogChartAuth = true;
  }

  private renderContent(h: any, data: any) {
    return data.name;
  }

  private onExpand(e: any, data: any) {
    if ("expand" in data) {
      data.expand = !data.expand;
      if (!data.expand && data.children) {
        this.collapse(data.children);
      }
    } else {
      this.$set(data, "expand", true);
    }
  }

  private collapse(list: any) {
    const that = this;
    list.forEach((child: any) =>  {
      if (child.expand) {
        child.expand = false;
      }
      child.children && that.collapse(child.children);
    });
  }

  private expandChange() {
    this.toggleExpand(this.authTreeData, this.expandAll);
  }

  private toggleExpand(data: any, val: any) {
    const that = this;
    if (Array.isArray(data)) {
      data.forEach((item) => {
        that.$set(item, "expand", val);
        if (item.children) {
          that.toggleExpand(item.children, val);
        }
      });
    } else {
      this.$set(data, "expand", val);
      if (data.children) {
        that.toggleExpand(data.children, val);
      }
    }
  }

  /**
   * 节点点击
   * @param e
   * @param data
   */
  private onNodeClick(e: any, data: any) {
    console.log(data);
  }

  private created() {
    this.getData();
  }
}
</script>

<style lang="stylus" scoped></style>
