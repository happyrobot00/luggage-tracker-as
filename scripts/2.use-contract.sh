#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for environment variable with contract name"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

echo
echo
echo ---------------------------------------------------------
echo "Step 1: Call 'view' functions on the contract"
echo
echo "(run this script again to see changes made by this file)"
echo ---------------------------------------------------------
echo
near call $CONTRACT clear '{}' --accountId=happyrobot.testnet
near call $CONTRACT removeLuggageItem '{"id":"jules_bag"}' --accountId=happyrobot.testnet
echo ---------------------------------------------------------
echo "1: Checking in Luggage item id: 'jules_bag'"
echo ---------------------------------------------------------
near call $CONTRACT checkInLuggageItem '{"id":"jules_bag", "flightno":"QF1234", "origin":"SYD", "destination":"JFK"}' --accountId=happyrobot.testnet
near view $CONTRACT getLuggageItem '{"id":"jules_bag"}' --accountId=happyrobot.testnet
echo
echo
echo ---------------------------------------------------------
echo "2: Update status to 'en-route'"
echo ---------------------------------------------------------
near call $CONTRACT luggageEnRoute '{"id":"jules_bag"}' --accountId=happyrobot.testnet
near view $CONTRACT getLuggageItem '{"id":"jules_bag"}' --accountId=happyrobot.testnet
echo
echo
echo ---------------------------------------------------------
echo "3: Update status to 'ready for collection'"
echo ---------------------------------------------------------
near call $CONTRACT readyForCollection '{"id":"jules_bag", "collectionPoint":"Carousel 3"}' --accountId=happyrobot.testnet
near view $CONTRACT getLuggageItem '{"id":"jules_bag"}' --accountId=happyrobot.testnet
echo
echo
echo ---------------------------------------------------------
echo "4: User collects luggage"
echo ---------------------------------------------------------
near call $CONTRACT collectLuggage '{"id":"jules_bag"}' --accountId=happyrobot.testnet
near view $CONTRACT getLuggageItem '{"id":"jules_bag"}' --accountId=happyrobot.testnet
echo
echo
echo
echo
echo
echo ---------------------------------------------------------
echo "Step 2: Call 'change' functions on the contract"
echo ---------------------------------------------------------
echo

# the following line fails with an error because we can't write to storage without signing the message
# --> FunctionCallError(HostError(ProhibitedInView { method_name: "storage_write" }))
# near view $CONTRACT write '{"key": "some-key", "value":"some value"}'
#near call $CONTRACT write '{"key": "some-key", "value":"some value"}' --accountId $CONTRACT

echo
echo "now run this script again to see changes made by this file"
exit 0
