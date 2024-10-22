import { Injectable } from '@nestjs/common'
import { RegisterDto } from '../auth/dto/auth.dto'

@Injectable()
export class UserService {
  /**
   * 注册
   */
  async register({ username, ...data }: RegisterDto) {}
}
