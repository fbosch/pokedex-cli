const padStart = require("string.prototype.padstart")
const titleize = require("titleize")
const chalk = require("chalk")
const { typeColorMap } = require("./maps")

module.exports = {
	nationalDexNumber: id => padStart(id, 3, "0"),
	generateTypeLabel: type => chalk.bold.bgHex(typeColorMap[type])(` ${titleize(type)} `)
}
