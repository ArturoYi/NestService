import path from 'node:path'
import cluster from 'node:cluster'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { fastifyApp } from './common/adapters/fastify.adapter'
import { ConfigKeyPaths } from './config'
import { isDev } from './global/env'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { useContainer } from 'class-validator'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { ConfigService } from '@nestjs/config'
import { HttpStatus, UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { setupSwagger } from './setup-swagger'
import { RedisIoAdapter } from './common/adapters/socket.adapter'
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyApp, {
    bufferLogs: true,
    snapshot: true,
    // forceCloseConnections: true,
  })
  //获取环境变量值
  const configService = app.get(ConfigService<ConfigKeyPaths>)
  const { port, globalPrefix } = configService.get('app', { infer: true })
  /// 跨域
  app.enableCors({ origin: '*', credentials: true })
  /// 启用全局前缀
  app.setGlobalPrefix(globalPrefix)
  /// class-validator (用于自定义验证器)
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  /// 静态资源服务
  app.useStaticAssets({ root: path.join(__dirname, '..', 'public') })
  /// 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) =>
        new UnprocessableEntityException(
          errors.map((e) => {
            const rule = Object.keys(e.constraints!)[0]
            const msg = e.constraints![rule]
            return msg
          })[0],
        ),
    }),
  )
  // 启用socket.io
  app.useWebSocketAdapter(new RedisIoAdapter(app))
  //开始监听关机挂钩
  if (!isDev) app.enableShutdownHooks()
  //开发环境下开启控制台打印日志，生产环境不使用这个日志
  if (isDev) app.useGlobalInterceptors(new LoggingInterceptor())
  //启动文档
  setupSwagger(app, configService)
  await app.listen(port, '0.0.0.0')
}
bootstrap()
