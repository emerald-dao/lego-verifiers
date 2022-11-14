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

export const catalogTemplate =  {
  isPreset: false,
  name: "Owns X NFTs",
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
    cadence: "owns_float.cdc",
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
    name: "Owns X Flovatars",
    description: "Checks to see if a user owns AMOUNT Flovatars",
    logo: "/flovatar.jpeg",
    cadence: "owns_x_flovatars.cdc",
    parameters: [
      paramsAmount
    ],
    imports: {
      testnet: [],
      mainnet: ["import Flovatar from 0x921ea449dffec68a"]
    },
    script: `
    if let collection = getAccount(user).getCapability(Flovatar.CollectionPublicPath).borrow<&{Flovatar.CollectionPublic}>() {
      let amount: Int = AMOUNT
      if collection.getIDs().length >= amount {
        SUCCESS
      }
    }`
  },
  {
    isPreset: true,
    name: "Owns Flovatar",
    description: "Checks to see if a user owns at least 1 Flovatar",
    logo: "/flovatar.jpeg",
    cadence: "owns_flovatar.cdc",
    parameters: [],
    validateParameters: () => {
      return true
    },
    imports: {
      testnet: [],
      mainnet: ["import Flovatar from 0x921ea449dffec68a"]
    },
    script: `
    if let collection = getAccount(user).getCapability(Flovatar.CollectionPublicPath).borrow<&{Flovatar.CollectionPublic}>() {
      if collection.getIDs().length >= 1 {
        SUCCESS
      }
    }`
  }
]