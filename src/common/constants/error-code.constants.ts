export enum ErrorEnum {
  DEFAULT = '0:未知错误',
  SERVER_ERROR = '500:服务繁忙，请稍后再试',
  TOO_MANY_REQUESTS = '1201:请求频率过快，请一分钟后再试',
  MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY = '1202:一天最多发送5条验证码',
  INVALID_VERIFICATION_CODE = '1002:验证码填写有误',
  VERIFICATION_CODE_SEND_FAILED = '1203:验证码发送失败',
  SYSTEM_USER_EXISTS = '1001:系统用户已存在',
  INVALID_USERNAME_PASSWORD = '1003:用户名密码有误',
  // ----------
  PERMISSION_REQUIRES_PARENT = '1005:权限必须包含父节点',
  PARENT_MENU_NOT_FOUND = '1014:父级菜单不存在',
  ILLEGAL_OPERATION_DIRECTORY_PARENT = '1006:非法操作：该节点仅支持目录类型父节点',
  // ----------
  DEPARTMENT_HAS_ASSOCIATED_USERS = '1009:该部门存在关联用户，请先删除关联用户',
  DEPARTMENT_HAS_ASSOCIATED_ROLES = '1010:该部门存在关联角色，请先删除关联角色',
  DEPARTMENT_HAS_CHILD_DEPARTMENTS = '1015:该部门存在子部门，请先删除子部门',
  DEPARTMENT_NOT_FOUND = '1019:部门不存在',
  // -------------
}
