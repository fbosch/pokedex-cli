const blessed = require("blessed")
const chalk = require("chalk")
const { typeColorMap } = require("../maps")
const { nationalDexNumber } = require("../utils")

module.exports = pokemon => {
  const box = blessed.box({
    top: "left",
    label: ` ${chalk.bold.blue("⬤")}  ${chalk.bold.red("●")} ${chalk.bold.yellow("●")} ${chalk.bold.green("●")} `,
    width: "40%",
    height: "100%",
    border: {
      type: "line"
    },
    style: {
      bg: typeColorMap[pokemon.types[0].type.name],
      border: {
        fg: "#f00"
      }
    }
  })
  blessed.image({
    parent: box,
    autoPadding: true,
    file: `https://www.serebii.net/pokedex-sm/icon/${nationalDexNumber(pokemon.id)}.png`,
    width: 32,
    top: "center",
    left: "center"
  })
  return box
}
