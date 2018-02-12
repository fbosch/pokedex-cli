const blessed = require("blessed")
const chalk = require("chalk")
const { statLabelMap, statColorMap } = require("../maps")

module.exports = pokemon => {
  const maxBaseStat = 270

  const box = blessed.box({
    label: "Stats",
    height: 15,
    width: "50%-2",
    top: 8,
    left: 1,
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
    top: 1
  })

  pokemon.stats.reverse().forEach((stat, index) => {
    const statContainer = blessed.box({
      parent: container,
      width: `100%-1`,
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
