import { Module } from '@nestjs/common'
import { EmailController } from './controllers/email.controller'

const controllers = [EmailController]

@Module({
  controllers: [...controllers],
})
export class AuthModule {}
