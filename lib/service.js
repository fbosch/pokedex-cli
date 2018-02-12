const got = require("got")
const pokemon = require("pokemon")
const startCase = require("lodash.startcase")
const storage = require("node-persist")
const cache = storage.create({ dir: ".cache/" })
cache.initSync()

const cacheableRequest = endpoint => cache.get(endpoint)
  .then(cachedResult => cachedResult ? cachedResult : got(endpoint, { timeout: 20000, json: true })
    .then(response => {
      cache.set(endpoint, response.body)
      return response.body
    }))

module.exports.getPokemon = input => {
  const id = /^\d+$/.test(input) ? input : pokemon.getId(startCase(input).replace(" ", "-")).toString()
  return cacheableRequest("https://www.pokeapi.co/api/v2/pokemon/" + id)
}
