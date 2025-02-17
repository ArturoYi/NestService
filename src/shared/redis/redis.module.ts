import { RedisModule as NestRedisModule, RedisService } from '@liaoliaots/nestjs-redis'
import { Global, Module, Provider } from '@nestjs/common'
import { CacheService } from './cache.service'
import { REDIS_PUBSUB } from './redis.constant'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisOptions } from 'ioredis'
import { RedisSubPub } from './redis-subpub'
import { RedisPubSubService } from './subpub.service'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-yet'
import { ConfigKeyPaths, IRedisConfig } from '@project/src/config'
import { REDIS_CLIENT } from '@project/src/common/decorators/inject-redis.decorator'

const providers: Provider[] = [
  CacheService,
  {
    provide: REDIS_PUBSUB,
    useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
      const redisOptions: RedisOptions = configService.get<IRedisConfig>('redis')
      return new RedisSubPub({
        ...redisOptions,
      })
    },
    inject: [ConfigService],
  },
  RedisPubSubService,
  {
    provide: REDIS_CLIENT,
    useFactory: (redisService: RedisService) => {
      return redisService.getClient()
    },
    inject: [RedisService],
  },
]

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const redisOptions: RedisOptions = configService.get<IRedisConfig>('redis')
        return {
          isGlobal: true,
          store: redisStore,
          isCacheableValue: () => true,
          host: redisOptions.host,
          port: redisOptions.port,
          username: redisOptions.username,
          password: redisOptions.password,
        }
      },
      inject: [ConfigService],
    }),
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const redisConfig = configService.get<IRedisConfig>('redis')
        return {
          readyLog: true,
          config: {
            host: redisConfig.host,
            port: redisConfig.port,
            username: redisConfig.username,
            password: redisConfig.password,
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers,
  exports: [...providers, CacheModule],
})
export class RedisModule {}
