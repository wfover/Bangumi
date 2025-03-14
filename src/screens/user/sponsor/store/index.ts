/*
 * @Author: czy0729
 * @Date: 2023-01-07 16:44:54
 * @Last Modified by: czy0729
 * @Last Modified time: 2025-01-08 10:13:38
 */
import Action from './action'
import { EXCLUDE_STATE, NAMESPACE } from './ds'

export default class ScreeSponsor extends Action {
  init = async () => {
    this.setState({
      ...(await this.getStorage(NAMESPACE)),
      ...EXCLUDE_STATE,
      _loaded: true
    })

    return true
  }
}
