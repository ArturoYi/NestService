import { Inject, Injectable } from '@nestjs/common'
import type { Redis, RedisOptions } from 'ioredis'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { Emitter } from '@socket.io/redis-emitter'
import { RedisIoAdapterKey } from '@project/src/common/adapters/socket.adapter'

// 获取器
export type TCacheKey = string
export type TCacheResult<T> = Promise<T | undefined>

@Injectable()
export class CacheService {
  private cache!: Cache
  private ioRedis!: Redis
  constructor(@Inject(CACHE_MANAGER) cache: Cache) {
    this.cache = cache
  }

  private get redisClient(): Redis {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return this.cache.store.client as unknown as Redis
  }

  public get<T>(key: TCacheKey): TCacheResult<T> {
    return this.cache.get(key)
  }

  public set(key: TCacheKey, value: any, milliseconds: number) {
    return this.cache.set(key, value, milliseconds)
  }

  public getClient() {
    return this.redisClient
  }

  private _emitter: Emitter

  public get emitter(): Emitter {
    if (this._emitter) return this._emitter

    this._emitter = new Emitter(this.redisClient, {
      key: RedisIoAdapterKey,
    })

    return this._emitter
  }
}
