export const userApi = {
  allUserLit: {
    method: 'get',
    url: '/user/all',
  },
  userList: {
    method: 'get',
    url: '/user/list',
  },
  addUser: {
    method: 'post',
    url: '/user/register',
  },
  updateUser: {
    method: 'post',
    url: '/user/update',
  },
  deleteUser: {
    method: 'post',
    url: 'user/delete',
  },
  getInfo: {
    method: 'get',
    url: '/user/getUserInfo',
  },
};
export const roleApi = {
  allRoleList: {
    method: 'get',
    url: '/role/all'
  },
  roleList: {
    method: 'get',
    url: 'role/list',
  },
  addRole: {
    method: 'post',
    url: '/role/add',
  },
  updateRole: {
    method: 'post',
    url: '/role/update',
  },
  deleteRole: {
    method: 'post',
    url: '/role/delete',
  },
  getInfo: {
    method: 'get',
    url: '/role/getRoleInfo',
  },
  addAuthToRole: {
    method: 'post',
    url: '/role/addAuthToRole',
  },
  addApiAuthToRole: {
    method: 'post',
    url: '/role/addApiAuthToRole',
  },
  authByRole: {
    method: 'get',
    url: '/role/authByRole',
  },
  authApiByRole: {
    method: 'get',
    url: '/role/authApiByRole',
  },

};
export const authApi = {
  allAuthList: {
    method: 'get',
    url: '/authority/all',
  },
  authList: {
    method: 'get',
    url: '/authority/list',
  },
  addAuth: {
    method: 'post',
    url: '/authority/add',
  },
  updateAuth: {
    method: 'post',
    url: '/authority/update',
  },
  deleteAuth: {
    method: 'post',
    url: '/authority/delete',
  },
  authTree: {
    method: 'get',
    url: '/authority/tree',
  },
  apiAuthTree: {
    method: 'get',
    url: '/apiResource/tree',
  },
  getInfo: {
    method: 'get',
    url: '/authority/getAuthInfo',
  },
};
export const organizationApi = {
  all: {
    method: 'post',
    url: '/organization/all',
  },
  add: {
    method: 'post',
    url: '/organization/add',
  },
  addUser: {
    method: 'post',
    url: '/organization/addUser',
  },
  update: {
    method: 'update',
    url: '/organization/update',
  },
  delete: {
    method: 'update',
    url: '/organization/delete',
  },
  info: {
    method: 'get',
    url: '/organization/organizationInfo',
  },
  list: {
    method: 'get',
    url: '/organization/list',
  },
  // 组织用户树
  organizationUserTree: {
    method: 'get',
    url: '/organization/organizationUserTree',
  },
  organizationTree: {
    method: 'get',
    url: '/organization/organizationTree',
  },
};
/**
 * 系统中心
 */
export const systemApi = {
  all: {
    method: 'post',
    url: '/system/all',
  },
  add: {
    method: 'post',
    url: '/system/add',
  },
  update: {
    method: 'update',
    url: '/system/update',
  },
  delete: {
    method: 'update',
    url: '/system/delete',
  },
  info: {
    method: 'get',
    url: '/system/info',
  },
  list: {
    method: 'get',
    url: '/system/list',
  }
};

export const taskConfigApi = {
  add: {
    method: 'post',
    url: '/task/taskConfig/email/add',
  },
  update: {
    method: 'update',
    url: '/task/taskConfig/email/update',
  },
  delete: {
    method: 'delete',
    url: '/task/taskConfig/email/del',
  },
  info: {
    method: 'get',
    url: '/task/taskConfig/email/list',
  },
  list: {
    method: 'get',
    url: '/task/taskConfig/email/list',
  },
  defaultList: {
    method: 'post',
    url: '/task/taskConfig/default/list'
  },
  tree: {
    method: 'get',
    url: '/task/category/categoryTree',
  },
};
export const taskMessageConfigApi = {
  add: {
    method: 'post',
    url: '/task/taskConfig/message/add',
  },
  update: {
    method: 'update',
    url: '/task/taskConfig/message/update',
  },
  delete: {
    method: 'delete',
    url: '/task/taskConfig/message/del',
  },
  info: {
    method: 'get',
    url: '/task/taskConfig/message/list',
  },
  list: {
    method: 'get',
    url: '/task/taskConfig/message/list',
  },
  tree: {
    method: 'get',
    url: '/task/category/categoryTree',
  },
  canSubmit: {
    method: 'post',
    url: '/task/can/submit',
  }
};
export const appKeyApi = {
  add: {
    method: 'post',
    url: '/app/add',
  },
  update: {
    method: 'update',
    url: '/task/email/cancle',
  },
  delete: {
    method: 'delete',
    url: '/app/del',
  },
  info: {
    method: 'get',
    url: '/task/log/info',
  },
  list: {
    method: 'get',
    url: '/app/list',
  },
  tree: {
    method: 'get',
    url: '/category/categoryTree',
  },
  systemConfigEdit: {
    url: '/app/systemConfig/edit',
    method: 'get',
  },
  systemConfigInfo: {
    url: '/app/systemConfig/info',
    method: 'get',
  }
};
export const taskApi = {
  authApp: {
    method: 'post',
    url: '/task/auth/app'
  },
  add: {
    method: 'post',
    url: '/task/email/add',
  },
  messageAdd:{
    method: 'post',
    url: '/task/message/add',
  },
  update: {
    method: 'update',
    url: '/task/email/cancle',
  },
  delete: {
    method: 'delete',
    url: '/task/del',
  },
  info: {
    method: 'get',
    url: '/taskConfig/email/list',
  },
  list: {
    method: 'get',
    url: '/task/list',
  },
  tree: {
    method: 'get',
    url: '/category/categoryTree',
  },
  cancle: {
    method: 'post',
    url: '/task/cancle'
  }
};
export const kafkaApi = {
  newTask: {
    url: '/kafka/newTask'
  }
}
/**
 * 资源
 */
export const apiResourceApi = {
  resourceAdd: {
    method: 'post',
    url: '/apiResource/resource/add'
  },
  resourceEdit: {
    method: 'post',
    url: '/apiResource/resource/update'
  },
  resourceList:{
    method: 'get',
    url: '/apiResource/resource/list',
  },
  systemList:{
    method: 'get',
    url: '/apiResource/system/list',
  },
  moduleList:{
    method: 'get',
    url: '/apiResource/module/list',
  },
  uniqueSystem: {
    method: 'update',
    url: '/apiResource/system/unique',
  },
  uniqueModule: {
    method: 'update',
    url: '/apiResource/module/unique',
  },
  uniqueApi: {
    method: 'update',
    url: '/apiResource/api/unique',
  },
  deleteApi: {
    method: 'post',
    url: '/apiResource/resource/delete'
  }
};


