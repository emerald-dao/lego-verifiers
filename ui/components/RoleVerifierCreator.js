import BasicVerifierSelector from "./BasicVerifierSelector"
import BasicVerifierView from "./BasicVerifierView"
import { catalogTemplate } from "../flow/preset_verifiers"
import { TraitsLogic } from "./LogicSelector"
import { useState } from "react"

export default function RoleVerifierCreator(props) {
  const { basicVerifiers: verifiers, setBasicVerifiers: setVerifiers } = props

  const [verifierID, setVerifierID] = useState(verifiers.length)

  const createNewVerifier = () => {
    const verifier = Object.assign({}, catalogTemplate)
    verifier.id = verifierID
    setVerifierID(verifierID + 1)

    verifier.isPreset = false
    verifier.traits = []
    verifier.traitsLogic = TraitsLogic.AND
    setVerifiers(oldVerifiers => [...oldVerifiers, verifier])
  }

  const createPresetVerifier = (verifierInfo) => {
    const verifier = Object.assign({}, verifierInfo)
    verifier.id = verifierID
    setVerifierID(verifierID + 1)

    verifier.isPreset = true
    setVerifiers(oldVerifiers => [...oldVerifiers, verifier])
  }

  const deleteVerifier = (index) => {
    const newVerifiers = verifiers.filter((verifier, idx) => {
      return idx != index
    })
    setVerifiers(newVerifiers)
  }

  const updateNFTCatalogVerifier = (index, nft) => {
    setVerifiers(oldVerifiers => {
      const newVerifiers = oldVerifiers.map((verifier, idx) => {
        if (idx == index) {
          return { ...verifier, nft: nft }
        }
        return verifier
      })
      return newVerifiers
    })
  }

  const updateVerifierParam = (index, paramName, paramValue, validity = true) => {
    setVerifiers(oldVerifiers => {
      const newVerifiers = oldVerifiers.map((verifier, idx) => {
        if (idx == index) {
          const newParameters = verifier.parameters.map((param) => {
            if (param.names.placeholder == paramName) {
              return { ...param, value: paramValue, isValid: validity }
            }
            return param
          })

          return { ...verifier, parameters: newParameters }
        }
        return verifier
      })

      return newVerifiers
    })
  }

  const updateVerifierTraits = (index, traits, traitsLogic) => {
    setVerifiers(oldVerifiers => {
      const newVerifiers = oldVerifiers.map((verifier, idx) => {
        if (idx == index) {
          return { ...verifier, traits: traits, traitsLogic: traitsLogic}
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
          Verifiers
        </label>
      </div>

      <div className="mt-1 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 auto-rows-fr">
        {
          verifiers.map((verifier, index) => {
            if (verifier.isPreset) {
              return (
                <BasicVerifierView
                  key={verifier.id}
                  index={index}
                  isPreset={true}
                  verifierInfo={verifier}
                  updateVerifierParam={updateVerifierParam}
                  deleteVerifier={deleteVerifier}
                />
              )
            }
            return (
              <BasicVerifierView
                key={verifier.id}
                index={index}
                isPreset={false}
                verifierInfo={verifier}
                updateNFTCatalogVerifier={updateNFTCatalogVerifier}
                updateVerifierTraits={updateVerifierTraits}
                updateVerifierParam={updateVerifierParam}
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