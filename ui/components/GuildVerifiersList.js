import { useState } from "react"
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useRecoilState } from "recoil"
import {
  transactionInProgressState,
  transactionStatusState
} from "../lib/atoms"
import { classNames, getItemsInPage } from '../lib/utils'
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/solid"
import { DocumentDuplicateIcon } from "@heroicons/react/outline"
import { getModeFromRaw } from "./VerificationModeSelector"
import ScriptModal from "./ScriptModal"
import { deleteVerifier } from "../flow/transactions"
import { useSWRConfig } from "swr"

export default function GuildVerifiersList(props) {
  const [transactionInProgress, setTransactionInProgress] = useRecoilState(transactionInProgressState)
  const [, setTransactionStatus] = useRecoilState(transactionStatusState)
  const router = useRouter()

  const { verifiers, user, guildId } = props
  const [openScript, setOpenScript] = useState(false)
  const [currentScript, setCurrentScript] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { mutate } = useSWRConfig()

  return (
    <div className="p-2">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">
            {`Verifiers (${verifiers.length})`}
          </h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div hidden className="text-green-800 bg-green-100"></div>
          <div hidden className="text-blue-800 bg-blue-100"></div>
          <div hidden className="text-red-800 bg-red-100"></div>
          <div hidden className="text-yellow-800 bg-yellow-100"></div>
          {
            <button
              type="button"
              disabled={transactionInProgress}
              className={
                classNames(
                  transactionInProgress ? "bg-emerald-light" : "bg-emerald hover:bg-emerald-dark",
                  "inline-flex items-center rounded-2xl justify-center border border-transparent px-4 py-2 text-sm font-medium text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald focus:ring-offset-2 sm:w-auto"
                )}
              onClick={() => {
                router.push("/")
              }}
            >
              New Verifier
            </button>
          }
        </div>
      </div>

      {verifiers.length > 0 ?
        <div className="mt-3 flex flex-col w-full">
          <div className="px-1 overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-2xl">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Copy
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Description
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Mode
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Roles
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Script
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {getItemsInPage(verifiers, currentPage, pageSize).map((verifier) => {
                      const mode = getModeFromRaw(verifier.verificationMode.rawValue)
                      verifier.mode = mode
                      return verifier
                    }).map((verifier) => (
                      <tr key={verifier.uuid}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center justify-center">
                            <DocumentDuplicateIcon className="h-5 w-5 cursor-pointer" onClick={() => {
                              navigator.clipboard.writeText(`/verifier custom verifierowner:${user.addr} verifierid:${verifier.uuid}`)
                            }} />
                          </div>
                        </td>
                        <td className="py-4 px-3 text-sm">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 relative">
                              <Image className="rounded-lg object-contain" src={(verifier.image && verifier.image != "") ? verifier.image : "/emerald-bot.png"} alt="" fill sizes="33vw" />
                            </div>
                            <div className="flex flex-col ml-4">
                              <label className="block font-medium text-gray-900 break-words max-w-[300px] min-w-[60px]">{verifier.name}</label>
                              <label className="shrink-0 truncate text-gray-500 text-xs">UUID: {verifier.uuid}</label>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 min-w-[140px]">
                          {verifier.description}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <label className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${verifier.mode.tagColor}`}>
                            {verifier.mode.name}
                          </label>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex flex-col gap-y-1 items-start">
                            {
                              verifier.roles.map((role, index) => {
                                return (
                                  <label key={`role-${index}`} className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${role.twBgColor} ${role.twTextColor}`}>
                                    {role.name}
                                  </label>
                                )
                              })
                            }
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <button
                            className="text-blue-500 decoration-1 decoration-blue-500 underline"
                            onClick={() => {
                              setCurrentScript(verifier.scriptCode)
                              setOpenScript(true)
                            }}
                          >Script Code
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <button
                            type="button"
                            disabled={transactionInProgress}
                            className={
                              classNames(
                                transactionInProgress ? "bg-rose-400" : "bg-rose-400 hover:bg-rose-600",
                                "inline-flex items-center rounded-2xl justify-center border border-transparent px-4 py-2 text-sm font-medium text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 sm:w-auto"
                              )}
                            onClick={async () => {
                              await deleteVerifier(verifier.uuid, setTransactionInProgress, setTransactionStatus)
                              mutate(["allVerifiersFetcher", user.addr, guildId])
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {verifiers.length > pageSize ?
            <div className="mt-2 flex justify-between">
              <button
                className="bg-gray-50 p-2 rounded-full overflow-hidden shadow ring-1 ring-black ring-opacity-5"
                disabled={currentPage == 1}
                onClick={() => {
                  if (currentPage == 1) { return }
                  setCurrentPage(currentPage - 1)
                }}
              >
                <ArrowLeftIcon
                  className={`h-5 w-5 ${currentPage == 1 ? "text-gray-400" : "text-black"}`}
                />
              </button>
              <button
                className="bg-gray-50 h-9 w-9 rounded-full overflow-hidden shadow ring-1 ring-black ring-opacity-5"
                disabled={true}
              >{currentPage}</button>
              <button
                className="bg-gray-50 p-2 rounded-full overflow-hidden shadow ring-1 ring-black ring-opacity-5"
                disabled={currentPage * pageSize >= verifiers.length}
                onClick={() => {
                  if (currentPage * pageSize >= verifiers.length) {
                    return
                  }
                  setCurrentPage(currentPage + 1)
                }}
              >
                <ArrowRightIcon className={`h-5 w-5 ${currentPage * pageSize >= verifiers.length ? "text-gray-400" : "text-black"}`} />
              </button>
            </div> : null
          }
        </div> :
        <div className="flex mb-10 justify-center">
          <label className="leading-[200px] font-flow font-medium text-base text-gray-500">
            {"There is nothing here"}
          </label>
        </div>}
      <ScriptModal open={openScript} setOpen={setOpenScript} script={currentScript} />
    </div>
  )
}