const blessed = require("blessed")
const autoBind = require("auto-bind")
const { getSpecies, getPokemon } = require("../service")
const { pokemonIdExists } = require("../utils")
const spriteBox = require("./sprite")
const descriptionBox = require("./description")
const flavorTextBox = require("./flavor-text")

module.exports = class Pokedex {
	constructor(input) {
		autoBind(this)
		this.state = { pokemon: null, species: null }
		this.screen = blessed.screen({ dockBorders: true })
		this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
		this.entry = blessed.box({
			parent: this.screen,
			height: 35,
			width: "95%",
			left: "center",
			top: "center"
		})

		this.fetchData(input)
		this.setState(this.state)
	}

	prefetchAdjacentPokemonData() {
		const { pokemon } = this.state
		const adjacentPokemonIds = [pokemon.id - 1, pokemon.id + 1]
		adjacentPokemonIds.filter(pokemonIdExists).forEach(id => {
			getPokemon(id)
			getSpecies(id)
		})
	}

	fetchData(input) {
		getPokemon(input).then(pokemon => this.setState({ pokemon }, this.prefetchAdjacentPokemonData))
		getSpecies(input).then(species => this.setState({ species }))
	}

	setState(newState, callback) {
		this.state = { ...this.state, ...newState }
		const children = this.render(this.state)
		this.entry.children.forEach(child => child.destroy())
		children.forEach(child => this.entry.append(child))
		this.screen.render()
		if (typeof callback === "function") {
			callback()
		}
	}

	render({ pokemon, species }) {
		const sprite = spriteBox(pokemon)
		const description = descriptionBox(pokemon)
		const flavorText = flavorTextBox(species)
		if (flavorText) {
			sprite.append(flavorText)
		}

		return [
			sprite,
			description
		]
	}

}
