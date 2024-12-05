import { Injectable } from '@nestjs/common'
import { RegisterDto } from '../auth/dto/auth.dto'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import Redis from 'ioredis'
import { EntityManager, Repository } from 'typeorm'
import { UserEntity } from './user.entity'
import { md5 } from '@project/src/utils/crypto.util'
import { randomValue } from '@project/src/utils'
import { BusinessException } from '@project/src/common/exceptions/biz.exception'
import { ErrorEnum } from '@project/src/common/constants/error-code.constants'
import { isEmpty } from 'lodash'
import { UserStatus } from './constant'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async findUserByUserName(username: string): Promise<UserEntity | undefined> {
    return this.userRepository
      .createQueryBuilder('user')
      .where({
        username,
        status: UserStatus.Enabled,
      })
      .getOne()
  }
  /**
   * 注册
   */
  async register({ username, ...data }: RegisterDto): Promise<void> {
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
      })
      const user = await manager.save(u)
      return user
    })
  }
}
