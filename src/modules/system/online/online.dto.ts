import { ApiProperty } from '@nestjs/swagger'
import { PagerDto } from '@project/src/common/dto/pager.dto'
import { IsString } from 'class-validator'

export class KickDto {
  @ApiProperty({ description: 'tokenId' })
  @IsString()
  tokenId: string
}

export class OnlineQueryDto extends PagerDto {}
