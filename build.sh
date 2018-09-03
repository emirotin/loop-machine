#!/bin/sh

git checkout master
cd looper
middleman build
git checkout gh-pages
cp -R ./* ..
git add .
git commit -am "build"
git push
git checkout master
