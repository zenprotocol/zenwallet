import React from 'react'
import { shallow } from 'enzyme'

import DeployContractStore from '../../../stores/deployContractStore'
import PortfolioStore from '../../../stores/portfolioStore'
import DeployContractContainer from '../DeployContract'
import { calcMaxBlocksForContract } from '../deployContractUtils'

jest.mock('electron', () => ({
  ipcRenderer: { on: jest.fn() },
}))

describe('calcMaxBlocksForContract', () => {
  let zenBalance
  let codeLength
  it('should return 0 when there are no ZENP', () => {
    zenBalance = '0'
    codeLength = 0
    expect(calcMaxBlocksForContract(zenBalance, codeLength)).toEqual(0)
  })
  it('should return 0 when codeLength is 0', () => {
    zenBalance = '0'
    codeLength = 0
    expect(calcMaxBlocksForContract(zenBalance, codeLength)).toEqual(0)
  })
  it('should return 5', () => {
    zenBalance = '10'
    codeLength = 2
    expect(calcMaxBlocksForContract(zenBalance, codeLength)).toEqual(5 * 100000000)
  })
  it('should return round down', () => {
    zenBalance = '10'
    codeLength = 3
    expect(calcMaxBlocksForContract(zenBalance, codeLength)).toEqual(333333333)
  })
})

const DeployContract = DeployContractContainer.wrappedComponent.wrappedComponent
jest.doMock('services/db', () => mockDb)

describe.skip('DeployContract', () => {
  const contract = new DeployContractStore()
  const portfolioStore = new PortfolioStore()
  const component = shallow(<DeployContract contract={contract} portfolioStore={portfolioStore} />)

  it('renders to the dom', () => {
    expect(component.find('Layout').length).toBe(1)
  })
})
