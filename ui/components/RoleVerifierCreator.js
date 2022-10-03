import { useState } from "react"
import BasicVerifierSelector from "./BasicVerifierSelector"
import BasicVerifierEditor from "./BasicVerifierEditor"

const generateVerifierCreationCode = (verifiers) => {

}

export default function RoleVerifierCreator() {
  const [verifiers, setVerifiers] = useState([])
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
        Verifiers
      </label>
      <button
          type="button"
          className="h-12 px-6 text-base rounded-2xl font-flow font-semibold shadow-sm text-black bg-emerald hover:bg-emerald-dark"
          onClick={() => {
            console.log("CREATE")
          }}>
            Create Role Verifier
        </button>
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