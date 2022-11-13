import Image from "next/image";
import { useState } from "react";
import { classNames } from "../lib/utils";
import NFTSelector from "./NFTSelector"
import { useRecoilState } from "recoil"
import {
  transactionInProgressState,
} from "../lib/atoms"


export default function BasicVerifierCreator(props) {
  const [transactionInProgress,] = useRecoilState(transactionInProgressState)
  const { index, verifierInfo, updateVerifier} = props
  const [selectedNFT, setSelectedNFT] = useState(null)

  const logo = selectedNFT ? selectedNFT.logoURL : verifierInfo.logo
  const name = selectedNFT ? selectedNFT.name : verifierInfo.name
  const description = selectedNFT ? selectedNFT.description : verifierInfo.description
  const parameter = verifierInfo.parameters[0]
  console.log(verifierInfo)

  // const getDescription = (selectedNFT) => {

  // }

  return (
    <div className="flex flex-col gap-y-2 h-full justify-between font-flow p-1">
      <div className="flex flex-col gap-y-1 font-flow p-1">
        <div className="w-20 h-20 flex items-center rounded-full py-1 text-base font-bold text-black relative ring-emerald ring-2">
          <Image className="rounded-full object-contain" src={logo} alt="" fill sizes="33vw" />
        </div>
        <label className="cursor-pointer text-left text-2xl font-bold">{name}</label>
        <label className="cursor-pointer text-left text-sm">{description}</label>
      </div>

      <div className="flex flex-col gap-y-2 justify-end pb-4">
        <NFTSelector selectedNFT={selectedNFT} setSelectedNFT={setSelectedNFT} />
        <div>
          <label className="block text-base font-bold font-flow">
            {parameter.names.display}
          </label>
          <div className="mt-1">
            <input
              type={`text`}
              name={`amount`}
              id={`amount`}
              disabled={transactionInProgress}
              required
              placeholder={``}
              className={classNames(
                parameter.isValid ? `border-emerald` : `border-rose-500`,
                `bg-white block w-full font-flow text-lg rounded-2xl px-3 py-2 border
                               focus:border-emerald-dark
                              outline-0 focus:outline-2 focus:outline-emerald-dark 
                              placeholder:text-gray-300`
              )}
              value={parameter.value ?? ""}
              onChange={(event) => {
                if (parameter.regex) {
                  if (event.target.value === '' || parameter.regex.test(event.target.value)) {
                    updateVerifier(index, parameter.names.placeholder, event.target.value)
                  }
                  return
                }
                updateVerifier(index, parameter.names.placeholder, event.target.value)
              }}
              onBlur={(event) => {
                const isValid = parameter.validate(parameter.value)
                updateVerifier(index, parameter.names.placeholder, event.target.value, isValid)
              }}
            />
          </div>
        </div>

      </div>
      {/* <VerificationTypeSelector */}
      {/* verificationTypes={verificationTypes} */}
      {/* verificationType={verificationType} */}
      {/* setVerificationType={setVerificationType} */}
      {/* /> */}
    </div>
  )
}