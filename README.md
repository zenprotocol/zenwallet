# Installation

Start by installing the (Zen Node)[https://gitlab.com/zenprotocol/zenprotocol]

Node Apis
https://gitlab.com/zenprotocol/zenprotocol/blob/master/src/Api/Server.fs

Get "/wallet/balance"
Get "/wallet/address"
Post "/wallet/transaction/send" (from_address, amount, to_address)
Post "/wallet/contract/activate"

# Installing

Install NodeJS (Version >= 6) and run the following
```
npm config set @zen:registry https://www.myget.org/F/zenprotocol/npm/
npm install @zen/zen-wallet -g
```

Run `zen-wallet`

# Building the Node

sudo apt install liblmdb0

./paket restore

cd src/Zulib
./build.sh

cd ..
msbuild


# Running nodes

cd /zenprotocol/src/Node/bin/Debug
./zen-node --localhost --wipe


# run another node from the same computer:

./zen-node -l1

Check balance
./zen-cli -l1 balance  

Send transaction:

./zen-cli send AssetHash 10 ToPublicAddress
./zen-cli send 0000000000000000000000000000000000000000000000000000000000000000 10 tz1q5889ee2udahvxtfp96z6fq7ql0jd8eh84v5tz3gdncndpr4vkacskganl5

Check Address:
./zen-cli -l1 address



# Building Client

```
yarn install
yarn build ; yarn start
yarn build ; yarn dev-l1
yarn start
```



Update node

1) go to zenprotocol/zenprotocol dir
2) git pull upstream master
3) build nodes



Running a contracts:

1) activate contract - use contracts/full-example.fst
2) copy the contract address



# Initializing the Faucet

1. Activate the faucet contract - src/app/contracts/faucet.fst
2. Run the 'faucet' contract with the following parameters:
   - command: 'init'
   - asset: '0000000000000000000000000000000000000000000000000000000000000000' (ZENP)
   - amount: as much as you want to fill up the faucet with
