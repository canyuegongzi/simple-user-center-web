<template lang="pug">
    .container
        base-header(title="组织中心" @editRow="editRow" @deleteRow="deleteRow")
        base-table(:dataFormat="tableColumn" :isPerson="true" :allowDeleteData="allowDeleteData" :tableData="tableData" @givePerson="givePerson" @editRow="editRow" @deleteRow="deleteRow" :handleSelectionChange="handleSelectionChange")
            .search-items(slot="table-tools")
                .search-item
                    el-input(v-model="query.queryStr" @blur="getData('search')"  @keyup.enter.native="getData('search')" placeholder="请输入组织名称搜索" size="mini" suffix-icon="el-icon-search")
                el-button(size="mini" type="primary" @click="openChartAuth") 组织架构
            el-pagination(slot="table-pagination" @size-change="handleSizeChange" :current-page.sync="currentPage"
                :page-size="pageSize"  layout="total, sizes, prev, pager, next, jumper" :total="total")
        el-dialog(:visible.sync="dialogVisible" @close="dialogClose" width="450px")
            span(slot="title") {{dialogTitle}}
            div(style="height: 370px;overflow: auto; padding: 0")
                el-scrollbar(style="height:100%;")
                    el-form(:model="organizationInfo" :rules="organizationInfoRules" ref="form" label-width="110px" class="input-width")
                        el-form-item(label="名称：" prop="name")
                            el-input(v-model="organizationInfo.name" size="mini"  placeholder="请输入名称")
                        el-form-item(label="父级组织：" prop="parentId")
                            el-select(v-model="organizationInfo.parentId" :disabled="formEditFlag" filterable size='mini' style="width:100%;height: 28px"  class="options")
                                el-option(v-for="(item, index) in organizationSelectOptions" :label="item.label" :value="item.value" :key="item.value")
                        el-form-item(label="负责人：" prop="leaderId")
                            el-select(v-model="organizationInfo.leaderId" :disabled="formEditFlag" filterable size='mini' style="width:100%;height: 28px" class="options")
                                el-option(v-for="(item, index) in userSelectOptions" :label="item.label" :value="item.value" :key="item.value" )
                        el-form-item(label="描述：" prop="desc")
                            el-input(v-model="organizationInfo.desc" size="mini" placeholder="请输入描述" )
            div(slot="footer")
                el-button(@click="cancelFun" size="mini") 取消
                el-button(type="primary" @click="okFun" size="mini") 确定
        el-dialog(:visible.sync="dialogChartAuth" @close="dialogClose" width="800px")
            span(slot="title") 组织架构
            div(style="height: 370px;overflow: auto; padding: 0")
                el-scrollbar(style="height:100%;")
                    vue2-org-tree(:render-content="renderContent" @on-node-click="onNodeClick" name="test" :horizontal="horizontal" :collapsable="collapsable"  @on-expand="onExpand" :data="authTreeData" :prop="{label: 'name', children: 'children', expand: 'expand'}")
        el-dialog(:visible.sync="dialogUserVisible" @close="dialogClose" width="700px" class="auth-transfer")
            span(slot="title") 成员
            div(style="height: 370px;overflow: auto; padding: 0")
                el-scrollbar(style="height:100%;")
                    el-form(:model="organUser" :rules="organUserRules" ref="form1" label-width="110px" class="input-width")
                        el-form-item(label="名称：" prop="name")
                            el-select(v-model="organUser.orId" size='mini' filterable :disabled="true" style="width:100%" )
                                el-option(v-for="(item, index) in organizationSelectOptions" :label="item.label" :value="item.value" :key="item.value")
                        el-form-item(label="系统人员：" prop="staffId")
                            el-transfer(filterable filter-placeholder="请输入系统人员名称" :titles="['候选人员', '已选人员']" v-model="organUser.userId" :data="userSelectOptions" :props="{key: 'value',label: 'label'}")
            div(slot="footer")
                el-button(@click="cancelFun" size="mini") 取消
                el-button(type="primary" @click="okAddUserOrganization" size="mini") 确定
</template>

<script lang="ts">
  import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
  import BaseHeader from "@/components/table-page/BaseHeader.vue";
  import BaseTable from "@/components/table-page/BaseTable.vue";
  import { $post, $get } from "@/utils/feth";
  import {roleApi, authApi, organizationApi, userApi} from '@/api/api';
  import { validEmail } from "@/utils/validate";
  import Rule from "@/type/Rule";
  import SelectOption from "@/type/SelectOption";
  import { confirmDelete, responseMsg } from "@/utils/response";
  import AuthInfo from "@/views/auth/Auth";
  import {listToTree} from '@/utils/tree-data';
  import OrganizationInfo from '@/views/organization/Organization';
  @Component({
    components: {
      BaseHeader,
      BaseTable,
    },
  })
