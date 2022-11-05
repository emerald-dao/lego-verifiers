import { useEffect, useState } from "react"
import { SpinnerCircular } from "spinners-react"
import useSWR from "swr"
import VerifiersList from "../components/VerifiersList"
import { getVerifiersByGuildId } from "../flow/scripts"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { discordColorPalette } from "../lib/utils"
import DiscordAccountView from "../components/DiscordAccountView"
import DiscordGuildView from "../components/DiscordGuildView"

const convertVerifiers = (verifierMaps, guild) => {
  const verifierIDs = Object.keys(verifierMaps)
  let verifiers = []

  const guildRoleNameMap = {}
  for (let i = 0; i < guild.roles.length; i++) {
    const role = guild.roles[i]
    guildRoleNameMap[role.id] = role
  }

  for (let i = 0; i < verifierIDs.length; i++) {
    const verifierID = verifierIDs[i]
    const verifier = verifierMaps[verifierID]
    if (verifier.guildId == guild.id) {
      const roles = []
      for (let j = 0; j < verifier.roleIds.length; j++) {
        const roleId = verifier.roleIds[j]
        const role = guildRoleNameMap[roleId] || {name: "Unknown", twTextColor: "text-indigo-500", twBgColor: "bg-indigo-100"}
        if (role.name != "Unknown") {
          const hex = discordColorPalette[role.color] ? discordColorPalette[role.color].hex : '#000000'
          role.twBgColor = `bg-[${hex}]/10`
          role.twTextColor = `text-[${hex}]`
        }
        roles.push(role)
      }
      verifier.guildName = guild.name
      verifier.roles = roles
      verifiers.push(verifier)
    }
  }

  return verifiers.sort((a, b) => b.uuid - a.uuid)
}

const verifiersFetcher = async (funcName, address, guildId) => {
  return await getVerifiersByGuildId(address, guildId)
}

export default function Profile(props) {
  const router = useRouter()
  const { data: session } = useSession()

  const account = props.user && props.user.addr
  const { data: verifiersData, error: verifiersError } = useSWR(
    account && session ? ["verifiersFetcher", account, session.guild.id] : null, verifiersFetcher)

  const [verifiers, setVerifiers] = useState([])

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
          <VerifiersList verifiers={verifiers} user={props.user} guildId={session.guild.id} />
        </div>
      )
    }
  }

  useEffect(() => {
    if (verifiersData) {
      setVerifiers(convertVerifiers(verifiersData, session.guild))
    }
  }, [verifiersData])

  const [calledPush, setCalledPush] = useState(false)

  useEffect(() => {
    if (!session && !calledPush) {
      setCalledPush(true)
      router.push("/")
    }
  }, [session])

  return (
    <div className="container mx-auto max-w-[920px] min-w-[380px] px-6">
      <div className="flex flex-col gap-y-10">
        <DiscordAccountView />
        <DiscordGuildView />
        <div className="w-full justify-between flex gap-x-2 items-center">
            <div className="w-full h-[1px] bg-gray-200"></div>
            <label className="shrink-0 text-gray-400 text-sm">⬇️ VERIFIERS FOR THIS GUILD ⬇️</label>
            <div className="w-full h-[1px] bg-gray-200"></div>
          </div>
        {showList()}
      </div>
    </div>
  )
}