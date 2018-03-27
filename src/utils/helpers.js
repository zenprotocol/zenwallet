import bech32 from 'bech32'

const validPrefixes = ['tc', 'zc', 'tp', 'zp']

export const truncateString = (string) => {
  if (string) {
    return string.substr(0, 6) + '...' + string.substr(string.length - 6);
  }
}

export const normalizeTokens = (number, isZen) => {
  if (Number.isInteger(number)) {
    number = Math.abs(number)
    if (isZen) {
      number = Math.floor((number / 100000000) * 100) / 100
      number.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
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

export const isZenAsset = (asset) => {
  return (asset === '0000000000000000000000000000000000000000000000000000000000000000')
}
