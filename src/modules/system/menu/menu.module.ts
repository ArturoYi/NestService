import { TypeOrmModule } from '@nestjs/typeorm'
import { MenuEntity } from './menu.entity'
import { forwardRef, Module } from '@nestjs/common'
import { RoleModule } from '../role/role.model'
import { MenuService } from './menu.service'
import { SseService } from '../../sse/sse.service'

const providers = [MenuService, SseService]

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity]), forwardRef(() => RoleModule)],
  controllers: [],
  providers: [...providers],
  exports: [TypeOrmModule],
})
export class MenuModule {}
