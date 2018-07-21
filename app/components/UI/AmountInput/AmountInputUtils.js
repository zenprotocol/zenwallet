export const formatNextAmountDisplay = (str: string, maxDecimal: number = 0) => {
  if (str === '') {
    return str
  }
  str = removeCommas(str)
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

export const removeCommas = (num: string): string => num.replace(/,/g, '')
