 pub contract EmeraldBotVerifiers {

  pub struct RoleVerifier {
    pub let codeId: String
    pub let params: [String]

    init(codeId: String, params: [String]) {
      self.codeId = codeId
      self.params = params
    }
  }

  pub resource Verifier {
    pub let roleIdToVerifier: {String: [RoleVerifier]}
    pub let name: String
    pub let description: String
    pub let image: String
    pub let scriptCode: String
    pub let removalCode: String
    pub let extra: {String: AnyStruct}

    pub fun getRoleIds(): [String] {
      return self.roleIdToVerifier.keys
    }

    init(
      roleIdToVerifier: {String: [RoleVerifier]}, 
      name: String, 
      description: String, 
      image: String, 
      scriptCode: String, 
      removalCode: String, 
      extra: {String: AnyStruct}
    ) {
      self.roleIdToVerifier = roleIdToVerifier
      self.name = name
      self.description = description
      self.image = image
      self.scriptCode = scriptCode
      self.removalCode = removalCode
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
      roleIdToVerifier: {String: [RoleVerifier]}, 
      name: String, 
      description: String, 
      image: String, 
      scriptCode: String,
      removalCode: String,
      extra: {String: AnyStruct}
    ) {
      let verifier <- create Verifier(
        roleIdToVerifier: roleIdToVerifier, 
        name: name, 
        description: description, 
        image: image, 
        scriptCode: scriptCode, 
        removalCode: removalCode, 
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
 