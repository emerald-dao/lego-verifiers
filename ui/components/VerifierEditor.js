import { XCircleIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useState } from "react";
import NFTSelector from "./NFTSelector";
import VerificationTypeSelector from "./VerificationTypeSelector";
import { useRecoilState } from "recoil"
import {
  transactionInProgressState,
} from "../lib/atoms"

const getVerificationTypes = (nft) => {
  console.log(nft)
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
  console.log(res)
  return res
}

export default function VerifierEditor(props) {
  const [transactionInProgress,] = useRecoilState(transactionInProgressState)
  const { isPreset, verifierInfo, index, deleteVerifier } = props
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [verificationType, setVerificationType] = useState(null)

  return (
    <div className="
    h-[424px] p-4 shrink-0
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
            <div className="flex items-center rounded-full py-1 text-base font-bold text-black">
              <Image className="rounded-full" src={verifierInfo.logo} alt="" layout="intrinsic" width={80} height={80} objectFit="cover" />
            </div>
            <label className="cursor-pointer text-left text-2xl font-bold">{verifierInfo.name}</label>
            <label className="cursor-pointer text-left text-sm">{verifierInfo.description}</label>
            </div>

            <div className="flex flex-col gap-y-2 p-1 pb-4">
            {
                  verifierInfo.parameterNames.length > 0 ?
                    verifierInfo.parameterNames.map((parameterName) => {
                      return (
                        <div className="flex flex-col gap-y-1">
                        <label className="block text-base font-bold font-flow">
                          {parameterName.display}
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name={parameterName.display}
                            id={parameterName.display}
                            disabled={transactionInProgress}
                            required
                            placeholder={``}
                            className="bg-white block w-full font-flow text-lg rounded-2xl px-3 py-2
            border border-emerald focus:border-emerald-dark
            outline-0 focus:outline-2 focus:outline-emerald-dark 
            placeholder:text-gray-300"
                            onChange={(event) => {
                              console.log("ROLEID")
                            }}
                          />
                        </div>
                      </div>
                      )
                    })
                    : null
                }
              </div>
          </div> :
          <>
            <NFTSelector selectedNFT={selectedNFT} setSelectedNFT={setSelectedNFT} />
            <VerificationTypeSelector
              verificationTypes={getVerificationTypes(selectedNFT)}
              verificationType={verificationType}
              setVerificationType={setVerificationType}
            />
          </>
      }
    </div>
  )
}