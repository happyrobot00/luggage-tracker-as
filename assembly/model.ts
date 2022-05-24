import { context, u128, base64, math, PersistentSet, PersistentVector, PersistentUnorderedMap } from "near-sdk-as";

/**
 * Exporting a new class LuggageItem.
 */
@nearBindgen
export class LuggageItem {
  id:                 string;     /* Reference Id of the luggage tag to identify the luggage item */
  flightno:           string;     /* Flight number */
  origin:             string;     /* Origin airport code.  EG:  LAX, JFK */
  destination:        string;     /* Final destination airport code.  EG:  LAX, JFK */
  ownerAccountId:     string;     /* NEAR wallet/account id of the passenger/owner of the luggage */
  checkInTime:        u64;        /* Timestamp of initial check in */
  checkOutTime:       u64;        /* Timestamp when bag collected and verified */
  status:             string;     /* status of luggage (ie.  en-route, checked-in etc) */
  collectionPoint:    string;     /* Gate number, carousel number - where you collect your bags */

  constructor() {}

  /* Checks in the luggage. */
  public checkIn(_id: string, _flightNo: string, _origin: string, _destination: string): void {
    this.checkInTime = context.blockTimestamp;
    this.id = _id;
    this.flightno = _flightNo;
    this.origin = _origin;
    this.destination = _destination;
    this.ownerAccountId = context.sender;
    this.status = "checked-in"
  }

  /* checks if the NEAR account id who checked in the luggage matches */
  public verifyPassenger(_sender: string): boolean {
    var isValid: boolean = false;
    if(this.ownerAccountId == _sender) {
      isValid = true;
    }
    return isValid;
  }

  /* updates the luggage status to 'en-route'.  Means the luggage is aboard the plane
     and is en-route to the destinatiuon */
  public enRoute(): void {
    this.status = "en-route"
  }

  /* updates the luggage status. Ready for collection, and adds the gate or carousel number */
  public readyForCollection(_collectionPoint: string): void {
    this.collectionPoint = _collectionPoint
    this.status = "ready"
  }

  /* updated the luggage status to collected */
  public collectLuggage(): void {
    this.checkOutTime = context.blockTimestamp;
    this.status = "collected"
  }

}


/*
* Generate a 24 character long random string.  No longer used in this example
* but kept here as an example.
*/
function generateRandomString(): string {
  let buf = math.randomBuffer(24);
  let b64 = base64.encode(buf);
  return b64;
}


/**
 * luggageRecords - uses a PersistentSet
 */
export const luggageRecords = new PersistentUnorderedMap<string, LuggageItem>("m");
