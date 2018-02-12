const blessed = require("blessed")
const titleize = require("titleize")
const startCase = require("lodash.startcase")
const chalk = require("chalk")
const weaknesses = require('./weaknesses')
const stats = require("./stats")
const { nationalDexNumber, generateTypeLabel } = require('../utils')

module.exports = pokemon => {
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
    Name:           ${chalk.bold(titleize(pokemon.name))}

    Type:           ${pokemon.types.map(({ type }) => generateTypeLabel(type.name)).join("  ")}

    Abilities:      ${pokemon.abilities.map(({ ability }) => startCase(ability.name)).join(", ")}
      `,
    width: "50%",
    top: "left",
    left: 0,
  })

  blessed.box({
    parent: box,
    content: `
    National Dex:     #${chalk.bold(nationalDexNumber(pokemon.id))}

    Weight:           ${chalk.bold(pokemon.weight / 10) + " kg"}

    Height:           ${chalk.bold(pokemon.height / 10) + " m"}
      `,
    width: "50%",
    top: "right",
    right: 0,
  })

  box.append(stats(pokemon))
  box.append(weaknesses(pokemon))

  return box
}
