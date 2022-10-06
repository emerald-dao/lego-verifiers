import { addVerifier, deleteVerifier, deployByName, getVerifiers } from "./src/common"
import path from "path"
import {
  emulator,
  init,
  getAccountAddress,
} from "flow-js-testing"

const deployContracts = async () => {
  const deployer = await getAccountAddress("Alice")
  await deployByName(deployer, "EmeraldBotVerifiers")
}

describe("Lego", () => {
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "..")
    const port = 8080
    await init(basePath, { port })
    await emulator.start(port)
    return await new Promise(r => setTimeout(r, 2000));
  })

  afterEach(async () => {
    await emulator.stop();
    return await new Promise(r => setTimeout(r, 2000));
  })

  it("Deployment - Should deploy all contracts successfully", async () => {
    await deployContracts()
  })

  it("AddVerifier & DeleteVerifier", async () => {
    await deployContracts()

    const Alice = await getAccountAddress("Alice")
    const [result, error] = await addVerifier(
      Alice, "TEST", "", "", "import Hello from 0xWorld", ["1", "2"], 0
    )
    expect(error).toBeNull()

    const [verifiers, errorGet] = await getVerifiers(Alice)
    expect(errorGet).toBeNull()
    expect(Object.keys(verifiers).length).toBe(1)

    const verifierId = Object.keys(verifiers)[0]
    const [, errorDelete] = await deleteVerifier(Alice, parseInt(verifierId))
    expect(errorDelete).toBeNull()

    const [verifiers2, errorGet2] = await getVerifiers(Alice)
    expect(errorGet2).toBeNull()
    expect(Object.keys(verifiers2).length).toBe(0)
  }) 
})
