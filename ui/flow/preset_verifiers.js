import { paramsAmount, paramsEvent, paramsNFLAllDayTier, paramsSetID, paramsUFCStrikeTier } from "./verifier_params"

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
    if let floatCollection = getAccount(user).getCapability(FLOAT.FLOATCollectionPublicPath).borrow<&FLOAT.Collection{FLOAT.CollectionPublic}>() {
      let eventId: UInt64 = EVENT_ID
      let ids = floatCollection.ownedIdsFromEvent(eventId: eventId)
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
    let emeraldIds = EmeraldIdentity.getEmeraldIDs(discordID: discordId)
    if emeraldIds.keys.length > 0 {
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
    if let allDayCollection = getAccount(user).getCapability(AllDay.CollectionPublicPath).borrow<&AllDay.Collection{AllDay.MomentNFTCollectionPublic}>() {
      let count: {String: Int} = {"COMMON": 0, "RARE": 0, "LEGENDARY": 0, "ULTIMATE": 0}

      for id in allDayCollection.getIDs() {
        let moment = allDayCollection.borrowMomentNFT(id: id)!
        let editionData = AllDay.getEditionData(id: moment.editionID)
        count[editionData.tier] = (count[editionData.tier] ?? 0) + 1
      }

      if count["TIER"]! >= AMOUNT {
        SUCCESS
      }
    }`
  },
  {
    name: "Owns _ UFC Strike with Tier",
    description: "Checks to see if a user owns a specific number of moments that have a certain tier.",
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
    if let ufcStrikeCollection = getAccount(user).getCapability(UFC_NFT.CollectionPublicPath).borrow<&UFC_NFT.Collection{UFC_NFT.UFC_NFTCollectionPublic}>() {
      let count: {String: Int} = {"CHAMPION": 0, "CONTENDER": 0, "CHALLENGER": 0, "FANDOM": 0}

      for id in ufcStrikeCollection.getIDs() {
        let moment = collection.borrowUFC_NFT(id: id)!
        let setId: UInt32 = moment.setId
        let metadata = UFC_NFT.getSetMetadata(setId: setId)!
        count[metadata["TIER"]?.toUpper()] = count[metadata["TIER"]?.toUpper()] + 1
      }

      if count["TIER"]! >= AMOUNT {
        SUCCESS
      }
    }`
  },
  {
    name: "Owns _ NBA TopShot Moments with Set ID",
    description: "Checks to see if a user owns a specific number of moments that have a certain Set ID.",
    logo: "/topshot.png",
    parameters: [
      paramsAmount,
      paramsSetID
    ],
    imports: {
      testnet: ["import TopShot from 0x877931736ee77cff"],
      mainnet: ["import TopShot from 0x0b2a3299cc857e29"]
    },
    script: `
    if let collection = getAccount(user).getCapability(/public/MomentCollection).borrow<&{TopShot.MomentCollectionPublic}>() {
      var answer: Int = 0
      var coveredPlays: [UInt32] = []
      let setID: UInt32 = SET_ID
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
  }
].map((v) => {
  v.isPreset = true
  return v
})