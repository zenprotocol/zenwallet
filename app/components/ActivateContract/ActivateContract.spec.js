// eslint-disable-next-line max-len
// import { calcMaxBlocksForContract } from './ActivateContract' // TODO [AdGo] 15.04.2018 fix alias resolving

describe.skip('calcMaxBlocksForContract', () => {
  let zenBalance
  let codeLength
  it('should return 0 when there are no ZENP', () => {
    zenBalance = 0
    expect(calcMaxBlocksForContract(zenBalance)).toEqual(0)
  })
  it('should return 0 when codeLength is 0', () => {
    codeLength = 0
    expect(calcMaxBlocksForContract(zenBalance, codeLength)).toEqual(0)
  })
  it('should return 5', () => {
    zenBalance = 10
    codeLength = 2
    expect(calcMaxBlocksForContract(zenBalance, codeLength)).toEqual(5 * 100000000)
  })
  it('should return round down', () => {
    zenBalance = 10
    codeLength = 3
    expect(calcMaxBlocksForContract(zenBalance, codeLength)).toEqual(333333333)
  })
})
