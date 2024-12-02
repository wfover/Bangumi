/*
 * @Author: czy0729
 * @Date: 2024-10-10 11:55:19
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-11-18 06:49:06
 */
import React from 'react'
import { View } from 'react-native'
import { useObserver } from 'mobx-react'
import './styles'
import { Component, Page, Track } from '@components'
import { _, StoreContext } from '@stores'
import { NavigationProps } from '@types'
import Bg from './component/bg'
import List from './component/list'
import Options from './component/options'
import { useMilestonePage } from './hooks'

/** 照片墙 */
const Milestone = (props: NavigationProps) => {
  const { id, $ } = useMilestonePage(props)

  return useObserver(() => (
    <Component id='screen-milestone'>
      <StoreContext.Provider value={id}>
        <View
          style={{
            height: _.statusBarHeight,
            backgroundColor: _.colorPlain
          }}
        />
        <Page loaded={$.state._loaded}>
          <Bg />
          <List />
        </Page>
        <Options />
        <Track title='照片墙' hm={[`milestone/${$.userId}`, 'Milestone']} />
      </StoreContext.Provider>
    </Component>
  ))
}

export default Milestone