import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import config from './config'
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      // 指定多个 env 文件时，第一个优先级最高
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      load: [...Object.values(config)],
    }),
    // 避免暴力请求，限制同一个接口 10 秒内不能超过 7 次请求
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        errorMessage: '当前操作过于频繁，请稍后再试！',
        throttlers: [{ ttl: seconds(10), limit: 7 }],
      }),
    }),
    // 启用 CLS 上下文：https://github.com/Papooch/nestjs-cls/issues
    // ClsModule.forRoot({
    //   global: true,
    //   // https://github.com/Papooch/nestjs-cls/issues/92
    //   interceptor: {
    //     mount: true,
    //     setup: (cls, context) => {
    //       const req = context.switchToHttp().getRequest<FastifyRequest<{ Params: { id?: string } }>>()
    //       if (req.params?.id && req.body) {
    //         // 供自定义参数验证器(UniqueConstraint)使用
    //         cls.set('operateId', Number.parseInt(req.params.id))
    //       }
    //     },
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
