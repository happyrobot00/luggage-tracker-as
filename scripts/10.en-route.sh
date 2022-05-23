#!/usr/bin/env bash
export CONTRACT=dev-1652560975710-68441058074270
export BENEFICIARY=happyrobot.testnet

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Set Luggage Item as 'en-route'"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

near call $CONTRACT luggageEnRoute '{"id":"jules_bag"}' --accountId=happyrobot.testnet

exit 0
