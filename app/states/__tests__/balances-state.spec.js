import { ZEN_ASSET_HASH } from '../../../app/constants'
import BalancesState from '../balances-state'

const awesomeTokenAsset = '0000000000000000000000000000000000000000000000000000000000000001'

describe('BalancesState', () => {
  let cut
  beforeEach(() => {
    cut = new BalancesState()
  })
  it('[init] should initialize the class', () => {
    expect(cut.assets.length).toEqual(0)
  })
  it('[getAssetName] should return ZENP', () => {
    expect(cut.getAssetName(ZEN_ASSET_HASH)).toEqual('ZENP')
  })
  it('[getAssetName] should return Awesome Token', () => {
    expect(cut.getAssetName(awesomeTokenAsset)).toEqual('Awesome Token')
  })
  it('[getAssetName] should return ""', () => {
    expect(cut.getAssetName('01010101')).toEqual('')
  })
  it('[getBalanceFor] should return 0 when no matching', () => {
    const asset1 = { asset: 'bar', balance: 1 }
    cut.assets = [asset1]
    expect(cut.getBalanceFor('123')).toEqual(0)
  })
  it('[getBalanceFor] should return balance of asset', () => {
    const asset1 = { asset: 'bar', balance: 1 }
    cut.assets = [asset1]
    expect(cut.getBalanceFor('bar')).toEqual(1)
  })
  it('[assetsWithNames] should get asset with names', () => {
    cut.assets = [
      { asset: ZEN_ASSET_HASH, balance: 2 },
      { asset: awesomeTokenAsset, balance: 3 },
    ]
    expect(cut.assetsWithNames).toEqual([
      { asset: ZEN_ASSET_HASH, balance: 2, name: 'ZENP' },
      { asset: awesomeTokenAsset, balance: 3, name: 'Awesome Token' },
    ])
  })
  it('[assetsWithNames] should return empty array', () => {
    expect(cut.assetsWithNames).toEqual([])
  })
  it('[filteredBalancesWithNames] should return empty array when no assets are present', () => {
    expect(cut.filteredBalancesWithNames()).toEqual([])
  })
  it('[filteredBalancesWithNames] should return cut.assetsWithNames when query is empty', () => {
    const mockedAssetsWithNames = [{ asset: ZEN_ASSET_HASH, balance: 2, name: 'ZENP' }]
    Object.defineProperty(cut, 'assetsWithNames', {
      get: jest.fn(() => mockedAssetsWithNames),
    })
    expect(cut.filteredBalancesWithNames()).toEqual(mockedAssetsWithNames)
  })
  it('[filteredBalancesWithNames] should return [] when no balances matches', () => {
    const mockedAssetsWithNames = [{ asset: ZEN_ASSET_HASH, balance: 2, name: 'ZENP' }]
    Object.defineProperty(cut, 'assetsWithNames', {
      get: jest.fn(() => mockedAssetsWithNames),
    })
    expect(cut.filteredBalancesWithNames('123')).toEqual([])
  })
  it('[filteredBalancesWithNames] should return matching object by name', () => {
    const assetWithName1 = { name: 'foo', asset: 'bar', balance: 2 }
    const assetWithName2 = { name: 'asset2', asset: 'asset2', balance: 2 }
    const mockedAssetsWithNames = [assetWithName1, assetWithName2]
    Object.defineProperty(cut, 'assetsWithNames', {
      get: jest.fn(() => mockedAssetsWithNames),
    })
    expect(cut.filteredBalancesWithNames('foo')).toEqual([assetWithName1])
  })
  it('[filteredBalancesWithNames] should return matching object by contractId', () => {
    const assetWithName1 = { name: 'foo', asset: 'bar', balance: 1 }
    const assetWithName2 = { name: 'assetWithName2', asset: 'assetWithName2', balance: 2 }
    const mockedAssetsWithNames = [assetWithName1, assetWithName2]
    Object.defineProperty(cut, 'assetsWithNames', {
      get: jest.fn(() => mockedAssetsWithNames),
    })
    expect(cut.filteredBalancesWithNames('bar')).toEqual([assetWithName1])
  })
})
