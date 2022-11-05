import Image from "next/image"
import { signIn, signOut, useSession } from 'next-auth/react'

export default function DiscordAccountView(props) {
  const { data: session } = useSession()

  return (
    <div className="w-full flex flex-col gap-y-2">
      <label className="block text-2xl font-bold font-flow">
        Discord
      </label>
      <div >
        {session ?
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
              className="h-12 px-6 text-base rounded-2xl font-flow font-semibold shadow-sm text-white bg-discord hover:bg-discord-dark"
              onClick={() => {
                signOut()
              }}>
              Disconnect
            </button>

          </div> 
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
    </div>
  )
}