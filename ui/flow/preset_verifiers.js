import Decimal from "decimal.js"

const paramsAmount = {
  names: {placeholder: "AMOUNT", display: "Amount"},
  value: null,
  regex: /^(0|[1-9]\d*)$/,
  isValid: false,
  validate: (value) => {
    try {
      const v = new Decimal(value)
      return v.isInteger() && v.isPositive() && !v.isZero()
    } catch (e) {
      return false
    }
  }
}

const paramsEvent = {
  names: {placeholder: "EVENT_ID", display: "Event ID"},
  value: null,
  regex: /^(0|[1-9]\d*)$/,
  isValid: false,
  validate: (value) => {
    try {
      const v = new Decimal(value)
      return v.isInteger() && v.isPositive() && !v.isZero()
    } catch (e) {
      return false
    }
  }
}

const paramsNFLAllDayRarity = {
  names: {placeholder: "RARITY", display: "Rarity"},
  value: null,
  regex: null,
  isValid: false,
  validate: (value) => {
    try {
      return value == "COMMON" || value == "RARE" || value == "LEGENDARY" || value == "ULTIMATE"
    } catch (e) {
      return false
    }
  }
}

export const catalogTemplate =  {
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
    isPreset: true,
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
    isPreset: true,
    name: "Owns _ NFL All Day with Rarity",
    description: "Checks to see if a user owns a specific number of moments that have a certain rarity.",
    logo: "/nfl-all-day.jpg",
    parameters: [
      paramsAmount,
      paramsNFLAllDayRarity
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

      if count["RARITY"]! >= AMOUNT {
        SUCCESS
      }
    }`
  }
]