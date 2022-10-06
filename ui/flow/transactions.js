import * as fcl from "@onflow/fcl"
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

export const createVerifier = async (
  name, description, script, roleIds,
  setTransactionInProgress,
  setTransactionStatus
) => {
  const txFunc = async () => {
    return await doCreateVerifier(metadata)
  }

  return await txHandler(txFunc, setTransactionInProgress, setTransactionStatus)
}

const doCreateVerifier = async (name, description, script, roleIds) => {
  // const body = `
  // transaction() {
  //   prepare(signer: AuthAccount) {
  //     if signer.borrow<&NonFungibleToken.Collection>(from: ${storagePath}) == nil {
  //       signer.save(<- ${contractName}.createEmptyCollection(), to: ${storagePath})
  //       signer.link<&${collectionType}{${interfaces}}>(${publicPath}, target: ${storagePath})
  //     }
  //   }
  // }
  // `
  // const code = imports.concat(body)

  // const transactionId = await fcl.mutate({
  //   cadence: code,
  //   proposer: fcl.currentUser,
  //   payer: fcl.currentUser,
  //   limit: 9999
  // })
  // return transactionId
}
