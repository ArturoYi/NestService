import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

export class SendEmailCodeDto {
  @ApiProperty({ description: '邮箱' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string
}
