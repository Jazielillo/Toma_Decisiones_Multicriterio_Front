import { useState } from "react";
import ScenarioCard from "../../Components/ScenarioCard";
import { NewScenarioModal } from "../../modals/NewScenarioModal";

export default function Scenarios() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateScenario = (name: string, description: string) => {
        console.log('Escenario creado:', { name, description });
        // Aquí iría tu lógica para crear el proyecto
    };

    return (
        <>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Escenarios</h1>
                    <p className="font-bold text-gray-400">Proyecto: Playa</p>
                </div>
                <button
                    className="bg-blue-800 cursor-pointer hover:bg-blue-700 rounded-md px-4 py-3 text-white flex items-center gap-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                    Nuevo Proyecto
                </button>

                <NewScenarioModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onCreate={handleCreateScenario}
                />

            </div>

            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7">
                <ScenarioCard />
                <ScenarioCard />
                <ScenarioCard />
                <ScenarioCard />
                <ScenarioCard />
                <ScenarioCard />
            </div>
        </>
    )
}