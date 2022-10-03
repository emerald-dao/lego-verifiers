import { useState } from "react"
import BasicVerifierSelector from "./BasicVerifierSelector"
import BasicVerifierEditor from "./BasicVerifierEditor"

const generateVerifierCreationCode = (verifiers) => {

}

export default function RoleVerifierCreator(props) {
  console.log(props)
  const { basicVerifiers: verifiers, setBasicVerifiers: setVerifiers} = props

  const createNewVerifier = () => {
    console.log("new verifier")
    setVerifiers(oldVerifiers => [1, ...oldVerifiers])
  }

  const createPresetVerifier = (verifierInfo) => {
    console.log("preset verifier")
    verifierInfo.isPreset = true
    setVerifiers(oldVerifiers => [verifierInfo, ...oldVerifiers])
  }

  const deleteVerifier = (index) => {
    const newVerifiers = verifiers.filter((verifier, idx) => idx != index)
    console.log(newVerifiers)
    setVerifiers(newVerifiers)
    console.log("delete verifier at index", index)
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
                  deleteVerifier={deleteVerifier}
                />
              )
            }
            return (
              <BasicVerifierEditor
                key={index}
                index={index}
                isPreset={false}
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