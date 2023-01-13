import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import RoleVerifierCreator from './RoleVerifierCreator'
import DiscordRoleSelector from './DiscordRoleSelector'
import LogicSelector, { BasicVerifiersLogic, TraitsLogic } from './LogicSelector'
import { useRecoilState } from "recoil"
import {
  showBasicNotificationState,
  basicNotificationContentState
} from "../lib/atoms.js"
import TraitsEditor from './TraitsEditor'

const getTraitsDefaultValue = (initTraits, traitID) => {
  if (initTraits.length == 0) {
    return [{ id: traitID, trait: "", value: "" }]
  }
  return initTraits
}

const getTraitsIDDefaultValue = (initTraits) => {
  let id = 0
  for (let i = 0; i < initTraits.length; i++) {
    const t = initTraits[i]
    if (t.id > id) {
      id = t.id
    }
  }
  return id + 1
}

export default function TraitFilterModal(props) {
  const [, setShowBasicNotification] = useRecoilState(showBasicNotificationState)
  const [, setBasicNotificationContent] = useRecoilState(basicNotificationContentState)

  const [traits, setTraits] = useState([])

  const { open, setOpen, name, index, updateVerifierTraits, initTraits, initTraitsLogic } = props
  
  const [traitID, setTraitID] = useState(getTraitsIDDefaultValue(initTraits))
  const [traitsLogic, setTraitsLogic] = useState(initTraitsLogic)

  useEffect(() => {
    if (open) {
      const defaultTraits = getTraitsDefaultValue(initTraits, traitID)
      setTraits(defaultTraits)
    }
  }, [open])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-400"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-400"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-4xl">
                  <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">{name}</Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col gap-y-8">
                          <LogicSelector
                            basicVerifiersLogic={traitsLogic}
                            setBasicVerifiersLogic={setTraitsLogic}
                            title={"Traits Logic"}
                          />
                          <TraitsEditor traits={traits} setTraits={setTraits} traitID={traitID} setTraitID={setTraitID} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="h-12 w-24 rounded-xl border border-gray-300 bg-white py-2 px-4 text-sm font-bold text-black shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald focus:ring-offset-2"
                        onClick={() => {
                          setOpen(false)
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="h-12 w-24 items-center ml-4 inline-flex justify-center rounded-xl border border-transparent bg-emerald py-2 px-4 text-sm font-bold text-black shadow-sm hover:bg-emerald-dark focus:outline-none focus:ring-2 focus:ring-emerald focus:ring-offset-2"
                        onClick={() => {
                          const filteredTraits = traits.filter((t) => {
                            return t.trait.trim().length > 0 && t.value.trim().length > 0
                          })
                          updateVerifierTraits(index, filteredTraits, traitsLogic)
                          setOpen(false)
                        }}
                      >
                        {"Save"}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
