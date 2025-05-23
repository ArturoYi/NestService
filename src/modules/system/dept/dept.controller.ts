import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { DeptDto, DeptQueryDto } from './dept.dto'
import { DeptService } from './dept.service'
import { ErrorEnum } from '@project/src/common/constants/error-code.constants'
import { ApiResult } from '@project/src/common/decorators/api-result.decorator'
import { IdParam } from '@project/src/common/decorators/id-param.decorator'
import { ApiSecurityAuth } from '@project/src/common/decorators/swagger.decorators'
import { BusinessException } from '@project/src/common/exceptions/biz.exception'
import { CreatorPipe } from '@project/src/common/pipes/creator.pipe'
import { UpdaterPipe } from '@project/src/common/pipes/updater.pipe'
import { definePermission, Perm } from '../../auth/decorators/permission.decorator'
import { DeptEntity } from './dept.entity'
import { AuthUser } from '../../auth/decorators/auth-user.decorator'

export const permissions = definePermission('system:dept', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiSecurityAuth()
@ApiTags('System - 部门模块')
@Controller('depts')
export class DeptController {
  constructor(private deptService: DeptService) {}

  @Get()
  @ApiOperation({ summary: '获取部门列表' })
  @ApiResult({ type: [DeptEntity] })
  @Perm(permissions.LIST)
  async list(@Query() dto: DeptQueryDto, @AuthUser('uid') uid: number): Promise<DeptEntity[]> {
    return this.deptService.getDeptTree(uid, dto)
  }

  @Post()
  @ApiOperation({ summary: '创建部门' })
  @Perm(permissions.CREATE)
  async create(@Body(CreatorPipe) dto: DeptDto): Promise<void> {
    await this.deptService.create(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '查询部门信息' })
  @Perm(permissions.READ)
  async info(@IdParam() id: number) {
    return this.deptService.info(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新部门' })
  @Perm(permissions.UPDATE)
  async update(@IdParam() id: number, @Body(UpdaterPipe) updateDeptDto: DeptDto): Promise<void> {
    await this.deptService.update(id, updateDeptDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除部门' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number): Promise<void> {
    // 查询是否有关联用户或者部门，如果含有则无法删除
    const count = await this.deptService.countUserByDeptId(id)
    if (count > 0) throw new BusinessException(ErrorEnum.DEPARTMENT_HAS_ASSOCIATED_USERS)

    const count2 = await this.deptService.countChildDept(id)
    console.log('count2', count2)
    if (count2 > 0) throw new BusinessException(ErrorEnum.DEPARTMENT_HAS_CHILD_DEPARTMENTS)

    await this.deptService.delete(id)
  }

  // @Post('move')
  // @ApiOperation({ summary: '部门移动排序' })
  // async move(@Body() dto: MoveDeptDto): Promise<void> {
  //   await this.deptService.move(dto.depts);
  // }
}
