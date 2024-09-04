import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { fastifyApp } from './common/adapters/fastify.adapter'
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyApp, {
    bufferLogs: true,
    snapshot: true,
    // forceCloseConnections: true,
  })
  console.log(process.env.NODE_ENV)
  await app.listen(3000)
}
bootstrap()
