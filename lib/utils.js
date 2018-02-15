const padStart = require('string.prototype.padstart')
const inRange = require('lodash.inrange')
const { all } = require('pokemon')
const titleize = require('titleize')
const chalk = require('chalk')
const { typeColorMap } = require('./maps')

const highestDexNumber = all().length

module.exports.nationalDexNumber = id => padStart(id, 3, '0')

module.exports.pokemonIdExists = id => inRange(id, 1, highestDexNumber)

module.exports.generateTypeLabel = type => chalk.bold.bgHex(typeColorMap[type])(` ${titleize(type)} `)
