/*
 * @Author: czy0729
 * @Date: 2022-11-08 18:52:31
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-12-17 05:47:53
 */
import { _ } from '@stores'

export const memoStyles = _.memoStyles(() => ({
  container: {
    paddingHorizontal: _.wind,
    marginTop: _.md
  },
  item: {
    width: '50%',
    paddingVertical: _.sm,
    paddingRight: 20
  },
  progress: {
    maxWidth: Math.floor(_.window.contentWidth * 0.33),
    height: 2,
    marginRight: _.sm,
    backgroundColor: _.select(_.colorBorder, _.colorTinygrailIcon),
    borderRadius: _.radiusSm,
    overflow: 'hidden'
  },
  progressBar: {
    height: 2,
    backgroundColor: _.colorSuccess,
    borderRadius: _.radiusSm,
    overflow: 'hidden'
  }
}))
