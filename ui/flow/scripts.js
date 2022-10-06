import publicConfig from "../publicConfig"
import * as fcl from "@onflow/fcl"

const EmeraldBotVerifiersPath = "0xEmeraldBotVerifiers"

export const getVerifiers = async (address) => {
  const code = `
  import EmeraldBotVerifiers from 0xEmeraldBotVerifiers

  pub fun main(address: Address): {UInt64: &EmeraldBotVerifiers.Verifier} {
      let verifierCollection =
          getAccount(address)
          .getCapability(EmeraldBotVerifiers.VerifierCollectionPublicPath)
          .borrow<&EmeraldBotVerifiers.VerifierCollection>()
          ?? panic("Could not borrow VerifierCollection from address")
  
      let res: {UInt64: &EmeraldBotVerifiers.Verifier} = {} 
      let verifierIds = verifierCollection.getVerifierIds()
      for id in verifierIds {
          if let verifier = verifierCollection.getVerifierInfo(verifierId: id) {
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