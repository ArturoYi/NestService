import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { Public } from './decorators/public.decorator'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { LocalGuard } from './guards/local.guard'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { RegisterDto } from './dto/auth.dto'

@ApiTags('Auth - 认证模块')
@UseGuards(LocalGuard)
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto)
  }
}
