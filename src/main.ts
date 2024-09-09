import path from 'path'
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
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyApp, {
    bufferLogs: true,
    snapshot: true,
    // forceCloseConnections: true,
  })
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
      //是否禁止未在白名单中的属性出现在请求数据
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
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
  if (isDev) app.useGlobalInterceptors(new LoggingInterceptor())
  await app.listen(port, '0.0.0.0')
}
bootstrap()
