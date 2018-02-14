const got = require("got")
const pokemon = require("pokemon")
const startCase = require("lodash.startcase")
const storage = require("node-persist")

const cache = storage.create({ dir: ".cache/" })
cache.initSync()

const idFromInput = input => /^\d+$/.test(input) ? input : pokemon.getId(startCase(input).replace(" ", "-")).toString()

const cacheableRequest = endpoint => cache.get(endpoint)
	.then(cachedResult => cachedResult ? cachedResult : got(endpoint, { timeout: 30000, json: true })
		.then(response => {
			cache.set(endpoint, response.body)
			return response.body
		})).catch(console.error)

module.exports.getPokemon = input => cacheableRequest("https://www.pokeapi.co/api/v2/pokemon/" + idFromInput(input))

module.exports.getSpecies = input => cacheableRequest("https://www.pokeapi.co/api/v2/pokemon-species/" + idFromInput(input))
