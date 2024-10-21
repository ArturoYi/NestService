import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { getIp } from '@project/src/utils'

import type { FastifyRequest } from 'fastify'
/**
 * 快速获取IP
 */
export const Ip = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<FastifyRequest>()
  return getIp(request)
})
