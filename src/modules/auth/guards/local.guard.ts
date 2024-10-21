import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthStrategy } from '../auth.constant'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalGuard extends AuthGuard(AuthStrategy.LOCAL) {
  /**
   * Determines if a request can be activated.
   *
   * @param context The execution context of the request, containing information such as the request itself, route information, and more.
   * @returns Always returns true, indicating the request can always be activated.
   */
  async canActivate(context: ExecutionContext) {
    return true
  }
}
