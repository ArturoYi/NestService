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
import { genAuthPermKey, genAuthPVKey, genAuthTokenKey } from '@project/src/common/helper/genRedisKey'
import { RoleService } from '../system/role/role.service'
import { MenuService } from '../system/menu/menu.service'
import { LoginLogService } from '../system/log/services/login-log.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private menuService: MenuService,
    private roleService: RoleService,
    private tokenService: TokenService,
    private userService: UserService,
    private loginLogService: LoginLogService,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    @Inject(AppConfig.KEY) private appConfig: IAppConfig,
  ) {}

  async login(username: string, password: string, ip: string, ua: string): Promise<string> {
    const user = await this.userService.findUserByUserName(username)
    if (isEmpty(user)) throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)
    const comparePassword = md5(`${password}${user.psalt}`)
    if (user.password !== comparePassword) throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)
    const roleIds = await this.roleService.getRoleIdsByUser(user.id)

    const roles = await this.roleService.getRoleValues(roleIds)
    // 包含access_token和refresh_token
    const token = await this.tokenService.generateAccessToken(user.id, roles)
    await this.redis.set(genAuthTokenKey(user.id), token.accessToken, 'EX', this.securityConfig.jwtExprire)
    // 设置密码版本号 当密码修改时，版本号+1
    await this.redis.set(genAuthPVKey(user.id), 1)

    // 设置菜单权限
    const permissions = await this.menuService.getPermissions(user.id)
    await this.setPermissionsCache(user.id, permissions)

    await this.loginLogService.create(user.id, ip, ua)

    return token.accessToken
  }

  async setPermissionsCache(uid: number, permissions: string[]): Promise<void> {
    await this.redis.set(genAuthPermKey(uid), JSON.stringify(permissions))
  }
}
