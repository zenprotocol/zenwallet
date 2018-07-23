import { replacePkHashVar } from '../deployContractUtils'

const pkhash = 'pkhashDummy'

test('replacePkHashVar no pkHash var present', () => {
  const codeFromFile = 'foo bar'
  expect(replacePkHashVar(codeFromFile, pkhash)).toEqual(codeFromFile)
})

test('replacePkHashVar no pkHash var present', () => {
  const codeFromFile = 'foo "%pkhash" bar'
  const expected = 'foo "pkhashDummy" bar'
  expect(replacePkHashVar(codeFromFile, pkhash)).toEqual(expected)
})
