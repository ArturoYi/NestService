import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { AppConfig, IAppConfig, ISecurityConfig, SecurityConfig } from '@project/src/config'
import { isEmpty } from 'lodash'
import { BusinessException } from '@project/src/common/exceptions/biz.exception'
import { ErrorEnum } from '@project/src/common/constants/error-code.constants'
import { md5 } from '@project/src/utils/crypto.util'
import { InjectRedis } from '@project/src/common/decorators/inject-redis.decorator'
import { UserService } from '../user/user.service'
import { TokenService } from './services/token.service'
import { genAuthPVKey, genAuthTokenKey } from '@project/src/common/helper/genRedisKey'

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private tokenService: TokenService,
    private userService: UserService,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    @Inject(AppConfig.KEY) private appConfig: IAppConfig,
  ) {}

  async login(username: string, password: string, ip: string, ua: string): Promise<string> {
    const user = await this.userService.findUserByUserName(username)
    if (isEmpty(user)) throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)
    const comparePassword = md5(`${password}${user.psalt}`)
    if (user.password !== comparePassword) throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)

    // 包含access_token和refresh_token
    const token = await this.tokenService.generateAccessToken(user.id, [])
    await this.redis.set(genAuthTokenKey(user.id), token.accessToken, 'EX', this.securityConfig.jwtExprire)
    // 设置密码版本号 当密码修改时，版本号+1
    await this.redis.set(genAuthPVKey(user.id), 1)

    return token.accessToken
  }
}
