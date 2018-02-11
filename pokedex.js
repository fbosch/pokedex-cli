const got = require("got")
const blessed = require("blessed")
const padStart = require("string.prototype.padstart")
const titleize = require("titleize")
const chalk = require("chalk")
const startCase = require("lodash.startcase")
const { typeColorMap, statColorMap, statLabelMap } = require("./maps")
const { getTypeWeaknesses } = require("./pokemon-types")

const padding = 1

const nationalDexNumber = id => padStart(id, 3, "0")

const request = input => got("http://pokeapi.co/api/v2/pokemon/" + input.toLowerCase(), { timeout: 10000, json: true })
  .then(response => response.body)
  .catch(err => {
    throw err
  })

const generateTypeLabels = types => types.map(({ type }) => chalk.bold.bgHex(typeColorMap[type.name])(" " + titleize(type.name) + " ")).join("  ")

const sprite = pokemon => {
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

const stats = pokemon => {
  const maxBaseStat = 270
  const box = blessed.box({
    label: "Stats",
    height: 15,
    width: "50%-2",
    top: 9,
    left: padding,
    border: {
      type: "line"
    },
    style: {
      border: {
        fg: "#888"
      }
    }
  })

  const statsDisplay = blessed.box({
    parent: box,
    height: "80%",
    width: "96%",
    top: padding
  })

  pokemon.stats.reverse().map((stat, index) => {
    const statContainer = blessed.box({
      parent: statsDisplay,
      width: `100%-${padding}`,
      label: statLabelMap[stat.stat.name],
      top: (2 * index),
      height: "12%",
      style: {
        fg: "#fff"
      }
    })
    blessed.progressbar({
      parent: statContainer,
      content: " " + stat.base_stat.toString(),
      orientation: "horizontal",
      width: "60%",
      left: "40%",
      filled: Math.floor((stat.base_stat / maxBaseStat) * 100),
      style: {
        fg: "#fff",
        bg: "#222",
        bar: {
          fg: "#fff",
          bg: statColorMap[stat.stat.name]
        }
      }
    })
    return statContainer
  })

  return box
}

const weaknesses = pokemon => {
  const box = blessed.box({
    label: "Damage Taken",
    height: 15,
    right: padding,
    top: 9,
    width: "50%-1",
    border: {
      type: "line"
    },
    style: {
      border: {
        fg: "#888"
      }
    }
  })

  const pokemonWeaknesses = getTypeWeaknesses(pokemon.types[0].type.name)

  return box
}

const description = pokemon => {
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

    Type:           ${generateTypeLabels(pokemon.types)}

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

function output(pokemon) {
  const screen = blessed.screen({ dockBorders: true })

  const entry = blessed.box({
    parent: screen,
    height: 35,
    width: "95%",
    left: "center",
    top: "center"
  })

  entry.append(sprite(pokemon))
  entry.append(description(pokemon))

  screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
  screen.render()
}

module.exports = input => {
  if (!(typeof input === "string" && input.length !== 0)) {
    return Promise.reject(new Error("Specify pokémon name or pokédex number"))
  }
  return request(input).then(output)
}
