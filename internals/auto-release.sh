#!/bin/bash

# this script resets local and remote release branches to local master branch
# use it when latest master is ready for a new release

# Bail on first error
# See https://medium.com/@nthgergo/publishing-gh-pages-with-travis-ci-53a8270e87db
set -o errexit

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "${BRANCH}" != 'master' ]; then
  echo "must release from master"
  exit 0
fi

if [ "$#" != "1" ]; then
    echo "Illegal number of parameters, write only a number in the following format _._._"
    exit 0
fi

tmp=$(mktemp)
jq '.version = $val' --arg val "$1" package.json > "$tmp" && mv "$tmp" package.json
jq '.version = $val' --arg val "$1" app/package.json > "$tmp" && mv "$tmp" app/package.json
npm install
git commit -am "update npm dependencies for v$1"
npm run build && npm pack
npm publish
git tag v$1
git push origin v$1
git push
echo "run 'npm run package' to create installer file for your local platform"
