const blessed = require("blessed")
const sprite = require("./sprite")
const description = require("./description")

module.exports = pokemon => {
  const screen = blessed.screen({ dockBorders: true })
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

  const entry = blessed.box({
    parent: screen,
    height: 35,
    width: "95%",
    left: "center",
    top: "center"
  })

  entry.append(sprite(pokemon))
  entry.append(description(pokemon))

  screen.render()
}
