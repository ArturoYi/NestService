import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LessThan, Repository } from 'typeorm'

import { TaskLogQueryDto } from '../dto/log.dto'
import { TaskLogEntity } from '../entities/task-log.entity'
import { paginate } from '@project/src/common/helper/paginate'

@Injectable()
export class TaskLogService {
  constructor(
    @InjectRepository(TaskLogEntity)
    private taskLogRepository: Repository<TaskLogEntity>,
  ) {}

  async create(tid: number, status: number, time?: number, err?: string): Promise<number> {
    const result = await this.taskLogRepository.save({
      status,
      detail: err,
      time,
      task: { id: tid },
    })
    return result.id
  }

  async list({ page, pageSize }: TaskLogQueryDto) {
    const queryBuilder = this.taskLogRepository
      .createQueryBuilder('task_log')
      .leftJoinAndSelect('task_log.task', 'task')
      .orderBy('task_log.id', 'DESC')

    return paginate<TaskLogEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }

  async clearLog(): Promise<void> {
    await this.taskLogRepository.clear()
  }

  async clearLogBeforeTime(time: Date): Promise<void> {
    await this.taskLogRepository.delete({ createdAt: LessThan(time) })
  }
}
