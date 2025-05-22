import { useState } from "react";
import ProjectCard from "../../Components/ProjectCard";
import { NewProjectModal } from "../../modals/NewProjectModal";

export default function Projects() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateProject = (name: string, description: string) => {
        console.log('Proyecto creado:', { name, description });
        // Aquí iría tu lógica para crear el proyecto
    };

    return (
        <>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Proyectos</h1>
                    <p className="font-bold text-gray-400">Gestiona tus proyectos de toma de decisiones</p>
                </div>
                <button
                    className="bg-blue-800 cursor-pointer hover:bg-blue-700 rounded-md px-4 py-3 text-white flex items-center gap-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                    Nuevo Escenario
                </button>

                <NewProjectModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onCreate={handleCreateProject}
                />

            </div>

            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7">
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
            </div>
        </>
    )
}