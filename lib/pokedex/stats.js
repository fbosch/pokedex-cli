const blessed = require('blessed')
const mem = require('mem')
const { statLabelMap, statColorMap } = require('../maps')

const byLabelMapOrder = (a, b) => {
  const statKeys = Object.keys(statLabelMap)
  return statKeys.indexOf(a.stat.name) > statKeys.indexOf(b.stat.name)
}

module.exports = mem(pokemon => {
  const maxBaseStat = 270

  const statsBox = blessed.box({
    label: 'Stats',
    height: 15,
    width: '50%-2',
    top: 9,
    left: 1,
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: '#222'
      }
    }
  })

  const container = blessed.box({
    parent: statsBox,
    height: '80%',
    width: '96%',
    top: 1
  })

  if (pokemon) {
    pokemon.stats
      .sort(byLabelMapOrder)
      .forEach((stat, index) => {
        const statContainer = blessed.box({
          parent: container,
          width: `100%-1`,
          label: statLabelMap[stat.stat.name],
          top: (2 * index),
          height: '12%',
          style: {
            fg: '#fff'
          }
        })
        blessed.progressbar({
          parent: statContainer,
          content: ' ' + stat.base_stat.toString(),
          orientation: 'horizontal',
          width: '60%',
          left: '40%',
          filled: Math.floor((stat.base_stat / maxBaseStat) * 100),
          style: {
            fg: '#fff',
            bg: '#222',
            bar: {
              fg: '#fff',
              bg: statColorMap[stat.stat.name]
            }
          }
        })
      })
  }

  return statsBox
})
