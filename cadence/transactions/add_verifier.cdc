import EmeraldBotVerifiers from "../contracts/EmeraldBotVerifiers"

transaction(
    name: String,
    description: String,
    image: String,
    scriptCode: String,
    guildId: String,
    roleIds: [String],
    rawVerificationMode: UInt8
) {
    let verifierCollection: &EmeraldBotVerifiers.VerifierCollection

    prepare(signer: AuthAccount) {
        if signer.borrow<&EmeraldBotVerifiers.VerifierCollection>(from: EmeraldBotVerifiers.VerifierCollectionStoragePath) == nil {
            signer.save(<- EmeraldBotVerifiers.createEmptyCollection(), to: EmeraldBotVerifiers.VerifierCollectionStoragePath)
            let cap = signer.link<&EmeraldBotVerifiers.VerifierCollection>(
                EmeraldBotVerifiers.VerifierCollectionPublicPath, 
                target: EmeraldBotVerifiers.VerifierCollectionStoragePath
            ) ?? panic("Could not link VerifierCollection to PublicPath")
        }

        self.verifierCollection = signer.borrow<&EmeraldBotVerifiers.VerifierCollection>(from: EmeraldBotVerifiers.VerifierCollectionStoragePath)
            ?? panic("Could not borrow VerifierCollection from signer")
    }

    execute {
        let verificationMode = EmeraldBotVerifiers.VerificationMode(rawValue: rawVerificationMode) 
            ?? panic("Invalid verification mode")

        self.verifierCollection.addVerifier(
            name: name,
            description: description,
            image: image,
            scriptCode: scriptCode,
            guildId: guildId,
            roleIds: roleIds,
            verificationMode: verificationMode,
            extra: {}
        )
    }
}