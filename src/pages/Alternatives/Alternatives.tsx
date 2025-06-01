// Alternatives.tsx - Versión mejorada con reactividad en tiempo real y edición
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { NewAlternativeModal } from "../../modals/NewAlternativeModal";
import { DeleteConfirmationModal } from "../../modals/DeleteConfirmationModal";
import { getAlternatives, createAlternative, updateAlternative, deleteAlternative, type Alternative } from "../../api/alternatives";
import { useProjectId, useScenarioId } from "../../helpers";

export default function Alternatives() {

    const router = useNavigate();
    const currentProjectId = useProjectId(); // Hook para proyecto
    const currentScenarioId = useScenarioId(); // Hook para escenario

    const [alternatives, setAlternatives] = useState<Alternative[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingAlternative, setDeletingAlternative] = useState<Alternative | null>(null);
    const [editingAlternative, setEditingAlternative] = useState<Alternative | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    // Cargar alternativas cuando cambia el ID del escenario
    useEffect(() => {
        if (currentScenarioId) {
            loadAlternatives();
        } else {
            setAlternatives([]);
            setLoading(false);
        }
    }, [currentScenarioId]); // Se ejecuta cada vez que cambia currentScenarioId

    const loadAlternatives = async () => {
        if (!currentScenarioId) {
            setAlternatives([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getAlternatives();
            setAlternatives(data);
        } catch (error) {
            console.error('Error loading alternatives:', error);
            toast.error('Error al cargar las alternativas', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colorful",
            });
            setAlternatives([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAlternative = async (name: string, description: string) => {
        if (!currentScenarioId) {
            toast.error('No hay escenario seleccionado');
            return;
        }

        try {
            const newAlternative = await createAlternative({
                name,
                description,
                escenario_id: parseInt(currentScenarioId)
            });

            setAlternatives(prev => [...prev, newAlternative]);

            toast.success('Alternativa creada exitosamente', {
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
            console.error('Error creating alternative:', error);
            toast.error('Error al crear la alternativa', {
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

    const handleUpdateAlternative = async (alternativeId: number, name: string, description: string) => {
        try {
            const updatedAlternative = await updateAlternative(alternativeId, {
                name,
                description
            });

            setAlternatives(prev =>
                prev.map(alt =>
                    alt.id === alternativeId ? updatedAlternative : alt
                )
            );

            toast.success('Alternativa actualizada exitosamente', {
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
            console.error('Error updating alternative:', error);
            toast.error('Error al actualizar la alternativa', {
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

    const handleDeleteAlternative = async () => {
        if (!deletingAlternative) return;

        try {
            setIsDeleting(true);
            await deleteAlternative(deletingAlternative.id);

            setAlternatives(prev => prev.filter(alt => alt.id !== deletingAlternative.id));

            toast.success('Alternativa eliminada exitosamente', {
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
            console.error('Error deleting alternative:', error);
            toast.error('Error al eliminar la alternativa', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colorful",
            });
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setDeletingAlternative(null);
        }
    };

    const openDeleteModal = (alternative: Alternative) => {
        setDeletingAlternative(alternative);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingAlternative(null);
    };

    const openEditModal = (alternative: Alternative) => {
        setEditingAlternative(alternative);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingAlternative(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAlternative(null);
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
    if (!currentScenarioId) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="text-center">
                    <div className="mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-20 mx-auto text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026C4.617 9.75 5.25 10.383 5.25 11.25s-.633 1.5-1.156 1.5c-.117 0-.232-.009-.344-.026m-4.5 0a2.25 2.25 0 0 0-.1.557c0 1.12.846 2.042 1.94 2.136.423.036.888.061 1.38.061h3.375c.52 0 1.023-.074 1.5-.21m-4.5-2.544a2.25 2.25 0 0 0-.1-.557m4.6 2.101c.317.21.69.363 1.075.819.165.196.3.419.416.664.107.244.183.502.24.767.057.265.097.532.112.803.015.271-.004.543-.057.814-.114.683-.37 1.333-.756 1.929a3.998 3.998 0 0 1-1.564 1.35c-.226.13-.471.234-.729.302-.258.069-.526.107-.796.107-.27 0-.538-.038-.796-.107a3.818 3.818 0 0 1-.729-.302 3.998 3.998 0 0 1-1.564-1.35c-.386-.596-.642-1.246-.756-1.929-.053-.271-.072-.543-.057-.814.015-.271.055-.538.112-.803.057-.265.133-.523.24-.767.083-.245.218-.468.416-.664.385-.456.758-.609 1.075-.819Z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-200 mb-4">
                        Debes seleccionar un escenario
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Para ver y gestionar alternativas, primero necesitas seleccionar un escenario.
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
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Alternativas</h1>
                    <p className="font-bold text-gray-400">
                        {currentProjectId && currentScenarioId ?
                            `Proyecto: ${currentProjectId} | Escenario: ${currentScenarioId}` :
                            'Selecciona un proyecto y escenario'
                        }
                    </p>
                </div>
                <button
                    className="bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-3 text-white flex items-center gap-2"
                    onClick={openCreateModal}
                    disabled={!currentScenarioId}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                    Nueva Alternativa
                </button>

                <NewAlternativeModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onCreate={handleCreateAlternative}
                    onUpdate={handleUpdateAlternative}
                    alternative={editingAlternative || undefined}
                />

                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDeleteAlternative}
                    title="Eliminar Alternativa"
                    itemName={deletingAlternative?.name || ""}
                    isLoading={isDeleting}
                />
            </div>

            <div className="flex gap-3 mb-6">
                <button className="border border-gray-600 hover:bg-gray-800 rounded-md px-4 py-2 text-white">
                    Ir a Criterios
                </button>
                <button className="border border-gray-600 hover:bg-gray-800 rounded-md px-4 py-2 text-white">
                    Ir a Pesos
                </button>
            </div>

            <div className="border border-gray-600 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-blue-500">
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                    </svg>
                    <h2 className="text-2xl font-bold">Alternativas disponibles</h2>
                </div>
                <p className="text-gray-400 mb-6">Define todas las alternativas que deseas evaluar en este escenario.</p>

                {alternatives.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-16 mx-auto text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No hay alternativas</h3>
                        <p className="text-gray-500 mb-4">Crea tu primera alternativa para comenzar</p>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2 text-white"
                            onClick={openCreateModal}
                        >
                            Crear Alternativa
                        </button>
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="grid grid-cols-12 mb-4">
                            <div className="col-span-4">
                                <h3 className="font-bold text-gray-300">Nombre</h3>
                            </div>
                            <div className="col-span-6">
                                <h3 className="font-bold text-gray-300">Descripción</h3>
                            </div>
                            <div className="col-span-2">
                                <h3 className="font-bold text-gray-300 text-right">Acciones</h3>
                            </div>
                        </div>

                        {alternatives.map((alternative) => (
                            <div key={alternative.id} className="grid grid-cols-12 items-center py-3 border-t border-gray-700">
                                <div className="col-span-4">
                                    <p className="font-medium">{alternative.name}</p>
                                </div>
                                <div className="col-span-6">
                                    <p className="text-gray-300">{alternative.description || 'Sin descripción'}</p>
                                </div>
                                <div className="col-span-2 flex justify-end gap-2">
                                    <button
                                        className="bg-transparent cursor-pointer rounded-md border border-gray-600 p-2 text-white flex items-center gap-2 hover:bg-gray-800"
                                        onClick={() => openEditModal(alternative)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>
                                    <button
                                        className="bg-transparent cursor-pointer rounded-md border border-red-600 p-2 text-red-400 hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                        onClick={() => openDeleteModal(alternative)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}