import path from 'path'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { fastifyApp } from './common/adapters/fastify.adapter'
import { ConfigService } from '@nestjs/config'
import { ConfigKeyPaths } from './config'
import cluster from 'node:cluster'
import { isDev, isMainProcess } from './global/env'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
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
  /// 静态资源服务
  app.useStaticAssets({ root: path.join(__dirname, '..', 'public') })
  if (isDev) app.useGlobalInterceptors(new LoggingInterceptor())
  await app.listen(port, '0.0.0.0')
}
bootstrap()
