/* eslint-disable no-param-reassign */
/*
 * @Author: czy0729
 * @Date: 2021-08-09 01:49:10
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-08-14 16:57:49
 */
import React from 'react'

function compareLog(prev, next) {
  const unsameKeys = []

  Object.keys(prev).forEach(key => {
    if (typeof prev[key] === 'object') {
      if (JSON.stringify(prev[key]) === JSON.stringify(next[key])) return
    } else if (prev[key] === next[key]) return

    unsameKeys.push(key)
  })

  if (unsameKeys.length) {
    if (prev[unsameKeys[0]] === 'object') {
      compareLog(prev[unsameKeys[0]], next[unsameKeys[0]])
      return
    }

    // 不打印styles, 没意义
    if (unsameKeys[0]) {
      if (unsameKeys[0] === 'styles') {
        console.log('\n', '[update]', unsameKeys[0], '\n')
      } else {
        console.log(
          '\n',
          '[update]',
          `${unsameKeys[0]}:`,
          JSON.stringify(prev[unsameKeys[0]]),
          '=>',
          JSON.stringify(next[unsameKeys[0]]),
          '\n'
        )
      }
    }
  }
}

function mapKey(target, key, value) {
  if (key === 'navigation' || key === '_loaded') return

  // 每次请求后, 不管数据源有没有变化, _loaded都会变化
  // 只额外过滤第一层对象里面的_loaded, 避免影响是否更新判断
  if (value && typeof value === 'object' && '_loaded' in value) {
    const { _loaded, ...other } = value
    target[key] = other
    return
  }

  target[key] = value
}

/**
 * 封装通用React.memo的第二参数
 *
 * @param {*} prevProps
 * @param {*} nextProps
 * @param {*} propsOrKeys
 */
function memoCompare(prevProps, nextProps, propsOrKeys, dev) {
  // 正常情况不会是false, 这是留给强制更新的一个参数配合
  if (prevProps === false && nextProps === false) {
    return false
  }

  const _prevProps = propsOrKeys ? {} : prevProps
  const _nextProps = propsOrKeys ? {} : nextProps
  if (propsOrKeys) {
    const _keys = Array.isArray(propsOrKeys)
      ? propsOrKeys
      : Object.keys(propsOrKeys)

    _keys.forEach(key => {
      mapKey(_prevProps, key, prevProps[key])
      mapKey(_nextProps, key, nextProps[key])
    })
  }

  const notUpdate = JSON.stringify(_prevProps) === JSON.stringify(_nextProps)
  if (dev && !notUpdate) compareLog(_prevProps, _nextProps)

  return notUpdate
}

/**
 * 封装通用React.memo
 *
 * @param {*} Component
 * @param {*} defaultProps
 * @param {*} customCompareFn | dev
 * @param {*} dev
 * @returns Component
 */
export default function memo(Component, defaultProps, customCompareFn, dev) {
  if (defaultProps) Component.defaultProps = defaultProps

  // 支持第三个参数为dev: true
  let _dev = dev
  if (typeof customCompareFn === 'boolean') _dev = customCompareFn

  return React.memo(Component, (prevProps, nextProps) =>
    typeof customCompareFn === 'function'
      ? memoCompare(
          customCompareFn(prevProps),
          customCompareFn(nextProps),
          null,
          _dev
        )
      : memoCompare(prevProps, nextProps, Component.defaultProps, _dev)
  )
}