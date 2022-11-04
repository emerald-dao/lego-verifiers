import MultiRolesVerifierCreator from "../components/MultiRolesVerifierCreator";
import useExitPrompt from "../hooks/useExitPrompt";
import * as fcl from "@onflow/fcl"
import { useEffect, useState } from "react";

export default function Home(props) {
  useExitPrompt(true)

  const { user } = props
  const account = user && user.loggedIn ? user.addr : null

  const [discordAccount, setDiscordAccount] = useState(null)

  return (
    <div className="container mx-auto max-w-[920px] min-w-[380px] px-6">
      {!account || !discordAccount ?
        <div className="w-full mt-10 flex flex-col gap-y-8 items-center justify-center">
          <label className="font-flow font-bold text-3xl sm:text-5xl">Your Verifiers for</label>
          <label className="-mt-4 font-flow font-bold text-3xl sm:text-5xl">Your <span className="text-emerald">🤖️ Emerald Bot</span></label>
          <div className="-mt-2 flex flex-col justify-center items-center">
            <label className="font-flow text-base sm:text-lg">Build unique Emerald Bot verifiers</label>
            <label className="font-flow text-base sm:text-lg">for the roles in your community</label>
          </div>

          {!account ?
            <button
              type="button"
              className="mt-3 h-12 px-6 text-base rounded-2xl font-flow font-semibold shadow-sm text-black bg-emerald hover:bg-emerald-dark"
              onClick={fcl.logIn}
            >
              <label>Connect Wallet</label>
            </button>
            : null}
          {account && !discordAccount ?
            <button
              type="button"
              className="mt-3 h-12 px-6 text-base rounded-2xl font-flow font-semibold shadow-sm text-white bg-discord hover:bg-discord-dark"
              onClick={() => {
                onOpen()
              }}
            >
              <label>Connect Discord</label>
            </button>
            : null}
        </div>
        : <MultiRolesVerifierCreator user={user} />
      }
    </div>
  )
}