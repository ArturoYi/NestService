import { Controller, BeforeApplicationShutdown } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FastifyReply, FastifyRequest } from 'fastify'
import { SkipThrottle } from '@nestjs/throttler'
import { ApiSecurityAuth } from '@project/src/common/decorators/swagger.decorators'

@ApiTags('System - sse模块')
@ApiSecurityAuth()
@SkipThrottle()
@Controller('sse')
export class SseController implements BeforeApplicationShutdown {
  private replyMap: Map<number, FastifyReply> = new Map()

  beforeApplicationShutdown(signal?: string) {
    throw new Error('Method not implemented.')
  }
}
