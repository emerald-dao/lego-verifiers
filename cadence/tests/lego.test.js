import { deployByName } from "./src/common"
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

describe("Deployment", () => {
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
})
