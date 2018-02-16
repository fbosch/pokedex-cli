
const typeArray = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy'
]
const types = typeArray.reduce((accum, type) => Object.assign({}, accum, { [type]: type }), {})
const { normal, fire, water, electric, grass, ice, fighting, poison, ground, flying, psychic, bug, rock, ghost, dragon, dark, steel, fairy } = types

const noEffect = 0
const notVeryEffective = 0.5
const normalEffectiveness = 1
const superEffective = 2
const ultraEffective = 4

const typeStrengths = {
  [normal]: {
    [rock]: notVeryEffective,
    [steel]: notVeryEffective,
    [ghost]: noEffect
  },
  [fire]: {
    [fire]: notVeryEffective,
    [water]: notVeryEffective,
    [grass]: superEffective,
    [ice]: superEffective,
    [bug]: superEffective,
    [rock]: notVeryEffective,
    [dragon]: notVeryEffective,
    [steel]: superEffective
  },
  [water]: {
    [fire]: superEffective,
    [water]: notVeryEffective,
    [grass]: notVeryEffective,
    [ground]: superEffective,
    [rock]: superEffective,
    [dragon]: notVeryEffective
  },
  [electric]: {
    [water]: superEffective,
    [electric]: notVeryEffective,
    [grass]: notVeryEffective,
    [ground]: noEffect,
    [flying]: superEffective,
    [dragon]: notVeryEffective
  },
  [grass]: {
    [fire]: notVeryEffective,
    [water]: superEffective,
    [grass]: notVeryEffective,
    [poison]: notVeryEffective,
    [ground]: superEffective,
    [flying]: superEffective,
    [bug]: notVeryEffective,
    [rock]: superEffective,
    [dragon]: notVeryEffective,
    [steel]: notVeryEffective
  },
  [ice]: {
    [fire]: notVeryEffective,
    [water]: notVeryEffective,
    [grass]: superEffective,
    [ice]: notVeryEffective,
    [ground]: superEffective,
    [flying]: superEffective,
    [dragon]: superEffective,
    [steel]: notVeryEffective
  },
  [fighting]: {
    [normal]: superEffective,
    [ice]: superEffective,
    [poison]: notVeryEffective,
    [psychic]: notVeryEffective,
    [bug]: notVeryEffective,
    [rock]: superEffective,
    [ghost]: noEffect,
    [dark]: superEffective,
    [steel]: superEffective,
    [fairy]: notVeryEffective
  },
  [poison]: {
    [grass]: superEffective,
    [poison]: notVeryEffective,
    [ground]: notVeryEffective,
    [rock]: notVeryEffective,
    [ghost]: notVeryEffective,
    [dark]: noEffect,
    [fairy]: superEffective
  },
  [ground]: {
    [fire]: superEffective,
    [electric]: superEffective,
    [grass]: notVeryEffective,
    [poison]: superEffective,
    [flying]: noEffect,
    [bug]: notVeryEffective,
    [rock]: superEffective,
    [steel]: superEffective
  },
  [flying]: {
    [electric]: notVeryEffective,
    [grass]: superEffective,
    [fighting]: superEffective,
    [bug]: superEffective,
    [rock]: superEffective,
    [flying]: notVeryEffective,
    [steel]: notVeryEffective
  },
  [psychic]: {
    [fighting]: superEffective,
    [poison]: superEffective,
    [psychic]: notVeryEffective,
    [dark]: noEffect,
    [steel]: notVeryEffective
  },
  [bug]: {
    [fire]: notVeryEffective,
    [grass]: superEffective,
    [fighting]: notVeryEffective,
    [poison]: notVeryEffective,
    [flying]: notVeryEffective,
    [psychic]: superEffective,
    [ghost]: notVeryEffective,
    [dark]: superEffective,
    [steel]: notVeryEffective,
    [fairy]: notVeryEffective
  },
  [rock]: {
    [fire]: superEffective,
    [ice]: superEffective,
    [fighting]: notVeryEffective,
    [ground]: notVeryEffective,
    [flying]: superEffective,
    [bug]: superEffective,
    [steel]: notVeryEffective
  },
  [ghost]: {
    [normal]: noEffect,
    [psychic]: superEffective,
    [ghost]: superEffective,
    [dark]: notVeryEffective
  },
  [dragon]: {
    [dragon]: superEffective,
    [steel]: notVeryEffective,
    [fairy]: noEffect
  },
  [dark]: {
    [fighting]: notVeryEffective,
    [psychic]: superEffective,
    [ghost]: superEffective
  },
  [steel]: {
    [fire]: notVeryEffective,
    [water]: notVeryEffective,
    [electric]: notVeryEffective,
    [ice]: superEffective,
    [rock]: superEffective,
    [steel]: notVeryEffective,
    [fairy]: superEffective
  },
  [fairy]: {
    [fire]: notVeryEffective,
    [fighting]: superEffective,
    [poison]: notVeryEffective,
    [dragon]: superEffective,
    [dark]: superEffective,
    [steel]: notVeryEffective
  }
}

const normalizedTypeEffectiveness = typeArray.reduce((values, type) => Object.assign({}, values, { [type]: normalEffectiveness }), {})

const emptyTypeChart = typeArray.reduce((chart, type) => Object.assign({}, chart, { [type]: normalizedTypeEffectiveness }), {})

const typeChart = typeArray.reduce((chart, type) => Object.assign({}, chart, { [type]: Object.assign({}, emptyTypeChart[type], typeStrengths[type]) }), {})

const extractTypeWeaknesses = type => typeArray.reduce((weaknesses, otherType) => Object.assign({}, weaknesses, { [otherType]: typeChart[otherType][type] }), {})

// console.log(extractTypeWeaknesses('ghost'))

const typeWeaknesses = typeArray.reduce((weaknesses, type) => Object.assign({}, weaknesses, { [type]: extractTypeWeaknesses(type) }), {})

// console.log(typeWeaknesses)
const getDualTypeWeakness = (firstWeakness, secondWeakness) => {
  const difference = Math.abs(firstWeakness - secondWeakness)
  const smallestValue = firstWeakness < secondWeakness ? firstWeakness : secondWeakness
  const largestValue = firstWeakness > secondWeakness ? firstWeakness : secondWeakness
  let value = firstWeakness
  if (difference !== 0) {
    if (smallestValue === noEffect) {
      value = noEffect
    }
    if (smallestValue === notVeryEffective) {
      value = notVeryEffective
    }
    if (largestValue === superEffective) {
      if (smallestValue === notVeryEffective) {
        value = normalEffectiveness
      }
      if (smallestValue === normalEffectiveness) {
        value = superEffective
      }
    }
  } else {
    if (smallestValue === superEffective) {
      value = ultraEffective
    }
  }
  return value
}

const getTypeWeaknesses = (firstType, secondType) => {
  if (firstType && !secondType) return typeWeaknesses[firstType]
  const firstTypeWeaknesses = getTypeWeaknesses(firstType)
  const secondTypeWeaknesses = getTypeWeaknesses(secondType)
  const dualTypeWeaknesses = typeArray.reduce((weaknesses, type) => {
    const firstWeakness = firstTypeWeaknesses[type]
    const secondWeakness = secondTypeWeaknesses[type]
    return Object.assign({}, weaknesses, { [type]: getDualTypeWeakness(firstWeakness, secondWeakness) })
  }, {})
  return dualTypeWeaknesses
}

const getTypeStrengths = type => typeStrengths[type]

module.exports.typeChart = typeChart
module.exports.getTypeWeaknesses = getTypeWeaknesses
module.exports.getTypeStrengths = getTypeStrengths
module.exports.types = types
