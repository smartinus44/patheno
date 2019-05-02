#!/bin/bash

git commit -a
git push
git ls-remote --exit-code faraway
if test $? = 0; then
  git remote add gandi git+ssh://451993@git.sd5.gpaas.net/default.git
fi
git push gandi master
ssh 451993@git.sd5.gpaas.net deploy default.git
