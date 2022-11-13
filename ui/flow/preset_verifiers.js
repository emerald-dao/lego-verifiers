import Decimal from "decimal.js"

export const PresetVerifiersList = (network) => {
  if (network === "mainnet") {
    return mainnetPresetVerifiersList
  }
  return testnetPresetVerifiersList
}

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
  id: 0,
  name: "NFT Catalog",
  description: "Create customize verifiers for NFTs in NFT Catalog",
  logo: "/nft-catalog.png",
  parameters: [
    paramsAmount
  ],
  imports: [
  ],
  script: ``
}

export const testnetPresetVerifiersList = [
  {
    id: 0,
    name: "Owns FLOAT",
    description: "Checks to see if a user owns a FLOAT from a specific event.",
    logo: "/float.png",
    cadence: "owns_float.cdc",
    parameters: [
      paramsEvent
    ],
    imports: [
      "import FLOAT from 0x2d4c3caffbeab845"
    ],
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
    id: 1,
    name: "Owns X Flovatars",
    description: "Checks to see if a user owns AMOUNT Flovatars",
    logo: "/flovatar.jpeg",
    cadence: "owns_x_flovatars.cdc",
    parameters: [
      paramsAmount
    ],
    imports: [
      "import Flovatar from 0x921ea449dffec68a"
    ],
    script: `
    if let collection = getAccount(user).getCapability(Flovatar.CollectionPublicPath).borrow<&{Flovatar.CollectionPublic}>() {
      let amount: Int = AMOUNT
      if collection.getIDs().length >= amount {
        SUCCESS
      }
    }`
  },
  {
    id: 2,
    name: "Owns Flovatar",
    description: "Checks to see if a user owns at least 1 Flovatar",
    logo: "/flovatar.jpeg",
    cadence: "owns_flovatar.cdc",
    parameters: [],
    validateParameters: () => {
      return true
    },
    imports: [
      "import Flovatar from 0x921ea449dffec68a"
    ],
    script: `
    if let collection = getAccount(user).getCapability(Flovatar.CollectionPublicPath).borrow<&{Flovatar.CollectionPublic}>() {
      if collection.getIDs().length >= 1 {
        SUCCESS
      }
    }`
  }
]

export const mainnetPresetVerifiersList = testnetPresetVerifiersList