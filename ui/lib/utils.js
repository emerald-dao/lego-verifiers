import { ModeShortCircuit } from "../components/VerificationModeSelector"
import publicConfig from "../publicConfig"

export const getIPFSFileURL = (cid, path) => {
  if (!cid || !path) { return }
  return `https://gateway.pinata.cloud/ipfs/${cid}/${path}`
}

export const getIPFSFileURLByURL = (url) => {
  if (!url.includes("ipfs://")) { return }
  const newURL = url.replace("ipfs://", "")
  return `https://gateway.pinata.cloud/ipfs/${newURL}`
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const generateImportsAndScript = (basicVerifier) => {
  if (!basicVerifier.isPreset && basicVerifier.name == "Owns _ NFT(s)") {
    const nft = basicVerifier.nft
    const publicPath = `/${nft.collectionData.publicPath.domain}/${nft.collectionData.publicPath.identifier}`
    const imports = [
      `import ${nft.contractName} from ${nft.contractAddress}`,
      `import NonFungibleToken from ${publicConfig.nonFungibleTokenAddress}`
    ]
    const script = `
    if let collection = getAccount(user).getCapability(${publicPath}).borrow<&{NonFungibleToken.CollectionPublic}>() {
      let amount: Int = AMOUNT
      if collection.getIDs().length >= amount {
        SUCCESS
      }
    }
    `;
    return { imports, script }
  }
}

export const generateScript = (roleVerifiers, verificationMode) => {
  for (let i = 0; i < roleVerifiers.length; i++) {
    const rv = roleVerifiers[i]
    for (let j = 0; j < rv.basicVerifiers.length; j++) {
      const bv = rv.basicVerifiers[j]
      // generate codes for AMOUNT
      if (!bv.isPreset && bv.name == "Owns _ NFT(s)") {
        const { imports, script } = generateImportsAndScript(bv);
        bv.imports = {[publicConfig.chainEnv]: imports};
        bv.script = script;
      }
    }
  }

  const imports = generateImports(roleVerifiers)

  let checkNumber = 0
  let totalMain = ""
  for (let i = 0; i < roleVerifiers.length; i++) {
    const rv = roleVerifiers[i]
    const roleId = rv.role.id
    let ifStatement = []

    let operator = "&&"
    if (rv.basicVerifiersLogic == "OR") {
      operator = "||"
    }
    for (let j = 0; j < rv.basicVerifiers.length; j++) {
      const bv = rv.basicVerifiers[j]
      let code = bv.script
      for (let k = 0; k < bv.parameters.length; k++) {
        const param = bv.parameters[k]
        code = code.replaceAll(param.names.placeholder, param.value)
      }

      const successNumber = `success${checkNumber}`
      totalMain += `
    var ${successNumber} = false
      ${code.replace("SUCCESS", `${successNumber} = true`)}
      `
      ifStatement.push(successNumber)
      checkNumber++
    }

    if (verificationMode.key == ModeShortCircuit.key) {
      totalMain += `
      if !earnedRoles.contains("${roleId}") && (${ifStatement.join(` ${operator} `)}) {
        earnedRoles.append("${roleId}")
        continue
      }`
    } else {
      totalMain += `
      if !earnedRoles.contains("${roleId}") && (${ifStatement.join(` ${operator} `)}) {
        earnedRoles.append("${roleId}")
      }`
    }
  }

  const verifyScript = `
  import EmeraldIdentity from 0x39e42c67cc851cfb
${imports.join('\n')}

  pub fun main(discordIds: [String]): {String: [String]} {
    let response: {String: [String]} = {}
    for discordId in discordIds {
      var earnedRoles: [String] = []
      for user in EmeraldIdentity.getEmeraldIDs(discordID: discordId).values {

        ${totalMain}

      }
      response[discordId] = earnedRoles
    }

    return response
  }`

  return verifyScript
}

const generateImports = (roleVerifiers) => {
  const imports = []
  for (let i = 0; i < roleVerifiers.length; i++) {
    const rv = roleVerifiers[i]
    for (let j = 0; j < rv.basicVerifiers.length; j++) {
      const bv = rv.basicVerifiers[j];
      const chainImports = bv.imports[publicConfig.chainEnv];
      imports.push(...chainImports);
    }
  }
  const uniqueImports = [...new Set(imports)]
  return uniqueImports.map((i) => i.trim())
}

export const getItemsInPage = (totalItems, page, pageSize) => {
  const items = totalItems.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
  return items
}

export const discordColorPalette = {
  0: { hex: '#000000', name: 'Default' },
  1752220: { hex: '#1ABC9C', name: 'Aqua' },
  5763719: { hex: '#57F287', name: 'Green' },
  2067276: { hex: '#1F8B4C', name: 'DarkGreen' },
  3447003: { hex: '#3498DB', name: 'Blue' },
  2123412: { hex: '#206694', name: 'DarkBlue' },
  10181046: { hex: '#9B59B6', name: 'Purple' },
  7419530: { hex: '#71368A', name: 'DarkPurple' },
  15277667: { hex: '#E91E63', name: 'LuminousVividPink' },
  11342935: { hex: '#AD1457', name: 'DarkVividPink' },
  15844367: { hex: '#F1C40F', name: 'Gold' },
  12745742: { hex: '#C27C0E', name: 'DarkGold' },
  15105570: { hex: '#E67E22', name: 'Orange' },
  11027200: { hex: '#A84300', name: 'DarkOrange' },
  15548997: { hex: '#ED4245', name: 'Red' },
  10038562: { hex: '#992D22', name: 'DarkRed' },
  9807270: { hex: '#95A5A6', name: 'Grey' },
  9936031: { hex: '#979C9F', name: 'DarkGrey' },
  8359053: { hex: '#7F8C8D', name: 'DarkerGrey' },
  12370112: { hex: '#BCC0C0', name: 'LightGrey' },
  3426654: { hex: '#34495E', name: 'Navy' },
  2899536: { hex: '#2C3E50', name: 'DarkNavy' },
  16776960: { hex: '#FFFF00', name: 'Yellow' },
  16777215: { hex: '#FFFFFF', name: 'White(Default)' },
  10070709: { hex: '#99AAb5', name: 'Greyple' },
  2303786: { hex: '#23272A', name: 'Black' },
  2895667: { hex: '#2C2F33', name: 'DarkButNotBlack' },
  2303786: { hex: '#23272A', name: 'NotQuiteBlack' },
  5793266: { hex: '#5865F2', name: 'Blurple' },
  5763719: { hex: '#57F287', name: 'Green' },
  16705372: { hex: '#FEE75C', name: 'Yellow' },
  15418782: { hex: '#EB459E', name: 'Fuchsia' },
  15548997: { hex: '#ED4245', name: 'Red' },
  6323595: { hex: '#607D8B', name: 'Unnamed role color 1' },
  5533306: { hex: '#546E7A', name: 'Unnamed role color 2' },
  3553599: { hex: '#36393F', name: 'Background black color' },
}

export const getCatalogImageSrc = (metadata) => {
  let src = null
  let squareImageFile = metadata.collectionDisplay.squareImage.file
  if (squareImageFile.url && squareImageFile.url.trim() != '' && !squareImageFile.url.includes("ipfs://")) {
    src = squareImageFile.url.trim()
    return src
  } else if (squareImageFile.url && squareImageFile.url.includes("ipfs://")) {
    return getIPFSFileURLByURL(squareImageFile.url)
  } else if (squareImageFile.cid
    && squareImageFile.cid.trim() != ''
    && squareImageFile.path
    && squareImageFile.path.trim() != '') {
    const imageCID = squareImageFile.cid.trim()
    const imagePath = squareImageFile.path.trim()
    return getIPFSFileURL(imageCID, imagePath)
  } else {
    return "/nft-catalog.png"
  }
}

