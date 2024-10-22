import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'

const providers = [UserService]

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [...providers],
  exports: [TypeOrmModule, ...providers],
})
export class UserModule {}
