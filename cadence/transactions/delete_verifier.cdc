import EmeraldBotVerifiers from "../contracts/EmeraldBotVerifiers"

transaction(verifierId: UInt64) {
    let verifierCollection: &EmeraldBotVerifiers.VerifierCollection

    prepare(signer: AuthAccount) {
        self.verifierCollection = signer.borrow<&EmeraldBotVerifiers.VerifierCollection>(from: EmeraldBotVerifiers.VerifierCollectionStoragePath)
            ?? panic("Could not borrow VerifierCollection from signer")
    }

    execute {
        self.verifierCollection.deleteVerifier(verifierId: verifierId)
    }
}