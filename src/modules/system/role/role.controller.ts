import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiResult } from '@project/src/common/decorators/api-result.decorator'
import { ApiSecurityAuth } from '@project/src/common/decorators/swagger.decorators'
import { definePermission, Perm } from '../../auth/decorators/permission.decorator'
import { SseService } from '../../sse/sse.service'
import { RoleQueryDto, RoleDto, RoleUpdateDto } from './role.dto'
import { RoleEntity } from './role.entity'
import { RoleInfo } from './role.model'
import { RoleService } from './role.service'
import { MenuService } from '../menu/menu.service'
import { IdParam } from '@project/src/common/decorators/id-param.decorator'
import { UpdaterPipe } from '@project/src/common/pipes/updater.pipe'

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
  constructor(
    private roleService: RoleService,
    private menuService: MenuService,
    @Inject(forwardRef(() => SseService))
    private sseService: SseService,
  ) {}

  @Get()
  @ApiOperation({ summary: '获取角色列表' })
  @ApiResult({ type: [RoleEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: RoleQueryDto) {
    return this.roleService.list(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取角色信息' })
  @ApiResult({ type: RoleInfo })
  @Perm(permissions.READ)
  async info(@IdParam() id: number) {
    return this.roleService.info(id)
  }

  @Post()
  @ApiOperation({ summary: '新增角色' })
  @Perm(permissions.CREATE)
  async create(@Body() dto: RoleDto): Promise<void> {
    await this.roleService.create(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色' })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: number, @Body(UpdaterPipe) dto: RoleUpdateDto): Promise<void> {
    await this.roleService.update(id, dto)
    await this.menuService.refreshOnlineUserPerms(false)
    this.sseService.noticeClientToUpdateMenusByRoleIds([id])
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number): Promise<void> {
    if (await this.roleService.checkUserByRoleId(id)) throw new BadRequestException('该角色存在关联用户，无法删除')

    await this.roleService.delete(id)
    await this.menuService.refreshOnlineUserPerms(false)
    this.sseService.noticeClientToUpdateMenusByRoleIds([id])
  }
}
