if let floatCollection = getAccount(user).getCapability(FLOAT.FLOATCollectionPublicPath).borrow<&FLOAT.Collection{FLOAT.CollectionPublic}>() {
  let eventId: UInt64 = EVENT_ID
  let ids = floatCollection.ownedIdsFromEvent(eventId: eventId)
  if ids.length > 0 {
    SUCCESS
  }
}