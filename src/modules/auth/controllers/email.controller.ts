import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Throttle, ThrottlerGuard } from '@nestjs/throttler'

import { Public } from '../decorators/public.decorator'

import { SendEmailCodeDto } from '../dto/captcha.dto'
import { MailerService } from '@project/src/shared/mailer/mailer.service'
import { Ip } from '@project/src/common/decorators/http.decorator'

@ApiTags('Auth - 认证模块')
// @UseGuards(ThrottlerGuard)
@Controller('auth/email')
export class EmailController {
  constructor(private mailerService: MailerService) {}

  @Post('send')
  @ApiOperation({ summary: '发送邮箱验证码' })
  @Public()
  @Throttle({ default: { limit: 2, ttl: 600000 } })
  async sendEmailCode(@Body() dto: SendEmailCodeDto, @Ip() ip: string): Promise<void> {
    const { email } = dto

    await this.mailerService.checkLimit(email, ip)
    const { code } = await this.mailerService.sendVerificationCode(email)

    await this.mailerService.log(email, code, ip)
  }
}
