/*
 * @Author: czy0729
 * @Date: 2021-02-28 17:51:26
 * @Last Modified by: czy0729
 * @Last Modified time: 2025-03-06 19:13:18
 */
import React from 'react'
import { Avatar, Flex, Text, Touchable } from '@components'
import { _ } from '@stores'
import { formatNumber, HTMLDecode, navigationReference, tinygrailOSS } from '@utils'
import { ob } from '@utils/decorators'
import Rank from '../../rank'
import { COMPONENT } from './ds'
import { memoStyles } from './styles'

function Log({
  navigation,
  monoId,
  name = '',
  icon,
  amount,
  rank = 0,
  oldRank = 0,
  userName,
  time,
  type,
  onToggle
}) {
  const styles = memoStyles()
  const rankChange = oldRank - rank
  return (
    <Flex style={styles.container}>
      <Avatar
        src={tinygrailOSS(icon)}
        size={36}
        name={name}
        borderColor='transparent'
        skeletonType='tinygrail'
        onPress={() => {
          const navigationRef = navigation || navigationReference()
          if (!navigationRef) return

          if (typeof onToggle === 'function') onToggle()
          setTimeout(() => {
            navigationRef.push('Mono', {
              monoId: `character/${monoId}`,
              _name: name
            })
          }, 160)
        }}
      />
      <Flex.Item style={_.ml.sm}>
        <Touchable
          onPress={() => {
            const navigationRef = navigation || navigationReference()
            if (!navigationRef) return

            if (typeof onToggle === 'function') onToggle()
            setTimeout(() => {
              navigationRef.push('TinygrailSacrifice', {
                monoId: `character/${monoId}`
              })
            }, 160)
          }}
        >
          <Flex>
            <Text
              style={_.mr.xs}
              type='tinygrailPlain'
              size={name.length > 12 ? 8 : name.length > 8 ? 10 : 12}
              bold
              numberOfLines={1}
              shrink
            >
              {name}
            </Text>
            <Rank value={rank} />
            {rankChange !== 0 && (
              <Text
                style={[
                  styles.change,
                  {
                    backgroundColor: rankChange >= 0 ? _.colorBid : _.colorAsk
                  }
                ]}
                size={9}
                lineHeight={1}
                bold
                align='center'
                shadow
              >
                {rankChange >= 0 ? '↑' : '↓'}
                {Math.abs(rankChange)}
              </Text>
            )}
          </Flex>
          <Flex style={_.mt.xs}>
            <Flex.Item>
              {userName ? (
                <Flex>
                  <Text type='tinygrailText' size={10} numberOfLines={1} shrink>
                    @{HTMLDecode(userName)}
                  </Text>
                  <Text
                    style={_.ml.xs}
                    type={type === 4 ? 'ask' : 'bid'}
                    size={10}
                    numberOfLines={1}
                  >
                    +{formatNumber(amount, 0)}
                    {type === 3 && ' 精炼成功'}
                    {type === 4 && ' 精炼失败'}
                  </Text>
                </Flex>
              ) : (
                <Text type='ask' size={10}>
                  <Text type='tinygrailText' size={10}>
                    受到攻击{' '}
                  </Text>
                  -{formatNumber(amount, 0)}
                </Text>
              )}
            </Flex.Item>
            <Text style={_.ml.md} type='tinygrailText' size={10}>
              {time}
            </Text>
          </Flex>
        </Touchable>
      </Flex.Item>
    </Flex>
  )
}

export default ob(Log, COMPONENT)
