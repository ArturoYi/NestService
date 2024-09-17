import { Logger as ITypeORMLogger, QueryRunner } from 'typeorm'
export class TypeORMLogger implements ITypeORMLogger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    throw new Error('Method not implemented.')
  }
  logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    throw new Error('Method not implemented.')
  }
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    throw new Error('Method not implemented.')
  }
  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    throw new Error('Method not implemented.')
  }
  logMigration(message: string, queryRunner?: QueryRunner) {
    throw new Error('Method not implemented.')
  }
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    throw new Error('Method not implemented.')
  }
}
