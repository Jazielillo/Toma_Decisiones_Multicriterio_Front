import { useState, useEffect } from "react";
import ProjectCard from "../../Components/ProjectCard";
import { NewProjectModal } from "../../modals/NewProjectModal";
import { toast } from "react-toastify";
import StepNavigation from "../../Components/StepNavigation";
import { getIdProjectLocalStorage, notifyWorkContextChanged } from "../../helpers";
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    cloneProject,
    type Project,
} from "../../api/projects";

export default function Projects() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Función para obtener los proyectos del endpoint
    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Error al obtener proyectos:', error);
            setError('Error al cargar los proyectos');
        } finally {
            setLoading(false);
        }
    };

    // Cargar proyectos al montar el componente
    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (name: string, description: string) => {
        try {
            const newProject = await createProject({
                title: name,
                description: description
            });

            // Agregar el nuevo proyecto a la lista local
            setProjects(prevProjects => [...prevProjects, newProject]);

            console.log('Proyecto creado:', newProject);
        } catch (error) {
            console.error('Error al crear proyecto:', error);
            setError('Error al crear el proyecto');
        }
    };

    const handleUpdateProject = async (projectId: number, name: string, description: string) => {
        try {
            const updatedProject = await updateProject(projectId, {
                title: name,
                description: description
            });

            // Actualizar el proyecto en la lista local
            setProjects(prevProjects =>
                prevProjects.map(project =>
                    project.id === projectId ? updatedProject : project
                )
            );

            console.log('Proyecto actualizado:', updatedProject);
            if (getIdProjectLocalStorage() === String(projectId)) {
                notifyWorkContextChanged();
            }
        } catch (error) {
            console.error('Error al actualizar proyecto:', error);
            setError('Error al actualizar el proyecto');
        }
    };

    const handleEditProject = (project: Project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleDeleteProject = async (projectId: number) => {
        try {
            await deleteProject(projectId);

            // Actualizar la lista local después de eliminar
            setProjects(prevProjects =>
                prevProjects.filter(project => project.id !== projectId)
            );

            toast.error(`Proyecto Eliminado`, {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colorful",
            });
        } catch (error) {
            console.error('Error al eliminar proyecto:', error);
            setError('Error al eliminar el proyecto');
        }
    };



    const handleViewProject = (project: Project) => {
        console.log('Ver proyecto:', project);
        // Aquí iría tu lógica para navegar al detalle del proyecto
        // Por ejemplo: navigate(`/projects/${project.id}`)
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
    };

    // Función para limpiar errores
    const clearError = () => {
        setError(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <div className="text-xl ml-4">Cargando proyectos...</div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Proyectos</h1>
                    <p className="font-bold text-gray-400">Gestiona tus proyectos de toma de decisiones</p>
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

                <NewProjectModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onCreate={handleCreateProject}
                    onUpdate={handleUpdateProject}
                    project={editingProject || undefined}
                />
            </div>

            <StepNavigation />

            {/* Mostrar errores si existen */}
            {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg flex justify-between items-center">
                    <span className="text-red-400">{error}</span>
                    <button
                        onClick={clearError}
                        className="text-red-400 hover:text-red-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {projects.length === 0 && !loading ? (
                <div className="text-center py-12">
                    <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                    </div>
                    <p className="text-gray-400 text-lg">No tienes proyectos aún</p>
                    <p className="text-gray-500">Crea tu primer proyecto haciendo clic en "Nuevo Proyecto"</p>
                </div>
            ) : (
                <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onEdit={handleEditProject}
                            onDelete={handleDeleteProject}
                            onProjectsUpdate={fetchProjects}
                            onView={handleViewProject}
                        />
                    ))}
                </div>
            )}
        </>
    );
}