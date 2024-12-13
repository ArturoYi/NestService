import { ApiProperty } from '@nestjs/swagger'
import { CommonEntity } from '@project/src/common/entity/common.entity'
import { Column, Entity } from 'typeorm'

@Entity({ name: 'sys_captcha_log' })
export class CaptchaLogEntity extends CommonEntity {
  @Column({ name: 'user_id', nullable: true })
  @ApiProperty({ description: '用户ID' })
  userId: number

  @Column({ nullable: true })
  @ApiProperty({ description: '账号' })
  account: string

  @Column({ nullable: true })
  @ApiProperty({ description: '验证码' })
  code: string

  @Column({ nullable: true })
  @ApiProperty({ description: '验证码提供方' })
  provider: 'sms' | 'email'
}
