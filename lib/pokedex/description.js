const blessed = require("blessed")
const titleize = require("titleize")
const mem = require("mem")
const startCase = require("lodash.startcase")
const chalk = require("chalk")
const { getName } = require("pokemon")
const { nationalDexNumber, generateTypeLabel } = require('../utils')
const weaknesses = require('./weaknesses')
const stats = require("./stats")

module.exports = mem(pokemon => {
	const box = blessed.box({
		width: "60%",
		height: "100%",
		top: "right",
		right: 0,
		border: {
			type: "line"
		},
		style: {
			border: {
				fg: "#f00"
			}
		}
	})

	blessed.box({
		parent: box,
		content: `

	 Name:           ${pokemon ? chalk.bold(titleize(getName(pokemon.id))) : "---"}

	 National Dex:   ${pokemon ? "#" + chalk.bold(nationalDexNumber(pokemon.id)) : "---"}

	 Type:           ${pokemon ? pokemon.types.sort((a, b) => a.slot > b.slot).map(({ type }) => generateTypeLabel(type.name)).join("  ") : "---"}

			`,
		width: "50%",
		top: "left",
		left: 0
	})

	blessed.box({
		parent: box,
		content: `

	Abilities:      ${pokemon ? pokemon.abilities.map(({ ability }) => startCase(ability.name)).join(", ") : "---"}

	Weight:         ${pokemon ? chalk.bold(pokemon.weight / 10) + " kg" : "---"}

	Height:         ${pokemon ? chalk.bold(pokemon.height / 10) + " m" : "---"}
			`,
		width: "57%",
		top: "right",
		right: 0
	})

	box.append(stats(pokemon))
	box.append(weaknesses(pokemon))

	return box
})
