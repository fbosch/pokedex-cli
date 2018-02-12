const { typeColorMap } = require("./maps")
const padStart = require("string.prototype.padstart")
const titleize = require("titleize")
const chalk = require("chalk")

module.exports.nationalDexNumber = id => padStart(id, 3, "0")
module.exports.generateTypeLabel = type => chalk.bold.bgHex(typeColorMap[type])(` ${titleize(type)} `)
