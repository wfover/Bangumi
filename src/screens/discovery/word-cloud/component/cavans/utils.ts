/*
 * @Author: czy0729
 * @Date: 2024-09-26 18:24:18
 * @Last Modified by: czy0729
 * @Last Modified time: 2024-09-27 22:15:32
 */
const COLORS = [
  'rgba(255, 255, 255, 0.9)',
  'rgba(255, 255, 255, 0.75)',
  'rgba(255, 255, 255, 0.6)',
  'rgba(255, 255, 255, 0.45)',
  'rgba(255, 255, 255, 0.3)'
]

export function getWords(result: [string, string][], max: number = 100) {
  return result
    .map((item, index) => ({
      text: item[0],
      value: Number(item[1]),
      color: COLORS[index % COLORS.length]
    }))
    .filter((_item, index) => index <= max)
}