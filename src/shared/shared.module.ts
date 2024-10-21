import { Global, Module } from '@nestjs/common'
import { LoggerModule } from './logger/logger.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { RedisModule } from './redis/redis.module'
import { MailerModule } from './mailer/mailer.module'
import { isDev } from '../global/env'

@Global()
@Module({
  imports: [
    // logger
    LoggerModule.forRoot(),
    // rate limit
    ThrottlerModule.forRoot([
      {
        limit: 3,
        ttl: 60000,
      },
    ]),
    // 允许在不同的组件之间进行事件的发布和订阅，实现松耦合的通信机制
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20,
      verboseMemoryLeak: isDev,
      ignoreErrors: false,
    }),
    // redis
    RedisModule,
    // mailer
    MailerModule,
  ],
  exports: [MailerModule, RedisModule],
})
export class SharedModule {}
