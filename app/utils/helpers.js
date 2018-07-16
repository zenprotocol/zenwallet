// @flow

import bech32 from 'bech32'

import db from '../services/store'
import { ZEN_ASSET_NAME, ZEN_ASSET_HASH } from '../constants'

const validPrefixes = ['zen', 'tzn', 'czen', 'ctzn']
const savedContracts = db.get('savedContracts').value()

export const isDev = () => process.env.NODE_ENV === 'development'

// TODO use exposed asset names from stores instead
export const getAssetName = (asset: ?string) => {
  if (asset === ZEN_ASSET_HASH) { return ZEN_ASSET_NAME }
  const contractFromDb = savedContracts.find(contract => contract.contractId === asset)
  if (contractFromDb && contractFromDb.name) {
    return contractFromDb.name
  }
  return ''
}

export const truncateString = (string: ?string) => {
  if (string) {
    return string.length > 12
      ? `${string.substr(0, 6)}...${string.substr(string.length - 6)}`
      : string
  }
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

export const minimumDecimalPoints = (num: string | number, decimalPoints: number): string => {
  num = Number(num)
  return num.toFixed(Math.max(decimalPoints, (num.toString().split('.')[1] || []).length))
}

export const numberWithCommas = (x: number | string): string => {
  const parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}
