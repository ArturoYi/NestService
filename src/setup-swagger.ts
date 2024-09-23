import { INestApplication, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ConfigKeyPaths, IAppConfig, ISwaggerConfig } from './config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { API_SECURITY_AUTH } from './common/decorators/swagger.decorators'

export function setupSwagger(app: INestApplication, configService: ConfigService<ConfigKeyPaths>) {
  const { name } = configService.get<IAppConfig>('app', { infer: true })
  const { enable, path } = configService.get<ISwaggerConfig>('swagger', { infer: true })
  if (!enable) return

  const documentBuilder = new DocumentBuilder()
    .setTitle(name)
    .setDescription(`${name} API document`)
    .setVersion('1.0')

  // auth security
  documentBuilder.addSecurity(API_SECURITY_AUTH, {
    description: '输入令牌（Enter the token）',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  })

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    ignoreGlobalPrefix: false,
  })

  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 保持登录
    },
  })
  const logger = new Logger('SwaggerModule')
}
