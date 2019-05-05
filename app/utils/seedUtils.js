import bip39 from 'bip39'

import bip39Words from './bip39Words'

export const isValidBip39Word = (string: ?string) =>
  !!(string && bip39Words.find(word => word.includes(string)))

export const isBip39Word = (string: ?string) =>
  !!(string && bip39Words.find(word => word === string))

export const setWordFromFirstBox = (value, idx) => {
  if (!idx) {
    const userInputWords = getSeedFromClipboard(value)
    if (!userInputWords) {
      return false
    }
    return userInputWords
  }
}

export const parseSeedFromClipboard = (clipboardContents) => {
  if (!clipboardContents) {
    return false
  }
  try {
    const parsed = JSON.parse(clipboardContents)
    if (Array.isArray(parsed)) {
      return parsed.join(' ')
    }
  } catch (err) {
    //
  }
  if (clipboardContents.match(',')) {
    return clipboardContents.replace(/(, |,)/g, ' ')
  }
  if (clipboardContents.match('\n')) {
    return clipboardContents.replace(/\n/g, ' ')
  }
  if (clipboardContents.match(' ')) {
    return clipboardContents
  }
  return false
}

export const getSeedFromClipboard = (clipboardContents) => {
  const parsed = parseSeedFromClipboard(clipboardContents.trim())
  if (!parsed || !bip39.validateMnemonic(parsed)) {
    return false
  }
  return parsed.split(' ')
}
