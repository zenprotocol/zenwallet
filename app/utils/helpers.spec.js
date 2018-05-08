import { validateInputNumber } from './helpers'

describe('validateInputNumber', () => {
  it('should only accept numbers and dots', () => {
    const maxDecimal = 3
    let str = 'asdf.'
    expect(validateInputNumber(str)).toBe(false)
    expect(validateInputNumber(str, maxDecimal)).toBe(false)
    str = '0a'
    expect(validateInputNumber(str)).toBe(false)
    expect(validateInputNumber(str, maxDecimal)).toBe(false)
    str = '0.a'
    expect(validateInputNumber(str)).toBe(false)
    expect(validateInputNumber(str, maxDecimal)).toBe(false)
  })
  it('should not modify string', () => {
    let str = '0'
    expect(validateInputNumber(str)).toBe(str)
    expect(validateInputNumber(str, 8)).toBe(str)
    str = '1'
    expect(validateInputNumber(str)).toBe(str)
    str = ''
    expect(validateInputNumber(str)).toBe(str)
  })
  it('should block dot when no decimal is passed', () => {
    let str = '0.'
    expect(validateInputNumber(str)).toBe(false)
    str = '10.'
    expect(validateInputNumber(str)).toBe(false)
    str = '10.1'
    expect(validateInputNumber(str)).toBe(false)
    str = '.'
    expect(validateInputNumber(str)).toBe(false)
    str = '.1'
    expect(validateInputNumber(str)).toBe(false)
  })
  it('should not block dot when decimal > 0', () => {
    const maxDecimal = 1
    let str = '0.'
    expect(validateInputNumber(str, maxDecimal)).toBe(str)
    str = '10.'
    expect(validateInputNumber(str, maxDecimal)).toBe(str)
    str = '10.1'
    expect(validateInputNumber(str, maxDecimal)).toBe(str)
  })
  it('should block 2nd dot', () => {
    const maxDecimal = 1
    let str = '0.0.'
    expect(validateInputNumber(str, maxDecimal)).toBe(false)
    str = '10..'
    expect(validateInputNumber(str, maxDecimal)).toBe(false)
    str = '10..234124.1234'
    expect(validateInputNumber(str, 20)).toBe(false)
  })
  it('should handle leading dot', () => {
    const maxDecimal = 1
    let str = '.'
    expect(validateInputNumber(str, maxDecimal)).toBe('0.')
    str = '.1'
    expect(validateInputNumber(str, maxDecimal)).toBe('0.1')
    str = '.11'
    expect(validateInputNumber(str, maxDecimal)).toBe('0.1')
  })
  it('should limit decimals', () => {
    let maxDecimal = 1
    let str = '12.123456'
    expect(validateInputNumber(str, maxDecimal)).toBe('12.1')
    str = '.1'
    expect(validateInputNumber(str, maxDecimal)).toBe('0.1')
    str = '.11'
    expect(validateInputNumber(str, maxDecimal)).toBe('0.1')
    str = '0.123456787'
    maxDecimal = 8
    expect(validateInputNumber(str, maxDecimal)).toBe('0.12345678')
    str = '101.123456787'
    maxDecimal = 8
    expect(validateInputNumber(str, maxDecimal)).toBe('101.12345678')
  })
  it('should block non dot after zero', () => {
    const maxDecimal = 1
    let str = '01'
    expect(validateInputNumber(str, maxDecimal)).toBe(false)
    str = '01.'
    expect(validateInputNumber(str, maxDecimal)).toBe(false)
    str = '01.1'
    expect(validateInputNumber(str, maxDecimal)).toBe(false)
    str = '0.1'
    expect(validateInputNumber(str, maxDecimal)).toBe(str)
  })
})
