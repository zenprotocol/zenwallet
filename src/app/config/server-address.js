let address

if (process.env.ZEN_LOCAL === 'L1')
    address = 'http://127.0.0.1:36000'
else
    address = 'http://127.0.0.1:31567'

export default address
