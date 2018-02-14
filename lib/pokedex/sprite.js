const blessed = require("blessed")
const mem = require("mem")
const chalk = require("chalk")
const { nationalDexNumber } = require("../utils")
const { typeColorMap } = require("../maps")

module.exports = mem(pokemon => {
	const box = blessed.box({
		top: "left",
		label: ` ${chalk.bold.blue("⬤")}  ${chalk.bold.red("●")} ${chalk.bold.yellow("●")} ${chalk.bold.green("●")} `,
		width: "40%",
		height: "100%",
		border: {
			type: "line"
		},
		style: {
			bg: pokemon ? typeColorMap[pokemon.types.find(type => type.slot === 1).type.name] : "#fff",
			border: {
				fg: "#f00"
			}
		}
	})

	blessed.image({
		parent: box,
		autoPadding: true,
		file: pokemon ? `https://www.serebii.net/pokedex-sm/icon/${nationalDexNumber(pokemon.id)}.png` : "./lib/assets/pokeball.png",
		width: pokemon ? 32 : 12,
		top: pokemon ? "-5%" : "center",
		left: "center"
	})

	return box
})
