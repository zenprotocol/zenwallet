import bech32 from 'bech32'

const validPrefixes = ['tc', 'zc', 'tp', 'zp']

export const truncateString = (string) => {
  if (string) {
    return string.substr(0, 6) + '...' + string.substr(string.length - 6);
  }
}

export const normalizeTokens = (number) => {
  if (Number.isInteger(number)) {
    console.log('normalizeTokens', number)
    return (number / 100000000).toLocaleString(undefined, { minimumFractionDigits: 4 });
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
