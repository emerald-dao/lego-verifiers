import { 
  deployContractByName, executeScript, sendTransaction, shallPass
} from "flow-js-testing"

export const deployByName = async (deployer, contractName, args) => {
  const [, error] = await deployContractByName({ to: deployer, name: contractName, args: args })
  expect(error).toBeNull()
}

export const addVerifier = (
  signer, verifierName, description, image, scriptCode, guildId, roleIds, verificationMode
) => {
  const signers = [signer]
  const name = "add_verifier"
  const args = [verifierName, description, image, scriptCode, guildId, roleIds, verificationMode]
  return sendTransaction({ name: name, args: args, signers: signers })
}

export const deleteVerifier = (signer, verifierId) => {
  const signers = [signer]
  const name = "delete_verifier"
  const args = [verifierId]
  return sendTransaction({ name: name, args: args, signers: signers })
}

export const getVerifiers = (address) => {
  const name = "get_verifiers"
  const args = [address]
  return executeScript({name: name, args: args})
}

