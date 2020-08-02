import Vue from 'vue';
export function responseMsg(success: boolean, title: string, callback: () => void) {
  console.log(success);
  if (success) {
    Vue.prototype.$message({
      message: title + "成功！",
      type: "success",
      center: true,
    });
    if (typeof callback === "function") {
      callback();
    }
  } else {
    Vue.prototype.$message({
      message: title + "错误！",
      type: "error",
    });
    if (typeof callback === "function") {
      callback();
    }
  }
}

export function confirmDelete(path: string, callback: () => void, params: any, server?: string) {
  Vue.prototype.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    console.log(params);
    Vue.prototype.$post(path, params, server).then((response: any) => {
      console.log(response);
      responseMsg(response.data.success, "删除", callback);
    });
  }).catch(() => { });
}
