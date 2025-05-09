/*
 * @Author: czy0729
 * @Date: 2022-03-16 01:23:50
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-11-18 06:47:32
 */
import React from 'react'
import { HeaderV2, HeaderV2Popover } from '@components'
import { useStore } from '@stores'
import { open } from '@utils'
import { ob } from '@utils/decorators'
import { t } from '@utils/fetch'
import { TEXT_MENU_BROWSER } from '@constants'
import { Ctx } from '../types'
import { COMPONENT, DATA } from './ds'

function Header() {
  const { $ } = useStore<Ctx>()
  return (
    <HeaderV2
      title='好友'
      hm={$.hm}
      headerRight={() => (
        <HeaderV2Popover
          data={DATA}
          onSelect={title => {
            if (title === TEXT_MENU_BROWSER) {
              open($.url)

              t('好友.右上角菜单', {
                key: title
              })
            }
          }}
        />
      )}
    />
  )
}

export default ob(Header, COMPONENT)
