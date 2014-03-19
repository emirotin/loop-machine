#!/bin/sh

git checkout master
cd source
middleman build
git checkout gh-pages
cp -R build/* ..
git add .
git commit -am "build"
git push
git checkout master