export default class Organization extends Vue {
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
  public organizationInfoRules = {
    name: [new Rule({ message: "名称不能为空" })],
    leaderId: [new Rule({ message: "负责人不能为空" })],
    parentId: [new Rule({ message: "上级不能为空" })],
  };
  public organUserRules = {
    orId: [new Rule({ message: "组织不能为空" })],
  };
  public $refs!: {
    form: HTMLFormElement;
    form1: HTMLFormElement;
  };
  public tableColumn = [
    { prop: "name", label: "名称", width: 120 },
    { prop: "leaderName", label: "负责人", width: 120 },
    { prop: "parentName", label: "上级机构", width: 120 },
    { prop: "desc", label: "描述" },
  ];
  public organizationInfo = new OrganizationInfo();
  public tableData = [];
  public currentPage: number = 1;
  public selectedRow: Array<number | string> = [];
  public pageSize: number = 10;
  public total: number = 0;
  public pageTitle: string = "新增";
  public query: any = {
    queryStr: "",
  };
  public organUser: any = {
    orId: '',
    userId: [],
  };
  public dialogVisible: boolean = false;
  public dialogChartAuth: boolean = false;
  public dialogUserVisible: boolean = false;
  public dialogTitle: string = "新增组织";
  public formEditFlag: boolean = false;
  public userSelectOptions: SelectOption[] = [];
  public organizationSelectOptions: SelectOption[] = [];
  public organizationId: any = "";
  public authTreeData: any = [];
  public horizontal: boolean =  false;
  public collapsable: boolean = true;
  public expandAll: boolean = false;

  @Watch("currentPage", { deep: true, immediate: false })
  public currentPageChange(val: any, oldVal: any) {
    this.getData();
  }
  public editRow(data: any) {
    this.dialogVisible = true;
    this.dialogTitle = data != "editRow" ? "编辑组织" : "新增组组织";
    if (data != "editRow") {
      this.organizationId = data.row.id;
      this.formEditFlag = true;
      this.getOrganizationInfo();
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
    confirmDelete(organizationApi.delete.url, this.getData, { id: ids, isDeleteChild: 1 });
  }

  /**
   * 添加成员
   */
  public givePerson(data: any) {
    this.organUser.orId = data.row.id;
    this.organUser.userId = [];
    this.organizationId = data.row.id;
    this.dialogUserVisible = true;
    this.getOrganizationInfo();
  }

  /**
   * 当前行是否可删除
   * @param row {object}
   * @returns {boolean}
   */
  public allowDeleteData(row: any) {
    if (row.parentId === -1) {
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
    const response: any = await $get(organizationApi.list.url, {
      page: this.currentPage,
      pageSize: this.pageSize,
      name: this.query.queryStr,
    });
    this.total = (response.data && response.data.data.count) || 0;
    this.tableData =
      response.data && response.data.data ? response.data.data.data : [];
    this.tableData.forEach((item: any) => {
      item.editFlag = 1;
      item.leaderId = item.leader.id;
      item.leaderName = item.leader.name;
    });
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
  public async getUserList() {
    const response: any = await $get(userApi.userList.url, {
      page: 1,
      pageSize: 100000,
      name: "",
    });
    this.userSelectOptions =
      response.data && response.data.data
        ? this.dealUserListData(response.data.data.data)
        : [];
    return false;
  }

  /**
   * 获取全部的功能
   */
  public async getOrganizationList() {
    const response: any = await $get(organizationApi.list.url, {
      page: 1,
      pageSize: 100000,
      name: "",
    });
    this.organizationSelectOptions =
      response.data && response.data.data
        ? this.dealOrganizationListData(response.data.data.data)
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
  private dealUserListData(data: any) {
    const res = data.map((item: any) => {
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
  private dealOrganizationListData(data: any) {
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
    this.dialogUserVisible = false;
    this.organizationId = "";
    this.formEditFlag = false;
    this.organizationInfo = new OrganizationInfo();
  }

  /**
   * 弹窗取消
   */
  private cancelFun() {
    this.dialogVisible = false;
    this.organizationId = "";
    this.formEditFlag = false;
    this.dialogUserVisible = false;
    this.organizationInfo = new OrganizationInfo();
    this.getData();
  }

  /**
   * 弹窗确认
   */
  private async okFun() {
    let params: any;
    let api: string = "";
    if (this.dialogTitle.indexOf("新增") > -1) {
      params = { ...this.organizationInfo };
      api = organizationApi.add.url;
    } else {
      params = { ...this.organizationInfo, id: this.organizationId };
      api = organizationApi.update.url;
    }
    this.$refs.form.validate(async (valid: boolean) => {
      if (!valid) {
        return false;
      }
      const res: any = await $post(api, params);
      await this.getOrganizationList();
      responseMsg(res.data.success, this.dialogTitle, this.cancelFun);
    });
  }

  /**
   * 获取组织详情
   */
  private async getOrganizationInfo() {
    const res: any = await $get(organizationApi.info.url, { id: this.organizationId });
    const organ: any =
      res.data && res.data.data ? res.data.data : new OrganizationInfo();
    this.organizationInfo = {
      name: organ.name,
      desc: organ.desc,
      leaderId: organ.leader.id,
      parentId: organ.parentId,
      parentName: organ.parentName,
    };
    if (organ.users && organ.users.length > 0) {
          organ.users.forEach((item: any) => {
            this.organUser.userId.push(item.id);
          });
    }
    this.formEditFlag = this.organizationInfo.parentId === -1 ? true : false;
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

  /**
   * 切花展开关闭
   */
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

  /**
   * 添加成员到组织
   */
  private async okAddUserOrganization() {
    this.$refs.form1.validate(async (valid: boolean) => {
      if (!valid)  {
        return false;
      }
      const res: any = await $post(organizationApi.addUser.url,
        {orId: this.organUser.orId, userId: this.organUser.userId.length > 0
            ? this.organUser.userId :
            []});
      responseMsg(
        res.data.success,
        '操作',
        this.cancelFun,
      );
    });
  }

  private async created() {
    await this.getData();
    await this.getOrganizationList();
    await this.getUserList();
  }
}
</script>

<style lang="stylus" scoped>
    .options
        >>>.el-input
                .el-input__inner
                        height 28px !important
</style>
