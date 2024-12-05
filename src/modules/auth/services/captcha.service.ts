import { Injectable } from '@nestjs/common'
import { ErrorEnum } from '@project/src/common/constants/error-code.constants'
import { BusinessException } from '@project/src/common/exceptions/biz.exception'
import { genCaptchaImgKey } from '@project/src/common/helper/genRedisKey'
import Redis from 'ioredis'
import { isEmpty } from 'lodash'

@Injectable()
export class CaptchaService {
  constructor() {}

  /**
   * 校验图片验证码
   */
  async checkImgCaptcha(id: string, code: string): Promise<void> {
    // const result = await this.redis.get(genCaptchaImgKey(id))
    // if (isEmpty(result) || code.toLowerCase() !== result.toLowerCase())
    //   throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_CODE)

    // // 校验成功后移除验证码
    // await this.redis.del(genCaptchaImgKey(id))
    return
  }
}
