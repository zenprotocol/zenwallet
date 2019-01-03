import TxHistoryStore from '../txHistoryStore'
import { getTxHistory, getTxHistoryCount } from '../../services/api-service'

jest.mock('../../services/api-service', () => ({
  getTxHistory: jest.fn(),
  getTxHistoryCount: jest.fn(),
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
  getTxHistoryCount.mockReset()
  window.setInterval.mockReset()
  window.clearInterval.mockReset()
})

let txHistoryState
beforeEach(() => {
  txHistoryState = new TxHistoryStore()
})
describe.skip('TxHistoryStore', () => {
  describe('after construction', () => {
    it('sets the tx object to the correct zero values', () => {
      expect(txHistoryState.count).toBe(0)
      expect(txHistoryState.pageIdx).toBe(0)
      expect(txHistoryState.transactions).toEqual([])
      expect(txHistoryState.pageSize).toBe(5)
      expect(txHistoryState.isFetchingCount).toBe(false)
      expect(txHistoryState.isFetchingTransactions).toBe(false)
    })
  })

  describe('when reset is called', () => {
    beforeEach(() => {
      txHistoryState.isFetchingCount = true

      txHistoryState.reset()
    })

    it('sets the tx object to the correct zero values', () => {
      expect(txHistoryState.isFetchingCount).toBe(false)
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
        expect(getTxHistoryCount).not.toHaveBeenCalled()
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
          expect(getTxHistory).toHaveBeenCalledWith({ skip: 0, take: 5 })
        })
        it('sets isFetching to true', () => {
          expect(txHistoryState.isFetchingTransactions).toBe(true)
        })
      })

      describe('after getTxHistory has resolved with a non empty list', () => {
        beforeEach(() => {
          getTxHistory.mockReturnValue(Promise.resolve(mockTransactions))
          txHistoryState.transactions = [...mockTransactions, ...mockTransactions]
          txHistoryState.fetch()
        })

        it('sets isFetching to false', () => {
          expect(txHistoryState.isFetchingTransactions).toBe(false)
        })

        it('increments the currentPageSize by the size of the transactions', () => {
          expect(txHistoryState.transactions.length).toBe(2)
        })

        it('sets the transtions to the resolved transactions', () => {
          expect(txHistoryState.transactions).toEqual(mockTransactions)
        })
      })

      describe('after getTxHistory has resolved with an empty list', () => {
        beforeEach(() => {
          getTxHistory.mockReturnValue(Promise.resolve([]))
          txHistoryState.transactions = [...mockTransactions, ...mockTransactions]
          txHistoryState.fetch()
        })

        it('sets isFetching to false', () => {
          expect(txHistoryState.isFetchingTransactions).toBe(false)
        })

        it('does not affect currentPageSize', () => {
          expect(txHistoryState.transactions.length).toBe(0)
        })

        it('does not affect existing transactions', () => {
          expect(txHistoryState.transactions).toEqual([])
        })
      })
    })
  })
})
