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
    return ({
      value: () => undefined,
    })
  },
  set: jest.fn(() => ({
    write: jest.fn(),
  })),
}))
