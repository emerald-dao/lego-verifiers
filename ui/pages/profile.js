import { useEffect, useState } from "react"
import { SpinnerCircular } from "spinners-react"
import useSWR from "swr"
import VerifiersList from "../components/VerifiersList"
import { getVerifiers } from "../flow/scripts"
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from "next/image"
import { useRecoilState } from "recoil"
import {
  transactionInProgressState,
} from "../lib/atoms"
import { useRouter } from 'next/router'
import { classNames } from "../lib/utils"

const convertVerifiers = (verifierMaps) => {
  const verifierIDs = Object.keys(verifierMaps)
  let verifiers = []
  for (let i = 0; i < verifierIDs.length; i++) {
    const verifierID = verifierIDs[i]
    const verifier = verifierMaps[verifierID]
    verifiers.push(verifier)
  }

  return verifiers.sort((a, b) => b.uuid - a.uuid)
}

const verifiersFetcher = async (funcName, address) => {
  return await getVerifiers(address)
}

export default function Profile(props) {
  const [transactionInProgress, setTransactionInProgress] = useRecoilState(transactionInProgressState)
  const router = useRouter()

  const account = props.user && props.user.addr
  const { data: verifiersData, error: verifiersError } = useSWR(
    account ? ["verifiersFetcher", account] : null, verifiersFetcher)

  const { data: session } = useSession()
  const [verifiers, setVerifiers] = useState([])

  if (session) {
    console.log("image:", session.user.image)
  }

  const showList = () => {
    if (!verifiersData) {
      return (
        <div className="flex mt-10 h-[200px] justify-center">
          <SpinnerCircular size={50} thickness={180} speed={100} color="#38E8C6" secondaryColor="#e2e8f0" />
        </div>
      )
    } else {
      return (
        <div className="flex flex-col gap-y-10">
          <VerifiersList verifiers={verifiers} user={props.user} />
        </div>
      )
    }
  }

  useEffect(() => {
    if (verifiersData) {
      setVerifiers(convertVerifiers(verifiersData))
    }
  }, [verifiersData])

  return (
    <div className="container mx-auto max-w-[920px] min-w-[380px] px-6">
      <div className="flex flex-col gap-y-12">

        <div>
          <label className="mb-5 block text-2xl font-bold font-flow">
            Discord
          </label>
          {
            session ?
              <div className="flex gap-x-2 justify-between items-center">
                <div className="flex gap-x-3 items-center">
                  <div className="rounded-full shrink-0 h-[64px] aspect-square bg-white relative sm:max-w-[64px] ring-1 ring-black ring-opacity-10 overflow-hidden">
                    <Image src={session.user.image} alt="" className="rounded-2xl" layout="fill" objectFit="cover" />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold text-lg">{session.user.name}</label>
                    <label>#{session.user.discriminator}</label>
                  </div>
                </div>

                <button
                  type="button"
                  className="h-12 px-6 text-base rounded-2xl font-flow font-semibold shadow-sm text-white bg-discord hover:bg-discord-dark"
                  onClick={() => {
                    signOut()
                  }}>
                  Disconnect
                </button>

              </div> :
              <button
                type="button"
                className="mt-3 h-12 px-6 text-base rounded-2xl font-flow font-semibold shadow-sm text-white bg-discord hover:bg-discord-dark"
                onClick={() => {
                  signIn('discord')
                }}
              >
                <label>Connect Discord</label>
              </button>
          }
        </div>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900">
              {`Verifiers (${verifiers.length})`}
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
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
        {showList()}
      </div>
    </div>
  )
}