/*
 * @Author: czy0729
 * @Date: 2024-11-16 10:13:10
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-11-17 09:44:58
 */
import { useInitStore } from '@stores'
import { useRunAfter } from '@utils/hooks'
import { NavigationProps } from '@types'
import store from './store'
import { Ctx } from './types'

/** 条目目录页面逻辑 */
export function useCatalogsPage(props: NavigationProps) {
  const context = useInitStore<Ctx['$']>(props, store)
  const { $ } = context

  useRunAfter(() => {
    $.init()
  })

  return context
}
