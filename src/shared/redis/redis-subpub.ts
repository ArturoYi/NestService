import { Logger } from '@nestjs/common'
import IORedis from 'ioredis'
import type { Redis, RedisOptions } from 'ioredis'

export class RedisSubPub {
  public pubClient: Redis
  public subClient: Redis
  constructor(
    private redisConfig: RedisOptions,
    private channelPrefix: string = 'm-shop-channel#',
    private logger: Logger = new Logger(RedisSubPub.name),
  ) {
    this.init()
  }

  public init() {
    const redisOptions: RedisOptions = {
      host: this.redisConfig.host,
      port: this.redisConfig.port,
      username: this.redisConfig.username,
      password: this.redisConfig.password,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 1000, 3000)
        this.logger.warn(`Redis连接重试中... 第${times}次尝试，延迟${delay}ms`)
        return delay
      },
    }

    const pubClient = new IORedis(redisOptions)
    const subClient = pubClient.duplicate()
    this.pubClient = pubClient
    this.subClient = subClient

    // 发布客户端事件监听
    this.pubClient.on('connect', () => {
      this.logger.log('发布客户端连接成功到 Redis')
    })
    this.pubClient.on('error', (err) => {
      this.logger.error('发布客户端连接错误:', err)
    })
    this.pubClient.on('close', () => {
      this.logger.warn('发布客户端连接已关闭')
    })

    // 订阅客户端事件监听
    this.subClient.on('connect', () => {
      this.logger.log('订阅客户端连接成功到 Redis')
    })
    this.subClient.on('error', (err) => {
      this.logger.error('订阅客户端连接错误:', err)
    })
    this.subClient.on('close', () => {
      this.logger.warn('订阅客户端连接已关闭')
    })
  }
  public async publish(event: string, data: any) {
    const channel = this.channelPrefix + event
    const _data = JSON.stringify(data)
    if (event !== 'log') Logger.debug(`发布事件：${channel} <- ${_data}`, RedisSubPub.name)

    await this.pubClient.publish(channel, _data)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private ctc = new WeakMap<Function, (channel: string, message: string) => void>()

  public async subscribe(event: string, callback: (data: any) => void) {
    const myChannel = this.channelPrefix + event
    this.subClient.subscribe(myChannel)

    const cb = (channel, message) => {
      if (channel === myChannel) {
        if (event !== 'log') Logger.debug(`接收事件：${channel} -> ${message}`, RedisSubPub.name)

        callback(JSON.parse(message))
      }
    }

    this.ctc.set(callback, cb)
    this.subClient.on('message', cb)
  }

  public async unsubscribe(event: string, callback: (data: any) => void) {
    const channel = this.channelPrefix + event
    this.subClient.unsubscribe(channel)
    const cb = this.ctc.get(callback)
    if (cb) {
      this.subClient.off('message', cb)

      this.ctc.delete(callback)
    }
  }
}
