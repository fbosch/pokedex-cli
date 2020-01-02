
const blessed = require('blessed')
const randomItem = require('random-item')

module.exports = species => {
  if (species) {
    const flavorTexts = species.flavor_text_entries.filter(entry => entry.language.name === 'en')

    const flavorText = randomItem(flavorTexts).flavor_text
    return blessed.text({
      content: flavorText,
      bottom: 1,
      width: '75%',
      left: 'center',
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: '#00f'
        }
      }
    })
  }
}
