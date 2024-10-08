/*
 * @Author: czy0729
 * @Date: 2020-10-22 19:41:01
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-08-23 00:49:12
 */
import React from 'react'
import { Flex, Text, Touchable } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import { Ctx } from '../../../types'
import { COMPONENT } from './ds'
import { memoStyles } from './styles'

function RakuenItem(
  { topicId, userName, title, group, date, time, userId, children },
  { navigation }: Ctx
) {
  const styles = memoStyles()
  return (
    <Flex style={styles.container} align='start'>
      <Flex.Item>
        <Touchable
          style={styles.item}
          animate
          onPress={() => {
            t('空间.跳转', {
              to: 'Topic',
              from: '超展开',
              topicId
            })

            navigation.push('Topic', {
              topicId,
              _title: title,
              _group: group,
              _time: `${date} ${time}`,
              _userName: userName,
              _userId: userId
            })
          }}
        >
          <Flex align='start'>
            <Flex.Item>
              <Text size={16}>{title}</Text>
              <Text style={_.mt.sm} type='sub' size={12}>
                {time} / {group}
              </Text>
            </Flex.Item>
          </Flex>
        </Touchable>
      </Flex.Item>
      {children}
    </Flex>
  )
}

export default obc(RakuenItem, COMPONENT)
