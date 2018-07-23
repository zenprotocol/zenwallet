import React from 'react'
import { shallow } from 'enzyme'

import DeployContractState from '../../../states/deploy-contract-state'
import BalancesState from '../../../states/balances-state'
import DeployContractContainer, { calcMaxBlocksForContract } from '../DeployContract'

jest.mock('electron', () => ({
  ipcRenderer: { on: jest.fn() },
}))

describe('calcMaxBlocksForContract', () => {
  let zenBalance
  let codeLength
  it('should return 0 when there are no ZENP', () => {
    zenBalance = '0'
    expect(calcMaxBlocksForContract(zenBalance)).toEqual(0)
  })
  it('should return 0 when codeLength is 0', () => {
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
jest.mock('services/store', () => ({
  get: (key) => {
    if (key === 'savedContracts') {
      return {
        value: () => [
          {
            name: 'Jezreel Valley Adumim 2018 Red',
            contractId: '99f1aed539e83caa26467a0143024c197421fdab7bc1aff905fce314c48b7f80',
            address: 'tc1qn8c6a4feaq725fjx0gq5xqjvr96zrldt00q6l7g9ln33f3yt07qq2qt6a7',
            code: 'Jezreel Valley Code',
          },
          {
            name: 'Awesome Token',
            contractId: '0000000000000000000000000000000000000000000000000000000000000001',
            address: '0000000000000000000000000000000000000000000000000000000000000001',
            code: 'Awesome Token Code',
          },
        ],
      }
    }
  },
}))

describe('DeployContract', () => {
  const contract = new DeployContractState()
  const balances = new BalancesState()
  const component = shallow(<DeployContract contract={contract} balances={balances} />)

  it('renders to the dom', () => {
    expect(component.find('Layout').length).toBe(1)
  })
})
