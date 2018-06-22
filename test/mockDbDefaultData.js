import exampleContractCode from '../app/services/exampleContractCode'

export default {
  userPreferences: {
    width: 1200,
    height: 800,
  },
  savedContracts: [
    {
      name: 'Example Token',
      contractId: '99f1aed539e83caa26467a0143024c197421fdab7bc1aff905fce314c48b7f80',
      address: 'tc1qn8c6a4feaq725fjx0gq5xqjvr96zrldt00q6l7g9ln33f3yt07qq2qt6a7',
      code: exampleContractCode,
    },
  ],
  config: {
    alreadyRedeemedTokens: false,
    autoLogoutMinutes: 30,
    miner: false,
    isReportingErrors: false,
    dontAskToReportErrors: false,
  },
}
