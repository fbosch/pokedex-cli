
const blessed = require('blessed')
const mem = require('mem')
const chalk = require('chalk')
const { getName, random, getId } = require('pokemon')
const { pokemonIdExists } = require('../utils')

module.exports = mem((pokemon, showPokemon) => {
  const navigationButtonsBox = blessed.box({
    bottom: -4,
    height: 4,
    style: {
      border: {
        fg: '#222'
      }
    }
  })

  const buttonStyling = {
    parent: navigationButtonsBox,
    height: 3,
    shrink: true,
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: '#222'
      }
    }
  }

  const randomButton = blessed.button(Object.assign({}, buttonStyling, {
    content: ` Random ${chalk.bold('⟳')} `,
    top: 0,
    valign: 'middle',
    left: '50%',
    style: {
      hover: {
        fg: '#f00'
      }
    }
  }))

  randomButton.on('click', () => showPokemon(getId(random())))

  if (pokemon) {
    const previousPokemonId = pokemon.id - 1
    if (pokemonIdExists(previousPokemonId)) {
      const previousPokemonName = getName(previousPokemonId)
      const previousButton = blessed.button(Object.assign({}, buttonStyling, {
        left: 0,
        content: ` ${chalk.blue.bold('⇦')} ${previousPokemonName} `
      }))
      previousButton.on('click', () => showPokemon(previousPokemonId))
    }
    const nextPokemonId = pokemon.id + 1
    if (pokemonIdExists(nextPokemonId)) {
      const nextPokemonName = getName(nextPokemonId)
      const nextButton = blessed.button(Object.assign({}, buttonStyling, {
        right: 0,
        content: ` ${nextPokemonName} ${chalk.blue.bold('⇨')} `,
        align: 'right'
      }))
      nextButton.on('click', () => showPokemon(nextPokemonId))
    }
  }

  return navigationButtonsBox
})
