import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ApiResult } from '@project/src/common/decorators/api-result.decorator'
import { genCaptchaImgKey } from '@project/src/common/helper/genRedisKey'
import { generateUUID } from '@project/src/utils'
import Redis from 'ioredis'
import { isEmpty } from 'lodash'
import * as svgCaptcha from 'svg-captcha'
import { Public } from '../decorators/public.decorator'
import { ImageCaptchaDto } from '../dto/captcha.dto copy'
import { ImageCaptcha } from '../models/auth.model'
import { InjectRedis } from '@project/src/common/decorators/inject-redis.decorator'

@ApiTags('Captcha - 验证码模块')
@Controller('auth/captcha')
export class CaptchaController {
  constructor(@InjectRedis() private redis: Redis) {}

  @Get('img')
  @ApiOperation({ summary: '获取登录图片验证码' })
  @ApiResult({ type: ImageCaptcha })
  @Public()
  // @Throttle({ default: { limit: 2, ttl: 600000 } })
  async captchaByImg(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
    const { width, height } = dto

    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: isEmpty(width) ? 100 : width,
      height: isEmpty(height) ? 50 : height,
      charPreset: '1234567890',
    })
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString('base64')}`,
      id: generateUUID(),
    }
    // 5分钟过期时间
    await this.redis.set(genCaptchaImgKey(result.id), svg.text, 'EX', 60 * 5)
    return result
  }
}
