/*
 * @Author: czy0729
 * @Date: 2024-11-17 08:13:45
 * @Last Modified by:   czy0729
 * @Last Modified time: 2024-11-17 08:13:45
 */
import { useInitStore } from '@stores'
import { useRunAfter } from '@utils/hooks'
import { NavigationProps } from '@types'
import store from './store'
import { Ctx } from './types'

/** 维基人页面逻辑 */
export function useWikiPage(props: NavigationProps) {
  const context = useInitStore<Ctx['$']>(props, store)
  const { $ } = context

  useRunAfter(() => {
    $.init()
  })

  return context
}
