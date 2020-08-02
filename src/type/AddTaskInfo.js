export default class AddTaskInfo {
    constructor() {
        this.operateUser = '';
        this.name = '';
        this.content = null;
        this.executeType = 1; // 不能为空 1： 单次 2：循环
        this.isDelay = 0; // 延时 0 否 1是
        this.status = 0; // 任务状态 0 未执行 1 执行中 2 ：执行成功 3 ：执行失败  4： 取消任务
        this.taskType = 1; // 任务类型，1： 邮件 2： 短信 3： socket
        this.executeCount = 0; // 执行次数
        this.maxExecuteCount = 1;
        this.predictDealTime = '';
        this.to = [];
        this.timeType = null;
        this.timeValue = null;
        this.taskConfig = null;
        this.title = null;
        this.app = null; // app
    }
}
//# sourceMappingURL=AddTaskInfo.js.map