import ReactModal from 'react-modal';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import type { Criterio } from '../api/criteria';

interface NewCriteriaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string, isMaximize: boolean) => void;
    onUpdate?: (id: number, name: string, description: string, isMaximize: boolean) => void;
    editingCriterio?: Criterio | null;
}

export function NewCriteriaModal({
    isOpen,
    onClose,
    onCreate,
    onUpdate,
    editingCriterio
}: NewCriteriaModalProps) {
    const [criteriaName, setCriteriaName] = useState('');
    const [criteriaDescription, setCriteriaDescription] = useState('');
    const [isMaximize, setIsMaximize] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const isEditing = !!editingCriterio;

    // Cargar datos cuando se está editando
    useEffect(() => {
        if (editingCriterio) {
            setCriteriaName(editingCriterio.name);
            setCriteriaDescription(editingCriterio.description || '');
            setIsMaximize(editingCriterio.is_benefit);
        } else {
            // Reset form cuando no se está editando
            setCriteriaName('');
            setCriteriaDescription('');
            setIsMaximize(true);
        }
    }, [editingCriterio]);

    const handleSubmit = async () => {
        if (!criteriaName.trim()) return;

        try {
            setIsLoading(true);

            if (isEditing && editingCriterio && onUpdate) {
                await onUpdate(
                    editingCriterio.id,
                    criteriaName.trim(),
                    criteriaDescription.trim(),
                    isMaximize
                );
                toast.success('Criterio actualizado exitosamente', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colorful",
                });
            } else {
                await onCreate(criteriaName.trim(), criteriaDescription.trim(), isMaximize);
                toast.success('Criterio creado exitosamente', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colorful",
                });
            }

            // Reset form
            setCriteriaName('');
            setCriteriaDescription('');
            setIsMaximize(true);
            onClose();
        } catch (error) {
            console.error('Error processing criteria:', error);
            toast.error(isEditing ? 'Error al actualizar el criterio' : 'Error al crear el criterio', {
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
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            // Reset form when closing
            setCriteriaName('');
            setCriteriaDescription('');
            setIsMaximize(true);
            onClose();
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={handleClose}
            shouldCloseOnOverlayClick={!isLoading}
            ariaHideApp={false}
            style={{
                overlay: {
                    backgroundColor: 'rgba(2, 6, 18, 0.8)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                content: {
                    position: 'relative',
                    inset: 'auto',
                    background: '#020612',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '32px',
                    color: 'white',
                    maxWidth: '500px',
                    width: '100%',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                }
            }}
        >
            <div className='flex justify-between'>
                <h2 className="text-2xl font-bold">
                    {isEditing ? 'Editar Criterio' : 'Añadir Criterio'}
                </h2>
                <div
                    className={`cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleClose}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>

            <p className="text-gray-400 mb-6">
                {isEditing
                    ? 'Modifica los datos del criterio'
                    : 'Añade un nuevo criterio para evaluar las alternativas'
                }
            </p>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre del Criterio <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 bg-[#0A0F1F] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Precio, Calidad, Rendimiento"
                        value={criteriaName}
                        onChange={(e) => setCriteriaName(e.target.value)}
                        disabled={isLoading}
                        maxLength={100}
                    />
                    {criteriaName.length > 80 && (
                        <p className="text-xs text-gray-400 mt-1">{criteriaName.length}/100 caracteres</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Descripción
                    </label>
                    <textarea
                        className="w-full px-4 py-2 bg-[#0A0F1F] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={3}
                        placeholder="Describe este criterio y cómo se evalúa"
                        value={criteriaDescription}
                        onChange={(e) => setCriteriaDescription(e.target.value)}
                        disabled={isLoading}
                        maxLength={255}
                    />
                    {criteriaDescription.length > 200 && (
                        <p className="text-xs text-gray-400 mt-1">{criteriaDescription.length}/255 caracteres</p>
                    )}
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0A0F1F] rounded-lg border border-gray-700">
                    <div>
                        <h3 className="text-sm font-medium text-gray-300 mb-1">¿Maximizar este criterio?</h3>
                        <p className="text-sm text-gray-500">
                            {isMaximize
                                ? "Valores más altos son mejores (ej: calidad, rendimiento, satisfacción)"
                                : "Valores más bajos son mejores (ej: precio, tiempo, esfuerzo)"
                            }
                        </p>
                    </div>
                    <div className="relative ml-4">
                        <button
                            type="button"
                            className={`${isMaximize ? 'bg-blue-600' : 'bg-gray-600'
                                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed`}
                            onClick={() => setIsMaximize(!isMaximize)}
                            disabled={isLoading}
                        >
                            <span
                                className={`${isMaximize ? 'translate-x-5' : 'translate-x-0'
                                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                            />
                        </button>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 text-gray-300 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        disabled={!criteriaName.trim() || isLoading}
                    >
                        {isLoading && (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isLoading
                            ? (isEditing ? 'Actualizando...' : 'Creando...')
                            : (isEditing ? 'Actualizar' : 'Añadir')
                        }
                    </button>
                </div>
            </div>
        </ReactModal>
    );
}