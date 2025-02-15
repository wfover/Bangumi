/*
 * @Author: czy0729
 * @Date: 2019-08-25 19:50:36
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-11-19 15:59:25
 */
import React from 'react'
import { toJS } from 'mobx'
import { ListView, Loading } from '@components'
import { _, useStore } from '@stores'
import { ob } from '@utils/decorators'
import { refreshControlProps } from '@tinygrail/styles'
import { TABS } from '../../ds'
import { Ctx } from '../../types'
import Item from '../item'
import { COMPONENT } from './ds'

function List({ id, title = '全部' }) {
  const { $ } = useStore<Ctx>()
  const rich = $.rich(id)
  if (!rich._loaded) return <Loading style={_.container.flex} color={_.colorTinygrailText} />

  // top 100 余额最多处理
  let data = rich
  if (title === TABS[1].title) {
    data = toJS(rich)
    data.list = data.list.slice().sort((a, b) => parseInt(b.share) - parseInt(a.share))
  } else if (title === TABS[2].title) {
    data = toJS(rich)
    data.list = data.list.slice().sort((a, b) => parseInt(b.total) - parseInt(a.total))
  } else if (title === TABS[3].title) {
    data = toJS(rich)
    data.list = data.list.slice().sort((a, b) => parseInt(b.principal) - parseInt(a.principal))
  }

  const [page, limit] = id.split('/')
  return (
    <ListView
      style={_.container.flex}
      contentContainerStyle={_.container.bottom}
      keyExtractor={(item: any) => String(item?.userId)}
      refreshControlProps={refreshControlProps}
      footerTextType='tinygrailText'
      data={data}
      windowSize={6}
      initialNumToRender={24}
      maxToRenderPerBatch={24}
      updateCellsBatchingPeriod={24}
      lazy={24}
      scrollToTop={TABS[$.state.page].title === title}
      renderItem={({ item, index }) => (
        <Item index={index} title={title} page={parseInt(page)} limit={parseInt(limit)} {...item} />
      )}
      onHeaderRefresh={() => $.fetchRich(id)}
    />
  )
}

export default ob(List, COMPONENT)
