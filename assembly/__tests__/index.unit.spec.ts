import { LuggageItem, luggageRecords } from "../model";
import { checkInLuggageItem, getLuggageItem, removeLuggageItem,
         luggageEnRoute, readyForCollection, collectLuggage } from "../index";


let contract: LuggageItem

beforeEach(() => {
  contract = new LuggageItem()
})

describe("LuggageItem", () => {


  /**
  *  Test that checking in a luggage item works by checking the size of the
  *  PersistentUnorderedMap
  */
  it("check in a luggage item", () => {
    checkInLuggageItem('jules_bag', "QF5555", "SYD", "FCO");
    expect(luggageRecords.length).toBe(
      1,
      'should only contain one luggage item'
    );
  })


  /**
  *  Test that, one, we can check in the bag, and then check that we can
  * retrieve that item.  We check this by verifying that the 'id' matches
  */
  it("retrieve the luggage item", () => {
    checkInLuggageItem('my_bag', "QF1234", "SYD", "FCO");
    const hasId  = luggageRecords.contains("my_bag")
    expect(hasId).toStrictEqual(true,
      "should return my_bag",
    );
  })

  /**
  *  Check that we can delete an item
  */
  it("delete luggage item", () => {
    checkInLuggageItem('my_bag', "EM9999", "SYD", "FCO");
    removeLuggageItem("my_bag")
    const bag = getLuggageItem("my_bag")
    expect(bag).toBeNull(
      "should NOT return my_bag",
    );
  })


  /**
  *  Test that we can't check in the same id twice or more
  */
  it("test that the same luggage item id cannot be added twice", () => {
    checkInLuggageItem('j_bag', "XY1234", "SYD", "FCO");
    checkInLuggageItem('j_bag', "XY1234", "SYD", "FCO");
    expect(luggageRecords.length).toBe(
      1,
      'should only contain one luggage item'
    );
  })

  /**
  *  Test that we can successfully update an item
  */
  it("set luggage item to status - en-route", () => {
    checkInLuggageItem('my_bag', "EM9999", "SYD", "FCO");
    luggageEnRoute('my_bag')
    const bag = <LuggageItem>luggageRecords.get("my_bag")
    expect(bag.status).toStrictEqual("en-route",
      "status should be 'en-route'",
    );
  })

  /**
  *  Test that we can successfully update an item
  */
  it("set luggage item to status - ready for collection", () => {
    checkInLuggageItem('my_bag', "EM9999", "SYD", "FCO");
    readyForCollection('my_bag', 'Carousel 8')
    const bag = <LuggageItem>luggageRecords.get("my_bag")
    expect(bag.collectionPoint).toStrictEqual("Carousel 8",
      "collection point should be 'Carousel 8'",
    );
  })

  /**
  *  Test that we can successfully update an item
  */
  it("set luggage item to status - collected", () => {
    checkInLuggageItem('my_bag', "EM9999", "SYD", "FCO");
    collectLuggage('my_bag')
    const bag = <LuggageItem>luggageRecords.get("my_bag")
    expect(bag.status).toStrictEqual("collected",
      "status should be 'collected'",
    );
  })


})
