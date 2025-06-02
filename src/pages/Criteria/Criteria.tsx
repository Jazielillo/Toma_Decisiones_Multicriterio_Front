import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NewCriteriaModal } from "../../modals/NewCriteriaModal";
import { DeleteConfirmationModal } from "../../modals/DeleteConfirmationModal";
import { getCriterios, createCriterio, deleteCriterio, type Criterio } from "../../api/criteria";
import { useScenarioId } from "../../helpers";

export default function Criteria() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [criterios, setCriterios] = useState<Criterio[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedCriterio, setSelectedCriterio] = useState<Criterio | null>(null);
    const [error, setError] = useState<string>("");

    const scenarioId = useScenarioId();
    const router = useNavigate();

    // Cargar criterios cuando cambie el scenario ID
    useEffect(() => {
        const loadCriterios = async () => {
            if (!scenarioId) {
                setCriterios([]);
                return;
            }

            try {
                setLoading(true);
                setError("");
                const data = await getCriterios();
                setCriterios(data);
            } catch (error) {
                console.error('Error al cargar criterios:', error);
                setError('Error al cargar los criterios');
                setCriterios([]);
            } finally {
                setLoading(false);
            }
        };

        loadCriterios();
    }, [scenarioId]);

    const handleCreateCriteria = async (name: string, description: string, isMaximize: boolean) => {
        if (!scenarioId) {
            setError('No hay escenario seleccionado');
            return;
        }

        try {
            setError("");
            const newCriterio = await createCriterio({
                name,
                description,
                is_benefit: isMaximize,
                escenario_id: parseInt(scenarioId),
                weight: 0, // Valor por defecto
                preference_threshold: 0, // Valor por defecto
                indifference_threshold: 0, // Valor por defecto
                veto_threshold: 0 // Valor por defecto
            });

            // Actualizar la lista local
            setCriterios(prev => [...prev, newCriterio]);
            console.log('Criterio creado:', newCriterio);
        } catch (error) {
            console.error('Error al crear criterio:', error);
            setError('Error al crear el criterio');
        }
    };

    const handleDeleteCriteria = async () => {
        if (!selectedCriterio) return;

        try {
            setDeleteLoading(true);
            setError("");
            await deleteCriterio(selectedCriterio.id);

            // Actualizar la lista local
            setCriterios(prev => prev.filter(c => c.id !== selectedCriterio.id));
            setSelectedCriterio(null);
            setIsDeleteModalOpen(false);
            console.log('Criterio eliminado:', selectedCriterio.name);
        } catch (error) {
            console.error('Error al eliminar criterio:', error);
            setError('Error al eliminar el criterio');
        } finally {
            setDeleteLoading(false);
        }
    };

    const openDeleteModal = (criterio: Criterio) => {
        setSelectedCriterio(criterio);
        setIsDeleteModalOpen(true);
    };

    const goToScenarios = () => {
        router('/scenarios');
    };

    // Mostrar loading
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Mostrar mensaje cuando no hay escenario seleccionado
    if (!scenarioId) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="text-center">
                    <div className="mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-20 mx-auto text-gray-500">
                            <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-200 mb-4">
                        Debes seleccionar un escenario
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Para ver y gestionar criterios, primero necesitas seleccionar un escenario.
                    </p>
                    <button
                        onClick={goToScenarios}
                        className="bg-blue-600 hover:bg-blue-700 rounded-md px-6 py-3 text-white font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        Ir a Seleccionar Escenario
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Responsive Header Section */}
            <div className="mb-4 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Criterios</h1>
                    <p className="font-bold text-gray-400 text-sm md:text-base">Proyecto: Proyecto 1 | Escenario: Escenario perron</p>
                </div>
                <button
                    className="bg-blue-800 cursor-pointer hover:bg-blue-700 rounded-md px-3 py-2 md:px-4 md:py-3 text-white flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto mt-3 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setIsModalOpen(true)}
                    disabled={!scenarioId}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 md:size-5">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                    Nuevo Criterio
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            {/* Responsive Navigation Buttons */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
                <button className="border border-gray-600 hover:bg-gray-800 rounded-md px-3 py-1 md:px-4 md:py-2 text-white text-sm md:text-base">
                    Ir a Alternativas
                </button>
                <button className="border border-gray-600 hover:bg-gray-800 rounded-md px-3 py-1 md:px-4 md:py-2 text-white text-sm md:text-base">
                    Ir a Pesos
                </button>
            </div>

            {/* Main Content Area */}
            <div className="border border-gray-600 rounded-lg p-3 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 md:size-6 text-blue-500">
                        <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                    </svg>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Criterios de evaluación</h2>
                </div>
                <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">Define los criterios que utilizarás para evaluar las alternativas.</p>

                <div className="w-full overflow-x-auto">
                    <div className="min-w-[600px]">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 border-b border-gray-600 pb-2 md:pb-3 mb-3 md:mb-4">
                            <div className="col-span-3">
                                <h3 className="font-bold text-gray-300 text-sm md:text-base">Nombre</h3>
                            </div>
                            <div className="col-span-4">
                                <h3 className="font-bold text-gray-300 text-sm md:text-base">Descripción</h3>
                            </div>
                            <div className="col-span-3">
                                <h3 className="font-bold text-gray-300 text-sm md:text-base">Objetivo</h3>
                            </div>
                            <div className="col-span-2">
                                <h3 className="font-bold text-gray-300 text-sm md:text-base">Acciones</h3>
                            </div>
                        </div>

                        {/* Table Rows */}
                        {criterios.length === 0 ? (
                            <div className="py-8 text-center">
                                <div className="mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-16 mx-auto text-gray-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h4.125M8.25 8.25V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.747-.057 1.124-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5c-.87 0-1.637.544-1.943 1.305m6.318 0c.065.21.1.433.1.664 0 .414-.336.75-.75.75h-4.5a-.75.75 0 0 1-.75-.75 2.25 2.25 0 0 1 .1-.664m5.8 0c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h4.125m6-16.5c.656 0 1.26.157 1.8.434.549.277 1.058.677 1.492 1.184.433.508.766 1.097.985 1.734.219.636.33 1.33.33 2.036v10.878c0 .621-.504 1.125-1.125 1.125H9.75A1.125 1.125 0 0 1 8.625 18.75V8.625c0-.621.504-1.125 1.125-1.125h2.25Z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-300 mb-2">No hay criterios</h3>
                                <p className="text-gray-500 mb-4">Crea tu primer criterio para comenzar</p>
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2 text-white"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Crear Criterio
                                </button>
                            </div>
                        ) : (
                            criterios.map((criterio) => (
                                <div key={criterio.id} className="grid grid-cols-12 items-center py-2 md:py-3 border-b border-gray-700 last:border-b-0">
                                    <div className="col-span-3">
                                        <p className="text-sm md:text-base">{criterio.name}</p>
                                    </div>
                                    <div className="col-span-4">
                                        <p className="text-sm md:text-base">{criterio.description || 'Sin descripción'}</p>
                                    </div>
                                    <div className="col-span-3">
                                        <p className={`text-sm md:text-base ${criterio.is_benefit ? 'text-green-500' : 'text-red-500'}`}>
                                            {criterio.is_benefit ? 'Maximizar' : 'Minimizar'}
                                        </p>
                                    </div>
                                    <div className="col-span-2 flex gap-1 md:gap-2">
                                        <button className="bg-transparent cursor-pointer rounded-md border border-gray-600 p-1 md:p-2 text-white flex items-center gap-1 md:gap-2 hover:bg-gray-800">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                        <button
                                            className="bg-transparent cursor-pointer rounded-md border border-gray-600 p-1 md:p-2 text-white flex items-center gap-1 md:gap-2 hover:bg-gray-800"
                                            onClick={() => openDeleteModal(criterio)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <NewCriteriaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateCriteria}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedCriterio(null);
                }}
                onConfirm={handleDeleteCriteria}
                title="Eliminar Criterio"
                itemName={selectedCriterio?.name || ""}
                isLoading={deleteLoading}
            />
        </>
    );
}