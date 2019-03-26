#!/usr/bin/env sh

set -e

npm run docs:build

cd docs/.vuepress/dist

echo 'tang.js.org' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:roboncode/tang.git master:gh-pages

cd -
