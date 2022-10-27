import * as fcl from "@onflow/fcl"
import publicConfig from "../publicConfig"
// Different from the response of FCL
// We don't need to show every status to users
export const TxStatus = {
  // Initializing: Initialing
  // the transaction is waiting to be approved
  initializing() {
    return { status: "Initializing", error: null, txid: null }
  },
  // Pending: Pending & Finalized & Executed
  // the transaction has not been confirmed on chain
  pending(txid) {
    return { status: "Pending", error: null, txid: txid }
  },
  // Success: Sealed with no error
  success(txid) {
    return { status: "Success", error: null, txid: txid }
  },
  // Failed: Sealed with error
  failed(error, txid) {
    return { status: "Failed", error: error, txid: txid }
  }
}

export const txHandler = async (
  txFunc,
  setTransactionInProgress,
  setTransactionStatus
) => {
  let transactionId = null
  setTransactionInProgress(true)
  setTransactionStatus(TxStatus.initializing())

  try {
    transactionId = await txFunc()
    setTransactionStatus(TxStatus.pending(transactionId))

    let res = await fcl.tx(transactionId).onceSealed()
    if (res.status === 4) {
      if (res.statusCode === 0) {
        setTransactionStatus(TxStatus.success(transactionId))
      } else {
        setTransactionStatus(TxStatus.failed(res.errorMessage, transactionId))
      }
      setTimeout(() => setTransactionInProgress(false), 3000)
    }
    return res
  } catch (e) {
    console.log(e)
    setTransactionStatus(TxStatus.failed(e, null))
    setTimeout(() => setTransactionInProgress(false), 3000)
  }
}

const EmeraldBotVerifiersPath = "0xEmeraldBotVerifiers"

export const deleteVerifier = async (
  verifierID,
  setTransactionInProgress,
  setTransactionStatus 
) => {
  const txFunc = async () => {
    return await doDeleteVerifier(verifierID)
  }

  return await txHandler(txFunc, setTransactionInProgress, setTransactionStatus)
}

const doDeleteVerifier = async (verifierID) => {
  const code = `
  import EmeraldBotVerifiers from 0xEmeraldBotVerifiers

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
  `
  .replace(EmeraldBotVerifiersPath, publicConfig.emeraldBotVerifiersAddress)

  const transactionId = await fcl.mutate({
    cadence: code,
    args: (arg, t) => ([
      arg(verifierID, t.UInt64)
    ]),
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    limit: 9999
  })
  return transactionId
}

export const addVerifier = async (
  name, description, image, script, guildId, roleIds, verificationMode,
  setTransactionInProgress,
  setTransactionStatus
) => {
  const txFunc = async () => {
    return await doAddVerifier(name, description, image, script, guildId, roleIds, verificationMode)
  }

  return await txHandler(txFunc, setTransactionInProgress, setTransactionStatus)
}

const doAddVerifier = async (name, description, image, scriptCode, guildId, roleIds, verificationMode) => {
  const code = `
  import EmeraldBotVerifiers from 0xEmeraldBotVerifiers

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
  `
  .replace(EmeraldBotVerifiersPath, publicConfig.emeraldBotVerifiersAddress)

  const transactionId = await fcl.mutate({
    cadence: code,
    args: (arg, t) => ([
      arg(name, t.String),
      arg(description, t.String),
      arg(image, t.String),
      arg(scriptCode, t.String),
      arg(guildId, t.String),
      arg(roleIds, t.Array(t.String)),
      arg(verificationMode, t.UInt8)
    ]),
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    limit: 9999
  })
  return transactionId
}
