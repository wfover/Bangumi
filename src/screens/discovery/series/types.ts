/*
 * @Author: czy0729
 * @Date: 2022-08-27 22:12:42
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-04-02 17:19:57
 */
import { factory } from '@utils'
import { Navigation } from '@types'
import Store from './store'

const f = factory(Store)

export type StoreType = typeof f

export type Ctx = {
  $: StoreType
  navigation?: Navigation
}
