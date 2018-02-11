const got = require("got")
const blessed = require("blessed")
const padStart = require("string.prototype.padstart")
const titleize = require("titleize")
const figlet = require("figlet")
const chalk = require("chalk")
const { typeColorMap, statColorMap } = require("./color-maps")


function request(input) {
  return got("http://pokeapi.co/api/v2/pokemon/" + input.toLowerCase(), { timeout: 10000, json: true })
    .then(response => response.body)
    .catch(err => {
      throw err
    })
}

const generateTypeLabels = types => types.map(({ type }) => chalk.bold.bgHex(typeColorMap[type.name])(" " + titleize(type.name) + " ")).join("  ")

function output(pokemon) {
  const padding = 1
  const maxBaseStat = 270
  const nationalDexNumber = padStart(pokemon.id, 3, "0")
  const screen = blessed.screen({ dockBorders: true })

  const dexEntryBox = blessed.box({
    parent: screen,
    height: "50%",
    width: "95%",
    left: "center",
    top: "center"
  })

  const spriteBox = blessed.box({
    top: "left",
    label: `Pokédex - #${nationalDexNumber}`,
    width: "40%",
    height: "100%",
    border: {
      type: "line"
    },
    style: {
      bg: typeColorMap[pokemon.types[0].type.name],
      border: {
        fg: "#f0f0f0"
      }
    }
  })

  const sprite = blessed.image({
    parent: spriteBox,
    file: `https://www.serebii.net/pokedex-sm/icon/${nationalDexNumber}.png`,
    width: 32,
    top: "center",
    left: "center"
  })

  dexEntryBox.append(spriteBox)

  const descriptionBox = blessed.box({
    parent: dexEntryBox,
    content: `
  Name:  ${chalk.bold(titleize(pokemon.name))}

  Type:  ${generateTypeLabels(pokemon.types)}
    `,
    width: "60%",
    height: "100%",
    top: "right",
    right: 0,
    border: {
      type: "line"
    },
    style: {
      border: {
        fg: "#f0f0f0"
      }
    }
  })

  const statsBox = blessed.box({
    label: "Stats",
    parent: descriptionBox,
    height: "43%",
    width: "50%",
    top: "20%",
    left: padding,
    border: {
      type: "line"
    },
    style: {
      border: {
        fg: "#f0f0f0"
      }
    }
  })

  const statsDisplay = blessed.box({
    parent: statsBox,
    height: "80%",
    width: "96%",
    top: padding
  })

  pokemon.stats.reverse().map((stat, index) => {
    const statContainer = blessed.box({
      parent: statsDisplay,
      width: `100%-${padding}`,
      label: stat.stat.name,
      top: (2 * index),
      height: "12%",
      style: {
        fg: "#fff"
      }
    })
    blessed.progressbar({
      parent: statContainer,
      content: stat.base_stat.toString(),
      orientation: "horizontal",
      width: "50%",
      left: "50%",
      filled: Math.floor((stat.base_stat / maxBaseStat) * 100),
      style: {
        fg: "#fff",
        bg: "#ccc",
        bar: {
          fg: "#fff",
          bg: statColorMap[stat.stat.name]
        }
      }
    })
  })

  dexEntryBox.append(descriptionBox)



  screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
  })

  screen.render()
}

module.exports = input => {
  if (!(typeof input === "string" && input.length !== 0)) {
    return Promise.reject(new Error("Specify pokémon name or pokédex number"))
  }
  return request(input).then(output)
}
