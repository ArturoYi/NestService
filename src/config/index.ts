import { AppConfig, IAppConfig, appRegToken } from './app.config'
import { DatabaseConfig, dbRegToken, IDatabaseConfig } from './database.config'
import { IMailerConfig, MailerConfig, mailerRegToken } from './mailer.config'
import { IRedisConfig, RedisConfig, redisRegToken } from './redis.config'
import { ISwaggerConfig, SwaggerConfig, swaggerRegToken } from './swagger.config'

export * from './app.config'
export * from './redis.config'
export * from './database.config'
export * from './swagger.config'
export * from './mailer.config'

export interface AllConfigType {
  [appRegToken]: IAppConfig
  [swaggerRegToken]: ISwaggerConfig
  [redisRegToken]: IRedisConfig
  [dbRegToken]: IDatabaseConfig
  [mailerRegToken]: IMailerConfig
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>

export default {
  AppConfig,
  SwaggerConfig,
  RedisConfig,
  DatabaseConfig,
  MailerConfig,
}
