/*
 * @Author: czy0729
 * @Date: 2023-12-26 07:10:55
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-12-26 07:13:53
 */
import React from 'react'
import { View } from 'react-native'
import { Touchable, Squircle, Image } from '@components'
import { systemStore } from '@stores'
import { obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import { rerender } from '@utils/dev'
import { ASSETS_AWARDS, HOST } from '@constants'
import { Ctx } from '../../types'
import { memoStyles } from './styles'

function Block({ year }, { navigation }: Ctx) {
  rerender('Discovery.Award.Block')

  const styles = memoStyles()
  const { coverRadius } = systemStore.setting
  const { width, height } = styles.item
  return (
    <Touchable
      style={styles.item}
      animate
      onPress={() => {
        t('发现.跳转', {
          to: 'Award',
          year: year,
          from: 'Award'
        })

        navigation.push('Award', {
          uri: `${HOST}/award/${year}`
        })
      }}
    >
      <Squircle width={width} height={height} radius={coverRadius}>
        <View style={styles[`item${year}`]}>
          <Image
            src={ASSETS_AWARDS[year]}
            size={width - (year === 2019 ? 32 : 0)}
            height={height}
            placeholder={false}
            resizeMode={year !== 2018 ? 'contain' : 'cover'}
          />
        </View>
      </Squircle>
    </Touchable>
  )
}

export default obc(Block)