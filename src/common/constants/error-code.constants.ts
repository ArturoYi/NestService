export enum ErrorEnum {
  DEFAULT = '0:未知错误',
  SERVER_ERROR = '500:服务繁忙，请稍后再试',
  TOO_MANY_REQUESTS = '1201:请求频率过快，请一分钟后再试',
  MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY = '1202:一天最多发送5条验证码',
  INVALID_VERIFICATION_CODE = '1002:验证码填写有误',
  VERIFICATION_CODE_SEND_FAILED = '1203:验证码发送失败',
  SYSTEM_USER_EXISTS = '1001:系统用户已存在',
}
