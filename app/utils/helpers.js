// @flow

import bech32 from 'bech32'

import db from '../services/store'
import { ZEN_ASSET_HASH, ZEN_TO_KALAPA_RATIO } from '../constants'

import bip39Words from './bip39Words'

const validPrefixes = ['tc', 'zc', 'tp', 'zp']
const savedContracts = db.get('savedContracts').value()

export const isDev = () => process.env.NODE_ENV === 'development'

export const getAssetName = (asset: ?string) => {
  if (asset === ZEN_ASSET_HASH) { return 'ZP' }
  const contractFromDb = savedContracts.find(contract => contract.contractId === asset)
  if (contractFromDb && contractFromDb.name) {
    return contractFromDb.name
  }
  return ''
}

// TODO [AdGo] 06/05/19 - rewrite this
/* eslint-disable no-restricted-syntax */
export const isValidBip39Word = (string: ?string) => {
  if (string) {
    for (const word of bip39Words) {
      if (word.includes(string)) {
        return true
      }
    }
    return false
  }
}

export const isBip39Word = (string: ?string) => {
  if (string) {
    for (const word of bip39Words) {
      if (word === string) {
        return true
      }
    }
    return false
  }
}
/* eslint-enable no-restricted-syntax */

export const truncateString = (string: ?string) => {
  if (string) {
    return string.length > 12
      ? `${string.substr(0, 6)}...${string.substr(string.length - 6)}`
      : string
  }
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

export const stringToNumber = (str: ?string) => str && parseFloat(str.replace(/,/g, ''))

export const isValidAddress = (address: ?string, type?: 'contract' | 'pubKey' = 'pubKey'): boolean => {
  try {
    const { prefix, words } = bech32.decode(address)
    const pkHash = bech32.fromWords(words.slice(1))
    const isPrefixValid = (validPrefixes.indexOf(prefix) > -1)
    return type === 'contract'
      ? pkHash.length === 36 && isPrefixValid
      : pkHash.length === 32 && isPrefixValid
  } catch (err) {
    // uncomment for debugging, this throws many errors from the bech32 package
    // console.error('validateAddress err', err)
    return false
  }
}

export const isZenAsset = (asset: string) => asset === ZEN_ASSET_HASH

export const zenToKalapa = (zen: number) => zen * ZEN_TO_KALAPA_RATIO

export const getNamefromCodeComment = (code: string) => {
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

export const validateInputNumber = (str: string, maxDecimal: number = 0) => {
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
