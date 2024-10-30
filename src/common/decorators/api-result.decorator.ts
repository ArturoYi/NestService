import { applyDecorators, HttpStatus, RequestMethod, Type } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { ResOp } from '../model/response.model'
import { METHOD_METADATA } from '@nestjs/common/constants'

const baseTypeNames = ['String', 'Number', 'Boolean']

/**
 * 根据类型生成基础属性
 *
 * 此函数旨在根据提供的类型信息生成一个基础属性对象如果提供的类型是预定义的基础类型之一，
 * 则返回一个包含类型名称的对象；如果不是基础类型，则返回一个引用类型架构的对象
 *
 * @param type - 要生成属性的类型对象，泛型类型
 * @returns 返回一个对象，包含属性类型信息或引用类型架构
 */
function genBaseProp(type: Type<any>) {
  // 检查类型名称是否在基础类型名称列表中
  if (baseTypeNames.includes(type.name)) {
    // 是基础类型，返回类型名称
    return { type: type.name.toLocaleLowerCase() }
  } else {
    // 非基础类型，返回引用类型架构
    return { $ref: getSchemaPath(type) }
  }
}

/**
 * @description: 生成返回结果装饰器
 */
export function ApiResult<TModel extends Type<any>>({
  type,
  isPage,
  status,
}: {
  type?: TModel | TModel[]
  isPage?: boolean
  status?: HttpStatus
}) {
  let prop = null

  if (Array.isArray(type)) {
    if (isPage) {
      prop = {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(type[0]) },
          },
          meta: {
            type: 'object',
            properties: {
              itemCount: { type: 'number', default: 0 },
              totalItems: { type: 'number', default: 0 },
              itemsPerPage: { type: 'number', default: 0 },
              totalPages: { type: 'number', default: 0 },
              currentPage: { type: 'number', default: 0 },
            },
          },
        },
      }
    } else {
      prop = {
        type: 'array',
        items: genBaseProp(type[0]),
      }
    }
  } else if (type) {
    prop = genBaseProp(type)
  } else {
    prop = { type: 'null', default: null }
  }

  const model = Array.isArray(type) ? type[0] : type

  return applyDecorators(
    ApiExtraModels(model),
    (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
      queueMicrotask(() => {
        const isPost = Reflect.getMetadata(METHOD_METADATA, descriptor.value) === RequestMethod.POST

        ApiResponse({
          status: status ?? (isPost ? HttpStatus.CREATED : HttpStatus.OK),
          schema: {
            allOf: [
              { $ref: getSchemaPath(ResOp) },
              {
                properties: {
                  data: prop,
                },
              },
            ],
          },
        })(target, key, descriptor)
      })
    },
  )
}
