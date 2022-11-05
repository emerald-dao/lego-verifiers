import { useState, useEffect } from "react"
import Image from "next/image"
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import { Combobox } from "@headlessui/react"
import { useRecoilState } from "recoil"
import {
  basicNotificationContentState,
  showBasicNotificationState,
  transactionInProgressState,
} from "../lib/atoms"
import publicConfig from "../publicConfig.js"
import { classNames } from "../lib/utils"
import { useSession } from 'next-auth/react'
import useSWR from "swr"

const discordGuildsFetcher = async (funcName, accessToken) => {
  const data = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      authorization: `Bearer ${accessToken}`,
    }
  })
  return data.json()
}

export default function DiscordGuildSelector(props) {
  const [, setShowBasicNotification] = useRecoilState(showBasicNotificationState)
  const [, setBasicNotificationContent] = useRecoilState(basicNotificationContentState)
  const [transactionInProgress] = useRecoilState(transactionInProgressState)

  const { data: session } = useSession()

  const [query, setQuery] = useState("")
  const { selectedGuild, setSelectedGuild} = props
  const [filteredGuilds, setFilteredGuilds] = useState([])
  const [guilds, setGuilds] = useState([])

  const { data: guildsData, error: guildsError} = useSWR(
    session ? ["discordGuildsFetcher", session.accessToken] : null, discordGuildsFetcher)

  console.log(guildsError)

  useEffect(() => {
    if (guildsData) {
      const ownedGuilds = guildsData.filter((guild) => guild.owner)
      for (let i = 0; i < ownedGuilds.length; i++) {
        let guild = ownedGuilds[i]
        const logoURL = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
        guild.logoURL = logoURL
      }
      console.log(ownedGuilds)
      setGuilds(ownedGuilds)
    }
  }, [guildsData])

  useEffect(() => {
    setFilteredGuilds(
      query === ""
        ? guilds
        : guilds.filter((guild) => {
          const content = `${guild.name}`
          return content.toLowerCase().includes(query.toLowerCase())
        }))
  }, [query, guilds])


  return (
      <Combobox as="div" className={props.className} value={props.user && props.user.loggedIn && selectedGuild} onChange={async (guild) => {
        if (!selectedGuild || guild.id != selectedGuild.id) {
          setSelectedGuild(guild)
        }
      }}>

        <div className="relative mt-1">
          <Combobox.Input
            className="w-full h-[50px] text-lg font-flow rounded-2xl border border-emerald bg-white py-2 pl-3 pr-10  focus:border-emerald-dark focus:outline-none focus:ring-1 focus:ring-emerald-dark"
            onChange={(event) => {
              setQuery(event.target.value)
            }}
            displayValue={(guild) => guild && `${guild.name}`}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          {filteredGuilds.length > 0 && (
            <Combobox.Options className="absolute z-10 rounded-2xl mt-1 max-h-56 w-full overflow-auto  bg-white py-1 text-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filteredGuilds.map((guild) => (
                <Combobox.Option
                  key={guild.id}
                  value={guild}
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
                        <div className="w-6 h-6 relative">
                          <Image src={guild.logoURL} alt="" layout="fill" objectFit="cover" className="rounded-full" />
                        </div>
                        <span className={classNames("ml-3 truncate", selected && "font-semibold")}>{`${guild.name}`}</span>
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
  )
}
