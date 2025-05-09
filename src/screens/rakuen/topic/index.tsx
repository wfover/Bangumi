/*
 * @Author: czy0729
 * @Date: 2019-04-29 19:28:43
 * @Last Modified by: czy0729
 * @Last Modified time: 2025-05-06 21:35:20
 */
import React from 'react'
import './styles'
import { Component, Page } from '@components'
import { StoreContext } from '@stores'
import { useObserver } from '@utils/hooks'
import { NavigationProps } from '@types'
import Bottom from './component/bottom'
import Extra from './component/extra'
import List from './component/list'
import TouchScroll from './component/touch-scroll'
import Header from './header'
import { useTopicPage } from './hooks'

/** 帖子 */
const Topic = (props: NavigationProps) => {
  const {
    id,
    forwardRef,
    fixedTextareaRef,
    onFloorPress,
    onShowFixedTextarea,
    onScrollToIndexFailed,
    onScrollToTop,
    onDirect
  } = useTopicPage(props)

  return useObserver(() => (
    <Component id='screen-topic'>
      <StoreContext.Provider value={id}>
        <Page statusBarEvent={false}>
          <List
            forwardRef={forwardRef}
            onScrollToIndexFailed={onScrollToIndexFailed}
            onShowFixedTextarea={onShowFixedTextarea}
          />
          <TouchScroll onPress={onFloorPress} />
        </Page>
        <Header onScrollToTop={onScrollToTop} />
        <Bottom fixedTextareaRef={fixedTextareaRef} onDirect={onDirect} />
        <Extra />
      </StoreContext.Provider>
    </Component>
  ))
}

export default Topic
