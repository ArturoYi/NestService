import { applyDecorators } from '@nestjs/common'
import { ApiSecurity } from '@nestjs/swagger'

export const API_SECURITY_AUTH = 'auth'

/**
 * like to @ApiSecurity('auth')
 * ApiSecurityAuth 函数返回一个装饰器，用于应用安全认证相关的配置到类或方法上。
 */
export function ApiSecurityAuth(): ClassDecorator & MethodDecorator {
  return applyDecorators(ApiSecurity(API_SECURITY_AUTH))
}
