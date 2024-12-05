import { Module } from '@nestjs/common'
import { EmailController } from './controllers/email.controller'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { CaptchaService } from './services/captcha.service'
import { UserModule } from '../user/user.module'
import { RedisModule } from '@project/src/shared/redis/redis.module'

const controllers = [EmailController, AuthController]
const providers = [AuthService, CaptchaService]
@Module({
  imports: [PassportModule, UserModule],
  controllers: [...controllers],
  providers: [...providers],
  exports: [...providers],
})
export class AuthModule {}
