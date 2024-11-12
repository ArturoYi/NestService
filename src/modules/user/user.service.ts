import { Injectable } from '@nestjs/common'
import { RegisterDto } from '../auth/dto/auth.dto'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { UserEntity } from './user.entity'
import { BusinessException } from '@project/src/common/exceptions/biz.exception'
import { ErrorEnum } from '@project/src/common/constants/error-code.constants'
import { isEmpty } from 'lodash'
import { randomValue } from '@project/src/utils'
import { md5 } from '@project/src/utils/crypto.util'
import { UserStatus } from './constant'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}
  /**
   * 注册
   */
  async register({ username, ...data }: RegisterDto) {
    const exists = await this.userRepository.findOneBy({
      username,
    })
    if (!isEmpty(exists)) throw new BusinessException(ErrorEnum.SYSTEM_USER_EXISTS)
    await this.entityManager.transaction(async (manager) => {
      const salt = randomValue(32)
      const password = md5(`${data.password ?? 'a123456'}${salt}`)

      const u = manager.create(UserEntity, {
        username,
        password,
        status: 1,
        psalt: salt,
        type: '1',
      })

      const user = await manager.save(u)
      return user
    })
  }

  /**
   * 根据用户名异步查找用户
   *
   * 此函数使用用户仓库的查询构建器来查询具有给定用户名且状态为启用的用户
   * 它返回一个用户实体的Promise，如果找不到匹配的用户，则返回undefined
   *
   * @param username 要查找的用户的用户名
   * @returns 返回用户实体的Promise，如果找不到则返回undefined
   */
  async findUserByUserName(username: string): Promise<UserEntity | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .where({
        username,
        status: UserStatus.Enabled,
      })
      .getOne()
  }
}
