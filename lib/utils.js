const padStart = require('string.prototype.padstart')
const inRange = require('lodash.inrange')
const { all } = require('pokemon')
const titleize = require('titleize')
const chalk = require('chalk')
const { typeColorMap } = require('./maps')

const highestDexNumber = all().length

module.exports.nationalDexNumber = id => padStart(id, 3, '0')

module.exports.pokemonIdExists = id => inRange(id, 1, highestDexNumber)

module.exports.generateTypeLabel = type => chalk.bgHex(typeColorMap[type])(` ${titleize(type)} `)

module.exports.closestTo = (array, value) => {
  var result,
    lastDelta

  array.some(function (item) {
    var delta = Math.abs(value - item)
    if (delta >= lastDelta) {
      return true
    }
    result = item
    lastDelta = delta
  })
  return result
}
