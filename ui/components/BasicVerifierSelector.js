
import { PlusCircleIcon } from "@heroicons/react/outline"
import Image from "next/image"
import { PresetVerifiersList } from "../flow/preset_verifiers"
import publicConfig from "../publicConfig"

export default function BasicVerifierSelector(props) {

  const presetVerifiers = PresetVerifiersList(publicConfig.chainEnv)
  const { createNewVerifier, createPresetVerifier } = props

  return (
    <div className={`
    h-[424px]
    shadow-lg bg-emerald
    ring-1 ring-black ring-opacity-5 rounded-2xl 
    flex flex-col gap-y-4
    p-4 overflow-auto
    `}>
      <button className={`
        w-full h-[96px] bg-white
        rounded-2xl shadow-sm p-4 shrink-0
        flex items-center justify-center cursor-pointer
      `}
        onClick={() => {
          createNewVerifier()
        }}
      >
        <div
          className="flex gap-x-1 items-center"
        >
          <PlusCircleIcon className="text-emerald" width={32} height={32} />
          <label className="cursor-pointer font-bold font-flow text-black text-xl">New Verifier</label>
        </div>
      </button>

      <label className="font-flow text-black text-lg font-bold">
        Preset Verifiers
      </label>
      {
        presetVerifiers.map((verifier, index) => {
          console.log(verifier)
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
                createPresetVerifier(verifier)
              }}>
              <div className={`flex flex-col gap-y-1 font-flow p-1`}>
                <div className="flex items-center rounded-full py-1 text-lg font-bold text-black">
                  <Image className="rounded-full" src={verifier.logo} alt="" layout="intrinsic" width={20} height={20} objectFit="cover" />&nbsp;&nbsp;{verifier.name}
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