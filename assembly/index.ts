import { storage, Context } from "near-sdk-core"
import { context } from "near-sdk-as"
import { LuggageItem, luggageRecords } from "./model";


/**
*  id = reference id of the luggage tag (QR code, barcode, bletooth tag)
*  flight no = flight number
*  origin = airport of origin i.e JFK is John F Kennedy Airpot, LAX, etc etc
*  destination = final destination airport.  ie. LAX
*
*  We check that the ID exists already.  If it does, we reject, else
*  we create a new LuggageItem record object.  We fetch the timestamp from
*  the server.  We then call the "checkIn" functuon.
*  We then add the record to "luggageRecords"
*/
export function checkInLuggageItem(id: string, flightno: string, origin: string, destination: string): string {
  var message: string;
  if(luggageRecords.contains(id) == true) {
    message = "id-already-exists"
  } else {
    const timestamp: u64 = context.blockTimestamp;
    const luggage = new LuggageItem();
    luggage.checkIn(id, flightno, origin, destination)
    luggageRecords.set(id, luggage);
    message = "ok"
  }
  return message;
}

/**
*  Get the luggage item record, using the reference id of the passenger.
*/
export function getLuggageItem(id: string): LuggageItem | null {
  let result = luggageRecords.get(id)
  return result;
}

/**
*  Remove/delete a luggageItem record from the PersistentUnorderedMap.
*/
export function removeLuggageItem(id: string): void {
  luggageRecords.delete(id);
}

/**
*  Update the luggage to "en-route".  This signifies that the luggage has been
*  loaded on the aircraft and is 'en-route' to its destination
**
*/
export function luggageEnRoute(id: string): void {
  let bag: LuggageItem = <LuggageItem>luggageRecords.get(id)
  bag.enRoute()
  luggageRecords.set(id, bag)
}

/**
*  Update the luggage to signify it is ready for collection.
*  _id = id of the luggage item
*  _collectionPoint = the name of the gate or carousel where the luggage can
*                     be collected eg "Gate 4", or "Carousel B"
*  Since the "get" returns a nullable type, we need to cast <LuggageItem> when
*  doing the get
*/
export function readyForCollection(id: string, collectionPoint: string): void {
  let bag: LuggageItem = <LuggageItem>luggageRecords.get(id)
  bag.readyForCollection(collectionPoint)
  luggageRecords.set(id, bag)
}


/**
*  Collect Luggage.  This is where the owner of the luggage cab collect the luggage item.
*  The owner would log into their Near Walletscan via the Luggage Tracker app.  If the account id
*  that was used to check in the luggage matches this account used to collect the luggage, then it will
*  succeed.  Otherwise it will reject.
*/
export function collectLuggage(id: string): void {
  let bag: LuggageItem = <LuggageItem>luggageRecords.get(id)
  bag.collectLuggage()
  luggageRecords.set(id, bag)
}


/**
*  Verify the account/wallet owner matches the one who initially checked in.
*/
export function verifyOwner(id: string): boolean {
  let result = false
  let bag: LuggageItem = <LuggageItem>luggageRecords.get(id)
  if(bag.verifyPassenger(context.sender) == true) {
    result = true
  }
  return result;
}



/**
*  Return all records as an array
*/
export function getAllLuggage(): LuggageItem[] {
  const items = luggageRecords.values();
  return items;
}

/**
*  Returns a count of the total luggage items
*/
export function totalBags(): i32 {
  return luggageRecords.length;
}

/**
*  Clears all records
*/
export function clear(): void {
  luggageRecords.clear();
}
