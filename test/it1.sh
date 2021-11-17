#!/usr/bin/env bash

echo "- starting $0 in $PWD..."; echo

# Start the Stellar Smart Contracts server
npx ttab -w -d $PWD exec npm run www

# Start the specified TxfCreator servers
for dir in $*; do
  cd $dir
  $0
  cd - > /dev/null
done
