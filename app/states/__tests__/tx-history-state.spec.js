import TxHistoryState from '../tx-history-state'
import { getTxHistory } from '../../services/api-service'

jest.mock('../../services/api-service', () => ({
  getTxHistory: jest.fn(),
}))

jest.spyOn(window, 'setInterval')
jest.spyOn(window, 'clearInterval')

const mockTransactions = [
  {
    txHash: '0a4f2e0d91edfd3d8450b0169cf694ae36a35b4c2789cefa6a098ecd96362376',
    deltas: [{ asset: '00', amount: 5000003406 }],
    blockNumber: 0,
  },
  {
    txHash: '2d0e33f5d4cb9dc2f9a43b50bf183645fb02085044c4e43e5057cf710c57978b',
    deltas: [{ asset: '00', amount: 5000003406 }],
    blockNumber: 0,
  }]

afterEach(() => {
  getTxHistory.mockReset()
  window.setInterval.mockReset()
  window.clearInterval.mockReset()
})

let txHistoryState
beforeEach(() => {
  txHistoryState = new TxHistoryState()
})
describe('TxHistoryState', () => {
  describe('after construction', () => {
    it('sets the tx object to the correct zero values', () => {
      expect(txHistoryState.skip).toBe(0)
      expect(txHistoryState.transactions).toEqual([])
      expect(txHistoryState.currentPageSize).toBe(0)
      expect(txHistoryState.isFetching).toBe(false)
    })
  })

  describe('when reset is called', () => {
    beforeEach(() => {
      txHistoryState.currentPageSize = 90
      txHistoryState.skip = 9
      txHistoryState.isFetching = true
      txHistoryState.transactions = [...mockTransactions]

      txHistoryState.reset()
    })

    it('sets the tx object to the correct zero values', () => {
      expect(txHistoryState.skip).toBe(0)
      expect(txHistoryState.transactions).toEqual([])
      expect(txHistoryState.currentPageSize).toBe(0)
      expect(txHistoryState.isFetching).toBe(false)
    })
  })

  describe('when fetch is already in progress', () => {
    beforeEach(() => {
      txHistoryState.isFetching = true
    })

    describe('and fetch is called', () => {
      beforeEach(() => {
        txHistoryState.fetch()
      })
      it('does not call getTxHistory', () => {
        expect(getTxHistory).not.toHaveBeenCalled()
      })
    })
  })

  describe('when fetch is not in progress', () => {
    describe('and fetch is called', () => {
      describe('before getTxHistory has resolved', () => {
        beforeEach(() => {
          getTxHistory.mockReturnValue(new Promise(() => {}))
          txHistoryState.fetch()
        })

        it('calls getTxHistory with skip: 0 and take: txHistoryState.batchSize', () => {
          expect(getTxHistory).toHaveBeenCalledWith({ skip: 0, take: txHistoryState.batchSize })
        })
        it('sets isFetching to true', () => {
          expect(txHistoryState.isFetching).toBe(true)
        })
      })

      describe('after getTxHistory has resolved with a non empty list', () => {
        beforeEach(() => {
          getTxHistory.mockReturnValue(Promise.resolve(mockTransactions))
          txHistoryState.transactions = [...mockTransactions, ...mockTransactions]
          txHistoryState.fetch()
        })

        it('sets isFetching to false', () => {
          expect(txHistoryState.isFetching).toBe(false)
        })

        it('increments the currentPageSize by the size of the transactions', () => {
          expect(txHistoryState.currentPageSize).toBe(2)
        })

        it('sets the transtions to the resolved transactions', () => {
          expect(txHistoryState.transactions).toEqual(mockTransactions)
        })
      })

      describe('after getTxHistory has resolved with an empty list', () => {
        const testExistingTransactions = [...mockTransactions, ...mockTransactions]

        beforeEach(() => {
          getTxHistory.mockReturnValue(Promise.resolve([]))
          txHistoryState.transactions = testExistingTransactions
          txHistoryState.currentPageSize = 60
          txHistoryState.fetch()
        })

        it('sets isFetching to false', () => {
          expect(txHistoryState.isFetching).toBe(false)
        })

        it('does not affect currentPageSize', () => {
          expect(txHistoryState.currentPageSize).toBe(60)
        })

        it('does not affect existing transactions', () => {
          expect(txHistoryState.transactions).toEqual(testExistingTransactions)
        })
      })
    })
  })
})
