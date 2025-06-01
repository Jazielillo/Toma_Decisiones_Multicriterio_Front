// Scenarios.tsx - Versión mejorada con reactividad en tiempo real
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import ScenarioCard from "../../Components/ScenarioCard";
import { NewScenarioModal } from "../../modals/NewScenarioModal";
import { getScenarios, createScenario, updateScenario, deleteScenario, cloneScenario, type Scenario } from "../../api/scenarios";
import { useProjectId, setIdScenarioLocalStorage } from "../../helpers/get_auth_header";

interface ScenariosProps {
    projectName?: string;
}

export default function Scenarios({ projectName = "Proyecto" }: ScenariosProps) {
    const router = useNavigate();
    const currentProjectId = useProjectId(); // Hook personalizado que reacciona a cambios

    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
    const [loading, setLoading] = useState(true);

    // Cargar escenarios cuando cambia el ID del proyecto
    useEffect(() => {
        if (currentProjectId) {
            loadScenarios();
        } else {
            setScenarios([]);
            setLoading(false);
        }
    }, [currentProjectId]); // Se ejecuta cada vez que cambia currentProjectId

    const loadScenarios = async () => {
        if (!currentProjectId) {
            setScenarios([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getScenarios();
            setScenarios(data);
        } catch (error) {
            console.error('Error loading scenarios:', error);
            toast.error('Error al cargar los escenarios', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colorful",
            });
            setScenarios([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateScenario = async (name: string, description: string) => {
        if (!currentProjectId) {
            toast.error('No hay proyecto seleccionado');
            return;
        }

        try {
            const newScenario = await createScenario({
                name,
                description,
                proyecto_id: parseInt(currentProjectId)
            });

            setScenarios(prev => [...prev, newScenario]);

            toast.success('Escenario creado exitosamente', {
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
            console.error('Error creating scenario:', error);
            toast.error('Error al crear el escenario', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colorful",
            });
        }
    };

    const handleUpdateScenario = async (scenarioId: number, name: string, description: string) => {
        try {
            const updatedScenario = await updateScenario(scenarioId, { name, description });

            setScenarios(prev => prev.map(scenario =>
                scenario.id === scenarioId ? updatedScenario : scenario
            ));

            toast.success('Escenario actualizado exitosamente', {
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
            console.error('Error updating scenario:', error);
            toast.error('Error al actualizar el escenario', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colorful",
            });
        }
    };

    const handleDeleteScenario = async (scenarioId: number) => {
        try {
            await deleteScenario(scenarioId);

            setScenarios(prev => prev.filter(scenario => scenario.id !== scenarioId));

            toast.success('Escenario eliminado exitosamente', {
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
            console.error('Error deleting scenario:', error);
            toast.error('Error al eliminar el escenario', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colorful",
            });
        }
    };

    const handleCloneScenario = async (scenarioId: number, newName: string) => {
        try {
            const clonedScenario = await cloneScenario(scenarioId, newName);

            setScenarios(prev => [...prev, clonedScenario]);

            toast.success('Escenario clonado exitosamente', {
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
            console.error('Error cloning scenario:', error);
            toast.error('Error al clonar el escenario', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colorful",
            });
        }
    };

    const handleUseScenario = (scenario: Scenario) => {
        // Guardar el ID del escenario seleccionado en localStorage
        setIdScenarioLocalStorage(scenario.id.toString());

        toast.success(`Escenario seleccionado: ${scenario.name}`, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colorful",
        });

        // Aquí puedes agregar lógica adicional para usar el escenario
        console.log('Escenario seleccionado:', scenario);
        console.log('ID guardado en localStorage:', scenario.id);
    };

    const openEditModal = (scenario: Scenario) => {
        setEditingScenario(scenario);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingScenario(null);
    };

    const handleModalSubmit = (name: string, description: string) => {
        if (editingScenario) {
            handleUpdateScenario(editingScenario.id, name, description);
        } else {
            handleCreateScenario(name, description);
        }
    };

    const goToProjects = () => {
        router('/projects');
    };

    // Mostrar loading
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Mostrar mensaje cuando no hay proyecto seleccionado
    if (!currentProjectId) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="text-center">
                    <div className="mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-20 mx-auto text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026C4.617 9.75 5.25 10.383 5.25 11.25s-.633 1.5-1.156 1.5c-.117 0-.232-.009-.344-.026m-4.5 0a2.25 2.25 0 0 0-.1.557c0 1.12.846 2.042 1.94 2.136.423.036.888.061 1.38.061h3.375c.52 0 1.023-.074 1.5-.21m-4.5-2.544a2.25 2.25 0 0 0-.1-.557m4.6 2.101c.317.21.69.363 1.075.819.165.196.3.419.416.664.107.244.183.502.24.767.057.265.097.532.112.803.015.271-.004.543-.057.814-.114.683-.37 1.333-.756 1.929a3.998 3.998 0 0 1-1.564 1.35c-.226.13-.471.234-.729.302-.258.069-.526.107-.796.107-.27 0-.538-.038-.796-.107a3.818 3.818 0 0 1-.729-.302 3.998 3.998 0 0 1-1.564-1.35c-.386-.596-.642-1.246-.756-1.929-.053-.271-.072-.543-.057-.814.015-.271.055-.538.112-.803.057-.265.133-.523.24-.767.083-.245.218-.468.416-.664.385-.456.758-.609 1.075-.819Z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-200 mb-4">
                        Debes seleccionar un proyecto
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Para ver y gestionar escenarios, primero necesitas seleccionar un proyecto.
                    </p>
                    <button
                        onClick={goToProjects}
                        className="bg-blue-600 hover:bg-blue-700 rounded-md px-6 py-3 text-white font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        Ir a Seleccionar Proyecto
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Escenarios</h1>
                    <p className="font-bold text-gray-400">Gestiona tus escenarios</p>
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

                <NewScenarioModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onCreate={handleModalSubmit}
                    onUpdate={handleModalSubmit}
                    scenario={editingScenario}
                />
            </div>

            {scenarios.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-16 mx-auto text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No hay escenarios</h3>
                    <p className="text-gray-500 mb-4">Crea tu primer escenario para comenzar</p>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2 text-white"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Crear Escenario
                    </button>
                </div>
            ) : (
                <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-7">
                    {scenarios.map((scenario) => (
                        <ScenarioCard
                            key={scenario.id}
                            scenario={scenario}
                            onEdit={() => openEditModal(scenario)}
                            onDelete={() => handleDeleteScenario(scenario.id)}
                            onClone={(newName) => handleCloneScenario(scenario.id, newName)}
                            onUse={() => handleUseScenario(scenario)}
                        />
                    ))}
                </div>
            )}
        </>
    );
}