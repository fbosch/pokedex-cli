const Pokedex = require('./pokedex')

const pokedex = new Pokedex()

module.exports = input => {
  if (!(typeof input === 'string' && input.length !== 0)) {
    return Promise.reject(new Error('Specify pokémon name or pokédex number'))
  }
  return pokedex.showPokemon(input)
}
