import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import PublicSidebar from "./PublicSidebar";

interface Alternative {
    id: number;
    name: string;
    description: string;
}

// Funciones para manejar cookies
const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

// Funciones para gestionar alternativas en cookies
const saveAlternativesToCookie = (alternatives: Alternative[]) => {
    setCookie('public_alternatives', JSON.stringify(alternatives), 30);
};

const loadAlternativesFromCookie = (): Alternative[] => {
    const data = getCookie('public_alternatives');
    if (data) {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error('Error parsing alternatives from cookie:', error);
            return [];
        }
    }
    return [];
};

export default function PublicAlternatives() {
    const [alternatives, setAlternatives] = useState<Alternative[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingAlternative, setDeletingAlternative] = useState<Alternative | null>(null);
    const [editingAlternative, setEditingAlternative] = useState<Alternative | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    // Formulario
    const [formName, setFormName] = useState("");
    const [formDescription, setFormDescription] = useState("");

    // Cargar alternativas de cookies al montar
    useEffect(() => {
        const loadedAlternatives = loadAlternativesFromCookie();
        setAlternatives(loadedAlternatives);
        setLoading(false);
    }, []);

    // Guardar en cookies cada vez que cambian las alternativas
    useEffect(() => {
        if (!loading) {
            saveAlternativesToCookie(alternatives);
        }
    }, [alternatives, loading]);

    const handleCreateAlternative = () => {
        if (!formName.trim()) {
            toast.error('El nombre es requerido', {
                position: "bottom-right",
                autoClose: 2000,
                theme: "colorful",
            });
            return;
        }

        const newAlternative: Alternative = {
            id: Date.now(),
            name: formName,
            description: formDescription
        };

        setAlternatives(prev => [...prev, newAlternative]);
        
        toast.success('Alternativa creada exitosamente', {
            position: "bottom-right",
            autoClose: 2000,
            theme: "colorful",
        });

        closeModal();
    };

    const handleUpdateAlternative = () => {
        if (!editingAlternative || !formName.trim()) {
            toast.error('El nombre es requerido', {
                position: "bottom-right",
                autoClose: 2000,
                theme: "colorful",
            });
            return;
        }

        setAlternatives(prev =>
            prev.map(alt =>
                alt.id === editingAlternative.id
                    ? { ...alt, name: formName, description: formDescription }
                    : alt
            )
        );

        toast.success('Alternativa actualizada exitosamente', {
            position: "bottom-right",
            autoClose: 2000,
            theme: "colorful",
        });

        closeModal();
    };

    const handleDeleteAlternative = () => {
        if (!deletingAlternative) return;

        setIsDeleting(true);
        
        setAlternatives(prev => prev.filter(alt => alt.id !== deletingAlternative.id));

        toast.success('Alternativa eliminada exitosamente', {
            position: "bottom-right",
            autoClose: 2000,
            theme: "colorful",
        });

        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setDeletingAlternative(null);
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
        setFormName(alternative.name);
        setFormDescription(alternative.description);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingAlternative(null);
        setFormName("");
        setFormDescription("");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAlternative(null);
        setFormName("");
        setFormDescription("");
    };

    const handleSubmit = () => {
        if (editingAlternative) {
            handleUpdateAlternative();
        } else {
            handleCreateAlternative();
        }
    };

    if (loading) {
        return (
            <div className="flex bg-gray-900 min-h-screen">
                <PublicSidebar />
                <div className="flex-1 p-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-900 min-h-screen">
            <PublicSidebar />
            
            <div className="flex-1 p-8 text-white">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold">Alternativas</h1>
                        <p className="font-bold text-gray-400 mt-2">
                            Define todas las alternativas que deseas evaluar
                        </p>
                    </div>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-3 text-white flex items-center gap-2"
                        onClick={openCreateModal}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Nueva Alternativa
                    </button>
                </div>

                <div className="border border-gray-600 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        <h2 className="text-2xl font-bold">Lista de Alternativas</h2>
                    </div>
                    <p className="text-gray-400 mb-6">
                        Gestiona las alternativas que serán evaluadas con el método ELECTRE III.
                    </p>

                    {alternatives.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                No hay alternativas
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Comienza creando tu primera alternativa
                            </p>
                            <button
                                onClick={openCreateModal}
                                className="bg-blue-600 hover:bg-blue-700 rounded-md px-6 py-2 text-white"
                            >
                                Crear Primera Alternativa
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">ID</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Nombre</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Descripción</th>
                                        <th className="text-right py-3 px-4 text-gray-400 font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alternatives.map((alternative) => (
                                        <tr key={alternative.id} className="border-b border-gray-700 hover:bg-gray-800">
                                            <td className="py-3 px-4 text-gray-300">{alternative.id}</td>
                                            <td className="py-3 px-4 font-semibold">{alternative.name}</td>
                                            <td className="py-3 px-4 text-gray-400">{alternative.description}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(alternative)}
                                                        className="p-2 text-blue-400 hover:bg-blue-400 hover:bg-opacity-10 rounded transition-colors"
                                                        title="Editar"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(alternative)}
                                                        className="p-2 text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal de Crear/Editar */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4">
                                {editingAlternative ? 'Editar Alternativa' : 'Nueva Alternativa'}
                            </h2>
                            
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Nombre *</label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Ej: Alternativa A"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-300 mb-2">Descripción</label>
                                <textarea
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-24"
                                    placeholder="Describe esta alternativa..."
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                                >
                                    {editingAlternative ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Confirmación de Eliminación */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4 text-red-400">Eliminar Alternativa</h2>
                            
                            <p className="text-gray-300 mb-6">
                                ¿Estás seguro de que deseas eliminar la alternativa <strong>"{deletingAlternative?.name}"</strong>?
                                Esta acción no se puede deshacer.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={closeDeleteModal}
                                    disabled={isDeleting}
                                    className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDeleteAlternative}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Eliminando...
                                        </>
                                    ) : (
                                        'Eliminar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
