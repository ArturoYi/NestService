import { ConfigType, registerAs } from '@nestjs/config'
import { env, envBoolean } from '@project/global/env'

export const swaggerRegToken = 'swagger'

export const SwaggerConfig = registerAs(swaggerRegToken, () => ({
  enable: envBoolean('SWAGGER_ENABLE', false),
  path: env('SWAGGER_PATH', '/docs'),
}))

export type ISwaggerConfig = ConfigType<typeof SwaggerConfig>
