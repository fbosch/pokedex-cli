const renderUI = require("./ui")
const { getPokemon } = require("./service")

module.exports = input => {
  if (!(typeof input === "string" && input.length !== 0)) {
    return Promise.reject(new Error("Specify pokémon name or pokédex number"))
  }
  return getPokemon(input).then(renderUI)
}
