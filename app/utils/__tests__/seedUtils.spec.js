import validSeedExample from '../../../test/validSeedExample.json'
import { parseSeedFromClipboard, getSeedFromClipboard } from '../seedUtils'

test('[getSeedFromClipboard] empty string', () => {
  const clipString = ''
  const expected = false
  expect(getSeedFromClipboard(clipString)).toBe(expected)
})

test('[getSeedFromClipboard] invalid seed', () => {
  const clipString = 'one to three'
  const expected = false
  expect(getSeedFromClipboard(clipString)).toBe(expected)
})

test('[getSeedFromClipboard] valid seed', () => {
  const clipString = String(validSeedExample)
  const expected = validSeedExample
  expect(getSeedFromClipboard(clipString)).toEqual(expected)
})

test('[parseSeedFromClipboard] empty string', () => {
  const clipString = ''
  const expected = false
  expect(parseSeedFromClipboard(clipString)).toBe(expected)
})

test('[parseSeedFromClipboard] space separated', () => {
  const clipString = 'one two three'
  const expected = 'one two three'
  expect(parseSeedFromClipboard(clipString)).toEqual(expected)
})

test('[parseSeedFromClipboard] comma and space separated', () => {
  const clipString = 'one, two, three'
  const expected = 'one two three'
  expect(parseSeedFromClipboard(clipString)).toEqual(expected)
})

test('[parseSeedFromClipboard] comma separated', () => {
  const clipString = 'one,two,three'
  const expected = 'one two three'
  expect(parseSeedFromClipboard(clipString)).toEqual(expected)
})

test('[parseSeedFromClipboard] comma and mixed spaces separated', () => {
  const clipString = 'one,two, three'
  const expected = 'one two three'
  expect(parseSeedFromClipboard(clipString)).toEqual(expected)
})

test('[parseSeedFromClipboard] linebreak separated', () => {
  const clipString = `one
two
three`
  const expected = 'one two three'
  expect(parseSeedFromClipboard(clipString)).toEqual(expected)
})

test('[parseSeedFromClipboard] array format', () => {
  const clipString = '["one", "two", "three"]'
  const expected = 'one two three'
  expect(parseSeedFromClipboard(clipString)).toEqual(expected)
})

test('[parseSeedFromClipboard] one valid word', () => {
  const clipString = 'abandon'
  const expected = false
  expect(parseSeedFromClipboard(clipString)).toEqual(expected)
})
