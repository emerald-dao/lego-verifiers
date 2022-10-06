pub contract EmeraldBotVerifiers {

    pub let VerifiersCollectionStoragePath: StoragePath
    pub let VerifiersCollectionPublicPath: PublicPath
    pub let VerifiersCollectionPrivatePath: PrivatePath

    pub event ContractInitialized()

    pub event VerifierCreated(verifierId: UInt64, name: String, mode: UInt8, roleIds: [String])
    pub event VerifierDeleted(verifierId: UInt64)

    pub enum VerificationMode: UInt8 {
        pub case Normal
        pub case ShortCircuit
    }

    pub resource Verifier {
        pub let name: String
        pub let description: String
        pub let image: String
        pub let scriptCode: String
        pub let roleIds: [String]
        pub let verificationMode: VerificationMode
        pub let extra: {String: AnyStruct}

        init(
            name: String, 
            description: String, 
            image: String, 
            scriptCode: String, 
            roleIds: [String],
            verificationMode: VerificationMode,
            extra: {String: AnyStruct}
        ) {
            self.name = name
            self.description = description
            self.image = image
            self.scriptCode = scriptCode
            self.roleIds = roleIds
            self.verificationMode = verificationMode
            self.extra = extra
        }
    }

    pub resource interface VerifierCollectionPublic {
        pub fun getVerifiers(): [UInt64]
        pub fun getVerifierInfo(verifierId: UInt64): &Verifier?
    }

    pub resource VerifierCollection: VerifierCollectionPublic {
        pub let verifiers: @{UInt64: Verifier}

        pub fun addVerifier(
            name: String, 
            description: String, 
            image: String,
            scriptCode: String,
            roleIds: [String],
            verificationMode: VerificationMode,
            extra: {String: AnyStruct}
        ) {

            let verifier <- create Verifier(
                name: name, 
                description: description, 
                image: image, 
                scriptCode: scriptCode, 
                roleIds: roleIds,
                verificationMode: verificationMode,
                extra: extra
            )
            emit VerifierCreated(verifierId: verifier.uuid, name: name, mode: verificationMode.rawValue, roleIds: roleIds)
            self.verifiers[verifier.uuid] <-! verifier
        }

        pub fun deleteVerifier(verifierId: UInt64) {
            emit VerifierDeleted(verifierId: verifierId)
            destroy self.verifiers.remove(key: verifierId)
        }

        pub fun getVerifiers(): [UInt64] {
            return self.verifiers.keys
        }

        pub fun getVerifierInfo(verifierId: UInt64): &Verifier? {
            return &self.verifiers[verifierId] as &Verifier?
        }

        init() {
            self.verifiers <- {}
        }

        destroy() {
            destroy self.verifiers
        }
    }

    init() {
        self.VerifiersCollectionStoragePath = /storage/emeraldBotVerifiersCollection
        self.VerifiersCollectionPublicPath = /public/emeraldBotVerifiersCollection
        self.VerifiersCollectionPrivatePath = /private/emeraldBotVerifiersCollection

        emit ContractInitialized()
    }
}
 