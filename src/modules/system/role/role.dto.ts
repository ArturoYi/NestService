import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { PagerDto } from '@project/src/common/dto/pager.dto'
import { IsUnique } from '@project/src/shared/datebase/constraints/unique.constraint'
import { IsArray, IsIn, IsOptional, IsString, Matches, MinLength } from 'class-validator'
import { RoleEntity } from './role.entity'
import { OperatorDto } from '@project/src/common/dto/operator.dto'

export class RoleDto extends OperatorDto {
  @ApiProperty({ description: '角色名称' })
  @IsString()
  @MinLength(2, { message: '角色名称长度不能小于2' })
  name: string

  @IsUnique({ entity: RoleEntity })
  @ApiProperty({ description: '角色标识' })
  @IsString()
  @Matches(/^[a-z0-9]+$/i, { message: '角色值只能包含字母和数字' })
  @MinLength(2, { message: '角色值长度不能小于2' })
  value: string

  @ApiProperty({ description: '角色备注' })
  @IsString()
  @IsOptional()
  remark?: string

  @ApiProperty({ description: '状态' })
  @IsIn([0, 1])
  status: number

  @ApiProperty({ description: '关联菜单、权限编号' })
  @IsOptional()
  @IsArray()
  menuIds?: number[]
}

export class RoleUpdateDto extends PartialType(RoleDto) {}

export class RoleQueryDto extends IntersectionType(PagerDto<RoleDto>, PartialType(RoleDto)) {
  @ApiProperty({ description: '角色名称', required: false })
  @IsString()
  name?: string

  @ApiProperty({ description: '角色值', required: false })
  @IsString()
  value: string
}
