import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import PublicSidebar from "./PublicSidebar";

interface Criterion {
    id: number;
    name: string;
    description: string;
    isBenefit: boolean; // true = Maximizar, false = Minimizar
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

// Funciones para gestionar criterios en cookies
const saveCriteriaToCookie = (criteria: Criterion[]) => {
    setCookie('public_criteria_list', JSON.stringify(criteria), 30);
};

const loadCriteriaFromCookie = (): Criterion[] => {
    const data = getCookie('public_criteria_list');
    if (data) {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error('Error parsing criteria from cookie:', error);
            return getDefaultCriteria();
        }
    }
    return getDefaultCriteria();
};

// Criterios por defecto
const getDefaultCriteria = (): Criterion[] => [
    {
        id: 1,
        name: 'Precio',
        description: 'Costo total del producto o servicio',
        isBenefit: false // Minimizar
    },
    {
        id: 2,
        name: 'Rendimiento',
        description: 'Eficiencia y desempeño general',
        isBenefit: true // Maximizar
    }
];

export default function PublicCriteria() {
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingCriterion, setDeletingCriterion] = useState<Criterion | null>(null);
    const [editingCriterion, setEditingCriterion] = useState<Criterion | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    // Formulario
    const [formName, setFormName] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formIsBenefit, setFormIsBenefit] = useState(true);

    // Cargar criterios de cookies al montar
    useEffect(() => {
        const loadedCriteria = loadCriteriaFromCookie();
        setCriteria(loadedCriteria);
        setLoading(false);
    }, []);

    // Guardar en cookies cada vez que cambian los criterios
    useEffect(() => {
        if (!loading) {
            saveCriteriaToCookie(criteria);
        }
    }, [criteria, loading]);

    const handleCreateCriterion = () => {
        if (!formName.trim()) {
            toast.error('El nombre es requerido', {
                position: "bottom-right",
                autoClose: 2000,
                theme: "colorful",
            });
            return;
        }

        const newCriterion: Criterion = {
            id: Date.now(),
            name: formName,
            description: formDescription,
            isBenefit: formIsBenefit
        };

        setCriteria(prev => [...prev, newCriterion]);
        
        toast.success('Criterio creado exitosamente', {
            position: "bottom-right",
            autoClose: 2000,
            theme: "colorful",
        });

        closeModal();
    };

    const handleUpdateCriterion = () => {
        if (!editingCriterion || !formName.trim()) {
            toast.error('El nombre es requerido', {
                position: "bottom-right",
                autoClose: 2000,
                theme: "colorful",
            });
            return;
        }

        setCriteria(prev =>
            prev.map(crit =>
                crit.id === editingCriterion.id
                    ? { ...crit, name: formName, description: formDescription, isBenefit: formIsBenefit }
                    : crit
            )
        );

        toast.success('Criterio actualizado exitosamente', {
            position: "bottom-right",
            autoClose: 2000,
            theme: "colorful",
        });

        closeModal();
    };

    const handleDeleteCriterion = () => {
        if (!deletingCriterion) return;

        setIsDeleting(true);
        
        // 1. Eliminar el criterio de la lista
        setCriteria(prev => prev.filter(crit => crit.id !== deletingCriterion.id));

        // 2. Eliminar de criteria_weights (pesos y umbrales)
        const weightsData = getCookie('public_criteria_weights');
        if (weightsData) {
            try {
                const weights = JSON.parse(weightsData);
                const updatedWeights = weights.filter((w: any) => 
                    w.name.toLowerCase() !== deletingCriterion.name.toLowerCase()
                );
                setCookie('public_criteria_weights', JSON.stringify(updatedWeights), 30);
            } catch (error) {
                console.error('Error updating criteria weights:', error);
            }
        }

        // 3. Eliminar de la matriz (valores asociados a este criterio)
        const matrixData = getCookie('public_matrix');
        if (matrixData) {
            try {
                const matrix = JSON.parse(matrixData);
                const updatedMatrix = matrix.filter((m: any) => 
                    m.criterionId.toString().toLowerCase() !== deletingCriterion.id.toString().toLowerCase() &&
                    m.criterionId.toString().toLowerCase() !== deletingCriterion.name.toLowerCase()
                );
                setCookie('public_matrix', JSON.stringify(updatedMatrix), 30);
            } catch (error) {
                console.error('Error updating matrix:', error);
            }
        }

        toast.success('Criterio y datos asociados eliminados exitosamente', {
            position: "bottom-right",
            autoClose: 2000,
            theme: "colorful",
        });

        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setDeletingCriterion(null);
    };

    const openDeleteModal = (criterion: Criterion) => {
        setDeletingCriterion(criterion);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingCriterion(null);
    };

    const openEditModal = (criterion: Criterion) => {
        setEditingCriterion(criterion);
        setFormName(criterion.name);
        setFormDescription(criterion.description);
        setFormIsBenefit(criterion.isBenefit);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingCriterion(null);
        setFormName("");
        setFormDescription("");
        setFormIsBenefit(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCriterion(null);
        setFormName("");
        setFormDescription("");
        setFormIsBenefit(true);
    };

    const handleSubmit = () => {
        if (editingCriterion) {
            handleUpdateCriterion();
        } else {
            handleCreateCriterion();
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
                        <h1 className="text-4xl font-bold">Criterios</h1>
                        <p className="font-bold text-gray-400 mt-2">
                            Define los criterios que utilizarás para evaluar las alternativas
                        </p>
                    </div>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-3 text-white flex items-center gap-2"
                        onClick={openCreateModal}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Nuevo Criterio
                    </button>
                </div>

                <div className="border border-gray-600 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                        <h2 className="text-2xl font-bold">Criterios de Evaluación</h2>
                    </div>
                    <p className="text-gray-400 mb-6">
                        Los criterios se utilizarán para evaluar cada alternativa.
                    </p>

                    {criteria.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                No hay criterios
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Comienza creando tu primer criterio
                            </p>
                            <button
                                onClick={openCreateModal}
                                className="bg-blue-600 hover:bg-blue-700 rounded-md px-6 py-2 text-white"
                            >
                                Crear Primer Criterio
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Nombre</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Descripción</th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Objetivo</th>
                                        <th className="text-right py-3 px-4 text-gray-400 font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {criteria.map((criterion) => (
                                        <tr key={criterion.id} className="border-b border-gray-700 hover:bg-gray-800">
                                            <td className="py-3 px-4 font-semibold">{criterion.name}</td>
                                            <td className="py-3 px-4 text-gray-400">{criterion.description || 'Sin descripción'}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    criterion.isBenefit 
                                                        ? 'bg-green-900 text-green-300' 
                                                        : 'bg-red-900 text-red-300'
                                                }`}>
                                                    {criterion.isBenefit ? 'Maximizar' : 'Minimizar'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(criterion)}
                                                        className="p-2 text-blue-400 hover:bg-blue-400 hover:bg-opacity-10 rounded transition-colors"
                                                        title="Editar"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(criterion)}
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
                                {editingCriterion ? 'Editar Criterio' : 'Nuevo Criterio'}
                            </h2>
                            
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Nombre *</label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Ej: Precio"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Descripción</label>
                                <textarea
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-24"
                                    placeholder="Describe este criterio..."
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-300 mb-2">Objetivo</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={formIsBenefit}
                                            onChange={() => setFormIsBenefit(true)}
                                            className="mr-2"
                                        />
                                        <span className="text-green-400">Maximizar</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={!formIsBenefit}
                                            onChange={() => setFormIsBenefit(false)}
                                            className="mr-2"
                                        />
                                        <span className="text-red-400">Minimizar</span>
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Maximizar: valores más altos son mejores. Minimizar: valores más bajos son mejores.
                                </p>
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
                                    {editingCriterion ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Confirmación de Eliminación */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4 text-red-400">Eliminar Criterio</h2>
                            
                            <p className="text-gray-300 mb-4">
                                ¿Estás seguro de que deseas eliminar el criterio <strong>"{deletingCriterion?.name}"</strong>?
                            </p>
                            
                            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-3 mb-4">
                                <p className="text-yellow-300 text-sm font-medium mb-2">⚠️ Advertencia</p>
                                <p className="text-yellow-200 text-xs">
                                    Esta acción también eliminará:
                                </p>
                                <ul className="text-yellow-200 text-xs mt-2 list-disc list-inside">
                                    <li>Pesos y umbrales asociados</li>
                                    <li>Todos los valores de la matriz para este criterio</li>
                                </ul>
                            </div>

                            <p className="text-gray-400 text-sm mb-6">
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
                                    onClick={handleDeleteCriterion}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Eliminando...
                                        </>
                                    ) : (
                                        'Eliminar Todo'
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
