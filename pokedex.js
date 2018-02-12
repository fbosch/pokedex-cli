const got = require("got")
const pokemon = require("pokemon")
const blessed = require("blessed")
const padStart = require("string.prototype.padstart")
const titleize = require("titleize")
const chalk = require("chalk")
const startCase = require("lodash.startcase")
const { typeColorMap, statColorMap, statLabelMap } = require("./maps")
const http = require("http")
const { getTypeWeaknesses } = require("./pokemon-types")
const storage = require("node-persist")
const cache = storage.create({ dir: "cache/" })
cache.initSync()

const getPokemon = input => {
  const id = /^\d+$/.test(input) ? input : pokemon.getId(startCase(input)).toString()
  return cache.get(id).then(cachedPokemon => {
    if (cachedPokemon !== undefined) return cachedPokemon
    return got("http://www.pokeapi.co/api/v2/pokemon/" + id, { timeout: 20000, json: true })
      .then(response => {
        cache.set(id, response.body)
        return response.body
      })
  })
}

const padding = 1

const nationalDexNumber = id => padStart(id, 3, "0")
const generateTypeLabel = type => chalk.bold.bgHex(typeColorMap[type])(` ${titleize(type)} `)
const generateTypeLabels = types => types.map(({ type }) => generateTypeLabel(type.name)).join("  ")

const spriteDisplay = pokemon => {
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

const statsDisplay = pokemon => {
  const maxBaseStat = 270
  const box = blessed.box({
    label: "Stats",
    height: 15,
    width: "50%-2",
    top: 8,
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

  const container = blessed.box({
    parent: box,
    height: "80%",
    width: "96%",
    top: padding
  })

  pokemon.stats.reverse().forEach((stat, index) => {
    const statContainer = blessed.box({
      parent: container,
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
  })

  return box
}

const weaknessesDisplay = pokemon => {

  const pokemonWeaknesses = getTypeWeaknesses(pokemon.types[0].type.name)
  const weaknesses = Object.keys(pokemonWeaknesses).reduce((accum, type) => {
    const value = pokemonWeaknesses[type]
    switch (value) {
      case 0: {
        accum.noEffect.push({ type, value })
        break;
      }
      case 0.5: {
        accum.notVeryEffective.push({ type, value })
        break;
      }
      case 2: {
        accum.superEffective.push({ type, value })
        break;
      }
    }
    return accum
  }, { superEffective: [], notVeryEffective: [], noEffect: [] })


  const box = blessed.box({
    label: "Damage Taken",
    height: 15,
    right: padding,
    top: 8,
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

  const generateWeaknessLabel = weakness => `
   ${chalk.bold(weakness.value)} × ${generateTypeLabel(weakness.type)}
  `

  weaknesses.superEffective
    .forEach((weakness, index) => blessed.text({
      parent: box,
      content: generateWeaknessLabel(weakness),
      top: (2 * index)
    }))

  weaknesses.noEffect.concat(weaknesses.notVeryEffective)
    .forEach((weakness, index) => blessed.text({
      parent: box,
      content: generateWeaknessLabel(weakness),
      top: (2 * index),
      left: weaknesses.superEffective.length > 0 ? "50%" : "0"
    }))

  return box
}

const descriptionDisplay = pokemon => {
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

  box.append(statsDisplay(pokemon))
  box.append(weaknessesDisplay(pokemon))

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

  entry.append(spriteDisplay(pokemon))
  entry.append(descriptionDisplay(pokemon))

  screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
  screen.render()
}

module.exports = input => {
  if (!(typeof input === "string" && input.length !== 0)) {
    return Promise.reject(new Error("Specify pokémon name or pokédex number"))
  }
  return getPokemon(input).then(output)
}
