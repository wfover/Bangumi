/*
 * @Author: czy0729
 * @Date: 2019-03-23 04:16:27
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-11-15 02:55:08
 */
import React from 'react'
import { Component, Page } from '@components'
import { StoreContext } from '@stores'
import { useObserver } from '@utils/hooks'
import { IOS } from '@constants'
import { NavigationProps } from '@types'
import Bg from './component/bg'
import Extra from './component/extra'
import List from './component/list'
import Header from './header'
import { useSubjectPage } from './hooks'

/** 条目 */
const Subject = (props: NavigationProps) => {
  const { id, forwardRef, onBlockRef, onScrollIntoViewIfNeeded, onScrollTo, onScrollToTop } =
    useSubjectPage(props)

  return useObserver(() => (
    <Component id='screen-subject'>
      <StoreContext.Provider value={id}>
        <Page statusBarEvent={false}>
          {IOS && <Bg />}
          <List
            forwardRef={forwardRef}
            onScrollIntoViewIfNeeded={onScrollIntoViewIfNeeded}
            onBlockRef={onBlockRef}
          />
        </Page>
        <Header onScrollTo={onScrollTo} onScrollToTop={onScrollToTop} />
        <Extra />
      </StoreContext.Provider>
    </Component>
  ))
}

export default Subject
