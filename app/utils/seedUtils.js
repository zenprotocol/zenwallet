import bip39 from 'bip39'

import bip39Words from './bip39Words'

export const isValidBip39Word = (string: ?string) => {
  if (string) {
    for (const word of bip39Words) {
      if (word.includes(string)) {
        return true
      }
    }
  }
  return false
}

export const isBip39Word = (string: ?string) => {
  if (string) {
    for (const word of bip39Words) {
      if (word === string) {
        return true
      }
    }
  }
  return false
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
