const { types } = require("./pokemon-types")

const { normal, fire, water, electric, grass, ice, fighting, poison, ground, flying, psychic, bug, rock, ghost, dragon, dark, steel, fairy } = types

module.exports.typeColorMap = {
	[normal]: "#A8A77A",
	[fire]: "#EE8130",
	[water]: "#6390F0",
	[electric]: "#F7D02C",
	[grass]: "#7AC74C",
	[ice]: "#96D9D6",
	[fighting]: "#C22E28",
	[poison]: "#A33EA1",
	[ground]: "#E2BF65",
	[flying]: "#A98FF3",
	[psychic]: "#F95587",
	[bug]: "#A6B91A",
	[rock]: "#B6A136",
	[ghost]: "#735797",
	[dragon]: "#6F35FC",
	[dark]: "#705746",
	[steel]: "#B7B7CE",
	[fairy]: "#D685AD"
}

module.exports.statColorMap = {
	hp: "#FF0000",
	attack: "#F08030",
	defense: "#F8D030",
	"special-attack": "#6890F0",
	"special-defense": "#78C850",
	speed: "#F85888"
}

module.exports.statLabelMap = {
	hp: "HP",
	attack: "Attack",
	defense: "Defense",
	"special-attack": "Sp. Attack",
	"special-defense": "Sp. Defense",
	speed: "Speed"
}
