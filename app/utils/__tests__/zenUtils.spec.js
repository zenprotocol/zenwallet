import { zenBalanceDisplay, kalapasToZen, zenToKalapas } from '../zenUtils'

test('kalapasToZen', () => {
  // setup
  const kalapas = 100000001
  const expected = 1.00000001
  // action
  const result = kalapasToZen(kalapas)
  // assertion
  expect(typeof result).toBe('number')
  expect(result).toBe(expected)
})
test('zenToKalapas', () => {
  // setup
  const zen = 1.00000001
  const expected = 100000001
  // action
  const result = zenToKalapas(zen)
  // assertion
  expect(typeof result).toBe('number')
  expect(result).toBe(expected)
})

test('zenBalanceDisplay 0 kalapas', () => {
  const kalapas = 0
  const expected = '0.00'
  expect(zenBalanceDisplay(kalapas)).toEqual(expected)
})
test('zenBalanceDisplay 110000000 kalapas', () => {
  const kalapas = 110000000
  const expected = '1.10'
  expect(zenBalanceDisplay(kalapas)).toEqual(expected)
})
test('zenBalanceDisplay 100000001 kalapas', () => {
  const kalapas = 100000001
  const expected = '1.00000001'
  expect(zenBalanceDisplay(kalapas)).toEqual(expected)
})
test('zenBalanceDisplay 100000000000 kalapas', () => {
  const kalapas = 100000000000
  const expected = '1,000.00'
  expect(zenBalanceDisplay(kalapas)).toEqual(expected)
})
test('zenBalanceDisplay 100000000001 kalapas', () => {
  const kalapas = 100000000001
  const expected = '1,000.00000001'
  expect(zenBalanceDisplay(kalapas)).toEqual(expected)
})
test('zenBalanceDisplay 100010000001 kalapas', () => {
  const kalapas = 100010000001
  const expected = '1,000.10000001'
  expect(zenBalanceDisplay(kalapas)).toEqual(expected)
})
