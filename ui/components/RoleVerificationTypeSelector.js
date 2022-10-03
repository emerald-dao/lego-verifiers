import { useState, useEffect, useCallback } from "react"
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

export default function RoleVerificationTypeSelector(props) {
  const [, setShowBasicNotification] = useRecoilState(showBasicNotificationState)
  const [, setBasicNotificationContent] = useRecoilState(basicNotificationContentState)
  const [transactionInProgress] = useRecoilState(transactionInProgressState)

  const [query, setQuery] = useState("")
  const { verificationTypes, verificationType, setVerificationType } = props
  const [filteredTypes, setFilteredTypes] = useState([])

  useEffect(() => {
    setFilteredTypes(
      query === ""
        ? verificationTypes
        : verificationTypes.filter((type) => {
          const content = `${type.type}`
          return content.toLowerCase().includes(query.toLowerCase())
        }))
  }, [query, verificationTypes])


  return (
    <div className={"flex flex-col"}>
      <label className="block text-base font-flow font-bold">Verification Type<span className="text-red-600">*</span></label>

      <Combobox as="div" className={props.className} value={props.user && props.user.loggedIn && verificationType} onChange={async (type) => {
        if (!verificationType || type.type != verificationType.type) {
          setVerificationType(type)
        }
      }}>

        <div className="relative mt-1">
          <Combobox.Input
            className="w-full h-[50px] text-lg font-flow rounded-2xl border border-emerald bg-white py-2 pl-3 pr-10  focus:border-emerald-dark focus:outline-none focus:ring-1 focus:ring-emerald-dark"
            onChange={(event) => {
              setQuery(event.target.value)
            }}
            displayValue={(type) => type && `${type.type}`}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          {filteredTypes.length > 0 && (
            <Combobox.Options className="absolute z-10 rounded-2xl mt-1 max-h-56 w-full overflow-auto  bg-white py-1 text-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filteredTypes.map((type) => (
                <Combobox.Option
                  key={type.type}
                  value={type}
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
                        <span className={classNames("ml-3 truncate", selected && "font-semibold")}>{`${type.type}`}</span>
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
