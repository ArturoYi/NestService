import { HttpException, HttpStatus } from '@nestjs/common'
import { ErrorEnum } from '../constants/error-code.constants'
import { RESPONSE_SUCCESS_CODE } from '../constants/response.constant'

export class BusinessException extends HttpException {
  private errorCode: number

  constructor(error: ErrorEnum | string) {
    //判断是否是枚举ErrorEnum
    if (!error.includes(':')) {
      super(
        HttpException.createBody({
          code: RESPONSE_SUCCESS_CODE,
          errorMsg: error,
        }),
        HttpStatus.OK,
      )
      this.errorCode = RESPONSE_SUCCESS_CODE
      return
    }
    const [code, errorMsg] = error.split(':')

    super(
      HttpException.createBody({
        code: code,
        errorMsg,
      }),
      HttpStatus.OK,
    )

    this.errorCode = Number(code)
  }
  getErrorCode(): number {
    return this.errorCode
  }
}

export { BusinessException as BizException }
