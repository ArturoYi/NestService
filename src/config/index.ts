import { AppConfig, IAppConfig, appRegToken } from './app.config'
import { ISwaggerConfig, SwaggerConfig, swaggerRegToken } from './swagger.config'

export * from './app.config'

export interface AllConfigType {
  [appRegToken]: IAppConfig
  [swaggerRegToken]: ISwaggerConfig
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>

export default {
  AppConfig,
  SwaggerConfig,
}
