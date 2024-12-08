import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRedis } from '@project/src/common/decorators/inject-redis.decorator'
import { SecurityConfig, ISecurityConfig } from '@project/src/config'
import { generateUUID } from '@project/src/utils'
import dayjs from 'dayjs'
import Redis from 'ioredis'
/**
 * 令牌服务
 */
@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectRedis() private redis: Redis,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
  ) {}

  generateJwtSign(payload: any) {
    const jwtSign = this.jwtService.sign(payload)

    return jwtSign
  }

  async generateAccessToken(
    uid: number,
    roles: string[] = [],
  ): Promise<{
    accessToken: string
    refreshToken: string
  }> {
    const payload: IAuthUser = {
      uid,
      pv: 1,
      roles,
    }

    const jwtSign = await this.jwtService.signAsync(payload)

    // 生成refreshToken
    const refreshToken = await this.generateRefreshToken(jwtSign, dayjs())

    return {
      accessToken: jwtSign,
      refreshToken,
    }
  }

  /**
   * 生成新的RefreshToken并存入数据库
   * @param accessToken
   * @param now
   */
  async generateRefreshToken(accessToken: string, now: dayjs.Dayjs) {
    const refreshTokenPayload = {
      uuid: generateUUID(),
    }
    const refreshTokenSign = await this.jwtService.signAsync(refreshTokenPayload, {
      secret: this.securityConfig.refreshSecret,
    })

    return refreshTokenSign
  }
}
