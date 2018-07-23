import React from 'react'
import { shallow } from 'enzyme'

import states from '../../../states'
import SavedContracts from '../SavedContracts'

jest.mock('electron', () => ({
  app: {
    getPath() { return 'test' },
  },
  ipcRenderer: { send: jest.fn(), on: jest.fn() },
}))

describe('SavedContracts', () => {
  describe('sortSavedContractsByExpiry', () => {
    const UnWrappedComponent =
      SavedContracts.wrappedComponent
    const component = shallow(<UnWrappedComponent {...states} />)
    const sortFunction = component.instance().sortSavedContractsByExpiry
    describe('when contracts contain data with undefined expiry', () => {
      const a = { address: 'a', expire: 900 }
      const b = { address: 'b' }
      const c = { address: 'c' }
      const d = { address: 'd', expire: 90 }
      it('returns contracts in ascending order of expiry and with undefined expiry last', () => {
        const contracts = [a, b, c, d]
        contracts.sort(sortFunction)
        expect(contracts).toEqual([d, a, b, c])
      })
    })

    describe('when contracts contain data without undefined expiry', () => {
      const a = { address: 'a', expire: 900 }
      const b = { address: 'b', expire: 890 }
      const c = { address: 'c', expire: 1000 }
      const d = { address: 'd', expire: 90 }
      it('returns contracts in ascending order of expiry', () => {
        const contracts = [a, b, c, d]
        contracts.sort(sortFunction)
        expect(contracts).toEqual([d, b, a, c])
      })
    })
  })
})
