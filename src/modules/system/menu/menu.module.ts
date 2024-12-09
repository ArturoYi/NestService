import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RoleModule } from '../role/role.module'

import { MenuController } from './menu.controller'
import { MenuEntity } from './menu.entity'
import { MenuService } from './menu.service'
import { SseService } from '../../sse/sse.service'

const providers = [MenuService, SseService]

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity]), forwardRef(() => RoleModule)],
  controllers: [MenuController],
  providers: [...providers],
  exports: [TypeOrmModule, ...providers],
})
export class MenuModule {}
