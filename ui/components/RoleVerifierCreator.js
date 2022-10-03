import { useState } from "react"
import BasicVerifierSelector from "./BasicVerifierSelector"
import BasicVerifierEditor from "./BasicVerifierEditor"

const generateVerifierCreationCode = (verifiers) => {

}

export default function RoleVerifierCreator(props) {
  const { basicVerifiers: verifiers, setBasicVerifiers: setVerifiers} = props

  const createNewVerifier = () => {
    setVerifiers(oldVerifiers => [...oldVerifiers, 1])
  }

  const createPresetVerifier = (verifierInfo) => {
    const verifier = Object.assign({}, verifierInfo)
    verifier.isPreset = true
    setVerifiers(oldVerifiers => [...oldVerifiers, verifier])
  }

  const deleteVerifier = (index) => {
    const newVerifiers = verifiers.filter((verifier, idx) => idx != index)
    setVerifiers(newVerifiers)
  }

  const updateVerifier = (index, paramName, paramValue) => {
    setVerifiers(oldVerifiers => {
      const newVerifiers = oldVerifiers.map((verifier, idx) => {
        if (idx == index) {
          const newParameters = verifier.parameters.map((param) => {
            if (param.names.placeholder == paramName) {
              return {...param, value: paramValue}
            }
            return param
          })

          return {...verifier, parameters: newParameters}
        }
        return verifier
      })

      return newVerifiers
    })
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex gap-x-2 justify-between items-center">
        <label className="block text-2xl font-bold font-flow">
          Basic Verifiers
        </label>
      </div>

      <div className="mt-1 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 auto-rows-fr">
        {
          verifiers.map((verifier, index) => {
            if (verifier.isPreset) {
              return (
                <BasicVerifierEditor
                  key={index}
                  index={index}
                  isPreset={true}
                  verifierInfo={verifier}
                  updateVerifier={updateVerifier}
                  deleteVerifier={deleteVerifier}
                />
              )
            }
            return (
              <BasicVerifierEditor
                key={index}
                index={index}
                isPreset={false}
                updateVerifier={updateVerifier}
                deleteVerifier={deleteVerifier}
              />
            )
          })
        }
        <BasicVerifierSelector
          createNewVerifier={createNewVerifier}
          createPresetVerifier={createPresetVerifier}
        />
      </div>
    </div>
  )
}