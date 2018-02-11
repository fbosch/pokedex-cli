#!/usr/bin/env node
'use strict'
const meow = require("meow")
const pokedex = require("./pokedex")

const cli = meow(`
	Usage
	  $ dex <input>

  Examples
  $ dex 001
  $ dex charmander
`, {
    string: ['_']
  })

const input = cli.input

if (input.length === 0) {
  console.error("Specify pokémon name or pokédex number")
  process.exit(1)
}

pokedex(input.join("-"))


