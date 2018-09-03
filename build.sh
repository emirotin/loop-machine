#!/bin/sh

git checkout master
cp -r looper tmp
git checkout gh-pages
cp -r tmp/* .
rm -rf tmp
git add .
git commit -am "build"
git push
git checkout master
