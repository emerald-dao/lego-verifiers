import { useState, useEffect } from "react"
import Image from "next/image"
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import { Combobox } from "@headlessui/react"
import { useRecoilState } from "recoil"
import {
  nftCatalogState
} from "../lib/atoms"
import { classNames } from "../lib/utils"

export default function NFTSelector(props) {
  let [query, setQuery] = useState("")
  const { selectedNFT, setSelectedNFT } = props
  const [filteredNFTs, setFilteredNFTs] = useState([])
  const [nftCatalog, setNFTCatalog] = useRecoilState(nftCatalogState)

  const NFTs = nftCatalog

  useEffect(() => {
    const getFiltered = (query) => {
      if (query === "") {
        return NFTs
      }

      const filtered = NFTs.filter((nft) => {
        const content = `${nft.name}`
        return content.toLowerCase().includes(query.toLowerCase())
      })

      if (filtered.length == 0) {
        return NFTs
      }

      return filtered
    }

    setFilteredNFTs(getFiltered(query))
  }, [query, NFTs])

  return (
    <div className={"flex flex-col"}>
      <label className="block text-base font-flow font-bold">NFT</label>

      <Combobox as="div" className={props.className} value={selectedNFT} onChange={async (nft) => {
        if (!selectedNFT || nft.contractName != selectedNFT.contractName) {
          setSelectedNFT(nft)
        }
      }}>

        <div className="relative">
          <Combobox.Input
            className={
              classNames(
                selectedNFT ? `border-emerald` : `border-rose-500`,
                "w-full h-[50px] text-lg font-flow rounded-2xl border bg-white py-2 pl-3 pr-10  focus:border-emerald-dark focus:outline-none focus:ring-1 focus:ring-emerald-dark"
              )
            }

            onChange={(event) => {
              setQuery(event.target.value)
            }}
            displayValue={(nft) => {
              return nft && `${nft.name}`
            }}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          {filteredNFTs.length > 0 && (
            <Combobox.Options className="absolute z-10 rounded-2xl mt-1 max-h-56 w-full overflow-auto  bg-white py-1 text-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filteredNFTs.map((nft) => (
                <Combobox.Option
                  key={`${nft.name}${nft.contractName}`}
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
                        <div className="rounded-full ring-1 ring-emerald w-6 h-6 relative shrink-0">
                          <Image src={nft.logoURL} alt="" fill sizes="33vw" className="rounded-full object-contain" />
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
