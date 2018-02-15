
import test from 'ava'
import Pokedex from './lib/pokedex'
import { getTypeWeaknesses, getTypeStrengths } from './lib/pokemon-types'
import pikachu from './fixtures/pikachu.json'

test('pokedex can display pokemon', t => {
  const pokedex = new Pokedex()
  pokedex.setState({ pokemon: pikachu })
  t.true(pokedex.state.pokemon === pikachu)
  t.true(pokedex.screen.children.length !== 0)
})

test('types have correct weaknesses and strengths', t => {
  const superEffective = 2

  t.true(getTypeWeaknesses('grass').fire === superEffective)
  t.true(getTypeStrengths('ice').dragon === superEffective)
  t.true(getTypeWeaknesses('dragon').dragon === superEffective)
})
