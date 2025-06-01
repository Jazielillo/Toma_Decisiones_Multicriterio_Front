import { useState } from "react";
import { CloneProjectModal } from "../modals/CloneProjectModal"
import { DeleteConfirmationModal } from "../modals/DeleteConfirmationModal";
import { cloneProject } from "../api/projects";
import { toast } from "react-toastify";

interface Project {
    title: string;
    description: string;
    id: number;
    owner_id: number;
    created_at: string;
    updated_at: string;
}

interface ProjectCardProps {
    project: Project;
    onEdit?: (project: Project) => void;
    onDelete?: (projectId: number) => void;
    onClone?: (project: Project) => void;
    onView?: (project: Project) => void;
    onProjectsUpdate?: () => void; // Callback para actualizar la lista de proyectos
}

export default function ProjectCard({
    project,
    onEdit,
    onDelete,
    onClone,
    onView,
    onProjectsUpdate
}: ProjectCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCloning, setIsCloning] = useState(false);

    const handleCloneProject = async () => {
        setIsCloning(true);
        try {
            const newTitle = `Copia de ${project.title}`;
            const clonedProject = await cloneProject(project.id, newTitle);

            console.log('Proyecto clonado exitosamente:', clonedProject);

            // Llama al callback onClone si existe
            if (onClone) {
                onClone(clonedProject);
            }

            // Actualiza la lista de proyectos si existe el callback
            if (onProjectsUpdate) {
                onProjectsUpdate();
            }

            // Cierra el modal
            setIsModalOpen(false);

            // Puedes agregar aquí una notificación de éxito si tienes un sistema de notificaciones

        } catch (error) {
            console.error('Error al clonar el proyecto:', error);
            // Aquí puedes agregar manejo de errores, como mostrar un mensaje de error
        } finally {
            setIsCloning(false);
        }
    };

    const handleDeleteProject = () => {
        console.log('Proyecto Eliminado');
        if (onDelete) {
            onDelete(project.id);
        }
    };

    const handleEditProject = () => {
        if (onEdit) {
            onEdit(project);
        }
    };

    const handleProjectSelected = (idProject: number) => {
        //Guardar el idProject en el localStorage
        localStorage.setItem('id_project_selected', String(idProject));

        //Eliminar el idScenario del localStorage
        localStorage.removeItem('id_scenario_selected');

        //Mostrar Alerta
        toast.success(`Proyecto seleccionado: ${project.title}`, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colorful",
        });
    };

    // Formatear fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="w-full border-2 border-gray-600 rounded-lg p-5">
            <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                </svg>

                <h1 className="text-2xl font-bold">{project.title}</h1>
            </div>

            {project.description && (
                <p className="text-gray-300 mt-2">{project.description}</p>
            )}

            <div className="flex justify-between text-gray-400 mt-3">
                <p>Creado: {formatDate(project.created_at)}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between mt-6 gap-4">
                <div className="flex gap-3">
                    <button
                        className="bg-transparent cursor-pointer rounded-md border p-2 text-white flex items-center gap-2"
                        onClick={handleEditProject}
                        title="Editar proyecto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </button>
                    <button
                        className="bg-transparent cursor-pointer rounded-md border p-2 text-white flex items-center gap-2"
                        onClick={() => setIsDeleteModalOpen(true)}
                        title="Eliminar proyecto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                    <button
                        className="bg-transparent cursor-pointer rounded-md border p-2 text-white flex items-center gap-2 disabled:opacity-50"
                        onClick={() => setIsModalOpen(true)}
                        title="Clonar proyecto"
                        disabled={isCloning}
                    >
                        {isCloning ? (
                            <svg className="animate-spin size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                            </svg>
                        )}
                    </button>
                </div>
                <button
                    className="bg-blue-800 hover:bg-blue-600 rounded-md p-2 text-white cursor-pointer"
                    onClick={() => handleProjectSelected(project.id)}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <div className="flex flex-col">
                        <span>Seleccionar</span>
                        <span>Proyecto</span>
                    </div>
                </button>
            </div>
            <CloneProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onClone={handleCloneProject}
                projectName={project.title}
                isLoading={isCloning}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteProject}
                title={`Eliminar "${project.title}"`}
                itemName={project.title} />
        </div>
    )
}