import { Module } from '@nestjs/common'
import { EmailController } from './controllers/email.controller'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccessTokenEntity } from './entities/access-token.entity'
import { RefreshTokenEntity } from './entities/refresh-token.entity'
import { AuthService } from './auth.service'

const controllers = [EmailController, AuthController]
const providers = [AuthService]
@Module({
  imports: [TypeOrmModule.forFeature([AccessTokenEntity, RefreshTokenEntity]), UserModule],
  controllers: [...controllers],
  providers: [...providers],
  exports: [TypeOrmModule],
})
export class AuthModule {}
