# `luggage-tracker-as` 
# Luggage Tracker Demo Smart Contract for LNC Certified Developer
This smart contract for the NEAR protocol uses the hypothetical example of luggage tracking for an airline passenger. 

- Passenger can check in their bag, using a unique luggage tag id, their origin and destination.
- The luggage gets status updates along the way (ie.  checked in, en-route, ready and collected
- Passenger can check-out their bag, using the bag's code and against their wallet account id

The luggage tracker use-case was chosen in order to study and demonstrate the following:
- Create and push records using persistent storage on the NEAR blockchain
- Delete a record off the storage
- Get and return a record
- Update a record

It also demonstrates a few other common functions, executed on the NEAR VM
- Obtaining a timestamp
- Generating a random string (this function ended up not being used but kept as an example)



## Challenges, Errors and Items of Interest

I’ve added a few challenging errors I encountered, possibly helpful to those learning assembly script on NEAR VM


### Nullable Types
When “getting” a PersistantUnoderedMap value, I was getting an error message.  
In the example below, I wish to update the class LuggageItem.  It would return an error because luggageRecords.get(id) returns a “nullable” type.
```
ERROR TS2322: Type 'assembly/model/LuggageItem | null' is not assignable to type 'assembly/model/LuggageItem'.

   let bag: LuggageItem = luggageRecords.get(id);
```

Original source:
```
export function luggageEnRoute(id: string): void {
  let bag: LuggageItem = luggageRecords.get(id)
  bag.enRoute()
  luggageRecords.set(id, bag)
}
```

The solution was to cast ‘LuggageItem’ as below: 
```
let bag: LuggageItem = <LuggageItem>luggageRecords.get(id)
```
Updated function
```
export function luggageEnRoute(id: string): void {
  let bag: LuggageItem =< LuggageItem> luggageRecords.get(id)
  bag.enRoute()
  luggageRecords.set(id, bag)
}
```

### Timestamps
Unlike javascript (or any language) there is no Date.now() or equivilent.  This link provides a much better explanation - https://dev.to/melvinmanni/common-mistakes-you-might-make-using-the-near-sdk-as-and-assemblyscript-264c

```
import { context } from "near-sdk-as";


let timestampInNanoseconds = context.blockTimestamp;

```

### Generate a Random String
I didn't end up using this.  The demo simulates scanning a unique luggage tag (which would either be supplied by the airline or the passenge, and would be a proper UUID.  

```
/*
* Generate a 24 character long random string. 
*/
function generateRandomString(): string {
  let buf = math.randomBuffer(24);
  let b64 = base64.encode(buf);
  return b64;
}
```
