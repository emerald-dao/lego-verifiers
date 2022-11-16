import { useEffect, useState } from "react"
import { SpinnerCircular } from "spinners-react"
import useSWR from "swr"
import GuildVerifiersList from "../components/GuildVerifiersList"
import { getVerifiers } from "../flow/scripts"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { discordColorPalette } from "../lib/utils"
import DiscordAccountView from "../components/DiscordAccountView"
import DiscordGuildView from "../components/DiscordGuildView"
import OtherVerifiersList from "../components/OtherVerifiersList"

const convertGuildVerifiers = (verifierMaps, guild) => {
  if (!guild) return []
  const verifierIDs = Object.keys(verifierMaps)
  let verifiers = []

  const guildRoleNameMap = {}

  const rolesLength = guild.roles ? guild.roles.length : 0
  for (let i = 0; i < rolesLength; i++) {
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
        const role = guildRoleNameMap[roleId] || { name: "Unknown", twTextColor: "text-indigo-500", twBgColor: "bg-indigo-100" }
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

const allVerifiersFetcher = async (funcName, address) => {
  return await getVerifiers(address)
}

const userGuildsFetcher = async (funcName, tokenType, accessToken) => {
  const auth = `${tokenType} ${accessToken}`
  const userGuilds = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      authorization: auth,
    },
  });
  return await userGuilds.json();
}

export default function Profile(props) {
  const router = useRouter()
  const { data: session } = useSession()

  const [calledPush, setCalledPush] = useState(false)

  useEffect(() => {
    if (!session && !calledPush) {
      setCalledPush(true)
      router.push("/")
    }
  }, [session])

  const account = props.user && props.user.addr

  const { data: allVerifiersData, error: allVerifiersError } = useSWR(
    account && session ? ["allVerifiersFetcher", account] : null, allVerifiersFetcher
  )

  const { data: userGuildsData, error: userGuildsError } = useSWR(
    account && session ? ["userGuildsFetcher", session.tokenType, session.accessToken] : null, userGuildsFetcher
  )

  const [guildVerifiers, setGuildVerifiers] = useState([])
  const [otherVerifiers, setOtherVerifiers] = useState([])
  const [userGuilds, setUserGuilds] = useState({})

  useEffect(() => {
    if (userGuildsData) {
      const guildsMap = {}
      for (let i = 0; i < userGuildsData.length; i++) {
        const guild = userGuildsData[i]
        guildsMap[guild.id] = guild
      }
      setUserGuilds(guildsMap)
    }
  }, [userGuildsData])

  useEffect(() => {
    if (allVerifiersData) {
      const guildVerifiersData = Object.values(allVerifiersData).filter((v) => v.guildId == session.guild.id)
      const otherVerifiersData = Object.values(allVerifiersData).filter((v) => v.guildId != session.guild.id)
      setGuildVerifiers(convertGuildVerifiers(guildVerifiersData, session.guild))
      setOtherVerifiers(otherVerifiersData.sort((a, b) => b.uuid - a.uuid))
    }
  }, [allVerifiersData])

  const showGuildVerifiersList = () => {
    if (!allVerifiersData) {
      return (
        <div className="flex mt-10 h-[200px] justify-center">
          <SpinnerCircular size={50} thickness={180} speed={100} color="#38E8C6" secondaryColor="#e2e8f0" />
        </div>
      )
    } else {
      return (
        <div className="flex flex-col gap-y-10">
          <GuildVerifiersList verifiers={guildVerifiers} user={props.user} guildId={session.guild.id} />
        </div>
      )
    }
  }

  const showOtherVerifiersList = () => {
    if (!allVerifiersData) {
      return (
        <div className="flex mt-10 h-[200px] justify-center">
          <SpinnerCircular size={50} thickness={180} speed={100} color="#38E8C6" secondaryColor="#e2e8f0" />
        </div>
      )
    } else {
      return (
        <div className="flex flex-col gap-y-10">
          <OtherVerifiersList verifiers={otherVerifiers} user={props.user} guilds={userGuilds} />
        </div>
      )
    }
  }

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
        {showGuildVerifiersList()}
        <div className="w-full justify-between flex gap-x-2 items-center">
          <div className="w-full h-[1px] bg-gray-200"></div>
          <label className="shrink-0 text-gray-400 text-sm">⬇️ VERIFIERS FOR OTHER GUILDS ⬇️</label>
          <div className="w-full h-[1px] bg-gray-200"></div>
        </div>
        {showOtherVerifiersList()}
      </div>
    </div>
  )
}