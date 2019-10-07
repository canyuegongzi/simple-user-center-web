const Storage = {
  // ==================sessionsTorage设置缓存================
  // 设置缓存
  sessionSet: (name: string, data: any) => {
    sessionStorage.removeItem(name);
    sessionStorage.setItem(name, JSON.stringify(data));
  },
  // 获取缓存
  sessionGet: (name: string) => {
    // @ts-ignore
    return JSON.parse(sessionStorage.getItem(name));
  },
  // 清除缓存
  sessionRemove: (name: string) => {
    sessionStorage.removeItem(name);
  },
  // ==================localStorage设置缓存==================
  // 设置缓存
  localSet: (name: string, data: any) => {
    localStorage.removeItem(name);
    localStorage.setItem(name, JSON.stringify(data));
  },
  // 获取缓存
  localGet: (name: string) => {
    try {
      // @ts-ignore
      return JSON.parse(localStorage.getItem(name));
    } catch (e) {
      // @ts-ignore
      return localStorage.getItem(name);
    }
  },
  // 清除缓存
  localRemove: (name: string) => {
    localStorage.removeItem(name);
  },

};

export default Storage;

