/*
 * @Author: czy0729
 * @Date: 2022-08-04 17:12:10
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-04 06:39:15
 */
import { _ } from '@stores'
import { DEFAULT_SUBJECT_TYPE, DEFAULT_ORDER } from '../ds'

export const NAMESPACE = 'ScreenUser'

export const EXCLUDE_STATE = {
  isFocused: true,
  showFilter: false,
  fixed: false,
  filter: '',
  fliterInputText: '',
  fetching: false
}

export const STATE = {
  subjectType: DEFAULT_SUBJECT_TYPE,
  order: DEFAULT_ORDER,
  list: true,
  showYear: true,
  tag: '',

  /** Tabs 当前页数 */
  page: 2,

  ...EXCLUDE_STATE,
  _loaded: false
}