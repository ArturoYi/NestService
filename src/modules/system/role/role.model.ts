import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleEntity } from './role.entity'
import { MenuModule } from '../menu/menu.module'

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), forwardRef(() => MenuModule)],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class RoleModule {}
