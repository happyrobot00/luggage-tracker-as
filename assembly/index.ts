import { storage, Context } from "near-sdk-core"
import { context } from "near-sdk-as"
import { LuggageItem, luggageRecords } from "./model";
import { PersistentVector } from "near-sdk-as";


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
  if(idExists(id) == true) {
    message = "id-already-exists"
  } else {
    const timestamp: u64 = context.blockTimestamp;
    const luggage = new LuggageItem();
    luggage.checkIn(id, flightno, origin, destination)
    luggageRecords.add(luggage);
    message = "ok"
  }
  return message;
}


/**
*  Get the luggage item record, using the reference id of the passenger.
*  We get the PersistentSet and return the array of records as a vector.
*  We loop through each, checking to see if the record item matches our id.
*
*/
export function getLuggageItem(id: string): LuggageItem {
  const items = luggageRecords.values();
  var result: LuggageItem;
  for(let i = 0; i < items.length; i++) {
    if(items[i].id == id) {
      result = items[i];
    }
  }
  return result;
}

/**
*  Check if the luggage 'id' exists.
*/
export function idExists(id: string): boolean {
  const items = luggageRecords.values();
  var result: boolean = false;
  for(let i = 0; i < items.length; i++) {
    if(items[i].id == id) {
      result = true;
    }
  }
  return result;
}

/**
*  Remove/delete a luggageItem record from the PersistentSet.
*/
export function removeLuggageItem(id: string): void {
  const luggageItem = getLuggageItem(id);
  luggageRecords.delete(luggageItem);
}


/**
*  Update the luggage to "en-route".  This signifies that the luggage has been
*  loaded on the aircraft and is 'en-route' to its destination
*
*  This method updates the record in the PersistentSet by finding the correct record and
*  assigning it to a variable.  Then delete the original.  Update the found record, then
*  add it back to the PersistentSet
*
*/
export function luggageEnRoute(id: string): void {
  const luggageItem = getLuggageItem(id);
  luggageRecords.delete(luggageItem);
  luggageItem.enRoute()
  luggageRecords.add(luggageItem);
}

/**
*  Update the luggage to signify it is ready for collection.
*  _id = id of the luggage item
*  _collectionPoint = the name of the gate or carousel where the luggage can
*                     be collected eg "Gate 4", or "Carousel B"
*
*/
export function readyForCollection(id: string, collectionPoint: string): void {
  const luggageItem = getLuggageItem(id);
  luggageRecords.delete(luggageItem);
  luggageItem.readyForCollection(collectionPoint)
  luggageRecords.add(luggageItem);
}



/**
*  Collect Luggage.  This is where the owner of the luggage cab collect the luggage item.
*  The owner would log into their Near Walletscan via the Luggage Tracker app.  If the account id
*  that was used to check in the luggage matches this account used to collect the luggage, then it will
*  succeed.  Otherwise it will reject.
*/
export function collectLuggage(id: string): string {
  const luggageItem = getLuggageItem(id);
  var isValidOwner = luggageItem.verifyPassenger(context.sender);
  var message: string;
  if(isValidOwner == true) {
    luggageRecords.delete(luggageItem);
    luggageItem.collectLuggage()
    luggageRecords.add(luggageItem);
    message = "collected"
  } else {
    message = "invalid-user"
  }
  return message;
}


/**
*  Verify the .
*/
export function verifyOwner(id: string): boolean {
  const luggageItem = getLuggageItem(id);
  var result = luggageItem.verifyPassenger(context.sender);
  return result;
}



export function updateStatus(id: string, status: string): void {
  const luggageItem = getLuggageItem(id);
  luggageRecords.delete(luggageItem);
  luggageItem.status = status
  luggageRecords.add(luggageItem);
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
  return luggageRecords.size;
}

/**
*  Clears all records
*/
export function clear(): void {
  luggageRecords.clear();
}
