import bech32 from 'bech32'

import { ZEN_ASSET_HASH, ZEN_TO_KALAPA_RATIO } from '../app/constants'

import bip39Words from './bip39Words'

const validPrefixes = ['tc', 'zc', 'tp', 'zp']

export const isValidBip39Word = (string) => {
  if (string) {
    for (const word of bip39Words) {
      if (word.includes(string)) {
        return true
      }
    }
    return false;
  }
}

export const isBip39Word = (string) => {
  if (string) {
    for (const word of bip39Words) {
      if (word == string) {
        return true
      }
    }
    return false;
  }
}

export const truncateString = (string) => {
  if (string) {
    return `${string.substr(0, 6)}...${string.substr(string.length - 6)}`;
  }
}

export const normalizeTokens = (number, isZen) => {
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

export const stringToNumber = str => str && parseFloat(str.replace(/,/g, ''))

export const validateAddress = (value) => {
  try {
    const decodedAddress = bech32.decode(value)
    const pkHash = bech32.fromWords(decodedAddress.words)
    const prefix = decodedAddress.prefix
    const isPrefixValid = (validPrefixes.indexOf(prefix) > -1)
    return (pkHash.length === 33 && isPrefixValid)
  } catch (e) {
    return false
  }
}

export const isZenAsset = (asset) => asset === ZEN_ASSET_HASH

export const zenToKalapa = zen => zen * ZEN_TO_KALAPA_RATIO

export const getNamefromCodeComment = (code) => {
  const startRegex = /NAME_START:/
  const endRegex = /:NAME_END/

  const startIsPresent = startRegex.test(code)
  const endIsPresent = endRegex.test(code)

  if (startIsPresent && endIsPresent) {
    const indexOfStart = code.indexOf('NAME_START:') + 11
    const indexOfEnd = code.indexOf(':NAME_END')
    const length = indexOfEnd - indexOfStart
    const name = code.substr(indexOfStart, length).trim()
    return name
  }
  return false
}

export const validateInputNumber = (str, maxDecimal = 0) => {
  if (str === '') {
    return str
  }
  // block non numbers/dots
  if (!str.match(/^[\d.]+$/)) {
    return false
  }
  // block dots
  if (maxDecimal === 0 && str.match(/\./g)) {
    return false
  }
  // handle more than one dot
  if (maxDecimal > 0 && (str.match(/\./g) || []).length > 1) {
    return false
  }
  // block non dot after zero
  if (maxDecimal > 0 && str.length > 1 && str.charAt(0) === '0' && str.charAt(1) !== '.') {
    return false
  }
  // handle leading dot .1
  if (maxDecimal > 0 && str.match(/^\./)) {
    return `0${str}`.substr(0, maxDecimal + 2)
  }
  // let end with dot pass
  if (maxDecimal > 0 && str.match(/\.$/)) {
    return str
  }
  // limit decimals
  if (maxDecimal > 0 && str.match(/\./)) {
    return str.split('.')[0] + '.' + str.split('.')[1].substr(0, maxDecimal) // eslint-disable-line prefer-template
  }
  return str
}
