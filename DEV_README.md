# Developing
```
$ git clone git@github.com:zenprotocol/zenwallet.git
$ cd zenwallet
$ npm install
$ npm run postinstall-dev
$ npm run dev # first time it will take a while to sync the blockchain
```

# Updating zen node
It's best to update the zen node and commit ONLY that change, to make it easy to trace in the repo's graph
```bash
$ npm run update-zen-node
$ git commit -am "update zen-node x.xx.xx"
$ git push # after QA!
```

# Releasing a new Version
Commit ONLY the change of the wallet version, to make it easy to trace in the repo's graph.
usually you'd want to update zen node first, then:
1. update `@zen/zen-wallet` version in `package.json`
1. update `@zen/zen-wallet` version in `app/package.json`
1. run the following in terminal

```bash
$ git commit -am "version x.xx.xx"
# checkout release branch with same code as local master
$ npm run update-release-branch
# create npm package file for myget
$ npm run build && npm pack
# create installer for local OS
$ npm run package
```

3. go to [myget](https://www.myget.org/feed/Packages/zenprotocol)
4. Add npm package to zen-wallet

# Zen Node APIs
[Node Apis](https://gitlab.com/zenprotocol/zenprotocol/blob/master/src/Api/Server.fs)
