<template lang="pug">
    .container.mg0
        el-form(:model="addTaskInfo" :rules="addTaskInfoRules" ref="form" label-width="150px" class="demo-ruleForm" size="mini")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="任务名称：" prop="name")
                        el-input(v-model="addTaskInfo.name" size="mini" placeholder="请输入屬性名称")
            // el-row(type="flex" justify="center" :gutter="0")
            //     el-col(:span="12")
            //         el-form-item(label="所属应用：" prop="app")
            //             el-select(v-model="addTaskInfo.app" style="width: 100%" placeholder="请选择所属应用" @change="appChange")
            //                 el-option(:label="item.name" v-for="(item, index) in appList" :key="index" :value="item.name")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="推送方式：" prop="taskType")
                        el-radio-group(v-model="addTaskInfo.taskType" @change="noticeTypeChange")
                            el-radio(:label="1") 邮件推送
                            el-radio(:label="2" :disabled="!currentUserInfo.phone") 短信推送
                            el-radio(:label="3" :disabled="true") websocket
                            el-radio(:label="4" :disabled="true") APP
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="推送配置模板：" prop="taskConfig")
                        el-select(v-model="addTaskInfo.taskConfig" style="width: 100%" size="mini" placeholder="请选择推送模板,推送配置为空时系统将采用默认配置推送")
                            el-option(v-for="item in currentConfigList" :value="item.name" :label="item.name" :key="item.id")
                        el-button(type="text" @click="loadDefaultConfigList" v-show="!currentConfigList.length") 获取默认推送配置
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="执行类型：" prop="executeType")
                        el-radio-group(v-model="addTaskInfo.executeType" @change="executeTypeChange")
                            el-radio(:label="1") 单次执行
                            el-radio(:label="2") 循环执行
            el-row(type="flex" justify="center" :gutter="0" v-if="addTaskInfo.executeType === 2")
                el-col(:span="12")
                    el-form-item(label="循环执行时间维度：" prop="timeType")
                        el-select(v-model="addTaskInfo.timeType" style="width: 100%" placeholder="请选择循环执行时间维度" @change="timeTypeChange")
                            el-option(label="每小时" value="hours")
                            el-option(label="每天" value="days")
                            <!--el-option(label="每周" value="weeks")-->
            el-row(type="flex" justify="center" :gutter="0" v-if="addTaskInfo.executeType === 2 && addTaskInfo.timeType == 'hours'")
                el-col(:span="12")
                    el-form-item(label="循环执行时间颗粒：" prop="timeValue")
                        el-select(v-model="addTaskInfo.timeValue" style="width: 100%" placeholder="循环执行时间颗粒")
                            el-option(:label="`${item}分`" :value="`${item < 10 ? '0' + item :item}`" :key="index" v-for="(item, index) in hoursTimeList")
            el-row(type="flex" justify="center" :gutter="0" v-if="addTaskInfo.executeType === 2 && addTaskInfo.timeType == 'days'")
                el-col(:span="12")
                    el-form-item(label="循环执行时间颗粒：" prop="timeValue")
                        el-time-picker(v-model="addTaskInfo.timeValue" format="HH:mm:00" value-format="HH:mm" placeholder="循环执行时间颗粒")
            el-row(type="flex" justify="center" :gutter="0" v-if="addTaskInfo.executeType===1")
                el-col(:span="12")
                    el-form-item(label="是否延时任务：" prop="isDelay")
                        el-radio-group(v-model="addTaskInfo.isDelay")
                            el-radio(:label="0") 否
                            el-radio(:label="1") 是
            el-row(type="flex" justify="center" :gutter="0" v-if="addTaskInfo.executeType===2")
                el-col(:span="12")
                    el-form-item(label="最大执行次数：" prop="maxExecuteCount")
                        el-input-number(v-model="addTaskInfo.maxExecuteCount" :min="1" :max="3" size="mini")
            el-row(type="flex" justify="center" :gutter="0" v-if="addTaskInfo.executeType===1 && addTaskInfo.isDelay === 1")
                el-col(:span="12")
                    el-form-item(label="任务执行时间：" prop="predictDealTime")
                        el-date-picker(v-model="addTaskInfo.predictDealTime" @change="selfTimeSelectChange" :picker-options="selfDateDateOptions1" ref="tracStartTimeSelect" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" :clearable="false" placeholder="选择任务执行时间" type="datetime" size="mini")
            el-row(type="flex" justify="center" :gutter="0" v-for="(itemTo, index) in addTaskInfo.to" :key="itemTo.key")
               el-col(:span="12")
                   el-form-item(:label="`推送对象${index + 1}：`"
                       :rules="{required: true, message: '推送对象不能为空', trigger: 'blur'}")
                       el-input(v-model="itemTo.value" placeholder="请输入推送对象" @blur="(e) => emailChange(e, itemTo)" :disabled="true")
                       //    template(slot="append")
                       //         el-button(@click.prevent="removeDomain(itemTo)" type="primary") 删除
            // el-row(type="flex" justify="center" :gutter="0")
            //     el-col(:span="12")
            //         el-form-item(label="推送对象操作：")
            //             el-button(@click="addDomain" type="primary" size="mini") 新增
            //             el-button(@click="resetDomain" size="mini") 重置
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="推送主题：" prop="title")
                        el-input(v-model="addTaskInfo.title" type="textarea" size="mini" placeholder="请输入推送主题")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    el-form-item(label="推送内容：" prop="content")
                        el-input(v-model="addTaskInfo.content" type="textarea" size="mini" placeholder="请输入推送内容")
            el-row(type="flex" justify="center" :gutter="0")
                el-col(:span="12")
                    .footer
                        el-button(type="primary" @click="okFun" size="mini") 确定
                        el-button(@click="cancelFun" size="mini") 重置
