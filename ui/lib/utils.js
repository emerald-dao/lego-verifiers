import Decimal from "decimal.js"
import { ModeShortCircuit } from "../components/VerificationModeSelector"

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const isValidRoleID = (roleID) => {
  try {
    const v = new Decimal(roleID)
    return v.isInteger() && v.isPositive() && !v.isZero()
  } catch (e) {
    return false
  }
}

export const generateScript = (roleVerifiers, verificationMode) => {
  const imports = generateImports(roleVerifiers)

  const checkNumber = 0
  const totalMain = ""
  for (let i = 0; i < roleVerifiers.length; i++) {
    const rv = roleVerifiers[i]
    const roleID = rv.roleID
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
      if ${ifStatement.join(` ${operator} `)} {
        earnedRoles.append("${roleID}")
        return earnedRoles
      }`
    } else {
      totalMain += `
      if ${ifStatement.join(` ${operator} `)} {
        earnedRoles.append("${roleID}")
      }`
    }
  }

  const verifyScript = `
${imports.join('\n')}

  pub fun main(users: [Address]): {Address: [String]} {
    let response: {Address: [String]} = {}
    for user in users {
      var earnedRoles: [String] = []

      ${totalMain}

      response[user] = earnedRoles
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
      const bv = rv.basicVerifiers[j]
      imports.push(...bv.imports)
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

