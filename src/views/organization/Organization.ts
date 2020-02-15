export default class OrganizationInfo {
  public name: string = '';
  public id?: any = '';
  public desc: string = '';
  public code?: string | number = '';
  public parentId?: string | number = '';
  public parentName?: string  = '';
  public leaderId?: any = '';
  public leaderName?: string = '';
  public isRoot?: number = 1;
}
