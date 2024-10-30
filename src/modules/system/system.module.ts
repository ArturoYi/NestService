import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'

const modules = []

@Module({
  imports: [
    ...modules,
    RouterModule.register([
      {
        path: 'system',
        module: SystemModule,
        children: [...modules],
      },
    ]),
  ],
  exports: [...modules],
})
export class SystemModule {}
