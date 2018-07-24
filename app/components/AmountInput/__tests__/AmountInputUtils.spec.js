import { formatNextAmountDisplay } from '../AmountInputUtils'

describe('formatNextAmountDisplay', () => {
  it('should only accept numbers and dots', () => {
    const maxDecimal = 3
    let str = 'asdf.'
    expect(formatNextAmountDisplay(str)).toBe(false)
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe(false)
    str = '0a'
    expect(formatNextAmountDisplay(str)).toBe(false)
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe(false)
    str = '0.a'
    expect(formatNextAmountDisplay(str)).toBe(false)
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe(false)
  })
  it('should not modify string', () => {
    let str = '0'
    expect(formatNextAmountDisplay(str)).toBe(str)
    expect(formatNextAmountDisplay(str, 8)).toBe(str)
    str = '1'
    expect(formatNextAmountDisplay(str)).toBe(str)
    str = ''
    expect(formatNextAmountDisplay(str)).toBe(str)
  })
  it('should block dot when no decimal is passed', () => {
    let str = '0.'
    expect(formatNextAmountDisplay(str)).toBe(false)
    str = '10.'
    expect(formatNextAmountDisplay(str)).toBe(false)
    str = '10.1'
    expect(formatNextAmountDisplay(str)).toBe(false)
    str = '.'
    expect(formatNextAmountDisplay(str)).toBe(false)
    str = '.1'
    expect(formatNextAmountDisplay(str)).toBe(false)
  })
  it('should not block dot when decimal > 0', () => {
    const maxDecimal = 1
    let str = '0.'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe(str)
    str = '10.'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe(str)
    str = '10.1'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe(str)
  })
  it('should block 2nd dot', () => {
    const maxDecimal = 1
    let str = '0.0.'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe(false)
    str = '10..'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe(false)
    str = '10..234124.1234'
    expect(formatNextAmountDisplay(str, 20)).toBe(false)
  })
  it('should handle leading dot', () => {
    const maxDecimal = 1
    let str = '.'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe('0.')
    str = '.1'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe('0.1')
    str = '.11'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe('0.1')
  })
  it('should limit decimals', () => {
    let maxDecimal = 1
    let str = '12.123456'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe('12.1')
    str = '.1'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe('0.1')
    str = '.11'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe('0.1')
    str = '0.123456787'
    maxDecimal = 8
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe('0.12345678')
    str = '101.123456787'
    maxDecimal = 8
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe('101.12345678')
  })
  it('should block non dot after zero', () => {
    const maxDecimal = 1
    let str = '01'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe(false)
    str = '01.'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe(false)
    str = '01.1'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe(false)
    str = '0.1'
    expect(formatNextAmountDisplay(str, maxDecimal)).toBe(str)
  })
})
