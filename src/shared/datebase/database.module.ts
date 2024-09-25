import { Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigKeyPaths, IDatabaseConfig } from '@project/config'
import { env } from '@project/global/env'
import { DataSource, LoggerOptions } from 'typeorm'
import { TypeORMLogger } from './typeorm-logger'
import { EntityExistConstraint } from './constraints/entity-exist.constraint'
import { UniqueConstraint } from './constraints/unique.constraint'

const providers = [EntityExistConstraint, UniqueConstraint]
const logger = new Logger('DatabaseModule')

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        let loggerOptions: LoggerOptions = env('DB_LOGGING') as 'all'
        try {
          // 解析成 js 数组 ['error']
          loggerOptions = JSON.parse(loggerOptions)
          logger.log('解析后的日志选项：', loggerOptions)
        } catch {
          // ignore
          logger.error('解析日志选项失败，使用默认选项')
        }
        logger.log('获取的数据库配置：', configService.get<IDatabaseConfig>('database'))
        return {
          ...configService.get<IDatabaseConfig>('database'),
          autoLoadEntities: true,
          logging: loggerOptions,
          logger: new TypeORMLogger(loggerOptions),
        }
      },
      // dataSource receives the configured DataSourceOptions
      // and returns a Promise<DataSource>.
      dataSourceFactory: async (options) => {
        logger.log('开始初始化数据源，配置选项：', options)
        const dataSource = await new DataSource(options).initialize()
        logger.log('数据源初始化成功。')
        return dataSource
      },
    }),
  ],
  providers,
  exports: providers,
})
export class DatabaseModule {}
