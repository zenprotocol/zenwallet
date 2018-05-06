// @flow
const localhost = 'http://127.0.0.1'

export const getServerAddress = () => (process.env.ZEN_LOCAL === 'L1' ? `${localhost}:36000` : `${localhost}:31567`)

export const getCrowdsaleServerAddress = () => (process.env.ZEN_LOCAL === 'localhost' ? `${localhost}:3000` : 'https://www.zenprotocol.com')
