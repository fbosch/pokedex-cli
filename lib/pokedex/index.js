const blessed = require('blessed')
const autoBind = require('auto-bind')
const { getSpecies, getPokemon } = require('../service')
const { pokemonIdExists } = require('../utils')
const spriteBox = require('./sprite')
const descriptionBox = require('./description')
const flavorTextBox = require('./flavor-text')
const navigationButtonsBox = require('./navigation-buttons')

module.exports = class Pokedex {
  constructor () {
    autoBind(this)
    this.state = { pokemon: null, species: null }
    this.screen = blessed.screen({ dockBorders: true })
    this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

    this.setState(this.state)
  }

  prefetchAdjacentPokemonData () {
    const { pokemon } = this.state
    const adjacentPokemonIds = [pokemon.id - 1, pokemon.id + 1]
    adjacentPokemonIds.filter(pokemonIdExists)
      .forEach(id => {
        getPokemon(id)
        getSpecies(id)
      })
  }

  showPokemon (input) {
    getPokemon(input).then(pokemon => this.setState({ pokemon }), this.prefetchAdjacentPokemonData)
    getSpecies(input).then(species => this.setState({ species }))
  }

  setState (newState, callback) {
    this.state = Object.assign({}, this.state, newState)
    const children = this.render(this.state)
    if (this.entry) this.entry.destroy()
    this.entry = blessed.box({
      parent: this.screen,
      height: 35,
      width: '95%',
      left: 'center',
      top: 'center'
    })
    children.forEach(child => this.entry.append(child))
    this.screen.render()
    if (typeof callback === 'function') {
      callback()
    }
  }

  render ({ pokemon, species }) {
    const sprite = spriteBox(pokemon)
    const description = descriptionBox(pokemon)
    const flavorText = flavorTextBox(species)
    const navigationButtons = navigationButtonsBox(pokemon, this.showPokemon)
    if (flavorText) {
      sprite.append(flavorText)
    }

    return [
      sprite,
      description,
      navigationButtons
    ]
  }
}
