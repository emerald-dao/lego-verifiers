import Image from "next/image";
import { useEffect, useState } from "react";
import { classNames } from "../lib/utils";
import NFTSelector from "./NFTSelector"
import { useRecoilState } from "recoil"
import {
  transactionInProgressState,
} from "../lib/atoms"
import { PlusIcon } from "@heroicons/react/outline";
import TraitFilterModal from "./TraitFilterModal";

export default function BasicVerifierCreator(props) {
  const [transactionInProgress,] = useRecoilState(transactionInProgressState)
  const { index, verifierInfo, updateVerifierParam, updateNFTCatalogVerifier, updateVerifierTraits} = props
  const [selectedNFT, setSelectedNFT] = useState(null)

  const [traitFilterOpen, setTraitFilterOpen] = useState(false)

  const [logo, setLogo] = useState(verifierInfo.logo)
  const [name, setName] = useState(verifierInfo.name)
  const [description, setDescription] = useState(verifierInfo.description)

  // Only support AMOUNT now
  // const [parameter, setParameter] = useState(verifierInfo.parameters[0])
  const parameter = verifierInfo.parameters[0]

  const updateInfo = (selectedNFT) => {
    if (!selectedNFT) { return }
    const nftName = selectedNFT.name
    setLogo(selectedNFT.logoURL)
    setName(`Owns _ ${nftName}`)
    setDescription(`Checks to see if a user owns AMOUNT ${nftName}`)
  }

  useEffect(() => {
    if (verifierInfo.nft && selectedNFT) {
      if (verifierInfo.nft.contractName != selectedNFT.contractName) {
        setSelectedNFT(verifierInfo.nft)
      }
      return
    }

    if (verifierInfo.nft) {
      setSelectedNFT(verifierInfo.nft)
    }
  }, [verifierInfo])

  useEffect(() => {
    if (selectedNFT) {
      updateNFTCatalogVerifier(index, selectedNFT)
      updateInfo(selectedNFT)
    }
  }, [selectedNFT])

  return (
    <div className={`flex flex-col h-full justify-between font-flow p-1`}>
      <div className="flex flex-col gap-y-1 font-flow">
        <div className="flex bg-gray-100 items-center rounded-full py-1 text-base font-bold text-black w-16 h-16 relative">
          {
            logo ?
              <Image className="rounded-full object-contain" src={logo} alt="" fill sizes="33vw" />
              : null
          }
        </div>
        <label className="cursor-pointer truncate text-left text-xl font-bold">{name}</label>
        <label className="cursor-pointer text-left text-sm">{description}</label>
      </div>

      <div className="flex flex-col gap-y-1 justify-end pb-2">
        <NFTSelector selectedNFT={selectedNFT} setSelectedNFT={setSelectedNFT} />
        <div>
          <label className="block text-base font-bold font-flow">
            {parameter.names.display}
          </label>
          <div>
            <input
              type={`text`}
              name={`amount`}
              id={`amount`}
              disabled={transactionInProgress}
              required
              placeholder={``}
              className={classNames(
                parameter.type.validate(parameter.value) ? `border-emerald` : `border-rose-500`,
                `bg-white block w-full font-flow text-lg rounded-2xl px-3 py-2 border
                               focus:border-emerald-dark
                              outline-0 focus:outline-2 focus:outline-emerald-dark 
                              placeholder:text-gray-300`
              )}
              value={parameter.value ?? ""}
              onChange={(event) => {
                if (parameter.type.formatRegex) {
                  if (event.target.value === '' || parameter.type.formatRegex.test(event.target.value)) {
                    updateVerifierParam(index, parameter.names.placeholder, event.target.value)
                  }
                  return
                }
                updateVerifierParam(index, parameter.names.placeholder, event.target.value)
              }}
              onBlur={(event) => {
                const isValid = parameter.type.validate(parameter.value)
                updateVerifierParam(index, parameter.names.placeholder, event.target.value, isValid)
              }}
            />
          </div>
        </div>
        <button className="mt-2 flex flex-col h-8 w-full items-center justify-center bg-emerald disabled:bg-emerald-light rounded-xl text-black disabled:text-gray-500"
          disabled={selectedNFT ? false : true}
          onClick={() => {
            setTraitFilterOpen(!traitFilterOpen)
          }}>
          <div className="flex gap-x-1 w-full justify-center items-center">
            <PlusIcon className="h-5 w-5" />
            <div>{`Traits Filter (${verifierInfo.traits.length})`}</div>
          </div>
        </button>
      </div>
      <TraitFilterModal 
        index={index} 
        open={traitFilterOpen} 
        setOpen={setTraitFilterOpen} 
        name={selectedNFT && selectedNFT.name}
        initTraits={verifierInfo.traits}
        initTraitsLogic={verifierInfo.traitsLogic}
        updateVerifierTraits={updateVerifierTraits} 
      />
    </div>
  )
}