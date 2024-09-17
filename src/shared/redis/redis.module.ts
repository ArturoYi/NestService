import { RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis'
import { Global, Module, Provider } from '@nestjs/common'
import { CacheService } from './cache.service'
import { REDIS_PUBSUB } from './redis.constant'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConfigKeyPaths } from '@project/config'
import { RedisOptions } from 'ioredis'
import { RedisSubPub } from './redis-subpub'
import { RedisPubSubService } from './subpub.service'
import { IRedisConfig } from '@project/config/redis.config'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-yet'
const providers: Provider[] = [
  CacheService,
  {
    provide: REDIS_PUBSUB,
    useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
      const redisOptions: RedisOptions = configService.get<IRedisConfig>('redis')
      return new RedisSubPub(redisOptions)
    },
    inject: [ConfigService],
  },
  RedisPubSubService,
]

@Global()
@Module({
  imports: [
    //Cache
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const redisOptions: RedisOptions = configService.get<IRedisConfig>('redis')

        return {
          isGlobal: true,
          store: redisStore,
          isCacheableValue: () => true,
          ...redisOptions,
        }
      },
      inject: [ConfigService],
    }),
    // redis
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => ({
        readyLog: true,
        config: configService.get<IRedisConfig>('redis'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers,
  exports: [...providers, CacheModule],
})
export class RedisModule {}
