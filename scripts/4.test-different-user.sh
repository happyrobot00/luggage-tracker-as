#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Testing Luggage Collection - using another account"
echo "- this should fail"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

echo
near call $CONTRACT collectLuggage '{"id":"jules"}' --accountId=7of9.testnet
near view $CONTRACT getAllLuggage '{}'
echo

exit 0
