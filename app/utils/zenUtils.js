import { Decimal } from 'decimal.js'

import { ZEN_ASSET_HASH, ZEN_TO_KALAPA_RATIO, ZENP_MAX_DECIMALS } from '../constants'
import { minimumDecimalPoints, numberWithCommas } from '../utils/helpers'

export const isZenAsset = (asset: string) => asset === ZEN_ASSET_HASH
export const zenToKalapas = zen => Decimal.mul(zen, ZEN_TO_KALAPA_RATIO).toNumber()
export const kalapasToZen = kalapas => Decimal.div(kalapas, ZEN_TO_KALAPA_RATIO).toNumber()

export const zenBalanceDisplay = (kalapas, fixed = ZENP_MAX_DECIMALS) =>
  numberWithCommas(minimumDecimalPoints(
    kalapasToZen(kalapas).toFixed(fixed),
    2,
  ))

export const toDisplay = (n, fractionDigits = 8) => {
  // eslint-disable-next-line eqeqeq
  if (n == '0') return '0' // support both number and string
  if (!n) return ''
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(n)) return n

  const d = new Decimal(n)
  if (d.isZero()) return '0' // n can be "0." for example

  // eslint-disable-next-line no-restricted-properties
  const minDividedUnit = Math.pow(10, -1 * fractionDigits)

  const fixed = d.abs().lessThan(minDividedUnit)
    ? (() => {
      // get a number with a fractional part with the first digit which is not zero
      const parts = d.toFixed(d.decimalPlaces() || 0).split('.')
      const arrFractional = Array.from(parts[1])
      const nonZeroIndex = arrFractional.findIndex((char) => char !== '0')
      return `${parts[0]}.${parts[1].substring(0, nonZeroIndex + 1)}`
    })()
    : // get the number with up to PRECISION decimal places, in this case number has a whole part
    d.toFixed(Math.min(fractionDigits, d.decimalPlaces() || 0), Decimal.ROUND_FLOOR)

  const parts = fixed.split('.')

  const whole = parts[0]
  const fraction = parts.length > 1 && !new Decimal(parts[1]).isZero() ? `.${parts[1]}` : ''
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + fraction
}
export const normalizeTokens = (number: number, isZen: ?boolean) => {
  const newNumber = number / ZEN_TO_KALAPA_RATIO
  if (isZen) {
    const formattedNumber = newNumber.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })
    return formattedNumber
  }
  return number.toLocaleString()
}
