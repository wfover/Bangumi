/*
 * @Author: czy0729
 * @Date: 2024-05-04 05:27:30
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-05-04 18:38:19
 */
import React from 'react'
import { Flex, Text, Touchable } from '@components'
import { _, uiStore } from '@stores'
import { findSubjectJp, HTMLDecode } from '@utils'
import { ob } from '@utils/decorators'
import { COMPONENT } from './ds'
import { styles } from './styles'

function Item({ navigation, item, index }) {
  const jp = findSubjectJp(item.title, item.id)
  const up = item.value.includes('+')
  let value: string | number = Math.abs(Number(item.value))
  if (item.value.includes('.')) value = value.toFixed(2)
  return (
    <Flex style={styles.item}>
      <Flex align='start'>
        <Text size={13} lineHeight={20}>
          {index + 1}.{' '}
        </Text>
        <Flex.Item>
          <Touchable
            style={_.ml.xs}
            onPress={() => {
              navigation.push('Subject', {
                subjectId: item.id,
                _cn: item.title
              })
            }}
          >
            <Text size={20}>{HTMLDecode(item.title)}</Text>
            {!!jp && jp !== item.title && (
              <Text style={_.mt.xs} type='sub' size={13} lineHeight={14}>
                {jp}
              </Text>
            )}
          </Touchable>
        </Flex.Item>
        <Touchable
          onPress={() => {
            uiStore.showPopableSubject({
              subjectId: item.id
            })
          }}
        >
          <Flex style={styles.value} align='start'>
            <Text type={up ? 'bid' : 'ask'} size={28}>
              {up ? '▴' : '▾'}
            </Text>
            <Text size={16} lineHeight={30}>
              {' '}
              {value}
            </Text>
          </Flex>
        </Touchable>
      </Flex>
    </Flex>
  )
}

export default ob(Item, COMPONENT)