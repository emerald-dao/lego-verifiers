import MultiRolesVerifierCreator from "../components/MultiRolesVerifierCreator";
import useExitPrompt from "../hooks/useExitPrompt";
import * as fcl from "@onflow/fcl"
import { signIn, signOut, useSession } from 'next-auth/react'


export default function Home(props) {
  // useExitPrompt(true)

  const { user } = props
  const { data: session } = useSession()
  const account = user && user.loggedIn ? user.addr : null
  const homePage = () => {
    if (!account) {
      return (
        <div className="w-full mt-10 flex flex-col gap-y-8 items-center justify-center">
          <div className="flex flex-col gap-y-5 sm:gap-y-8 items-center">
            <label className="font-flow font-bold text-2xl sm:text-5xl">A verification and utility</label>
            <label className="-mt-4 font-flow font-bold text-2xl sm:text-5xl">Discord bot <span className="text-emerald">#onFlow</span></label>
          </div>
          <div className="-mt-2 flex flex-col justify-center items-center">
            <label className="font-flow text-sm sm:text-lg">Build unique verifiers to gate access to channels.</label>
            <label className="font-flow text-sm sm:text-lg">Identify your users using our identity service.</label>
            <label className="font-flow text-sm sm:text-lg">Better manage your Discord community.</label>
          </div>

          <button
            type="button"
            className="cursor-pointer mt-3 h-12 px-6 text-base rounded-2xl font-flow font-semibold shadow-sm text-black bg-emerald hover:bg-emerald-dark"
            onClick={fcl.logIn}
          >
            Connect Wallet
          </button>
        </div>
      )
    }

    if (!session) {
      return (
        <div className="w-full mt-10 flex flex-col gap-y-8 items-center justify-center">
          <div className="flex flex-col gap-y-5 sm:gap-y-8 items-center">
            <label className="font-flow font-bold text-2xl sm:text-5xl">A verification and utility</label>
            <label className="-mt-4 font-flow font-bold text-2xl sm:text-5xl">Discord bot <span className="text-emerald">#onFlow</span></label>
          </div>
          <div className="-mt-2 flex flex-col justify-center items-center">
            <label className="font-flow text-sm sm:text-lg">Connect to the server you want to</label>
            <label className="font-flow text-sm sm:text-lg">set up verifications in.</label>
          </div>

          <button
            type="button"
            className="cursor-pointer mt-3 h-12 px-6 text-base rounded-2xl font-flow font-semibold shadow-sm text-white bg-discord hover:bg-discord-dark"
            onClick={() => {
              signIn('discord')
            }
            }
          >
            Connect Discord
          </button>
        </div>
      )
    }

    return <MultiRolesVerifierCreator user={user} />
  }

  return (
    <div className="container mx-auto max-w-[920px] min-w-[380px] px-6">
      {homePage()}
      <div>
        {/* Discord Colors */}
        <div className='text-[#000000] bg-[#000000] bg-[#000000]/10 hidden'></div>
        <div className='text-[#1ABC9C] bg-[#1ABC9C] bg-[#1ABC9C]/10 hidden'></div>
        <div className='text-[#57F287] bg-[#57F287] bg-[#57F287]/10 hidden'></div>
        <div className='text-[#1F8B4C] bg-[#1F8B4C] bg-[#1F8B4C]/10 hidden'></div>
        <div className='text-[#3498DB] bg-[#3498DB] bg-[#3498DB]/10 hidden'></div>
        <div className='text-[#206694] bg-[#206694] bg-[#206694]/10 hidden'></div>
        <div className='text-[#9B59B6] bg-[#9B59B6] bg-[#9B59B6]/10 hidden'></div>
        <div className='text-[#71368A] bg-[#71368A] bg-[#71368A]/10 hidden'></div>
        <div className='text-[#E91E63] bg-[#E91E63] bg-[#E91E63]/10 hidden'></div>
        <div className='text-[#AD1457] bg-[#AD1457] bg-[#AD1457]/10 hidden'></div>
        <div className='text-[#F1C40F] bg-[#F1C40F] bg-[#F1C40F]/10 hidden'></div>
        <div className='text-[#C27C0E] bg-[#C27C0E] bg-[#C27C0E]/10 hidden'></div>
        <div className='text-[#E67E22] bg-[#E67E22] bg-[#E67E22]/10 hidden'></div>
        <div className='text-[#A84300] bg-[#A84300] bg-[#A84300]/10 hidden'></div>
        <div className='text-[#ED4245] bg-[#ED4245] bg-[#ED4245]/10 hidden'></div>
        <div className='text-[#992D22] bg-[#992D22] bg-[#992D22]/10 hidden'></div>
        <div className='text-[#95A5A6] bg-[#95A5A6] bg-[#95A5A6]/10 hidden'></div>
        <div className='text-[#979C9F] bg-[#979C9F] bg-[#979C9F]/10 hidden'></div>
        <div className='text-[#7F8C8D] bg-[#7F8C8D] bg-[#7F8C8D]/10 hidden'></div>
        <div className='text-[#BCC0C0] bg-[#BCC0C0] bg-[#BCC0C0]/10 hidden'></div>
        <div className='text-[#34495E] bg-[#34495E] bg-[#34495E]/10 hidden'></div>
        <div className='text-[#2C3E50] bg-[#2C3E50] bg-[#2C3E50]/10 hidden'></div>
        <div className='text-[#FFFF00] bg-[#FFFF00] bg-[#FFFF00]/10 hidden'></div>
        <div className='text-[#FFFFFF] bg-[#FFFFFF] bg-[#FFFFFF]/10 hidden'></div>
        <div className='text-[#99AAb5] bg-[#99AAb5] bg-[#99AAb5]/10 hidden'></div>
        <div className='text-[#23272A] bg-[#23272A] bg-[#23272A]/10 hidden'></div>
        <div className='text-[#2C2F33] bg-[#2C2F33] bg-[#2C2F33]/10 hidden'></div>
        <div className='text-[#23272A] bg-[#23272A] bg-[#23272A]/10 hidden'></div>
        <div className='text-[#5865F2] bg-[#5865F2] bg-[#5865F2]/10 hidden'></div>
        <div className='text-[#57F287] bg-[#57F287] bg-[#57F287]/10 hidden'></div>
        <div className='text-[#FEE75C] bg-[#FEE75C] bg-[#FEE75C]/10 hidden'></div>
        <div className='text-[#EB459E] bg-[#EB459E] bg-[#EB459E]/10 hidden'></div>
        <div className='text-[#ED4245] bg-[#ED4245] bg-[#ED4245]/10 hidden'></div>
        <div className='text-[#607D8B] bg-[#607D8B] bg-[#607D8B]/10 hidden'></div>
        <div className='text-[#546E7A] bg-[#546E7A] bg-[#546E7A]/10 hidden'></div>
        <div className='text-[#36393F] bg-[#36393F] bg-[#36393F]/10 hidden'></div>
      </div>
    </div>
  )
}