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
    })
  }
}
