import { Inject, Injectable } from '@nestjs/common'
import { MailerService as NestMailerService } from '@nestjs-modules/mailer'
import Redis from 'ioredis'
import dayjs from 'dayjs'
import { AppConfig, IAppConfig } from '@project/src/config'
import { InjectRedis } from '@project/src/common/decorators/inject-redis.decorator'
import { BusinessException } from '@project/src/common/exceptions/biz.exception'
import { ErrorEnum } from '@project/src/common/constants/error-code.constants'
import { randomValue } from '@project/src/utils'

@Injectable()
export class MailerService {
  constructor(
    @Inject(AppConfig.KEY) private appConfig: IAppConfig,
    @InjectRedis() private redis: Redis,
    private mailerService: NestMailerService,
  ) {}
  async log(to: string, code: string, ip: string) {
    const getRemainTime = () => {
      const now = dayjs()
      return now.endOf('day').diff(now, 'second')
    }
    await this.redis.set(`captcha:${to}`, code, 'EX', 60 * 5)
    const limitCountOfDay = await this.redis.get(`captcha:${to}:limit-day`)
    const ipLimitCountOfDay = await this.redis.get(`ip:${ip}:send:limit-day`)
    await this.redis.set(`ip:${ip}:send:limit`, 1, 'EX', 60)
    await this.redis.set(`captcha:${to}:limit`, 1, 'EX', 60)
    await this.redis.set(`captcha:${to}:send:limit-count-day`, limitCountOfDay, 'EX', getRemainTime())
    await this.redis.set(`ip:${ip}:send:limit-count-day`, ipLimitCountOfDay, 'EX', getRemainTime())
  }
  async checkCode(to: string, code: string) {
    const ret = await this.redis.get(`captcha:${to}`)
    if (ret !== code) throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_CODE)
    await this.redis.del(`captcha:${to}`)
  }
  /**
   * 异步检查验证码发送限制
   * 此函数旨在防止滥用和过度使用验证码功能，通过限制IP地址和邮箱每日接收验证码的数量
   *
   * @param to 收件人邮箱地址，用于检查邮箱的验证码接收限制
   * @param ip 发送请求的IP地址，用于检查IP级别的发送限制
   * @throws {BusinessException} 如果IP地址已达到发送限制或邮箱已达到接收限制，将抛出异常
   */
  async checkLimit(to: string, ip: string) {
    // 定义每日验证码发送和接收的最大限制数量
    const LIMIT_NUM = 5
    // 检查IP地址是否已经达到了今日的发送限制
    const ipLimit = await this.redis.get(`ip:${ip}:send:limit`)
    if (ipLimit) throw new BusinessException(ErrorEnum.TOO_MANY_REQUESTS)
    // 检查邮箱今日已接收的验证码数量，并与限制比较
    let limitCountOfDay: string | number = await this.redis.get(`captcha:${to}:limit-day`)
    limitCountOfDay = limitCountOfDay ? Number(limitCountOfDay) : 0
    if (limitCountOfDay > LIMIT_NUM) {
      throw new BusinessException(ErrorEnum.MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY)
    }
    // 检查IP地址今日已发送的验证码数量，并与限制比较
    let ipLimitCountOfDay: string | number = await this.redis.get(`ip:${ip}:send:limit-day`)
    ipLimitCountOfDay = ipLimitCountOfDay ? Number(ipLimitCountOfDay) : 0
    if (ipLimitCountOfDay > LIMIT_NUM) {
      throw new BusinessException(ErrorEnum.MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY)
    }
  }
  /**
   * 异步发送邮件
   *
   * 此函数根据指定的参数发送电子邮件它允许发送纯文本或HTML格式的邮件
   * 通过选择type参数，可以确定邮件的内容类型是文本还是HTML默认情况下，发送的是文本邮件
   *
   * @param to 收件人的电子邮件地址
   * @param subject 邮件的主题
   * @param content 邮件的正文内容，可以是纯文本或HTML内容，取决于type参数
   * @param type 邮件的类型，可以是'text'或'html'默认为'text'
   * @returns 返回邮件发送操作的Promise对象
   */
  async send(to: string, subject: string, content: string, type: 'text' | 'html' = 'text'): Promise<any> {
    // 根据邮件类型发送邮件
    if (type === 'text') {
      // 发送纯文本邮件
      return this.mailerService.sendMail({
        to,
        subject,
        text: content,
      })
    } else {
      // 发送HTML邮件
      return this.mailerService.sendMail({
        to,
        subject,
        html: content,
      })
    }
  }
  async sendVerificationCode(to: string, code = randomValue(4, '1234567890')) {
    const subject = `[${this.appConfig.name}] 验证码`
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: './verification-code-zh',
        context: {
          code,
        },
      })
    } catch (error) {
      console.error(error)
      throw new BusinessException(ErrorEnum.VERIFICATION_CODE_SEND_FAILED)
    }
    return {
      to,
      code,
    }
  }
}
