import DiscordView from "../components/DiscordView";
import LogicSelector from "../components/LogicSelector";
import VerifiersComposer from "../components/VerifiersComposer";

export default function Home() {
  return (
    <div className="container mx-auto max-w-[920px] min-w-[380px] px-6">
      <div className="flex flex-col gap-y-10">
        <DiscordView />
        <LogicSelector />
        <VerifiersComposer />
      </div>
    </div>


  )
}