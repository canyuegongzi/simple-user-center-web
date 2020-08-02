export class ApiResourceDto {
    public id: string | number = '';
    public name: string = '';
    public desc: string = '';
    public value: string = '';
    public type: number = 3; //  '1: 系统， 2： 模块， 3： 接口'
    public parentId: any = '';
    public system: string = '';
    public module: string = '';
    public code: string = '';

}
