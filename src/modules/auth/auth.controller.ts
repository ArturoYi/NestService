import { Body, Controller, Post, UseGuards, Headers } from '@nestjs/common'
import { Public } from './decorators/public.decorator'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { LocalGuard } from './guards/local.guard'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { LoginDto, RegisterDto } from './dto/auth.dto'
import { CaptchaService } from './services/captcha.service'
import { ApiResult } from '@project/src/common/decorators/api-result.decorator'
import { AllowAnon } from './decorators/allow-anon.decorator'
import { Ip } from '@project/src/common/decorators/http.decorator'
import { LoginToken } from './models/auth.model'

@ApiTags('Auth - 认证模块')
@UseGuards(LocalGuard)
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private captchaService: CaptchaService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiResult({ type: [String] })
  @AllowAnon()
  async login(@Body() body: LoginDto, @Ip() ip: string, @Headers('user-agent') ua: string): Promise<LoginToken> {
    await this.captchaService.checkImgCaptcha(body.captchaId, body.verifyCode)
    const token = await this.authService.login(body.username, body.password, ip, ua)
    return { token: token }
  }

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto)
  }
}
