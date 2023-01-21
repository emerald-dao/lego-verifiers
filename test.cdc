import PartyFavorz from 0x123cb666996b8432
import MetadataViews from 0x1d7e57aa55817448

pub fun main(user: Address): [Info] {
  let infos: [Info] = []
  if let collection = getAccount(user).getCapability(PartyFavorz.CollectionPublicPath).borrow<&{MetadataViews.ResolverCollection}>() {
    var found: Bool = false
    for id in collection.getIDs() {
      let resolver = collection.borrowViewResolver(id: id)
      let displayView = resolver.resolveView(Type<MetadataViews.Display>())! as! MetadataViews.Display
      let traitsView = resolver.resolveView(Type<MetadataViews.Traits>())! as! MetadataViews.Traits
      for trait in traitsView.traits {
        if trait.name == "Season" {
          infos.append(Info(trait.value as! UInt64, displayView.name))
          break
        }
      }
    }
  }
  return infos
}

pub struct Info {
  pub let season: UInt64
  pub let name: String

  init(_ season: UInt64, _ name: String) {
    self.season = season
    self.name = name
  }
}