import { PlusCircleIcon } from "@heroicons/react/outline"
import Image from "next/image"
import { catalogTemplate, presetVerifiersList } from "../flow/preset_verifiers"

export default function BasicVerifierSelector(props) {

  const presetVerifiers = [catalogTemplate].concat(presetVerifiersList)
  const { createNewVerifier, createPresetVerifier } = props

  return (
    <div className={`
    h-[434px]
    shadow-lg bg-emerald
    ring-1 ring-black ring-opacity-5 rounded-2xl 
    flex flex-col gap-y-4
    p-4 overflow-auto
    `}>
      <label className="font-flow text-black text-lg font-bold">
        Templates
      </label>
      {
        presetVerifiers.map((verifier, index) => {
          return (
            <button
              key={index}
              className={`
            w-full bg-white 
            rounded-2xl shadow-md
            flex gap-x-2 shrink-0
          p-2 pb-3
            `}
              onClick={() => {
                if (!verifier.isPreset) {
                  createNewVerifier()
                  return
                }
                createPresetVerifier(verifier)
              }}>
              <div className={`flex flex-col gap-y-1 font-flow p-1`}>
                <div className="flex gap-x-1 items-center py-1 text-lg font-bold text-black">
                  <div className="w-5 h-5 relative">
                    <Image className="rounded-full object-cover" src={verifier.logo} alt="" fill sizes="33vw" />
                  </div>
                  <label>{verifier.name}</label>
                </div>
                <label className="cursor-pointer text-left text-sm">{verifier.description}</label>
              </div>
            </button>
          )
        })
      }
    </div>
  )
}