import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger'
import { ApiSecurityAuth } from '@project/src/common/decorators/swagger.decorators'
import { LoginDto } from '../auth/dto/auth.dto'
import { definePermission } from '../auth/decorators/permission.decorator'

export const permissions = definePermission('system:user', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',

  PASSWORD_UPDATE: 'password:update',
  PASSWORD_RESET: 'pass:reset',
} as const)

@ApiTags('System - 用户模块')
@ApiSecurityAuth()
@Controller('users')
export class UserController {
  constructor() {}
}
