import DiscordRoleView from "../components/DiscordRoleView";
import LogicSelector from "../components/LogicSelector";
import MultiRolesVerifierCreator from "../components/MultiRolesVerifierCreator";
import RoleVerifierCreator from "../components/RoleVerifierCreator";

export default function Home(props) {
  const { user } = props 
  return (
    <div className="container mx-auto max-w-[920px] min-w-[380px] px-6">
      <MultiRolesVerifierCreator user={user} />
    </div>


  )
}