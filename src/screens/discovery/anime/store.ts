/*
 * @Author: czy0729
 * @Date: 2019-06-22 15:38:18
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-04-07 09:22:05
 */
import { computed, observable } from 'mobx'
import { collectionStore, otaStore, systemStore } from '@stores'
import { updateVisibleBottom } from '@utils'
import { scrollToTop } from '@utils/dom'
import { t } from '@utils/fetch'
import store from '@utils/store'
import { init, search } from '@utils/subject/anime'
import { STORYBOOK } from '@constants'
import { ADVANCE_LIMIT, EXCLUDE_STATE, NAMESPACE, STATE } from './ds'
import { Params } from './types'

const _loaded = false

export default class ScreenAnime extends store<typeof STATE> {
  params: Params

  state = observable(STATE)

  init = async () => {
    const state = await this.getStorage(NAMESPACE)
    const commitState = {
      ...state,
      ...EXCLUDE_STATE,
      _loaded
    }
    if (!Array.isArray(commitState.tags)) commitState.tags = []
    this.setState(commitState)

    const { _tags = [] } = this.params
    if (_tags.length) this.initQuery(typeof _tags === 'string' ? [_tags] : _tags)

    await init()
    this.search()

    collectionStore.fetchUserCollectionsQueue(false)
    setTimeout(() => {
      this.setState({
        _loaded: true
      })
    }, 120)
  }

  /** 动画本地数据查询 */
  search = (passQuery?: any) => {
    setTimeout(() => {
      const { query } = this.state
      const data = search(passQuery || query)
      this.setState({
        data
      })
    }, 80)
  }

  // -------------------- get --------------------
  /** 是否中文优先 */
  @computed get cnFirst() {
    return systemStore.setting.cnFirst
  }

  /** 是否列表布局 */
  @computed get isList() {
    return this.state.layout === 'list'
  }

  /** 对应项搜索后总数 */
  @computed get total() {
    return this.state.data.list.length
  }

  /** 对应项实际显示列表 */
  @computed get list() {
    const { data, query } = this.state
    let { list } = data

    if (query.collected === '隐藏') {
      list = list.filter(item => {
        const subjectId = otaStore.animeSubjectId(item)
        return !collectionStore.collect(subjectId)
      })
    }

    if (!systemStore.advance) {
      list = list.filter((item, index) => index < ADVANCE_LIMIT)
    }

    return list
  }

  // -------------------- page --------------------
  /** 初始化查询配置 */
  initQuery = (tags = []) => {
    const { query } = this.state
    this.setState({
      expand: true,
      query: {
        ...query,
        tags
      }
    })
  }

  /** 筛选选择 */
  onSelect = (type: string, value: string, multiple = false) => {
    const { query } = this.state
    if (type === 'tags') {
      const { tags = [] } = query

      if (multiple) {
        // 标签支持多选
        this.setState({
          query: {
            ...query,
            tags:
              value === ''
                ? []
                : tags.includes(value)
                ? tags.filter(item => value !== item)
                : [...tags, value]
          }
        })
      } else {
        this.setState({
          query: {
            ...query,
            tags: value === '' ? [] : [value]
          }
        })
      }
    } else {
      this.setState({
        query: {
          ...query,
          [type]: value
        }
      })
    }

    setTimeout(() => {
      this.search()
      this.setStorage(NAMESPACE)
      t('Anime.选择', {
        type,
        value,
        multiple
      })
    }, 0)
  }

  scrollToOffset: any = null

  forwardRef = (ref: { scrollToOffset: any }) => {
    if (ref?.scrollToOffset) this.scrollToOffset = ref.scrollToOffset
  }

  /** 到顶 */
  scrollToTop = () => {
    if (STORYBOOK) {
      scrollToTop()
      return
    }

    if (typeof this.scrollToOffset === 'function') {
      this.scrollToOffset({
        x: 0,
        y: 0,
        animated: true
      })

      t('Anime.到顶')
    }
  }

  /** 切换布局 */
  switchLayout = () => {
    const _layout = this.isList ? 'grid' : 'list'
    t('Anime.切换布局', {
      layout: _layout
    })

    this.setState({
      layout: _layout
    })
    this.setStorage(NAMESPACE)
  }

  /** 展开收起筛选 */
  onExpand = () => {
    const { expand } = this.state
    this.setState({
      expand: !expand
    })
    this.setStorage(NAMESPACE)
  }

  /** 更新可视范围底部 y */
  onScroll = updateVisibleBottom.bind(this)
}
