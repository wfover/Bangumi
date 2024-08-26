/*
 * @Author: czy0729
 * @Date: 2024-08-16 01:11:21
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-08-16 05:17:32
 */
import React from 'react'
import { Flex, Heatmap, Iconfont, Text, Touchable } from '@components'
import { SectionTitle as SectionTitleComp } from '@_'
import { obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import { Ctx } from '../../types'
import { COMPONENT } from './ds'
import { memoStyles } from './styles'

function SectionTitle(_props, { $, navigation }: Ctx) {
  const styles = memoStyles()
  const { _count } = $.params
  return (
    <SectionTitleComp
      style={styles.title}
      right={
        <Touchable
          style={styles.touch}
          onPress={() => {
            const isCharacter = $.monoId.includes('character/')
            navigation.push('Topic', {
              topicId: `${isCharacter ? 'crt' : 'prsn'}/${($.monoId || '').match(/\d+/g)[0]}`
            })

            t('人物.跳转', {
              to: 'Topic',
              from: '去吐槽',
              monoId: $.monoId
            })
          }}
        >
          <Flex>
            <Text type='sub'>去吐槽</Text>
            <Iconfont name='md-navigate-next' />
          </Flex>
          <Heatmap id='人物.跳转' from='去吐槽' />
          <Heatmap right={66} id='人物.跳转' to='Topic' alias='帖子' transparent />
        </Touchable>
      }
    >
      吐槽{' '}
      {!!_count && (
        <Text type='sub' lineHeight={24}>
          {_count}+
        </Text>
      )}
    </SectionTitleComp>
  )
}

export default obc(SectionTitle, COMPONENT)