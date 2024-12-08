import { Module } from '@nestjs/common'
import { EmailController } from './controllers/email.controller'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { CaptchaService } from './services/captcha.service'
import { UserModule } from '../user/user.module'
import { RedisModule } from '@project/src/shared/redis/redis.module'
import { TokenService } from './services/token.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConfigKeyPaths, ISecurityConfig } from '@project/src/config'
import { isDev } from '@project/src/global/env'
import { CaptchaController } from './controllers/captcha.controller'

const controllers = [CaptchaController, AuthController, EmailController]
const providers = [AuthService, CaptchaService, TokenService]
const strategies = [JwtStrategy]

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const { jwtSecret, jwtExprire } = configService.get<ISecurityConfig>('security')

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: `${jwtExprire}s`,
          },
          ignoreExpiration: isDev,
        }
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [...controllers],
  providers: [...providers, ...strategies],
  exports: [JwtModule, ...providers],
})
export class AuthModule {}
