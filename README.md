# Preparing your machine

## Linux

1. Install mono-devel from http://www.mono-project.com/download. If you choose to install via a package manager, add Mono's own repository first.
2. Install lmdb. The package name is liblmdb0 on Ubuntu and lmdb on Fedora. `sudo apt install liblmdb0`
3. Install Nodejs (Version >= 6)
 - Recommended to install using [NVM](https://github.com/creationix/nvm#installation)
 - Recommended to install Node LTS (8.9.4) `nvm install 8.9.4`


## OSX

1. Install Mono as in step 1 of the instructions for Linux.
2. Install lmdb. You can get it via brew with `brew install lmdb`.
3. Install Nodejs (Version >= 6)
 - Recommended to install using [NVM](https://github.com/creationix/nvm#installation)
 - Recommended to install Node LTS (8.9.4) `nvm install 8.9.4`


## Windows

Windows is not yet supported


# Installation

Run the following:
```
npm config set @zen:registry https://www.myget.org/F/zenprotocol/npm/
npm install electron @zen/zen-wallet -g
```

Now you can run `zen-wallet` from anywhere in your command line


# Updating

Run:
```
npm install @zen/zen-wallet -g
```
