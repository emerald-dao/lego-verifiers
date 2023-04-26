import TopShot from 0x0b2a3299cc857e29

pub fun main(user: Address, setName: String, seriesId: UInt32): Bool {
  let infos: [Info] = []
  var ret: Bool = false
  if let collection = getAccount(user).getCapability(/public/MomentCollection).borrow<&{TopShot.MomentCollectionPublic}>() {
    var answer: Int = 0
    var coveredPlays: [UInt32] = []
    let setIDs: [UInt32] = TopShot.getSetIDsByName(setName: setName)!
    var setID: UInt32? = nil
    for setId in setIDs {
      if TopShot.getSetSeries(setID: setId)! == seriesId {
        setID = setId
        break
      }
    }
    for id in collection.getIDs() {
      let moment = collection.borrowMoment(id: id)!
      if moment.data.setID == setID {
        answer = answer + 1
        if !coveredPlays.contains(moment.data.playID) {
          coveredPlays.append(moment.data.playID)
        }
      }
    }
    if answer >= 1 {
      ret = true
    }
  }
  return ret
}

pub struct Info {
  pub let season: UInt64
  pub let name: String

  init(_ season: UInt64, _ name: String) {
    self.season = season
    self.name = name
  }
}