</template>

<<script lang="ts">
  import {MimeStorage} from "@/utils/localStorage";
  import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
  import Rule from "@/type/Rule";
  import BaseHeader from "@/components/table-page/BaseHeader.vue";
  import BaseTable from "@/components/table-page/BaseTable.vue";
  import {$get, $post} from "@/utils/feth";
  import {appKeyApi, kafkaApi, taskApi, taskConfigApi, taskMessageConfigApi} from "@/api/api";
  import AddTaskInfo from "@/type/AddTaskInfo";
  import moment from "moment";
  import FormPageHead from "@/components/form/FormPageHead.vue";
  import UserInfo from "@/views/user/User";
  @Component({
    components: {
      BaseHeader,
      BaseTable,
      FormPageHead,
    },
  })
  export default class AddTask extends Vue {

    @Prop({ type: Object, default: () => { return new UserInfo(); }})
    public currentUserInfo: any;

    public addTaskInfo: AddTaskInfo = new AddTaskInfo();
    public productAttrList = []
    public configIdList = []
    public config2IdList = []
    private token: any;
    private attrId: string | (string | null)[] = '';
    private attrType: string | (string | null)[] = ''
    public currentRow: any;
    public pageTitle: string = '信息推送';
    public selfDateDateOptions1: any =  this.timeDisabledDate()
    public addTaskInfoRules = {
      name: [
        new Rule({message: '名称不能为空'}),
      ],
      app: [new Rule({message: 'app不能为空'})],
      taskType: [
        new Rule({message: '任务类型不能为空'}),
      ],
      configId: [
        new Rule({message: '推送模板配置不能为空'}),
      ],
      isDelay: [
        new Rule({message: '是否延时不能为空'}),
      ],
      to: [
        new Rule({message: '推送对象不能为空'}),
      ],
      predictDealTime: [
        new Rule({message: '任务执行时间不能为空'}),
        new Rule({ message: '' }, (rule, value, callback) => {
          if (moment(this.addTaskInfo.predictDealTime).valueOf() <= moment().valueOf()) {
            callback(new Error('选择时间必要大于当前时间'))
          }
          if (moment(this.addTaskInfo.predictDealTime).valueOf() >= moment().add(24, 'hours').valueOf()) {
            callback(new Error('执行时间暂时只支持未来一天内时间'))
          }
          callback()
        }),

      ],
      content: [
        new Rule({message: '推送内容不能为空'}),
      ],
      title: [
        new Rule({message: '推送主题不能为空'}),
      ],
      executeType:[
        new Rule({message: '执行类型不能为空'}),
      ],
      timeType: [
        new Rule({message: '时间维度不能为空', trigger: 'change'}),
      ],
      timeValue: [
        new Rule({message: '时间颗粒不能为空', trigger: 'change'}),
      ]
    };
    public $refs!: {
      form: HTMLFormElement,
      form1: HTMLFormElement,
    };
    public formInfo: any =  null;
    public hoursTimeList: any =  [];
    public appList: any =  [];
    public id: number | string = '';
    public loading: any = null;
    public query: any = {
      queryStr:  '',
    };

    @Watch('currentUserInfo', { deep: true, immediate: true })
    public currentUserInfoChange(val: any, oldVal: any) {
        const targetValue: string = this.addTaskInfo.taskType === 1 ? val.email: val.phone
        this.addTaskInfo.to = [
            {
                key: Date.now(),
                value: targetValue
            }
        ]
    }

    get currentConfigList() {
      switch (this.addTaskInfo.taskType) {
        case 1:
          return this.configIdList
        case 2:
          return this.config2IdList
        default:
          return this.configIdList
      }
    }
    public goBack()  {
      this.$router.back()
    }

    public noticeTypeChange(val: any) {
      this.addTaskInfo.taskConfig = null
      const targetValue: string = this.addTaskInfo.taskType === 1 ? this.currentUserInfo.email: this.currentUserInfo.phone
      this.addTaskInfo.to = [
          {
              key: new Date().getTime(),
              value: targetValue
          }
      ]
    }

    public removeDomain(item: any) {
      const index = this.addTaskInfo.to.indexOf(item)
      if (index !== -1) {
        this.addTaskInfo.to.splice(index, 1)
      }
    }

    public emailChange(e: any, row: any) {
        const reg1 = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        const reg2 = /^((13[0-9])|(15[^4,\D])|(18[0,5-9]))\d{8}$/
        if(this.addTaskInfo.taskType === 1) {
          if (!reg1.test(row.value)) {
            this.$message.warning('请输入合法的邮箱')
            row.value = ''
          }
        }
        if(this.addTaskInfo.taskType === 2) {
          if (!reg2.test(row.value)) {
            this.$message.warning('请输入合法的手机号')
            row.value = ''
          }
        }


    }

    public addDomain() {
      this.addTaskInfo.to.push({
        value: '',
        key: Date.now()
      })
    }

    public async getAppList() {
        const response: any = await $post(appKeyApi.list.url, {
          page: 1,
          pageSize: 100,
          status: '1'
        }, 'push');
        const list = response.data && response.data.data ? response.data.data : [];
        this.appList = list
    }
    get timeValueList() {
      const type = this.addTaskInfo.timeType
      switch (type) {
            case 'hours':
                  const list = (() => {
                    const hours = []
                    for (let i = 0; i < 24; i++) {
                      hours.push({value: i, label: i + '点'})
                    }
                    return hours
                  })()
                  return list
                  break
            case 'days':
                  return []
                  break
            case 'weeks':
              const weeks = (() => {
                const hours = []
                for (let i = 1; i < 8; i++) {
                  hours.push({value: i, label: '周' + i})
                }
                return hours
              })()
              return weeks
              break
            default:
              return []
      }
    }
    public resetDomain() {
      this.addTaskInfo.to.forEach((item: any, index: number) => {
        item.value = ''
      })
    }

    public timeTypeChange() {
      this.addTaskInfo.timeValue=''
    }
    /**
     * 弹窗取消
     */
    private cancelFun() {
      this.id = '';
      this.$refs.form.resetFields();
      /*this.addTaskInfo = new AddTaskInfo()
      this.addTaskInfo.type = Number(this.attrType)*/

    }

    public executeTypeChange(value: number) {
        try{
          this.$nextTick(() =>{
            this.$refs.form.clearValidate('timeType')
          })
        } catch (e) {
          console.warn(e);
        }
        this.addTaskInfo.timeType = ''
        this.addTaskInfo.timeValue = ''
        this.addTaskInfo.maxExecuteCount = 1

    }

    private timeDisabledDate() {
      const that = this
      return {
        disabledDate (time: any) {
          return (time.getTime() <= moment().startOf("hour").valueOf()) || (time.getTime() >= moment().add(24, 'hours').startOf("hour").valueOf())
        }
      }

    }

    /**
     * 添加任务
     */
    private async okFun() {
      let params: any;
      params = { ...this.addTaskInfo };
      params.operateUser = Vue.prototype._user.name
      const list= params.to.map((item: any) => {return item.value})
      if(list.length <= 0) {
        this.$message.warning('推送对象不能为空');
        return
      }
      params.to = list.join(',')
      if(params.executeType === 2) {
        params.isDelay = 1;
      }
      this.$refs.form.validate(async (valid: boolean) => {
        if (!valid) {
          return false;
        }
        this.loading = this.$loading({
          lock: true,
          text: '应用鉴权中，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        const isExperienceList = this.currentConfigList.filter((item: any) => {
          return item.isExperience === true
        })
        const canSubmit: any = await $post(taskMessageConfigApi.canSubmit.url, {taskType: this.addTaskInfo.taskType, submitType: isExperienceList.length > 0 ? '2' : '1'}, 'push')
        if (canSubmit || canSubmit.flag) {
          const res: any = await $post(kafkaApi.newTask.url, params);
          if (Array.isArray(res) && res.length > 0 && res[0].errorCode === 0) {
            this.$message({
              message: '任务已添加至队列，等待执行中',
              type: "success",
              center: true,
            });
            this.addTaskInfo = new AddTaskInfo();
            this.$emit('successPush')
          } else {
            this.$message({
              message: '操作失败',
              type: "error",
              center: true,
            });
          }
        }else {
          this.$message.error(canSubmit.message ? canSubmit.message : '任务队列已达峰值，请稍后再试')
        }
        this.loading.close();
      });
    }

    public selfTimeSelectChange() {
        if (moment(this.addTaskInfo.predictDealTime).valueOf() <= moment().valueOf()) {
          // this.$message.warning('请选择合法的执行时间');
          // this.addTaskInfo.predictDealTime = ''
              // return;
        }
    }

    /**
     * 获取全部的商品类型configIdList
     */
    public async getAllConfig1IdList() {
      try {
        const response: any = await $post(taskConfigApi.list.url, {status: 1}, 'push');
        this.configIdList = response.data.data
        this.configIdList.forEach((item: any, index: number) => {
          item.label = item.name
          item.value = item._id
        })
      }catch (e) {
        this.configIdList = [];
      }

    }

    /**
     * 获取全部的商品类型configIdList
     */
    public async getAllConfig2IdList() {
      try {
        const response: any = await $post(taskMessageConfigApi.list.url, {status: 1}, 'push');
        this.config2IdList = response.data.data
        this.config2IdList.forEach((item: any, index: number) => {
          item.label = item.name
          item.value = item._id
        })
      }catch (e) {
        this.config2IdList = [];
      }

    }

    public async loadDefaultConfigList() {
      const type: any = this.addTaskInfo.taskType
      try {
        const response: any = await $post(taskConfigApi.defaultList.url, {type: type}, 'push');
        const list = response.data
        const tempList = list.map((item: any, index: number) => {
          return {
            label: item.name,
            value: item.id,
            isExperience : true,
            ...item
          }
        })
        if (type === 1) {
          this.configIdList = tempList
        }else if (type === 2) {
          this.config2IdList = tempList
        }
      }catch (e) {
        console.log('配置加载失败');
      }
      console.log('开始加载体验配置')
    }


    private async created() {
      const mimeStorage = new MimeStorage();
      const token: any = mimeStorage.getItem('token');
      this.token = token;
      this.attrId = this.$route.query.id
      this.attrType = this.$route.query.type + ''
      await this.getAllConfig1IdList()
      await this.getAllConfig2IdList()
      await this.getAppList()
      const list: any = (() => {
        const hourList:Array<number> = []
        for(let i = 1; i < 60; i++ ) {
          hourList.push(i)
        }
        return hourList
      })()
      this.hoursTimeList = list
    }
  }
</script>

<style scoped lang="stylus">
    .footer
        justify-content center
        display flex
        margin-top 32px
        margin-bottom 32px
    .demo-ruleForm
        margin-top 32px
</style>
