import bech32 from 'bech32'
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
  if (Number.isInteger(number)) {
    number = Math.abs(number)
    if (isZen) {
      number = Math.floor((number / 100000000) * 100) / 100
      number.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    } else {
      number = number.toLocaleString()
    }
    return number
  }
}

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

export const isZenAsset = (asset) => (asset === '0000000000000000000000000000000000000000000000000000000000000000')


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
