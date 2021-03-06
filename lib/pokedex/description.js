const blessed = require('blessed')
const titleize = require('titleize')
const startCase = require('lodash.startcase')
const chalk = require('chalk')
const { getName } = require('pokemon')
const { nationalDexNumber, generateTypeLabel } = require('../utils')
const weaknesses = require('./weaknesses')
const stats = require('./stats')

module.exports = pokemon => {
  const descriptionBox = blessed.box({
    width: '60%',
    height: '100%',
    top: 'right',
    right: 0,
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: '#f00'
      }
    }
  })

  const primaryInfo = blessed.box({
    parent: descriptionBox,
    width: '50%',
    top: 'left',
    left: 0
  })

  blessed.box({
    parent: primaryInfo,
    content: `

   ${chalk.bold('Name')}:

   ${chalk.bold('National Dex')}:

   ${chalk.bold('Type')}:
    `,
    top: 'left',
    left: 0,
    width: '50%'
  })

  blessed.box({
    parent: primaryInfo,
    content: `

${pokemon ? titleize(getName(pokemon.id) || pokemon.name) : '---'}

${pokemon ? '#' + nationalDexNumber(pokemon.id) : '---'}

${pokemon ? pokemon.types.sort((a, b) => a.slot > b.slot).map(({ type }) => generateTypeLabel(type.name)).join(' ') : '---'}

   `,
    top: 'right',
    left: '40%',
    width: '50%'
  })

  const secondaryInfo = blessed.box({
    parent: descriptionBox,
    width: '50%',
    top: 'right',
    right: 0
  })

  blessed.box({
    parent: secondaryInfo,
    content: `

  ${chalk.bold('Abilities')}:

  ${chalk.bold('Weight')}:

  ${chalk.bold('Height')}:
    `,
    top: 'left',
    left: 0,
    width: '50%'
  })

  blessed.box({
    parent: secondaryInfo,
    content: `

${pokemon ? pokemon.abilities.map(({ ability }) => startCase(ability.name)).join(', ') : '---'}

${pokemon ? (pokemon.weight / 10) + ' kg' : '---'}

${pokemon ? (pokemon.height / 10) + ' m' : '---'}
  `,
    width: '70%',
    left: '30%',
    top: 'right',
    right: 0
  })

  descriptionBox.append(stats(pokemon))
  descriptionBox.append(weaknesses(pokemon))

  return descriptionBox
}
