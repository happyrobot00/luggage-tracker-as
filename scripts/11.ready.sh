#!/usr/bin/env bash
export CONTRACT=dev-1652560975710-68441058074270
export BENEFICIARY=happyrobot.testnet

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Set Luggage Item as ready to be collected"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

near call $CONTRACT readyForCollection '{"id":"jules_bag", "collectionPoint":"Carousel 3"}' --accountId=happyrobot.testnet

exit 0
