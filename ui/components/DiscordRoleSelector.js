import { useState, useEffect } from "react"
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid"
import { Combobox } from "@headlessui/react"
import { classNames, discordColorPalette } from "../lib/utils"
import { useSession } from 'next-auth/react'

export default function DiscordRoleSelector(props) {
  const { data: session } = useSession()

  const [query, setQuery] = useState("")
  const { selectedRole, setSelectedRole } = props
  const [filteredRoles, setFilteredRoles] = useState([])
  const [roles, setRoles] = useState([])

  useEffect(() => {
    if (session) {
      const availableRoles = session.guild.roles.filter((role) => {
        return role.name != "@everyone" && !role.tags
      })
      for (let i = 0; i < availableRoles.length; i++) {
        const r = availableRoles[i]
        const hex = discordColorPalette[r.color] ? discordColorPalette[r.color].hex : '#000000'
        r.hexColor = hex
        r.twTextColor = `text-[${hex}]`
        r.twBgColor = `bg-[${hex}]`
      }
      setRoles(availableRoles)
    }
  }, [session])

  useEffect(() => {
    setFilteredRoles(
      query === ""
        ? roles
        : roles.filter((role) => {
          const content = `${role.name}`
          return content.toLowerCase().includes(query.toLowerCase())
        }))
  }, [query, roles])


  return (
    <div className="flex flex-col gap-y-2">
      <div>
        {/* Discord Colors */}
        <div className='text-[#000000] hidden'></div>
        <div className='text-[#1ABC9C] hidden'></div>
        <div className='text-[#57F287] hidden'></div>
        <div className='text-[#1F8B4C] hidden'></div>
        <div className='text-[#3498DB] hidden'></div>
        <div className='text-[#206694] hidden'></div>
        <div className='text-[#9B59B6] hidden'></div>
        <div className='text-[#71368A] hidden'></div>
        <div className='text-[#E91E63] hidden'></div>
        <div className='text-[#AD1457] hidden'></div>
        <div className='text-[#F1C40F] hidden'></div>
        <div className='text-[#C27C0E] hidden'></div>
        <div className='text-[#E67E22] hidden'></div>
        <div className='text-[#A84300] hidden'></div>
        <div className='text-[#ED4245] hidden'></div>
        <div className='text-[#992D22] hidden'></div>
        <div className='text-[#95A5A6] hidden'></div>
        <div className='text-[#979C9F] hidden'></div>
        <div className='text-[#7F8C8D] hidden'></div>
        <div className='text-[#BCC0C0] hidden'></div>
        <div className='text-[#34495E] hidden'></div>
        <div className='text-[#2C3E50] hidden'></div>
        <div className='text-[#FFFF00] hidden'></div>
        <div className='text-[#FFFFFF] hidden'></div>
        <div className='text-[#99AAb5] hidden'></div>
        <div className='text-[#23272A] hidden'></div>
        <div className='text-[#2C2F33] hidden'></div>
        <div className='text-[#23272A] hidden'></div>
        <div className='text-[#5865F2] hidden'></div>
        <div className='text-[#57F287] hidden'></div>
        <div className='text-[#FEE75C] hidden'></div>
        <div className='text-[#EB459E] hidden'></div>
        <div className='text-[#ED4245] hidden'></div>
        <div className='text-[#607D8B] hidden'></div>
        <div className='text-[#546E7A] hidden'></div>
        <div className='text-[#36393F] hidden'></div>
      </div>
      <label className="block text-2xl font-bold font-flow">
        Role
      </label>
      <Combobox as="div" className={props.className} value={props.user && props.user.loggedIn && selectedRole} onChange={async (role) => {
        if (!selectedRole || role.id != selectedRole.id) {
          setSelectedRole(role)
        }
      }}>

        <div className="relative mt-1">
          <Combobox.Input
            className={`w-full h-[50px] text-lg font-flow rounded-2xl border border-emerald bg-white py-2 pl-3 pr-10  focus:border-emerald-dark focus:outline-none focus:ring-1 focus:ring-emerald-dark`}
            onChange={(event) => {
              setQuery(event.target.value)
            }}
            displayValue={(role) => role && `${role.name}`}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          {filteredRoles.length > 0 && (
            <Combobox.Options className="absolute z-10 rounded-2xl mt-1 max-h-56 w-full overflow-auto  bg-white py-1 text-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filteredRoles.map((role) => (
                <Combobox.Option
                  key={role.name}
                  value={role}
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
                        <div className={`${role.twBgColor} rounded-full h-4 w-4`}></div>
                        <span className={classNames(`ml-3 truncate`, selected && "font-semibold")}>{`${role.name}`}</span>
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
