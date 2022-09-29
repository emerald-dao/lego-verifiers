 pub contract EmeraldBotVerifiers {

  pub resource Verifier {
    pub let name: String
    pub let description: String
    pub let image: String
    pub let scriptCode: String
    pub let extra: {String: AnyStruct}

    pub fun getRoleIds(): [String] {
      return self.roleIdToVerifier.keys
    }

    init(
      name: String, 
      description: String, 
      image: String, 
      scriptCode: String, 
      extra: {String: AnyStruct}
    ) {
      self.name = name
      self.description = description
      self.image = image
      self.scriptCode = scriptCode
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
      extra: {String: AnyStruct}
    ) {
      let verifier <- create Verifier(
        name: name, 
        description: description, 
        image: image, 
        scriptCode: scriptCode, 
        extra: extra
      )
      self.verifiers[verifier.uuid] <-! verifier
    }

    pub fun deleteVerifier(verifierId: UInt64) {
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
}
 