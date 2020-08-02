<template lang="pug">
    .container
        .header.flex
            .flex
                el-breadcrumb(class="crumbs")
                    el-breadcrumb-item 接口资源
            div()
                el-button(size="mini" type="primary"  @click="editRow('add')") 新增
                el-button(size="mini" type="success"  @click="openSystemModule") 系统模块
                el-button(size="mini" type="danger" @click="deleteRow('deleteRow')") 删除所选
        el-drawer(:visible.sync="drawer"  size="70%" class="auto-drawer" @open="openDrawer" @close="closeDrawer" custom-class="custom-class" :direction="direction" :before-close="handleClose")
            el-scrollbar(style="height:100%;")
                el-radio-group(v-model="drawerValue" size="mini" style="margin-left:8px" @change="getDrawerList")
                    el-radio-button(label="system") 系统列表
                    el-radio-button(label="module") 模块列表
                .header.flex
                    .flex
                        el-input(v-model="query.querySystemStr" placeholder="请输入资源名称搜索" style="width: 140px" size="mini" suffix-icon="el-icon-search")
                        el-select(v-model="query.system" clearable size='mini' v-show="drawerValue == 'module'" placeholder="请选择系统" style="margin-left: 8px;width: 140px")
                            el-option(v-for="item in systemTableData" :label="item.name" :value="item.code" :key="item.value")
                        el-button(size="mini" type="primary" style="margin-left:8px" @click="getDrawerList()") 搜索
                    div(style="margin-right:8px")
                        el-button(size="mini" type="success"  @click="editRowDrawer('add')") 新增
                el-table(:data="systemTableData" border  v-show="drawerValue == 'system'")
                    el-table-column(type="index" align="center" label="序号")
                    el-table-column(prop="name" align="center" label="名称")
                    el-table-column(prop="code" align="center" label="编码")
                    el-table-column(prop="value" align="center" label="属性")
                    el-table-column(prop="crateTime" align="center" label="创建时间")
                    el-table-column(prop="desc" align="center" label="描述")
                    el-table-column(label="操作"  align="center" width="140")
                        template( slot-scope="scope")
                            a(class="operate edit" style="color: #409eff;cursor: pointer;" @click="editRowDrawer('edit', scope.row)") 编辑
                            a(class="operate edit" style="color: #409eff;cursor: pointer;margin-left: 8px" @click="deleteRowDrawer(scope.row)") 删除
                el-table(:data="moduleTableData" border v-show="drawerValue == 'module'")
                    el-table-column(type="index" align="center" label="序号")
                    el-table-column(prop="name" align="center" label="名称")
                    el-table-column(prop="code" align="center" label="编码")
                    el-table-column(prop="system" align="center" label="所属系统")
                    el-table-column(prop="value" align="center" label="属性")
                    el-table-column(prop="crateTime" align="center" label="创建时间")
                    el-table-column(prop="desc" align="center" label="描述")
                    el-table-column(align="center" label="操作")
                        template( slot-scope="scope")
                            a(class="operate edit" style="color: #409eff;cursor: pointer;" @click="editRowDrawer('edit', scope.row)") 编辑
                            a(class="operate edit" style="color: #409eff;cursor: pointer;margin-left: 8px" @click="deleteRowDrawer(scope.row)") 删除
        el-dialog(:visible.sync="drawDialogVisible" @close="dialogClose" width="450px")
            span(slot="title") {{drawerDialogTitle}}
            div(style="height: 320px;overflow: auto; padding: 0")
                el-scrollbar(style="height:100%;")
                    el-form(:model="drawFormInfo" :rules="drawFormInfoRules" ref="form" label-width="110px" class="input-width")
                        el-form-item(label="名称：" prop="name")
                            el-input(v-model="drawFormInfo.name" size="mini"  placeholder="请输入名称")
                        el-form-item(label="编码：" prop="code" v-if="drawerDialogTitle.indexOf('编辑') <= -1")
                            el-input(v-model="drawFormInfo.code" size="mini" placeholder="请输入编码" )
                        el-form-item(label="属性值：" prop="value")
                            el-input(v-model="drawFormInfo.value" size="mini"  placeholder="请输入属性" )
                        el-form-item(label="所属系统：" prop="system" v-if="drawerValue == 'module'")
                            el-select(v-model="drawFormInfo.system" style="width: 100%" size='mini' placeholder="请输入所属系统")
                                el-option(v-for="item in systemTableData" :label="item.name" :value="item.code" :key="item.value")
                        el-form-item(label="描述：" prop="desc")
                            el-input(v-model="drawFormInfo.desc" size="mini"  placeholder="请输入描述")
            div(slot="footer")
                el-button(@click="drawCancelFun" size="mini") 取消
                el-button(type="primary" @click="drawOkFun" size="mini") 确定
        base-table(:dataFormat="tableColumn" :allowDeleteData="allowDeleteData" :tableData="tableData" @editRow="editRow" @deleteRow="deleteRow" :handleSelectionChange="handleSelectionChange")
            .search-items(slot="table-tools")
                .search-item
                    el-input(v-model="query.queryStr" placeholder="请输入资源名称搜索" size="mini" suffix-icon="el-icon-search")
                    el-select(v-model="query.system" clearable size='mini' placeholder="请选择系统")
                        el-option(v-for="item in systemTableData" :label="item.name" :value="item.code" :key="item.value")
                    el-button(icon="el-icon-search" type="primary" @click="getData('search')" size="mini") 搜索
                div
                    el-button(size="mini") 模板下载
                    el-button(size="mini" type="success" ) 资源导入
                    el-button(size="mini" type="primary" @click="openChartAuth") 资源架构
            el-pagination(slot="table-pagination" @size-change="handleSizeChange" :current-page.sync="currentPage"
            :page-size="pageSize"  layout="total, sizes, prev, pager, next, jumper" :total="total")
        el-dialog(:visible.sync="dialogVisible" @close="dialogClose" width="450px")
            span(slot="title") {{dialogTitle}}
            div(style="height: 320px;overflow: auto; padding: 0")
                el-scrollbar(style="height:100%;")
                    el-form(:model="apiResourceDto" :rules="apiResourceDtoRules" ref="form" label-width="110px" class="input-width")
                        el-form-item(label="名称：" prop="name")
                            el-input(v-model="apiResourceDto.name" size="mini"  placeholder="请输入名称")
                        el-form-item(label="编码：" prop="code" v-if="dialogTitle.indexOf('编辑') <= -1")
                            el-input(v-model="apiResourceDto.code"  size="mini" :disabled="dialogTitle.indexOf('编辑') > -1" placeholder="请输入编码" )
                        el-form-item(label="属性值：" prop="value")
                            el-input(v-model="apiResourceDto.value" size="mini"  placeholder="请输入属性值" )
                        el-form-item(label="系统：" prop="system")
                            el-select(v-model="apiResourceDto.system" @change="systemChange" clearable style="width: 100%" size='mini' placeholder="请输入所属系统")
                                el-option(v-for="item in systemTableData" :label="item.name" :value="item.code" :key="item.value")
                        el-form-item(label="模块：" prop="module")
                            el-select(v-model="apiResourceDto.module" clearable style="width: 100%" size='mini' placeholder="请输入所属系统")
                                el-option(v-for="item in moduleList" :label="item.name" :value="item.code" :key="item.value")
                        el-form-item(label="描述：" prop="desc")
                            el-input(v-model="apiResourceDto.desc" size="mini" placeholder="请输入描述" )
            div(slot="footer")
                el-button(@click="cancelFun" size="mini") 取消
                el-button(type="primary" @click="okFun" size="mini") 确定
        el-dialog(:visible.sync="dialogChartAuth" fullscreen @close="dialogClose" width="800px")
            span(slot="title") 资源架构
            div(style="overflow: auto; padding: 0")
                el-scrollbar(style="height:100%;")
                    vue2-org-tree(:render-content="renderContent" @on-node-click="onNodeClick" name="test" :horizontal="horizontal" :collapsable="collapsable"  @on-expand="onExpand" :data="authAllTreeData" :prop="{label: 'name', children: 'children', expand: 'expand'}")
