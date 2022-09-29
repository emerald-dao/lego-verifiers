// TRY IT OUT: node ./verifiers/generate.js

const verifiers = require('./verifiers.json');
const fs = require('fs');
const path = require('path');

async function generateScript(data) {
  // Start building Cadence script
  let totalImports = [];
  let totalMain = '';
  let totalSuccesses = 0;

  for (const roleId in data) {
    const roleVerifier = data[roleId];
    let ifStatement = [];
    for (let i = 0; i < roleVerifier.length; i++) {
      const { verifierId, parameters } = roleVerifier[i];
      const { cadence, parameterNames, imports } = verifiers[verifierId];
      let cadenceCode = fs.readFileSync(path.join(__dirname, `/scripts/${cadence}`), 'utf8');
      for (let j = 0; j < parameterNames.length; j++) {
        cadenceCode = cadenceCode.replaceAll(parameterNames[j], parameters[j])
      }
      totalImports = [...new Set([...totalImports, ...imports])];
      const successNumber = 'success' + totalSuccesses;
      totalMain += `
      var ${successNumber} = false
      ${cadenceCode.replace('SUCCESS', `${successNumber} = true`)} \n
      `;
      ifStatement.push(successNumber);
      totalSuccesses++;
    }
    totalMain += `
    if ${ifStatement.join(' && ')} {
      earnedRoles.append("${roleId}")
    }
    `;
  }

  const verifyScript = `
  ${totalImports.join('\n')}
  pub fun main(user: Address): [String] {
    var earnedRoles: [String] = []

    ${totalMain}

    return earnedRoles
  }
  `;

  console.log(verifyScript)
}

const sampleData = {
  100124012401204: [
    {
      verifierId: 0,
      parameters: [1234]
    },
    {
      verifierId: 1,
      parameters: [3]
    }
  ],
  100124012401216: [
    {
      verifierId: 2,
      parameters: []
    }
  ]
}

generateScript(sampleData);