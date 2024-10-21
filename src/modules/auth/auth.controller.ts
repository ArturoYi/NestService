import { Controller, UseGuards } from '@nestjs/common'
import { Public } from './decorators/public.decorator'
import { ApiTags } from '@nestjs/swagger'
import { LocalGuard } from './guards/local.guard'
import { AuthService } from './auth.service'

@ApiTags('Auth - 认证模块')
@UseGuards(LocalGuard)
@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
}
