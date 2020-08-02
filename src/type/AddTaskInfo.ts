export default class AddTaskInfo {
  public operateUser: string = '';
  public name: string = '';
  public content: string | null = null;
  public executeType: number = 1;  // 不能为空 1： 单次 2：循环
  public isDelay?: number = 0; // 延时 0 否 1是
  public status?: number = 0; // 任务状态 0 未执行 1 执行中 2 ：执行成功 3 ：执行失败  4： 取消任务
  public id?: string;
  public taskCode?: string;
  public taskType: number = 1; // 任务类型，1： 邮件 2： 短信 3： socket
  public executeCount?: number = 0; // 执行次数
  public maxExecuteCount?: number = 1;
  public startTime?: number;
  public predictDealTime?: any = '';
  public endTime?: number;
  public from?: string;
  public to: Array<any> = [];
  public timeType: string | null = null;
  public timeValue: string | null = null;
  public taskConfig: string |null = null;
  public title: string |null = null;
  public app: string |null = null; // app
}
