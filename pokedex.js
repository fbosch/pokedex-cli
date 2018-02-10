const got = require("got")
const blessed = require("blessed")
const padStart = require("string.prototype.padstart")
const titleize = require("titleize")


function request(input) {
  return got("http://pokeapi.co/api/v2/pokemon/" + input.toLowerCase(), { timeout: 20000, json: true })
    .then(response => response.body)
    .catch(err => {
      throw err
    })
}

function output(pokemon) {
  const dexNumber = padStart(pokemon.id, 3, "0")

  const screen = blessed.screen({
    smartCSR: true,
    fullUnicode: true
  })

  const dexEntryBox = blessed.box({
    parent: screen,
    label: `Pokédex - #${dexNumber}`,
    height: "95%",
    width: "95%",
    left: "center",
    top: "center",
    border: {
      type: "line"
    },
    style: {
      border: {
        fg: "#f0f0f0"
      }
    }
  })

  const spriteBox = blessed.box({
    top: "left",
    width: "50%",
    height: "30%"
  })

  const sprite = blessed.image({
    parent: spriteBox,
    file: `https://www.serebii.net/pokedex-sm/icon/${dexNumber}.png`,
    width: 30,
    top: "center",
    left: 7
  })

  dexEntryBox.append(spriteBox)

  const descriptionBox = blessed.box({
    parent: dexEntryBox,
    width: "60%",
    height: "30%",
    top: "right",
    right: 0
  })

  const pokemonName = blessed.bigtext({
    content: titleize(pokemon.name),
    style: {
      fg: "#f0f0f0"
    }
  })

  descriptionBox.append(pokemonName)

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
