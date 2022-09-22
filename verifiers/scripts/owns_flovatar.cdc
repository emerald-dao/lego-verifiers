if let collection = getAccount(user).getCapability(Flovatar.CollectionPublicPath).borrow<&{Flovatar.CollectionPublic}>() {
  let amount: Int = AMOUNT
  if collection.getIDs().length >= amount {
    SUCCESS
  }
}