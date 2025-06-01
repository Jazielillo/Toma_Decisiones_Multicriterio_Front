import ReactModal from 'react-modal';
import { useState, useEffect } from 'react';
import type { Alternative } from '../api/alternatives';

interface NewAlternativeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string) => void;
    onUpdate: (alternativeId: number, name: string, description: string) => void;
    alternative?: Alternative; // Si se pasa una alternativa, es modo edición
}

export function NewAlternativeModal({ isOpen, onClose, onCreate, onUpdate, alternative }: NewAlternativeModalProps) {
    const [alternativeName, setAlternativeName] = useState('');
    const [alternativeDescription, setAlternativeDescription] = useState('');
    const [nameError, setNameError] = useState('');

    const isEditMode = !!alternative;

    // Limpiar o cargar datos cuando se abre/cierra el modal
    useEffect(() => {
        if (isOpen) {
            if (isEditMode && alternative) {
                // Modo edición: cargar datos de la alternativa
                setAlternativeName(alternative.name);
                setAlternativeDescription(alternative.description || '');
            } else {
                // Modo creación: limpiar campos
                setAlternativeName('');
                setAlternativeDescription('');
            }
            setNameError('');
        }
    }, [isOpen, isEditMode, alternative]);

    const validateName = (name: string) => {
        if (!name.trim()) {
            setNameError('Este campo es requerido');
            return false;
        }
        setNameError('');
        return true;
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAlternativeName(value);

        // Limpiar error si el usuario empieza a escribir
        if (nameError && value.trim()) {
            setNameError('');
        }
    };

    const handleSubmit = () => {
        if (!validateName(alternativeName)) {
            return;
        }

        if (isEditMode && alternative) {
            onUpdate(alternative.id, alternativeName.trim(), alternativeDescription.trim());
        } else {
            onCreate(alternativeName.trim(), alternativeDescription.trim());
        }

        handleClose();
    };

    const handleClose = () => {
        setNameError('');
        onClose();
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={handleClose}
            shouldCloseOnOverlayClick={true}
            ariaHideApp={false}
            style={{
                overlay: {
                    backgroundColor: 'rgba(2, 6, 18, 0.8)', // #020612 con opacidad
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
                    {isEditMode ? 'Editar Alternativa' : 'Añadir Alternativa'}
                </h2>
                <div className='cursor-pointer' onClick={handleClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>

            <p className="text-gray-400 mb-6">
                {isEditMode ? 'Modifica la información de la alternativa' : 'Añade una nueva alternativa para este escenario'}
            </p>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre de la Alternativa *
                    </label>
                    <input
                        type="text"
                        className={`w-full px-4 py-2 bg-[#0A0F1F] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${nameError ? 'border-red-500' : 'border-gray-700'
                            }`}
                        placeholder="Ej: Opción A"
                        value={alternativeName}
                        onChange={handleNameChange}
                        onBlur={() => validateName(alternativeName)}
                    />
                    {nameError && (
                        <p className="text-red-400 text-sm mt-1">{nameError}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Descripción (Opcional)
                    </label>
                    <textarea
                        className="w-full px-4 py-2 bg-[#0A0F1F] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Describe esta alternativa"
                        value={alternativeDescription}
                        onChange={(e) => setAlternativeDescription(e.target.value)}
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 text-gray-300 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={!alternativeName.trim()}
                    >
                        {isEditMode ? 'Guardar Cambios' : 'Añadir'}
                    </button>
                </div>
            </div>
        </ReactModal>
    );
}