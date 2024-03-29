import { paramsAmount, paramsEvent, paramsNFLAllDayTier, paramsSetID, paramsUFCStrikeTier, paramsSeason, paramsPlayID, paramsSetName, paramsSeriesId } from "./verifier_params"

export const catalogTemplate = {
  isPreset: false,
  name: "Owns _ NFT(s)",
  description: "Create customize verifiers for NFTs in NFT Catalog",
  logo: "/nft-catalog.png",
  parameters: [
    paramsAmount
  ],
  imports: {
    testnet: [],
    mainnet: []
  },
  script: ``,
  nft: null
}

export const presetVerifiersList = [
  {
    name: "Owns FLOAT",
    description: "Checks to see if a user owns a FLOAT from a specific event.",
    logo: "/float.png",
    parameters: [
      paramsEvent
    ],
    imports: {
      testnet: ["import FLOAT from 0x0afe396ebc8eee65"],
      mainnet: ["import FLOAT from 0x2d4c3caffbeab845"]
    },
    script: `
    if let collection = getAccount(user).getCapability(FLOAT.FLOATCollectionPublicPath).borrow<&FLOAT.Collection{FLOAT.CollectionPublic}>() {
      let eventId: UInt64 = EVENT_ID
      let ids = collection.ownedIdsFromEvent(eventId: eventId)
      if ids.length > 0 {
        SUCCESS
      }
    }`
  },
  {
    name: "Has Emerald ID",
    description: "Checks to see if the user has an Emerald ID set up.",
    logo: "/emerald-id.png",
    parameters: [],
    imports: {
      testnet: [],
      mainnet: []
    },
    script: `
    if EmeraldIdentity.getEmeraldIDs(discordID: discordId).keys.length > 0 {
      SUCCESS
    }
    `
  },
  {
    name: "Owns _ NFL All Day with Tier",
    description: "Checks to see if a user owns a specific number of moments that have a certain tier.",
    logo: "/nfl-all-day.jpg",
    parameters: [
      paramsAmount,
      paramsNFLAllDayTier
    ],
    imports: {
      testnet: ["import AllDay from 0x4dfd62c88d1b6462"],
      mainnet: ["import AllDay from 0xe4cf4bdc1751c65d"]
    },
    script: `
    if let collection = getAccount(user).getCapability(AllDay.CollectionPublicPath).borrow<&AllDay.Collection{AllDay.MomentNFTCollectionPublic}>() {
      let count: {String: Int} = {"common": 0, "rare": 0, "legendary": 0, "ultimate": 0}

      for id in collection.getIDs() {
        let moment = collection.borrowMomentNFT(id: id)!
        let editionData = AllDay.getEditionData(id: moment.editionID)
        count[editionData.tier.toLower()] = (count[editionData.tier.toLower()] ?? 0) + 1
      }

      if count["TIER"]! >= AMOUNT {
        SUCCESS
      }
    }`
  },
  {
    name: "Owns NFL All Day Set",
    description: "Checks to see if a user owns a whole set from a certain series.",
    logo: "/nfl-all-day.jpg",
    parameters: [
      paramsSetName,
      paramsSeriesId
    ],
    imports: {
      testnet: ["import AllDay from 0x4dfd62c88d1b6462"],
      mainnet: ["import AllDay from 0xe4cf4bdc1751c65d"]
    },
    script: `
    let setData: AllDay.SetData = AllDay.getSetDataByName(name: "SET_NAME")
    let setPlaysInEditions: [UInt64] = setData.setPlaysInEditions.keys
    let neededLength = setPlaysInEditions.length
    let editionIds: [UInt64] = []
    
    if let collection = getAccount(user).getCapability(AllDay.CollectionPublicPath).borrow<&{AllDay.MomentNFTCollectionPublic}>() {
      let ids = collection.getIDs()
      for id in ids {
        let moment = collection.borrowMomentNFT(id: id)!
        let editionID = moment.editionID
        let edition: AllDay.EditionData = AllDay.getEditionData(id: editionID)
        if edition.seriesID != SERIES_ID {
          continue
        }
        if setPlaysInEditions.contains(editionID) && !editionIds.contains(editionID) {
          editionIds.append(editionID)
        }
      }
    }

    if editionIds.length == neededLength {
      SUCCESS
    }`
  },
  {
    name: "Owns _ Specific NFL All Day Moment(s)",
    description: "Checks to see if a user owns a certain number of a specific NFL All Day moment.",
    logo: "/nfl-all-day.jpg",
    parameters: [
      paramsPlayID,
      paramsAmount
    ],
    imports: {
      testnet: ["import AllDay from 0x4dfd62c88d1b6462"],
      mainnet: ["import AllDay from 0xe4cf4bdc1751c65d"]
    },
    script: `
    if let collection = getAccount(user).getCapability(AllDay.CollectionPublicPath).borrow<&{AllDay.MomentNFTCollectionPublic}>() {
      let ids = collection.getIDs()
      var total: Int = 0
      for id in ids {
        let moment = collection.borrowMomentNFT(id: id)!
        if moment.editionID == PLAY_ID {
          total = total + 1
        }
      }
      if total >= AMOUNT {
        SUCCESS
      }
    }`
  },
  {
    name: "Owns _ Specific UFC Strike Moment(s)",
    description: "Checks to see if a user owns a certain number of a specific UFC Strike moment.",
    logo: "/ufc-strike.jpg",
    parameters: [
      paramsAmount,
      paramsSetID
    ],
    imports: {
      testnet: ["import UFC_NFT from 0x04625c28593d9408"],
      mainnet: ["import UFC_NFT from 0x329feb3ab062d289"]
    },
    script: `
    if let collection = getAccount(user).getCapability(UFC_NFT.CollectionPublicPath).borrow<&UFC_NFT.Collection{UFC_NFT.UFC_NFTCollectionPublic}>() {
      var count: Int = 0
      for id in collection.getIDs() {
        let moment = collection.borrowUFC_NFT(id: id)!
        let setId: UInt32 = moment.setId
        if setId == SET_ID {
          count = count + 1
        }
      }
      if count >= AMOUNT {
        SUCCESS
      }
    }`
  },
  {
    name: "Owns _ UFC Strike with Tier",
    description: "Checks to see if a user owns a specific number of UFC Strike moments that have a certain tier.",
    logo: "/ufc-strike.jpg",
    parameters: [
      paramsAmount,
      paramsUFCStrikeTier
    ],
    imports: {
      testnet: ["import UFC_NFT from 0x04625c28593d9408"],
      mainnet: ["import UFC_NFT from 0x329feb3ab062d289"]
    },
    script: `
    if let collection = getAccount(user).getCapability(UFC_NFT.CollectionPublicPath).borrow<&UFC_NFT.Collection{UFC_NFT.UFC_NFTCollectionPublic}>() {
      var count: Int = 0

      for id in collection.getIDs() {
        let moment = collection.borrowUFC_NFT(id: id)!
        let setId: UInt32 = moment.setId
        let metadata = UFC_NFT.getSetMetadata(setId: setId)!
        if (metadata["TIER"]?.toLower() == "TIER_INPUT") {
          count = count + 1
        }
      }

      if count >= AMOUNT {
        SUCCESS
      }
    }`
  },
  {
    name: "Owns _ Specific TopShot Moment(s)",
    description: "Checks to see if a user owns a certain number of a specific TopShot moment.",
    logo: "/topshot.png",
    parameters: [
      paramsPlayID,
      paramsAmount
    ],
    imports: {
      testnet: ["import TopShot from 0x877931736ee77cff"],
      mainnet: ["import TopShot from 0x0b2a3299cc857e29"]
    },
    script: `
    if let collection = getAccount(user).getCapability(/public/MomentCollection).borrow<&{TopShot.MomentCollectionPublic}>() {
      let ids = collection.getIDs()
      var total: Int = 0
      for id in ids {
        let moment = collection.borrowMoment(id: id)!
        if moment.data.playID == PLAY_ID {
          total = total + 1
        }
      }
      if total >= AMOUNT {
        SUCCESS
      }
    }`
  },
  {
    name: "Owns _ TopShot(s) from Set",
    description: "Checks to see if a user owns a specific number of moments that have a certain Set ID.",
    logo: "/topshot.png",
    parameters: [
      paramsAmount,
      paramsSetName,
      paramsSeriesId
    ],
    imports: {
      testnet: ["import TopShot from 0x877931736ee77cff"],
      mainnet: ["import TopShot from 0x0b2a3299cc857e29"]
    },
    script: `
    if let collection = getAccount(user).getCapability(/public/MomentCollection).borrow<&{TopShot.MomentCollectionPublic}>() {
      var answer: Int = 0
      var coveredPlays: [UInt32] = []
      
      let setIDs: [UInt32] = TopShot.getSetIDsByName(setName: "SET_NAME")!
      var setID: UInt32? = nil
      for setId in setIDs {
        if TopShot.getSetSeries(setID: setId)! == SERIES_ID {
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
      if answer >= AMOUNT {
        SUCCESS
      }
    }`
  },
  {
    name: "Owns TopShot Set",
    description: "Checks to see if a user owns all the moments of a certain Set.",
    logo: "/topshot.png",
    parameters: [
      paramsSetName,
      paramsSeriesId
    ],
    imports: {
      testnet: ["import TopShot from 0x877931736ee77cff"],
      mainnet: ["import TopShot from 0x0b2a3299cc857e29"]
    },
    script: `
    if let collection = getAccount(user).getCapability(/public/MomentCollection).borrow<&{TopShot.MomentCollectionPublic}>() {
      var coveredPlays: [UInt32] = []
      
      let setIDs: [UInt32] = TopShot.getSetIDsByName(setName: "SET_NAME")!
      var setID: UInt32? = nil
      for setId in setIDs {
        if TopShot.getSetSeries(setID: setId)! == SERIES_ID {
          setID = setId
          break
        }
      }

      let numOfPlaysInSet = TopShot.getPlaysInSet(setID: setID!)!.length
      for id in collection.getIDs() {
        let moment = collection.borrowMoment(id: id)!
        if moment.data.setID == setID {
          if !coveredPlays.contains(moment.data.playID) {
            coveredPlays.append(moment.data.playID)
          }
        }
      }
      if coveredPlays.length >= numOfPlaysInSet {
        SUCCESS
      }
    }`
  },
  {
    name: "Owns Party Favorz with specific Season",
    description: "Checks to see if a user owns a Party Favorz with a specific season.",
    logo: "/party-favorz.png",
    parameters: [
      paramsSeason
    ],
    imports: {
      testnet: [],
      mainnet: ["import PartyFavorz from 0x123cb666996b8432", "import MetadataViews from 0x1d7e57aa55817448"]
    },
    script: `
    if let collection = getAccount(user).getCapability(PartyFavorz.CollectionPublicPath).borrow<&{MetadataViews.ResolverCollection}>() {
      let seasonNum: UInt64 = SEASON
      var found: Bool = false
      for id in collection.getIDs() {
        let resolver = collection.borrowViewResolver(id: id)
        let view = resolver.resolveView(Type<MetadataViews.Traits>())! as! MetadataViews.Traits
        for trait in view.traits {
          if trait.name == "Season" && (trait.value as? UInt64) == seasonNum {
            found = true
            break
          }
        }
        if found == true {
          SUCCESS
          break
        }
      }
    }`
  },
  {
    name: "Owns Party Favorz Set from specific Season",
    description: "Checks to see if a user owns a Party Favorz set from a specific season.",
    logo: "/party-favorz.png",
    parameters: [
      paramsSeason
    ],
    imports: {
      testnet: [],
      mainnet: ["import PartyFavorz from 0x123cb666996b8432", "import MetadataViews from 0x1d7e57aa55817448"]
    },
    script: `
    if let collection = getAccount(user).getCapability(PartyFavorz.CollectionPublicPath).borrow<&{MetadataViews.ResolverCollection}>() {
      let seasonNum: UInt64 = SEASON
      var found: {String: Bool} = {}
      for id in collection.getIDs() {
        let resolver = collection.borrowViewResolver(id: id)
        let traitsView = resolver.resolveView(Type<MetadataViews.Traits>())! as! MetadataViews.Traits
        let displayView = resolver.resolveView(Type<MetadataViews.Display>())! as! MetadataViews.Display
        for trait in traitsView.traits {
          if trait.name == "Season" && (trait.value as? UInt64) == seasonNum {
            found[displayView.name] = true
          }
        }
        if found.keys.length >= 3 {
          SUCCESS
          break
        }
      }
    }`
  },
  {
    name: "Owns Doodles Beta Pass",
    description: "Checks to see if a user owns at least a certain number of Doodles Beta Passes.",
    logo: "/betapass.png",
    parameters: [
      paramsAmount
    ],
    imports: {
      testnet: [],
      mainnet: ["import Wearables from 0xe81193c424cfd3fb", "import MetadataViews from 0x1d7e57aa55817448"]
    },
    script: `
    if let collection = getAccount(user).getCapability(Wearables.CollectionPublicPath).borrow<&Wearables.Collection{MetadataViews.ResolverCollection}>() {
      var answer: Int = 0
      for id in collection.getIDs() {
        let resolver = collection.borrowViewResolver(id: id)
        let display = resolver.resolveView(Type<MetadataViews.Display>())! as! MetadataViews.Display
        if display.name == "beta pass" {
          answer = answer + 1
        }
      }
      if answer >= AMOUNT {
        SUCCESS
      }
    }`
  },
  {
    name: "Owns Doodles Wearables",
    description: "Checks to see if a user owns at least a certain number of Doodles Wearables.",
    logo: "/navysweater.png",
    parameters: [
      paramsAmount
    ],
    imports: {
      testnet: [],
      mainnet: ["import Wearables from 0xe81193c424cfd3fb", "import NonFungibleToken from 0x1d7e57aa55817448"]
    },
    script: `
    if let collection = getAccount(user).getCapability(Wearables.CollectionPublicPath).borrow<&Wearables.Collection{NonFungibleToken.CollectionPublic}>() {
      if collection.getIDs().length >= AMOUNT {
        SUCCESS
      }
    }`
  },
  {
    name: "Owns .find Name",
    description: "Checks to see if a user owns a .find name.",
    logo: "/find-logo.jpg",
    parameters: [],
    imports: {
      testnet: [],
      mainnet: ["import FIND from 0x097bafa4e0b48eef"]
    },
    script: `
    if FIND.reverseLookup(user) != nil {
      SUCCESS
    }`
  }
].map((v) => {
  v.isPreset = true
  return v
})