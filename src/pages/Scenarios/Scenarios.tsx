import ScenarioCard from "../../Components/ScenarioCard";
import SideBar from "../../Components/SideBar";


export default function Scenarios() {
    return (
        <SideBar>
            <div className="mb-8">
                <h1 className="text-4xl font-bold">Escenarios</h1>
                <p className="font-bold text-gray-400">Proyecto: Playa</p>
            </div>
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7">
                <ScenarioCard />
                <ScenarioCard />
                <ScenarioCard />
                <ScenarioCard />
                <ScenarioCard />
                <ScenarioCard />
            </div>

        </SideBar>
    )
}
