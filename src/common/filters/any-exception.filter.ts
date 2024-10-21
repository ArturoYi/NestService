import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { QueryFailedError } from 'typeorm'
import { ErrorEnum } from '../constants/error-code.constants'
import { BizException } from '../exceptions/biz.exception'
import { IBaseResponse } from '../../../types/global'
import { isDev } from '@project/src/global/env'

interface myError {
  readonly status: number
  readonly statusCode?: number

  readonly message?: string
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  constructor() {
    this.registerCatchAllExceptionsHook()
  }
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getResponse<FastifyRequest>()
    const response = ctx.getResponse<FastifyReply>()

    const url = request.raw.url

    const status = this.getStatus(exception)
    let message = this.getErrorMessage(exception)

    if (status === HttpStatus.INTERNAL_SERVER_ERROR && !(exception instanceof BizException)) {
      Logger.error(exception, undefined, 'Catch')
      // 生产环境下隐藏错误信息
      if (!isDev) message = ErrorEnum.SERVER_ERROR?.split(':')[1]
    } else {
      this.logger.warn(`错误信息：(${status}) ${message} Path: ${decodeURI(url)}`, undefined, 'Catch')
    }

    const apiErrorCode = exception instanceof BizException ? exception.getErrorCode() : status

    // 返回基础响应结果
    const resBody: IBaseResponse = {
      code: apiErrorCode,
      message,
      data: null,
    }

    response.status(status).send(resBody)
  }

  getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus()
    } else if (exception instanceof QueryFailedError) {
      return HttpStatus.INTERNAL_SERVER_ERROR
    } else {
      return (exception as myError)?.status ?? (exception as myError)?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.message
    } else if (exception instanceof QueryFailedError) {
      return exception.message
    } else {
      return (exception as any)?.response.message ?? (exception as myError)?.message ?? `${exception}`
    }
  }

  registerCatchAllExceptionsHook() {
    /**
     * 当一个 Promise 被拒绝且没有使用 .catch() 方法或其他错误处理机制进行处理时，就会触发 unhandledRejection 事件。
     */
    process.on('unhandledRejection', (reason) => {
      console.error('unhandledRejection: ', reason)
    })

    /**
     * 当 Node.js 遇到一个未处理的异常时，就会触发 uncaughtException 事件。
     */
    process.on('uncaughtException', (err) => {
      console.error('uncaughtException: ', err)
    })
  }
}
