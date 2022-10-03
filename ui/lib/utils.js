import Decimal from "decimal.js"

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

export const generateScript = (roleVerifiers) => {
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
      console.log(bv.script)
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
    totalMain += `
    if ${ifStatement.join(` ${operator} `)} {
      earnedRoles.append("${roleID}")
    }
    `
  }

  const verifyScript = `
${imports.join('\n')}

  pub fun main(user: Address): [String] {
    var earnedRoles: [String] = []

    ${totalMain}

    return earnedRoles
  }
  `

  console.log(verifyScript)
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