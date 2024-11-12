import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { definePermission, Perm } from '../../auth/decorators/permission.decorator'
import { ApiSecurityAuth } from '@project/src/common/decorators/swagger.decorators'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiResult } from '@project/src/common/decorators/api-result.decorator'
import { RoleEntity } from './role.entity'
import { RoleQueryDto } from './role.dto'

export const permissions = definePermission('system:role', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('System - 角色模块')
@ApiSecurityAuth()
@Controller('roles')
export class RoleController {
  @Get()
  @ApiOperation({ summary: '获取角色列表' })
  @ApiResult({ type: [RoleEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: RoleQueryDto) {}
}
