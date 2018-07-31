import { ZEN_ASSET_NAME, ZEN_ASSET_HASH } from '../../../app/constants'
import PortfolioStore from '../portfolioStore'

const awesomeTokenAsset = '0000000000000000000000000000000000000000000000000000000000000001'

describe('PortfolioStore', () => {
  let cut
  beforeEach(() => {
    cut = new PortfolioStore()
  })
  it('[init] should initialize the class', () => {
    expect(cut.assets.length).toEqual(0)
  })
  it('[getAssetName] should return ZP', () => {
    expect(cut.getAssetName(ZEN_ASSET_HASH)).toEqual(ZEN_ASSET_NAME)
  })
  it('[getAssetName] should return Awesome Token', () => {
    expect(cut.getAssetName(awesomeTokenAsset)).toEqual('Awesome Token')
  })
  it('[getAssetName] should return ""', () => {
    expect(cut.getAssetName('01010101')).toEqual('')
  })
  it('[getBalanceFor] should return 0 when no matching', () => {
    const asset1 = { asset: 'bar', balance: 1 }
    cut.rawAssets = [asset1]
    expect(cut.getBalanceFor('123')).toEqual(0)
  })
  it('[getBalanceFor] should return balance of asset', () => {
    const asset1 = { asset: 'bar', balance: 1 }
    cut.rawAssets = [asset1]
    expect(cut.getBalanceFor('bar')).toEqual(1)
  })
  it('[filteredBalances] should return empty array when no assets are present', () => {
    expect(cut.filteredBalances()).toEqual([])
  })
  it('[filteredBalances] should return cut.assetsWithNames when query is empty', () => {
    const mockedAssetsWithNames = [{ asset: ZEN_ASSET_HASH, balance: 2, name: 'ZENP' }]
    Object.defineProperty(cut, 'assets', {
      get: jest.fn(() => mockedAssetsWithNames),
    })
    expect(cut.filteredBalances()).toEqual(mockedAssetsWithNames)
  })
  it('[filteredBalances] should return [] when no balances matches', () => {
    const mockedAssetsWithNames = [{ asset: ZEN_ASSET_HASH, balance: 2, name: 'ZENP' }]
    Object.defineProperty(cut, 'assets', {
      get: jest.fn(() => mockedAssetsWithNames),
    })
    expect(cut.filteredBalances('123')).toEqual([])
  })
  it('[filteredBalances] should return matching object by name', () => {
    const assetWithName1 = { name: 'foo', asset: 'bar', balance: 2 }
    const assetWithName2 = { name: 'asset2', asset: 'asset2', balance: 2 }
    const mockedAssetsWithNames = [assetWithName1, assetWithName2]
    Object.defineProperty(cut, 'assets', {
      get: jest.fn(() => mockedAssetsWithNames),
    })
    expect(cut.filteredBalances('foo')).toEqual([assetWithName1])
  })
  it('[filteredBalances] should return matching object by contractId', () => {
    const assetWithName1 = { name: 'foo', asset: 'bar', balance: 1 }
    const assetWithName2 = { name: 'assetWithName2', asset: 'assetWithName2', balance: 2 }
    const mockedAssetsWithNames = [assetWithName1, assetWithName2]
    Object.defineProperty(cut, 'assets', {
      get: jest.fn(() => mockedAssetsWithNames),
    })
    expect(cut.filteredBalances('bar')).toEqual([assetWithName1])
  })
})
