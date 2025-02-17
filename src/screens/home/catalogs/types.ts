/*
 * @Author: czy0729
 * @Date: 2022-07-19 15:51:17
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-11-09 06:32:19
 */
import { factory } from '@utils'
import { GetRouteParams, Navigation, RouteSubjectCatalogs, SubjectId } from '@types'
import Store from './store'

const f = factory(Store)

export type StoreType = typeof f

export type Ctx = {
  $: StoreType
  navigation?: Navigation
}

export type Params = GetRouteParams<RouteSubjectCatalogs>

export type SnapshotId = `subject-catalogs_${SubjectId}`
