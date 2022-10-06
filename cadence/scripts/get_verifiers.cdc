import EmeraldBotVerifiers from "../contracts/EmeraldBotVerifiers.cdc"

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