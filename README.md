# Installation

Start by installing the (Zen Node)[https://gitlab.com/zenprotocol/zenprotocol]


Node Apis
https://gitlab.com/zenprotocol/zenprotocol/blob/master/src/Api/Server.fs

Get "/wallet/balance"

Get "/wallet/address"

Post "/wallet/transaction/send" (from_address, amount, to_address)

Post "/wallet/contract/activate"



# Building the Node

./paket restore

sudo apt install liblmdb0

cd Zulib
./build.sh

cd ..
cd src
msbuild

# Running nodes


cd /zenprotocol/src/Node/bin/Debug
./zen-node --localhost

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
