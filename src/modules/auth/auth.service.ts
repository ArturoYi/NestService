import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'
// import { UserService } from '../user/user.service'
import { AppConfig, IAppConfig } from '@project/src/config'
import { isEmpty } from 'lodash'
import { BusinessException } from '@project/src/common/exceptions/biz.exception'
import { ErrorEnum } from '@project/src/common/constants/error-code.constants'
import { md5 } from '@project/src/utils/crypto.util'
import { InjectRedis } from '@project/src/common/decorators/inject-redis.decorator'
import { UserService } from '../user/user.service'
// import { MenuService } from '../system/menu/menu.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    // private menuService: MenuService,
    private userService: UserService,
    @Inject(AppConfig.KEY) private appConfig: IAppConfig,
  ) {}

  async login(username: string, password: string, ip: string, ua: string): Promise<string> {
    const user = await this.userService.findUserByUserName(username)
    if (isEmpty(user)) throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)
    const comparePassword = md5(`${password}${user.psalt}`)
    if (user.password !== comparePassword) throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)
    return ''
  }
}
