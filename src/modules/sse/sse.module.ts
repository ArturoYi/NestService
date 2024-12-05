import { Module } from '@nestjs/common'
import { SseService } from './sse.service'
import { SseController } from './sse.controller'

@Module({
  imports: [],
  controllers: [SseController],
  providers: [SseService],
  exports: [SseService],
})
export class SseModule {}
