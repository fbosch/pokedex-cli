const blessed = require('blessed')
const mem = require('mem')
const chalk = require('chalk')
const { nationalDexNumber } = require('../utils')
const { typeColorMap } = require('../maps')
const flavorTextBox = require('./flavor-text')

module.exports = mem(({ types, id }, species) => {
  const spriteBox = blessed.box({
    top: 'left',
    label: ` ${chalk.bold.blue('⬤')}  ${chalk.bold.red('●')} ${chalk.bold.yellow('●')} ${chalk.bold.green('●')} `,
    width: '40%',
    height: '100%',
    border: {
      type: 'line'
    },
    style: {
      bg: types ? typeColorMap[types.find(type => type.slot === 1).type.name] : '#fff',
      border: {
        fg: '#f00'
      }
    }
  })

  blessed.image({
    parent: spriteBox,
    autoPadding: true,
    file: id ? `https://www.serebii.net/pokedex-sm/icon/${nationalDexNumber(id)}.png` : './lib/assets/pokeball.png',
    width: id ? 32 : 12,
    top: id ? '-5%' : 'center',
    left: 'center'
  })

  const flavorText = flavorTextBox(species)
  if (flavorText) {
    spriteBox.append(flavorText)
  }

  return spriteBox
})
