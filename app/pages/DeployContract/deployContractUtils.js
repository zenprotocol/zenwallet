import { zenToKalapas } from '../../utils/zenUtils'
import { ZEN_ASSET_NAME, ZEN_ASSET_HASH } from '../../constants'

export const replacePkHashVar = (codeFromFile, pkhash) => codeFromFile.replace(/"%PKHASH%"/g, `"${pkhash}"`)

export const isContractNameReserved = (name) => {
  const reg = new RegExp(`^(${ZEN_ASSET_NAME}|${ZEN_ASSET_HASH})$`, 'i')
  return !!name.match(reg)
}

export function calcMaxBlocksForContract(zenBalance, codeLength) {
  if (zenBalance === 0 || codeLength === 0) {
    return 0
  }
  const kalapasBalance = zenToKalapas(zenBalance)
  return parseInt((kalapasBalance / codeLength), 10)
}
