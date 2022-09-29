import { useState, useEffect } from "react"
import Image from "next/image"
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import { Combobox } from "@headlessui/react"
import { useRecoilState } from "recoil"

import {
  basicNotificationContentState,
  showBasicNotificationState,
  transactionInProgressState,
} from "../lib/atoms"

import { NFTList } from "../flow/nft-list"
import publicConfig from "../publicConfig.js"
import { classNames } from "../lib/utils"
// import { getNFTDisplays } from "../../lib/mist-scripts"
// import NFTCard from "./NFTCard"


export default function NFTSelector(props) {
  const [, setShowBasicNotification] = useRecoilState(showBasicNotificationState)
  const [, setBasicNotificationContent] = useRecoilState(basicNotificationContentState)
  const [transactionInProgress] = useRecoilState(transactionInProgressState)

  const [query, setQuery] = useState("")
  const { selectedNFT, setSelectedNFT } = props
  const [filteredNFTs, setFilteredNFTs] = useState([])

  const NFTs = NFTList(publicConfig.chainEnv)

  useEffect(() => {
    setFilteredNFTs(
      query === ""
        ? NFTs
        : NFTs.filter((nft) => {
          const content = `${nft.name}`
          return content.toLowerCase().includes(query.toLowerCase())
        }))
  }, [query, NFTs])


  return (
    <div className={"flex flex-col"}>
      <label className="block text-base font-flow font-bold">NFT<span className="text-red-600">*</span></label>

      <Combobox as="div" className={props.className} value={props.user && props.user.loggedIn && selectedNFT} onChange={async (nft) => {
        if (!selectedNFT || nft.contractName != selectedNFT.contractName) {
          setSelectedNFT(nft)
        }
      }}>

        <div className="relative mt-1">
          <Combobox.Input
            className="w-full h-[50px] text-lg font-flow rounded-2xl border border-emerald bg-white py-2 pl-3 pr-10  focus:border-emerald-dark focus:outline-none focus:ring-1 focus:ring-emerald-dark"
            onChange={(event) => {
              setQuery(event.target.value)
            }}
            displayValue={(nft) => nft && `${nft.name}`}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          {filteredNFTs.length > 0 && (
            <Combobox.Options className="absolute z-10 rounded-2xl mt-1 max-h-56 w-full overflow-auto  bg-white py-1 text-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filteredNFTs.map((nft) => (
                <Combobox.Option
                  key={nft.name}
                  value={nft}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-default select-none py-2 pl-3 pr-9",
                      active ? "bg-emerald-light" : "text-black"
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <div className="flex items-center">
                        <div className="w-6 h-6 relative">
                          <Image src={nft.logoURL} alt="" layout="fill" objectFit="cover" className="rounded-full" />
                        </div>
                        <span className={classNames("ml-3 truncate", selected && "font-semibold")}>{`${nft.name}`}</span>
                      </div>

                      {selected && (
                        <span
                          className={classNames(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-black" : "text-emerald-dark"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  )
}
