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

echo "deleting local release branch if exists"
git branch -D release || true
git checkout -b release
echo "resetting release branch to master"
git reset --hard master
echo "pushing release branch"
git push -f --no-verify --set-upstream origin release
printf "\n" 
echo "run 'npm run build && npm pack' to create npm package file"
echo "run 'npm run packackge' to create installer file for your local platform"