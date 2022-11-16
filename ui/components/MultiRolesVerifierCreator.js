import Image from "next/image"
import React, { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import {
  nftCatalogState,
  transactionInProgressState,
  transactionStatusState,
  showBasicNotificationState,
  basicNotificationContentState
} from "../lib/atoms"
import * as fcl from "@onflow/fcl"
import { classNames, generateScript, getCatalogImageSrc } from "../lib/utils"
import MultiRolesView from "./MultiRolesView"
import VerificationModeSelector, { ModeNormal } from "./VerificationModeSelector"
import { addVerifier } from "../flow/transactions"
import { useRouter } from "next/router"
import DiscordAccountView from "./DiscordAccountView"
import { useSession } from 'next-auth/react'
import DiscordGuildView from "./DiscordGuildView"
import { getNFTCatalog } from "../flow/scripts"
import useSWR from "swr"

const NamePlaceholder = "Verifier's Name";
const DescriptionPlaceholder = "Details about this verifier"

const catalogFetcher = async (funcName) => {
  return await getNFTCatalog()
}

// There are some projects with duplicate contractName/displayName
// to avoid confusion, we don't hanle those projects
const filterCatalog = (catalog) => {
  let catalogArray = []
  let contractNames = {}
  let displayNames = {}
  for (let metadata of Object.values(catalog)) {
    if (metadata.collectionDisplay.name.trim() == "") {
      continue
    }

    let contractNameNum = contractNames[metadata.contractName]
    if (contractNameNum) {
      contractNameNum = contractNameNum + 1
    } else {
      contractNameNum = 1
    }
    contractNames[metadata.contractName] = contractNameNum

    let displayNameNum = displayNames[metadata.collectionDisplay.name]
    if (displayNameNum) {
      displayNameNum = displayNameNum + 1
    } else {
      displayNameNum = 1
    }

    displayNames[metadata.collectionDisplay.name] = displayNameNum
  }

  for (let metadata of Object.values(catalog)) {
    if (contractNames[metadata.contractName] != 1) {
      continue
    }
    if (displayNames[metadata.collectionDisplay.name] != 1) {
      continue
    }
    let copyMetadata = Object.assign({}, metadata)
    copyMetadata.name = metadata.collectionDisplay.name
    copyMetadata.logoURL = getCatalogImageSrc(metadata)
    catalogArray.push(copyMetadata)
  }

  return catalogArray.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
}

export default function MultiRolesVerifierCreator(props) {
  const { user } = props
  const router = useRouter()
  const [transactionInProgress, setTransactionInProgress] = useRecoilState(transactionInProgressState)
  const [transactionStatus, setTransactionStatus] = useRecoilState(transactionStatusState)
  const [, setShowBasicNotification] = useRecoilState(showBasicNotificationState)
  const [, setBasicNotificationContent] = useRecoilState(basicNotificationContentState)
  const [nftCatalog, setNFTCatalog] = useRecoilState(nftCatalogState)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [imageError, setImageError] = useState(null)
  const [roleVerifiers, setRoleVerifiers] = useState([])
  const [mode, setMode] = useState(ModeNormal)

  const { data: session } = useSession()
  const { data: catalogData, error: catalogError } = useSWR(user && session ? ["catalogFetcher"] : null, catalogFetcher)

  useEffect(() => {
    if (catalogData) {
      setNFTCatalog(filterCatalog(catalogData))
    }
  }, [catalogData])

  useEffect(() => {
    if (image) {
      setImageError(null)
    }
  }, [image])

  const canCreateLego = () => {
    return !transactionInProgress && roleVerifiers.length > 0 && name.trim().length > 0
  }

  const handleSubmit = async (event) => {
    if (!(props.user && props.user.loggedIn)) {
      fcl.authenticate()
      return
    }

    const script = generateScript(roleVerifiers, mode)
    const roleIds = roleVerifiers.map((rv) => rv.role.id)

    const res = await addVerifier(
      name,
      description || "",
      image || "",
      script,
      session.guild.id,
      roleIds,
      `${mode.raw}`,
      setTransactionInProgress,
      setTransactionStatus
    )

    handleCreationResponse(res)
  }

  const handleCreationResponse = (res) => {
    if (res && res.status === 4 && res.statusCode === 0) {
      router.push("/profile")
    }
  }

  return (
    <div className="flex flex-col gap-y-10">
      <DiscordAccountView />
      <DiscordGuildView />
      {session ?
        <>
          <div className="w-full justify-between flex gap-x-2 items-center">
            <div className="w-full h-[1px] bg-gray-200"></div>
            <label className="shrink-0 text-gray-400 text-sm">⬇️ BUILD YOUR VERIFIER ⬇️</label>
            <div className="w-full h-[1px] bg-gray-200"></div>
          </div>
          <div className="flex flex-row items-center justify-between gap-x-10 sm:gap-x-16">
            <div className="w-full flex flex-col">
              <label className="block text-2xl font-bold font-flow">
                Image
              </label>
              <div className="relative mt-3 flex items-center">
                <input
                  type="url"
                  name="image"
                  id="image"
                  disabled={transactionInProgress}
                  required
                  className="block w-full font-flow text-lg rounded-2xl px-3 py-2
            border border-emerald focus:border-emerald-dark
            outline-0 focus:outline-2 focus:outline-emerald-dark 
            placeholder:text-gray-300 pr-[64px]"
                  placeholder={"Paste image url here, press Enter to fetch it"}
                  onKeyUp={(event) => {
                    if (event.key == "Enter") {
                      const url = event.target.value
                      if (url && (url.startsWith("https://"))) {
                        setImage(event.target.value)
                      } else {
                        setShowBasicNotification(true)
                        setBasicNotificationContent({ type: "exclamation", title: "Invalid Image URL", detail: "Should start with https://" })
                      }
                    }
                  }}
                />
                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                  <kbd className="inline-flex items-center rounded-xl border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400">
                    Enter
                  </kbd>
                </div>
              </div>
            </div>

            <div className="rounded-full shrink-0 h-[100px] sm:h-[120px] aspect-square relative sm:max-w-[460px] ring-1 ring-black ring-opacity-10 overflow-hidden">
              <Image src={(imageError || !image) ? "/emerald-bot.png" : image} alt="" className="rounded-2xl object-cover" fill sizes="33vw"
                onError={(error) => {
                  setImageError(error)
                  setShowBasicNotification(true)
                  setBasicNotificationContent({ type: "exclamation", title: "Invalid Image URL", detail: "Fetch Image Failed" })
                }} />
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="block text-2xl font-bold font-flow">
              Name<span className="text-red-600">*</span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                disabled={transactionInProgress}
                required
                className="block w-full font-flow text-lg rounded-2xl px-3 py-2
            border border-emerald focus:border-emerald-dark
            outline-0 focus:outline-2 focus:outline-emerald-dark 
            placeholder:text-gray-300"
                placeholder={NamePlaceholder}
                onChange={(event) => {
                  setName(event.target.value)
                }}
              />
            </div>
          </div>

          {/** description */}
          <div className="flex flex-col gap-y-2">
            <label className="block text-2xl font-bold font-flow">
              Description
            </label>
            <div className="mt-1">
              <textarea
                rows={4}
                name="description"
                id="description"
                disabled={transactionInProgress}
                className="focus:ring-emerald-dark rounded-2xl px-3 py-2
                bg-emerald-ultralight resize-none block w-full font-flow text-lg placeholder:text-gray-300
                border border-emerald focus:border-emerald-dark
                outline-0 focus:outline-2 focus:outline-emerald-dark"

                defaultValue={''}
                spellCheck={false}
                placeholder={DescriptionPlaceholder}
                onChange={(event) => { setDescription(event.target.value) }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="block text-2xl font-bold font-flow">
              Verification Mode
            </label>
            <VerificationModeSelector mode={mode} setMode={setMode} />
          </div>

          <MultiRolesView
            roleVerifiers={roleVerifiers}
            setRoleVerifiers={setRoleVerifiers}
          />

          <div>
            <button
              type="button"
              className={classNames(
                !canCreateLego() ? "bg-emerald-light text-gray-500" : "bg-emerald hover:bg-emerald-dark text-black",
                "mt-24 w-full h-[56px] text-lg font-semibold rounded-2xl shadow-drizzle cursor-pointer"
              )}
              disabled={!canCreateLego()}
              onClick={() => {
                handleSubmit()
              }}
            >
              {user.loggedIn ? "Create Verifier" : "Connect Wallet"}
            </button>
          </div>
        </> : null
      }
    </div>
  )
}