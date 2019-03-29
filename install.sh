#!/bin/sh

[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

exists()
{
  command -v "$1" >/dev/null 2>&1
}

if exists nvm; then
  echo 'nvm exists!'
else
  echo 'Your system does not have nvm'
	curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

	export NVM_DIR="$HOME/.nvm"
	[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
	[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
fi

nvm install 10.15.3
nvm alias default v10.15.3

if exists apt-get; then
  echo 'apt-get exists!'
	sudo apt-get install libudev-dev
else
  echo 'Your system does not have apt-get'
fi

npm install
npm install -g pkg
npm run pkg

#mkdir -p "$HOME/.gtb-transfer/"
#cp -r dist "$HOME/.gtb-transfer/"
#
#echo "export PATH=\$PATH:\"~/.gtb-transfer/dist\"" >> $HOME/.bash_profile