</template>

<script lang="ts">
    import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
    import BaseHeader from "@/components/table-page/BaseHeader.vue";
    import BaseTable from "@/components/table-page/BaseTable.vue";
    import { $post, $get } from "@/utils/feth";
    import {authApi, systemApi, apiResourceApi} from "@/api/api";
    import { validEmail } from "@/utils/validate";
    import Rule from "@/type/Rule";
    import SelectOption from "@/type/SelectOption";
    import { confirmDelete, responseMsg } from "@/utils/response";
    import {ApiResourceDto} from "./apiResource";
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
        public apiResourceDtoRules = {
            name: [new Rule({ message: "名称不能为空" })],
            code: [
                new Rule({ message: "编码不能为空" }),
                new Rule({ required: true, trigger: 'blur', message: '账号只能是数字、字母、下划线' }, (rule, value, callback) => {
                    if (!(/^[A-Za-z0-9_]+$/.test(value))) {
                        callback(new Error('编码只能是数字、字母、下划线'))
                    } else {
                        callback()
                    }
                }),
                {
                    validator: (rule, value, callback, source, options) => {
                        const that = this
                        if (value != "" && value != null) {
                            $post(apiResourceApi.uniqueApi.url, {
                                apiCode: value,
                            }).then((response:any) => {
                                console.log(response)
                                console.log(this.oldCode)
                                console.log(this.dialogTitle)
                                if (!response.data || !response) {
                                    if (this.dialogTitle.indexOf('编辑') > -1) {

                                        if (this.oldCode === value) {
                                            callback()
                                        }
                                    }else {
                                        callback(new Error('编码已经存在'))
                                    }

                                } else {
                                    callback()
                                }
                            })
                        } else {
                            callback()
                        }
                    },
                    trigger: "blur"
                },
            ],
            value: [new Rule({ message: "属性值不能为空" })],
            system: [new Rule({message: "所属系统不能为空"})],
            module: [new Rule({message: "模块不能为空"})],
        };
        public drawFormInfoRules = {
            name: [new Rule({ message: "名称不能为空" })],
            code: [new Rule({ message: "编码不能为空" })],
            value: [new Rule({ message: "属性不能为空" })],
        }
        public $refs!: {
            form: HTMLFormElement;
            treeSelect: any;
        };
        public tableColumn = [
            { prop: "name", label: "名称", width: 120 },
            { prop: "code", label: "编码", width: 120 },
            { prop: "system", label: "系统", width: 120 },
            { prop: "module", label: "模块", width: 120 },
            { prop: "crateTime", label: "创建时间", width: 130 },
            { prop: "value", label: "属性值" },
            { prop: "desc", label: "描述" },
        ];
        public apiResourceDto = new ApiResourceDto();
        public drawFormInfo = {
            name: '',
            code: '',
            value: '',
            system: '',
            module: '',
            desc: '',
            type: 1
        }
        public tableData = [];
        public moduleList = []; // 模块
        public systemTableData = [];
        public moduleTableData = [];
        public currentPage: number = 1;
        public drawerValue: string = 'system';
        public selectedRow: Array<number | string> = [];
        public drawerSelectedRow: Array<number | string> = [];
        public pageSize: number = 10;
        public drawerId: any = ''
        public oldCode: any = ''
        public total: number = 0;
        public pageTitle: string = "新增";
        public query: any = {
            queryStr: "",
            system: '',
            querySystemStr: '',
            queryModuleStr: '',
        };
        public dialogVisible: boolean = false;
        public drawDialogVisible: boolean = false;
        public drawer: boolean = false;
        public dialogChartAuth: boolean = false;
        public dialogTitle: string = "新增资源";
        public drawerDialogTitle: string = "新增系统";
        public direction: string = "rtl";
        public formEditFlag: boolean = false;
        public authSelectOptions: SelectOption[] = [];
        public roleSelectOptions: SelectOption[] = [];
        public systemSelectOptions: SelectOption[] = [];
        public authId: any = "";
        public authTreeData: any = [];
        public authAllTreeData: any = [];
        public horizontal: boolean =  false;
        public collapsable: boolean = true;
        public expandAll: boolean = false;
        public resList: SelectOption[] = [];
        public elTreeSelectStyle = {
            width: '290px',
            height: '28px',
            fontSize: '12px'
        };
        public selectTreeParams = {
            multiple: false,
            clearable: true,
            filterable: true,
            placeholder: '请选择'
        };
        public treeParams = {
            data: [],
            clickParent: true,
            filterable: true,
            'check-strictly': true,
            'default-expand-all': false,
            'expand-on-click-node': false,
            props: {
                children: 'children',
                label: 'name',
                disabled: 'disabled',
                value: 'id'
            }
        }

        @Watch("currentPage", { deep: true, immediate: false })
        public currentPageChange(val: any, oldVal: any) {
            this.getData();
        }

        /**
         * 打开抽屉进行系统配置
         */
        public openSystemModule() {
            this.drawer = true
            this.drawerId = ''
        }
        /**
         * 打开抽屉
         */
        public openDrawer() {
            console.log('打开抽屉')
            this.drawerId = ''
            this.getDrawerList()
        }

        /**
         * 关闭抽屉
         */
        public closeDrawer() {
            console.log('关闭抽屉')
            this.drawerId = ''
        }

        /**
         * 编辑抽屉
         */
        public editRowDrawer(flag: string,  data: any) {
            this.drawDialogVisible = true
            if (flag == 'add') {
                this.drawerDialogTitle = this.drawerValue === 'system' ?  '新增系统' : '新增模块'
                this.drawFormInfo = {
                    name: '',
                    code: '',
                    value: '',
                    module:'',
                    desc: '',
                    system: '',
                    type: this.drawerValue === 'system' ? 1 : 2
                }
            } else if (flag == 'edit') {
                console.log(data)
                this.drawerDialogTitle = this.drawerValue === 'system' ?  '编辑系统' : '编辑模块'
                this.drawerId = data.id
                this.drawFormInfo = {
                    name: data.name,
                    code: data.code,
                    value: data.value,
                    system: data.system,
                    module: data.module,
                    type: data.type,
                    desc: data.desc,
                    id: data.id,
                }
            }
        }

        /**
         * 删除抽屉
         */
        public deleteRowDrawer(data: any) {
            const ids = data == "deleteRow" ? this.drawerSelectedRow : [data.row.id];
            if (ids.length < 1 || ids === null) {
                this.$message({
                    message: "请先选择要删除的数据！",
                    type: "warning",
                });
                return false;
            }
            // confirmDelete(authApi.deleteAuth.url, this.getData, { id: ids });
        }

        /**
         * 关闭抽屉
         */
        public handleClose(done: any) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        }

        /**
         * 查询系统下的模块
         */
        public async systemChange(value: string) {
            let list = []
            try {
                const res = await $get(apiResourceApi.moduleList.url, {system: value})
                console.log(res)
                list = res.data.data.data
            }catch (e) {
                console.warn(e)
                list = []
            }
            this.moduleList = list
            return list
        }

        /**
         * 抽屉列表搜索
         */
        public async getDrawerList() {
            let res: any
            if (this.drawerValue === 'system') {
                const params = {
                    name: this.query.querySystemStr
                }
                res = await $get(apiResourceApi.systemList.url, params)
                this.systemTableData = res.data.data.data
            }else if (this.drawerValue === 'module') {
                const params = {
                    name: this.query.querySystemStr,
                    system: this.query.system
                }
                res = await $get(apiResourceApi.moduleList.url, params)
                this.moduleTableData = res.data.data.data
            }
            console.log(res)
        }

        /**
         * 抽屉弹框取消
         */
        public drawCancelFun() {
            this.drawDialogVisible = false
            this.drawerId = ''
            this.drawFormInfo = {
                name: '',
                code: '',
                desc: '',
                value: '',
                module: '',
                system: '',
                type: this.drawerValue === 'system' ? 1 : 2
            }
        }

        /**
         * 抽屉弹框确认
         */
        public drawOkFun() {
            this.$refs.form.validate(async (valid: boolean) => {
                if (!valid) {
                    return false;
                }
                let api: string = '';
                let params:any = {}
                if (this.drawerValue === 'system') {
                    api = this.drawerDialogTitle.indexOf('编辑') > -1 ? apiResourceApi.resourceEdit.url: apiResourceApi.resourceAdd.url
                    params = {...params, ...this.drawFormInfo,  type: 1, parentId: -1}
                }else if (this.drawerValue === 'module') {
                    api = this.drawerDialogTitle.indexOf('编辑') > -1 ? apiResourceApi.resourceEdit.url: apiResourceApi.resourceAdd.url
                    params = {...params, ...this.drawFormInfo, type: 2, id: this.drawerId}
                    const currentSystem: any = this.systemTableData.find((item: any) => {
                        return item.code === this.drawFormInfo.system
                    })
                    console.log(this.systemTableData)
                    console.log(currentSystem)
                    params = {...params, ...this.drawFormInfo, type: 2, id: this.drawerId, parentId: currentSystem.id}
                }

                const res: any = await $post(api, params);
                responseMsg(res.data.success, this.dialogTitle, this.drawerCallback);

            });
        }

        /**
         * 抽屉操作回调
         */
        drawerCallback() {
            this.drawerId = ''
            this.drawDialogVisible = false
            this.drawFormInfo = {
                name: '',
                code: '',
                desc: '',
                value: '',
                module: '',
                system: '',
                type: this.drawerValue === 'system' ? 1 : 2
            }
           this.getDrawerList()
        }
        /**
         * 编辑新增
         */
        public async editRow(data: any) {
            this.dialogTitle = data !== 'add' ? '编辑资源' : '新增资源'
            this.dialogVisible = true;
            this.apiResourceDto = new ApiResourceDto();
            if(data !== 'add') {
                this.authId = data.row.id
                this.apiResourceDto = {...data.row}
                this.systemChange(data.row.system)
                this.oldCode = data.row.code
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
            confirmDelete(apiResourceApi.deleteApi.url, this.getData, { ids: ids, type: 3 });
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

        public isRootChange (val:any) {
            if (val == 1) {
                this.apiResourceDto.parentId = -1
            } else {
                this.$nextTick(() => {
                    if (this.$refs.treeSelect) {
                        // @ts-ignore
                        this.$refs.treeSelect.treeDataUpdateFun(this.authTreeData)
                    }
                })
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
            const response: any = await $get(apiResourceApi.resourceList.url, {
                page: this.currentPage,
                pageSize: this.pageSize,
                name: this.query.queryStr,
                system: this.query.system,
            });
            this.total = (response.data && response.data.data.count) || 0;
            this.tableData =
                response.data && response.data.data ? response.data.data.data : [];
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
        public async getSystemList() {
            const response: any = await $get(systemApi.all.url, {});
            this.systemSelectOptions =
                response.data && response.data.data
                    ? this.dealSystemListData(response.data.data)
                    : [];
            return false;
        }

        /**
         * 获取全部的功能
         */
        public async getAuthList() {
            const response: any = await $get(authApi.allAuthList.url, {});
            const treeData = response.data && response.data.data
                ? listToTree(response.data.data.data, 'id', 'parentId', 'children')
                : [];
            this.authTreeData = treeData.length > 0 ? treeData : [];
            this.authAllTreeData = {
                id: '-1',
                children: treeData,
                name: '资源架构'
            };
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
         * 处理系统列表
         */
        private dealSystemListData(data: any) {
            const res = data.map((item: ApiResourceDto) => {
                return {
                    label: item.name,
                    value: item.value,
                };
            });
            return res;
        }

        /**
         * 弹窗关闭
         */
        public dialogClose() {
            this.dialogVisible = false;
            this.dialogChartAuth = false;
            this.authId = "";
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
            this.authId = "";
            this.formEditFlag = false;
            this.apiResourceDto = new ApiResourceDto();
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
            let api: string = "";
            const currentModule = this.moduleList.find((item:any) => {
                return item.code === this.apiResourceDto.module
            })
            if (this.dialogTitle.indexOf("新增") > -1) {
                params = { ...this.apiResourceDto, parentId: currentModule.id };
                api = apiResourceApi.resourceAdd.url;
            } else {
                params = { ...this.apiResourceDto, id: this.authId, parentId: currentModule.id };
                api = apiResourceApi.resourceEdit.url;
            }
            console.log(params)
            this.$refs.form.validate(async (valid: boolean) => {
                if (!valid) {
                    return false;
                }
                const res: any = await $post(api, params);
                this.oldCode = ''
                responseMsg(res.data.success, this.dialogTitle, this.cancelFun);
            });
        }

        /*private async getApiResourceDto() {
            const res: any = await $get(authApi.getInfo.url, { id: this.authId });
            const auth: any =
                res.data && res.data.data ? res.data.data : new ApiResourceDto();
            this.apiResourceDto = {
                name: auth.name,
                desc: auth.desc,
                code: auth.code,
                parentId: auth.parentId,
                parentName: auth.parentName,
                isRoot: (auth.parentId == -1 || auth.parentId == '-1') ? 1 : 0,
                icon: auth.icon,
                path: auth.path,
                system: auth.system,
                value: auth.value
            };
            this.isRootChange(this.apiResourceDto.isRoot);
        }*/

        /**
         * 打开资源架构
         */
        public async openChartAuth() {
            this.dialogChartAuth = true;
            await this.getAuthList();
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

        private async created() {
            await this.getData();
            await this.getDrawerList();
        }
    }
</script>

<style lang="stylus" scoped>
    .header
        padding 0 0 0 8px
    .custom-class
        >>>#el-drawer__header
                margin-bottom 0
                height 0
</style>
