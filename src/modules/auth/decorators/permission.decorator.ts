import { applyDecorators, SetMetadata } from '@nestjs/common'
import { isPlainObject } from 'lodash'
import { PERMISSION_KEY } from '../auth.constant'

/** (此举非必需)保存通过 definePermission 定义的所有权限，可用于前端开发人员开发阶段的 ts 类型提示，避免前端权限定义与后端定义不匹配 */
let permissions: string[] = []

type AddPrefixToObjectValue<T extends string, P extends Record<string, string>> = {
  [K in keyof P]: K extends string ? `${T}:${P[K]}` : never
}

/** 资源操作需要特定的权限 */
export function Perm(permission: string | string[]) {
  return applyDecorators(SetMetadata(PERMISSION_KEY, permission))
}

export function definePermission(modulePrefix: string, actions) {
  if (isPlainObject(actions)) {
    Object.entries(actions).forEach(([key, action]) => {
      actions[key] = `${modulePrefix}:${action}`
    })
    permissions = [...new Set([...permissions, ...Object.values<string>(actions)])]
    return actions
  } else if (Array.isArray(actions)) {
    const permissionFormats = actions.map((action) => `${modulePrefix}:${action}`)
    permissions = [...new Set([...permissions, ...permissionFormats])]

    return actions.reduce((prev, action) => {
      prev[action.toUpperCase()] = `${modulePrefix}:${action}`
      return prev
    }, {})
  }
}

/** 获取所有通过 definePermission 定义的权限 */
export const getDefinePermissions = () => permissions
