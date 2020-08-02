const Storage = {
    // ==================sessionsTorage设置缓存================
    // 设置缓存
    sessionSet: (name, data) => {
        sessionStorage.removeItem(name);
        sessionStorage.setItem(name, JSON.stringify(data));
    },
    // 获取缓存
    sessionGet: (name) => {
        // @ts-ignore
        return JSON.parse(sessionStorage.getItem(name));
    },
    // 清除缓存
    sessionRemove: (name) => {
        sessionStorage.removeItem(name);
    },
    // ==================localStorage设置缓存==================
    // 设置缓存
    localSet: (name, data) => {
        localStorage.removeItem(name);
        localStorage.setItem(name, JSON.stringify(data));
    },
    // 获取缓存
    localGet: (name) => {
        try {
            // @ts-ignore
            return JSON.parse(localStorage.getItem(name));
        }
        catch (e) {
            // @ts-ignore
            return localStorage.getItem(name);
        }
    },
    // 清除缓存
    localRemove: (name) => {
        localStorage.removeItem(name);
    },
};
export default Storage;
//# sourceMappingURL=storage.js.map