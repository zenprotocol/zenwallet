import TxHistoryState from '../tx-history-state'
import { getTxHistory } from '../../services/api-service'

jest.mock('../../services/api-service', () => ({
  getTxHistory: jest.fn(),
}))
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
describe('TxHistoryState', () => {
  describe('after construction', () => {
    const txHistoryState = new TxHistoryState()
    it('sets the tx object to the correct zero values', () => {
      expect(txHistoryState.skip).toBe(0)
      expect(txHistoryState.transactions).toEqual([])
      expect(txHistoryState.currentPageSize).toBe(0)
      expect(txHistoryState.isFetching).toBe(false)
    })
  })

  describe('when fetch is called', () => {
    describe('before getTxHistory has resolved', () => {
      getTxHistory.mockReturnValue(new Promise(() => {}))
      const txHistoryState = new TxHistoryState()
      txHistoryState.fetch()
      it('calls getTxHistory with skip: 0 and take: 20', () => {
        expect(getTxHistory).toHaveBeenCalledWith({ skip: 0, take: 20 })
      })
      it('sets isFetching to true', () => {
        expect(txHistoryState.isFetching).toBe(true)
      })
    })

    describe('after getTxHistory has resolved with a non empty list', () => {
      getTxHistory.mockReturnValue(Promise.resolve(mockTransactions))
      const txHistoryState = new TxHistoryState()
      txHistoryState.transactions = [...mockTransactions, ...mockTransactions]
      txHistoryState.fetch()
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
      getTxHistory.mockReturnValue(Promise.resolve([]))
      const txHistoryState = new TxHistoryState()
      const testExistingTransactions = [...mockTransactions, ...mockTransactions]
      txHistoryState.transactions = testExistingTransactions
      txHistoryState.currentPageSize = 60
      txHistoryState.fetch()
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
