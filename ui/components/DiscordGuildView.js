import Image from "next/image"
import { useSession } from 'next-auth/react'

export default function DiscordGuildView(props) {
  const { data: session } = useSession()

  if (!session) {
    return <></>
  }

  const guild = session.guild
  const logoURL = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`

  return (
    <div className="w-full flex flex-col gap-y-2">
      <label className="block text-2xl font-bold font-flow">
        Guild
      </label>
      <div className="flex flex-col gap-y-3">
        <label>You are creating verifiers for</label>
        <div className="py-3 px-5 shadow-md rounded-2xl bg-emerald/30 flex gap-x-3 items-center">
          <div className="rounded-full shrink-0 h-[64px] aspect-square bg-white relative sm:max-w-[64px] ring-1 ring-black ring-opacity-10 overflow-hidden">
            <Image src={logoURL} alt="" className="rounded-2xl" layout="fill" objectFit="cover" />
          </div>
          <div className="flex flex-col">
            <label className="font-bold text-lg">{guild.name}</label>
          </div>
        </div>
      </div>
    </div>
  )
}