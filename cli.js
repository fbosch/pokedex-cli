#!/usr/bin/env node
'use strict'
const meow = require("meow")
const pokemon = require("pokemon")
const pokedex = require("./lib")

const cli = meow(`
	Usage
		$ dex <input>

	Examples
	$ dex 001
	$ dex charmander
`, { string: [''] })

const input = cli.input.join(" ")

pokedex(input.length === 0 ? pokemon.random() : input)
