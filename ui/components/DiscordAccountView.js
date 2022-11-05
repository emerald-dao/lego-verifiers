import Image from "next/image"
import { signOut, useSession } from 'next-auth/react'
import { useRecoilState } from "recoil"
import {
  transactionInProgressState,
} from "../lib/atoms"

export default function DiscordAccountView(props) {
  const [transactionInProgress,] = useRecoilState(transactionInProgressState)
  const { data: session } = useSession()

  if (!session) {
    return <></>
  }

  return (
    <div className="w-full flex flex-col gap-y-2">
      <label className="block text-2xl font-bold font-flow">
        Discord
      </label>
      <div className="flex flex-col gap-y-3">
        <label>You have logged in as</label>
        <div className="shrink truncate py-3 px-5 shadow-md rounded-2xl bg-emerald/30 flex flex-col sm:flex-row gap-y-3 sm:gap-x-2 sm:justify-between sm:items-center">
          <div className="flex gap-x-3 items-center">
            <div className="rounded-full shrink-0 h-[64px] aspect-square bg-white relative sm:max-w-[64px] ring-1 ring-black ring-opacity-10 overflow-hidden">
              <Image src={session.user.image} alt="" className="rounded-2xl" layout="fill" objectFit="cover" />
            </div>
            <div className="shrink truncate flex flex-col">
              <label className="shrink truncate font-bold text-lg">{session.user.name}</label>
              <label className="shrink truncate">#{session.user.discriminator}</label>
            </div>
          </div>

          <button
            type="button"
            className="h-12 px-6 text-base rounded-2xl font-flow font-semibold shadow-sm text-white disabled:bg-discord/50 disabled:hover:bg-discord/50 bg-discord hover:bg-discord-dark"
            disabled={transactionInProgress}
            onClick={() => {
              signOut()
            }}>
            Disconnect
          </button>

        </div>
      </div>

    </div>
  )
}