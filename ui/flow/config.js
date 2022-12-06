import { config } from "@onflow/fcl"
import publicConfig from "../publicConfig"
import {send as httpSend} from "@onflow/transport-http"

config({
  "accessNode.api": publicConfig.accessNodeAPI,
  "discovery.wallet": publicConfig.walletDiscovery,
  "sdk.transport": httpSend,
  "app.detail.title": "Emerald Bot",
  "app.detail.icon": "https://i.imgur.com/hO6zv5r.png",

  "0xNFTCatalog": publicConfig.nftCatalogAddress,
  "0xEmeraldBotVerifiers": publicConfig.emeraldBotVerifiersAddress,
})