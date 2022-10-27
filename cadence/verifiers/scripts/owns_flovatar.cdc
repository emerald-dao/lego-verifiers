if let collection = getAccount(user).getCapability(Flovatar.CollectionPublicPath).borrow<&{Flovatar.CollectionPublic}>() {
  if collection.getIDs().length >= 1 {
    SUCCESS
  }
}