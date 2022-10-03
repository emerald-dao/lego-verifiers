import DiscordRoleView from "../components/DiscordRoleView";
import LogicSelector from "../components/LogicSelector";
import RoleVerifierCreator from "../components/RoleVerifierCreator";

export default function Home() {
  return (
    <div className="container mx-auto max-w-[920px] min-w-[380px] px-6">
      <div className="flex flex-col gap-y-10">
        <DiscordRoleView />
        <LogicSelector />
        <RoleVerifierCreator />
      </div>
    </div>


  )
}