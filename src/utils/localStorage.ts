export class MimeStorage {
  private name: string;
  constructor(name?: string) {
    this.name = 'storage';
  }
  public setItem(params: any) {
    const obj = {
      name: '',
      value: '',
      expires: "",
      startTime: new Date().getTime(),
    };
    const options: any = {};
    Object.assign(options, obj, params);
    if (options.expires) {
      localStorage.setItem(options.name, JSON.stringify(options));
    } else {
      const type = Object.prototype.toString.call(options.value);
      if (Object.prototype.toString.call(options.value) == '[object Object]') {
        options.value = JSON.stringify(options.value);
      }
      if (Object.prototype.toString.call(options.value) == '[object Array]') {
        options.value = JSON.stringify(options.value);
      }
      localStorage.setItem(options.name, options.value);
    }
  }
  public getItem(name: any) {
    let item: any = localStorage.getItem(name);
    try {
      item = JSON.parse(item);
    } catch (error) {
      item = item;
    }
    if (item && item.startTime) {
      const date = new Date().getTime();
      if (date - item.startTime > item.expires) {
        localStorage.removeItem(name);
        return false;
      } else {
        return item.value;
      }
    } else {
      return item;
    }
  }
  // 移出缓存
  public removeItem(name: any) {
    localStorage.removeItem(name);
  }
  // 移出全部缓存
  public clear() {
    localStorage.clear();
  }
}
