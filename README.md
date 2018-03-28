**Please note that the usage of the software is only permitted to anyone who purchased a license during the license sale period. [Sale Terms](https://www.zenprotocol.com/legal/zen_protocol_token_sale_agreement.pdf)**


### Tutorial videos:
* [Installation/Update](https://www.youtube.com/watch?v=tYtMcELj3T0)
* [Claim and Send Tokens](https://www.youtube.com/watch?v=gHU3xg_5Dr8)
* [Example Contract](https://www.youtube.com/watch?v=cjfr7zM2vhU)


## Preparing Your Machine
* Note that this a new network and no other versions will effect functionality.


## Linux

1. Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. Install [mono-devel](http://www.mono-project.com/download). If you choose to install via a package manager, add Mono's own repository first.
3. Install lmdb. The package name is liblmdb0 on Ubuntu and lmdb on Fedora. `sudo apt install liblmdb0`
4. Install Nodejs (Version >= 6)
- Recommended to install using [NVM](https://github.com/creationix/nvm#installation)
- Recommended to install Node LTS (8.9.4) `nvm install 8.9.4`


## OSX

1. Install [mono-devel](http://www.mono-project.com/download). If you choose to install via a package manager, add Mono's own repository first.
* Steps 2-3 require [brew] (https://www.dyclassroom.com/howto-mac/how-to-install-nodejs-and-npm-on-mac-using-homebrew)
2. Open the **Terminal** (can be found from **search** bar)
3. Install lmdb. Enter the command (in terminal) `brew install lmdb`.
4. Install Nodejs (Version >= 6)
- Recommended to install using [NVM](https://github.com/creationix/nvm#installation)
- Recommended to install Node LTS (8.9.4) `nvm install 8.9.4`


## Windows

1. Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. Install [.NET Framework 4.7](https://www.microsoft.com/en-us/download/details.aspx?id=55167).
3. [Install Nodejs](https://nodejs.org/en/download/) (LTS version recommended)
4. Open the [Command Prompt](https://www.lifewire.com/how-to-open-command-prompt-2618089)



# Install/Update Wallet

## Step 1: Installation

Run the following commands in the Terminal / Command Prompt:
```
npm config set @zen:registry https://www.myget.org/F/zenprotocol/npm/
npm install electron @zen/zen-wallet -g
```

## Step 2: Updating

Run the command:
```
npm install @zen/zen-wallet -g
```

## Step 3: Running wallet and full node

Run `zen-wallet` from anywhere in your command line (terminal) to start  up the wallet

## Running with arguments

### Wipe (Clear Data)
When we launch a new testnet sometimes you will need to wipe your local database in order to sync. Note that this will delete any data/tokens from the wallet.

You can do this by running: `zen-wallet wipe`

### Miner
In order to run a node with a miner run the wallet with the `miner` argument like this: `zen-wallet miner`
*Running with miner allows you to get the block reward of Zen Tokens every time a new block is mined.

### Headless
1. Install the node (without GUI) by running the command `npm install @zen/zen-node -g`
2. Type the command `zen-node`

# Wallet Overview

* Access Software - Use your key from the software sale to redeem your tokens.
* Portfolio – View list of assets, their hash name, and current balance.
* Receive – Address used to receive Zen Tokens (or other compatible tokens) to your wallet
* Send – Submit address you want to send your tokens to, select asset (token) you would like to send, and enter the amount.
* Active Contracts – This is a list of all contracts that are currently active on the blockchain.
* Activate Contract – Upload contracts from your computer, name the contract, and choose number of blocks you want the contract to be activated for.
* Run Contract – Enter the contract name/address, choose command you want to run, pick which asset you would like to send, enter the amount.
* Saved Contract – Easy access to previously used contracts and templates

## Access the Software
1. Click on **ACCESS SOFTWARE** tab (left panel)
2. Enter public address from sofware sale
* The testnet will automatically verify how many tokens you are intitled to.
3. Click Redeem tokens.
4. Your testnet tokens will now be available in the *total balance* (top right) and **portfolio** tab (left panel).

## Receive Tokens (From Others)
1. Click the **Receive** tab (left panel).
2. Click on address or copy button
* Either one will copy your address to receive tokens to the clipboard for easy pasting
3. Send your address to someone who wants to transfer you tokens.

## Send Tokens (To Others)
1. Click the **Send** tab (left panel).
2. Enter other person's address.
3. Choose *Asset*
* Tokens in portfolio are already hardcoded options.
4. Enter *Amount* you want to send
5. Click *Send* (blue)

## Run Contract
1. Choose a .fst contract file from your computer
2. Give your contract a name
* The name will get saved as a comment in your code - which other nodes in the network will be able to read.
3. Choose how many blocks you would like to activate your contract for
4. Click "Activate"


# Example Contract

## Activate/Name the contract
1. [Download](https://gist.github.com/anonymous/354d2622af0452c19b66908a898aa3be) the example contract f* file (.fst)
2. Click on the *Drag and Drop* area or the **Upload** button (blue)
3. Select .fst file downloaded above
4. Click and insert a *name* for the contract
* This will change the name of the generic contract already saved in **Saved Contracts** section
5. Click the *Enter Amount* section and insert number of blocks you would like to activate contract for.
6. Click the *Activate* button (blue).
7. Click the **Saved Contracts** tab (left panel)
* You can now see the given contract name on the generic contract

## Saved Contracts
1. Click on **Saved Contracts** tab (left panel).
* Note there is already a contract that has been preloaded for your convenience.
2. Click *Run*.
3. New page will open under the **Run Contract** panel
4. Type `buy` in the *Enter Command* box
5. Choose asset `ZENP`
* Tokens in portfolio are already hardcoded options.
6. Enter amount of Tokens you would like to purchase (1 to 1 ratio)
7. Click the *Run* button (blue)
8. Click the **Portfolio** tab (left panel)
* You can now see your Zen Protocol and generic contract tokens in the portfolio

## Run Contract

1. Click **Run Contract** (left panel).
2. Under *Contract Address* enter the contract you would like to run.
* The generic contract you created is a hardcoded option.
3. Click *Enter Command* and type `redeem`.
4. Choose *asset* (same as contract).
5. Enter amount you like to redeem.
* You will receive a 1 to 1 ratio of *Zen Tokens* for *Generic Contract Tokens*.
6. Click the *Run* button (blue).
* Your ZENP balance will be higher by the number of contracts redeemed and the number of contracts lower by that same amount

### Please join us for updates and discussions:

[Telegram](https://t.me/zenprotocol) | [Twitter](https://twitter.com/zen_protocol) | [Blog](https://blog.zenprotocol.com/) | [Facebook](https://www.facebook.com/thezenprotocol) | [Instagram](https://www.instagram.com/zenprotocol/) | [Reddit] (https://www.reddit.com/r/zenprotocol/)
