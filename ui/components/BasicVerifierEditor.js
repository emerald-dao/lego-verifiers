import { XCircleIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useState } from "react";
import BasicVerifierCreator from "./BasicVerifierCreator";
import PresetBasicVerifier from "./PresetBasicVerifier";

const getVerificationTypes = (nft) => {
  const baseTypes = [
    {
      type: "Amount"
    },
    {
      type: "TokenID"
    }
  ]

  if (!nft || nft.name != "FLOAT") {
    return baseTypes
  }

  const res = baseTypes.concat([{ type: "EventID" }])
  return res
}

export default function BasicVerifierEditor(props) {
  const { isPreset, verifierInfo, index, updateVerifier, deleteVerifier } = props

  return (
    <div className="
    h-[524px] p-4 shrink-0
    shadow-lg bg-white
    ring-1 ring-black ring-opacity-5 rounded-2xl 
    flex flex-col gap-y-4 
    ">
      <div className="flex justify-end">
        <button
          onClick={() => {
            deleteVerifier(index)
          }}
        >
          <XCircleIcon
            className="text-emerald hover:text-emerald-dark"
            width={32} height={32}
          />
        </button>
      </div>

      {
        isPreset ?
          <div className={`flex flex-col h-full justify-between font-flow p-1`}>
            <div className="flex flex-col gap-y-1 font-flow p-1">
              <div className="flex items-center rounded-full py-1 text-base font-bold text-black w-20 h-20 relative">
                <Image className="rounded-full object-cover" src={verifierInfo.logo} alt="" fill sizes="33vw" /> 
              </div>
              <label className="cursor-pointer text-left text-2xl font-bold">{verifierInfo.name}</label>
              <label className="cursor-pointer text-left text-sm">{verifierInfo.description}</label>
            </div>

            <PresetBasicVerifier index={index} updateVerifier={updateVerifier} verifierInfo={verifierInfo} />
          </div> :
          <BasicVerifierCreator index={index} updateVerifier={updateVerifier} verifierInfo={verifierInfo} />
      }
    </div>
  )
}