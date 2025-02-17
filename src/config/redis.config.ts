import { ConfigType, registerAs } from '@nestjs/config'
import { env, envNumber } from '../global/env'

export const redisRegToken = 'redis'

export const RedisConfig = registerAs(redisRegToken, () => ({
  host: env('REDIS_HOST', 'redis-14039.c1.asia-northeast1-1.gce.redns.redis-cloud.com'),
  port: envNumber('REDIS_PORT', 14039),
  password: env('REDIS_PASSWORD', 'tkxmbkS4AoqDAaAQkOztenxl6iLvHECx'),
  username: env('REDIS_USERNAME', 'default'),
  // tls: {},
  // connectTimeout: 10000,
  // retryStrategy: (times: number) => Math.min(times * 50, 2000),
  // maxRetriesPerRequest: 3,
  // enableReadyCheck: true,
  // enableAutoPipelining: true,
  // keepAlive: 5000,
  // family: 4,
  reconnectOnError: (err: Error) => true,
}))

export type IRedisConfig = ConfigType<typeof RedisConfig>
