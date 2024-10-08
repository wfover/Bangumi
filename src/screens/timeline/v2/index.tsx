/*
 * @Author: czy0729
 * @Date: 2019-04-12 13:56:44
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-08-23 16:00:41
 */
import React from 'react'
import { Component, Page } from '@components'
import { TapListener } from '@_'
import { ic } from '@utils/decorators'
import { useObserver } from '@utils/hooks'
import Extra from './component/extra'
import Tab from './component/tab'
import Header from './header'
import { useTimelinePage } from './hooks'
import Store from './store'
import { Ctx } from './types'

/** 时间胶囊 */
const Timeline = (_props, context: Ctx) => {
  useTimelinePage(context)

  const { $ } = context
  return useObserver(() => (
    <Component id='screen-timeline'>
      <TapListener>
        <Page>
          <Header />
          {$.state._loaded && <Tab />}
        </Page>
      </TapListener>
      <Extra />
    </Component>
  ))
}

export default ic(Store, Timeline)
