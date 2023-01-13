import * as fcl from "@onflow/fcl"

// --- Utils ---

const splitList = (list, chunkSize) => {
  const groups = []
  let currentGroup = []
  for (let i = 0; i < list.length; i++) {
      const collectionID = list[i]
      if (currentGroup.length >= chunkSize) {
        groups.push([...currentGroup])
        currentGroup = []
      }
      currentGroup.push(collectionID)
  }
  groups.push([...currentGroup])
  return groups
}

// --- NFT Catalog ---

export const bulkGetNftCatalog = async () => {
  const collectionIdentifiers = await getCollectionIdentifiers()
  const groups = splitList(collectionIdentifiers, 40)
  const promises = groups.map((group) => {
    return getNftCatalogByCollectionIDs(group)
  })

  const itemGroups = await Promise.all(promises)
  const items = itemGroups.reduce((acc, current) => {
    return Object.assign(acc, current)
  }, {}) 
  return items 
}

export const getNftCatalogByCollectionIDs = async (collectionIDs) => {
  const code = `
  import NFTCatalog from 0xNFTCatalog

  pub fun main(collectionIdentifiers: [String]): {String: NFTCatalog.NFTCatalogMetadata} {
    let res: {String: NFTCatalog.NFTCatalogMetadata} = {}
    for collectionID in collectionIdentifiers {
        if let catalog = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionID) {
          res[collectionID] = catalog
        }
    }
    return res
  }
  `

  const catalogs = await fcl.query({
    cadence: code,
    args: (arg, t) => [
      arg(collectionIDs, t.Array(t.String))
    ]
  }) 

  return catalogs  
}

const getCollectionIdentifiers = async () => {
  const typeData = await getCatalogTypeData()

  const collectionData = Object.values(typeData)
  const collectionIdentifiers = []
  for (let i = 0; i < collectionData.length; i++) {
    const data = collectionData[i]
    let collectionIDs = Object.keys(Object.assign({}, data))
    if (collectionIDs.length > 0) {
      collectionIdentifiers.push(collectionIDs[0])
    }
  }
  return collectionIdentifiers
}

const getCatalogTypeData = async () => {
  const code = `
  import NFTCatalog from 0xNFTCatalog

  pub fun main(): {String : {String : Bool}} {
    let catalog = NFTCatalog.getCatalogTypeData()
    return catalog
  }
  `

  const typeData = await fcl.query({
    cadence: code
  }) 

  return typeData 
}

// --- EmeraldBot ---

export const getVerifiersByGuildId = async (address, guildId) => {
  const code = `
  import EmeraldBotVerifiers from 0xEmeraldBotVerifiers

  pub fun main(address: Address, guildId: String): {UInt64: &EmeraldBotVerifiers.Verifier} {
      let verifierCollection =
          getAccount(address)
          .getCapability(EmeraldBotVerifiers.VerifierCollectionPublicPath)
          .borrow<&EmeraldBotVerifiers.VerifierCollection>()
          
      let res: {UInt64: &EmeraldBotVerifiers.Verifier} = {} 

      if verifierCollection == nil {
        return res
      }

      let verifiers = verifierCollection!.getVerifiersByGuildId(guildId: guildId)
      for rawVerifier in verifiers {
          if let verifier = rawVerifier {
              res[verifier.uuid] = verifier
          }
      }
  
      return res
  }
  `

  const verifiers = await fcl.query({
    cadence: code,
    args: (arg, t) => [
      arg(address, t.Address),
      arg(guildId, t.String)
    ]
  }) 

  return verifiers 
}

export const getVerifiers = async (address) => {
  const code = `
  import EmeraldBotVerifiers from 0xEmeraldBotVerifiers

  pub fun main(address: Address): {UInt64: &EmeraldBotVerifiers.Verifier} {
      let verifierCollection =
          getAccount(address)
          .getCapability(EmeraldBotVerifiers.VerifierCollectionPublicPath)
          .borrow<&EmeraldBotVerifiers.VerifierCollection>()
          
      let res: {UInt64: &EmeraldBotVerifiers.Verifier} = {} 

      if verifierCollection == nil {
        return res
      }

      let verifierIds = verifierCollection!.getVerifierIds()
      for id in verifierIds {
          if let verifier = verifierCollection!.getVerifier(verifierId: id) {
              res[id] = verifier
          }
      }
  
      return res
  }
  `

  const verifiers = await fcl.query({
    cadence: code,
    args: (arg, t) => [
      arg(address, t.Address)
    ]
  }) 

  return verifiers
}