
const blessed = require('blessed')
const mem = require('mem')
const chalk = require('chalk')
const { getName } = require('pokemon')
const { pokemonIdExists } = require('../utils')

module.exports = mem((pokemon, getPokemon) => {
  const navigationButtonsBox = blessed.box({
    bottom: -4,
    height: 4,
    style: {
      border: {
        fg: '#222'
      }
    }
  })

  if (pokemon) {
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
    const previousPokemonId = pokemon.id - 1
    if (pokemonIdExists(previousPokemonId)) {
      const previousPokemonName = getName(previousPokemonId)
      const previousButton = blessed.button(Object.assign({}, buttonStyling, {
        left: 0,
        content: ` ${chalk.blue.bold('⇦')} ${previousPokemonName} `
      }))
      previousButton.on('click', () => getPokemon(previousPokemonId))
    }
    const nextPokemonId = pokemon.id + 1
    if (pokemonIdExists(nextPokemonId)) {
      const nextPokemonName = getName(nextPokemonId)
      const nextButton = blessed.button(Object.assign({}, buttonStyling, {
        right: 0,
        content: ` ${nextPokemonName} ${chalk.blue.bold('⇨')} `,
        align: 'right'
      }))
      nextButton.on('click', () => getPokemon(nextPokemonId))
    }
  }

  return navigationButtonsBox
})
