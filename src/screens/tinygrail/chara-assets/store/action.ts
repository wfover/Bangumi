/*
 * @Author: czy0729
 * @Date: 2024-10-24 20:22:51
 * @Last Modified by: czy0729
 * @Last Modified time: 2025-03-04 17:23:50
 */
import { tinygrailStore } from '@stores'
import { alert, confirm, copy, feedback, info } from '@utils'
import { t } from '@utils/fetch'
import { PER_BATCH_COUNT } from '../ds'
import { Direction } from '../types'
import Fetch from './fetch'

export default class Action extends Fetch {
  /** 标签页切换 */
  onChange = (page: number) => {
    if (page === this.state.page) return

    this.setState({
      page
    })
    this.save()
    this.tabChangeCallback(page)

    t('我的持仓.标签页切换', {
      page
    })
  }

  /** 设置前往路由 */
  onSelectGo = (title: string) => {
    this.setState({
      go: title
    })
    this.save()

    t('我的持仓.设置前往', {
      title
    })
  }

  /** 查看别人持仓时才会刷新对应数据 */
  tabChangeCallback = (page: number) => {
    if (this.userId) return

    if (!this.myCharaAssets._loaded) this.fetchMyCharaAssets()
    if (page === 2) this.fetchTemple()
    if (this.state.editing) this.toggleBatchEdit()
  }

  /** 选择等级筛选 */
  onLevelSelect = (level: any) => {
    this.setState({
      level
    })
    this.save()
  }

  /** 排序回调 */
  onSortPress = (item: string) => {
    if (item === this.state.sort) {
      const { direction } = this.state
      let nextSort = item
      let nextDirection: Direction = 'down'
      if (direction === 'down') {
        nextDirection = 'up'
      } else if (direction === 'up') {
        nextSort = ''
        nextDirection = ''
      }

      t('我的持仓.排序', {
        sort: nextSort,
        direction: nextDirection
      })

      this.setState({
        sort: nextSort,
        direction: nextDirection
      })
    } else {
      t('我的持仓.排序', {
        sort: item,
        direction: 'down'
      })

      this.setState({
        sort: item,
        direction: 'down'
      })
    }

    this.save()
  }

  /** 切换批量操作 */
  toggleBatchEdit = (batchAction = '') => {
    this.setState({
      editing: !this.state.editing,
      batchAction
    })
    this.clearState('editingIds', {})
  }

  /** 批量操作切换一项 */
  toggleEditingId = (id: string | number, count: any) => {
    const ids = {
      ...this.state.editingIds
    }
    if (ids[id]) {
      delete ids[id]
    } else {
      ids[id] = count
    }

    this.clearState('editingIds', ids)
  }

  /** 批量操作自增多选 */
  increaseBatchSelect = () => {
    const { editingIds } = this.state
    const { list } = this.charaList

    const _editingIds = {
      ...editingIds
    }
    const ids = Object.keys(_editingIds)
    let startIndex = -1
    let count = 0
    if (ids.length) {
      // 多选模式选择要从最后选择的角色索引处开始
      startIndex = Math.max(...ids.map(id => list.findIndex(item => item.id == id)))
    }

    list
      .filter((_item, index: number) => index > startIndex)
      .forEach(item => {
        if (count >= PER_BATCH_COUNT) return
        _editingIds[item.id] = item.state || 0
        count += 1
      })
    this.setState({
      editingIds: _editingIds
    })

    const start = startIndex === -1 ? 1 : startIndex + 2
    info(`已选 ${start} - ${start + PER_BATCH_COUNT - 1}`)
  }

  /** 批量献祭 */
  doBatchSacrifice = (isSale: boolean = false) => {
    const { editingIds } = this.state
    const ids = Object.keys(editingIds)
    if (!ids.length) {
      return
    }

    const action = isSale ? '出售' : '献祭'
    confirm(
      `批量 (${action}) (${ids.length}) 个角色的所有流动股份, 该操作不能撤回, 确定? (若角色当前有挂单, 可用数与显示数对不上时, 操作会失败)`,
      async () => {
        t('我的持仓.批量献祭', {
          length: ids.length,
          isSale
        })

        const successIds = []
        const errorIds = []
        for (const id of ids) {
          try {
            const { State } = await tinygrailStore.doSacrifice({
              monoId: id,
              amount: editingIds[id],
              isSale
            })

            if (State === 1) {
              errorIds.push(id)
            } else {
              successIds.push(id)
            }
          } catch (error) {
            errorIds.push(id)
          }
          info(`正在献祭 ${ids.findIndex(item => item === id) + 1} / ${ids.length}`)
        }
        feedback()

        // 当成功数量少于20个, 使用局部更新
        if (successIds.length <= 20) {
          tinygrailStore.batchUpdateMyCharaAssetsByIds(successIds)
        } else {
          this.fetchMyCharaAssets()
        }

        if (errorIds.length) {
          alert(`共有 (${errorIds.length}) 个角色 (${action}) 失败`, '小圣杯助手')
        } else {
          info('操作完成')
        }
        this.toggleBatchEdit()
      },
      '警告'
    )
  }

  /** 批量以当前价挂卖单 */
  doBatchAsk = async (distance = 0) => {
    const { editingIds } = this.state
    const ids = Object.keys(editingIds)
    if (!ids.length) return

    confirm(
      `批量对 (${ids.length}) 个角色以当前价${
        distance !== 0 ? `${distance}cc` : ''
      } (挂卖单), 确定? (若角色当前有挂单, 可用数与显示数对不上时, 操作会失败)`,
      async () => {
        t('我的持仓.批量挂单', {
          length: ids.length
        })

        const { list } = this.charaList
        const successIds = []
        const errorIds = []
        for (const id of ids) {
          try {
            const item = list.find(item => item.id == id)
            if (item) {
              const { current, state } = item
              const { State } = await tinygrailStore.doAsk({
                monoId: id,
                price: Math.max(5, current + distance),
                amount: state,
                isIce: false
              })

              if (State === 1) {
                errorIds.push(id)
              } else {
                successIds.push(id)
              }
            }
          } catch (error) {
            errorIds.push(id)
          }
          info(`正在挂卖单 ${ids.findIndex(item => item === id) + 1} / ${ids.length}`)
        }
        feedback()

        // 当成功数量少于 20 个, 使用局部更新
        if (successIds.length <= 20) {
          tinygrailStore.batchUpdateMyCharaAssetsByIds(successIds)
        } else {
          this.fetchMyCharaAssets()
        }

        if (errorIds.length) {
          alert(`共有 (${errorIds.length}) 个角色 (挂卖单) 失败`, '小圣杯助手')
        } else {
          info('操作完成')
        }
        this.toggleBatchEdit()
      },
      '警告'
    )
  }

  /** 批量生成分享粘贴板 */
  doBatchShare = async () => {
    const { editingIds } = this.state
    const ids = Object.keys(editingIds)
    if (!ids.length) return

    const { page } = this.state
    const list = page === 1 ? this.myCharaAssets.ico : this.charaList
    const items = []
    for (const id of ids) {
      try {
        const item = list.list.find(item => item.id == id)
        if (item) {
          items.push(item)
        }
      } catch (error) {
        console.error(error)
      }
    }

    copy(
      items
        .map(item => `https://bgm.tv/character/${item.monoId || item.id}\n${item.name}`)
        .join('\n'),
      `已复制 ${items.length} 个角色的分享链接`
    )
    this.toggleBatchEdit()
  }
}
