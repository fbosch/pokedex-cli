const blessed = require('blessed')
const chalk = require('chalk')
const chunk = require('lodash.chunk')
const { getTypeWeaknesses } = require('poke-types')
const { generateTypeLabel } = require('../utils')

const generateWeaknessLabel = weakness => `
  ${chalk.bold(weakness.value === 0.5 ? '½' : weakness.value === 0.25 ? '¼' : weakness.value)} ×  ${generateTypeLabel(weakness.type)}
`

module.exports = pokemon => {
  const weaknessesBox = blessed.box({
    label: chalk.bold('Damage Taken'),
    height: 15,
    right: 1,
    top: 9,
    width: '50%-1',
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: '#222'
      }
    }
  })

  if (pokemon) {
    const pokemonWeaknesses = getTypeWeaknesses(...pokemon.types.map(({ type }) => type.name))
    const weaknesses = Object.keys(pokemonWeaknesses).reduce((accum, type) => {
      const value = pokemonWeaknesses[type]
      if (value !== 1) {
        accum.push({ type, value })
      }
      return accum
    }, []).sort((a, b) => a.value < b.value)

    const weaknessChunks = chunk(weaknesses, 6)

    weaknessChunks.forEach((chunk, chunkIndex) =>
      chunk.sort((a, b) => a.value < b.value)
        .forEach((weakness, typeIndex) => blessed.text({
          parent: weaknessesBox,
          content: generateWeaknessLabel(weakness),
          top: (2 * typeIndex),
          left: (chunkIndex * (100 / weaknessChunks.length)) + '%'
        }))
    )
  }

  return weaknessesBox
}
