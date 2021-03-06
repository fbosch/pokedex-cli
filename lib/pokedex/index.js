const blessed = require('blessed')
const autoBind = require('auto-bind')
const { getSpecies, getPokemon } = require('../service')
const { pokemonIdExists } = require('../utils')
const spriteBox = require('./sprite')
const descriptionBox = require('./description')
const navigationButtonsBox = require('./navigation-buttons')
module.exports = class Pokedex {
  constructor () {
    autoBind(this)
    this.state = { pokemon: null, species: null }
    this.screen = blessed.screen({ dockBorders: true })
    this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
    this.entry = blessed.box({
      parent: this.screen,
      height: 35,
      width: '95%',
      left: 'center',
      top: 'center'
    })
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
    getPokemon(input).then(pokemon => this.update({ pokemon }), this.prefetchAdjacentPokemonData)
    getSpecies(input).then(species => this.update({ species }))
  }

  update (newState, callback) {
    this.state = Object.assign({}, this.state, newState)
    const children = this.render(this.state)
    this.entry.children.forEach(child => child.destroy())
    children.forEach(child => this.entry.append(child))
    this.screen.render()
    if (typeof callback === 'function') {
      callback()
    }
  }

  render ({ pokemon, species }) {
    const sprite = spriteBox(pokemon, species)
    const description = descriptionBox(pokemon)
    const navigationButtons = navigationButtonsBox(pokemon, this.showPokemon)
    return [
      sprite,
      description,
      navigationButtons
    ]
  }
}
