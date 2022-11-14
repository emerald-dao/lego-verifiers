import publicConfig from "../publicConfig"
import * as fcl from "@onflow/fcl"

const EmeraldBotVerifiersPath = "0xEmeraldBotVerifiers"
const NFTCatalogPath = "0xNFTCatalog"

export const getNFTCatalog = async () => {
  const code = `
  import NFTCatalog from 0xNFTCatalog

  pub fun main(): {String : NFTCatalog.NFTCatalogMetadata} {
      return NFTCatalog.getCatalog()
  }
  `
  .replace(NFTCatalogPath, publicConfig.nftCatalogAddress)

  const catalog = await fcl.query({
    cadence: code
  }) 

  return catalog
}

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
  .replace(EmeraldBotVerifiersPath, publicConfig.emeraldBotVerifiersAddress)

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
  .replace(EmeraldBotVerifiersPath, publicConfig.emeraldBotVerifiersAddress)

  const verifiers = await fcl.query({
    cadence: code,
    args: (arg, t) => [
      arg(address, t.Address)
    ]
  }) 

  return verifiers
}