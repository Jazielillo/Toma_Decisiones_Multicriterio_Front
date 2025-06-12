import ReactModal from 'react-modal';
import { useState } from 'react';

interface CloneProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onClone: (newProjectName: string) => void;
    projectName: string;
    isLoading?: boolean;
}

export function CloneProjectModal({
    isOpen,
    onClose,
    onClone,
    isLoading = false
}: CloneProjectModalProps) {
    const [projectName, setProjectName] = useState('');
    const [nameError, setNameError] = useState('');
    
    

const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setProjectName(value);

        // Limpiar error si el usuario empieza a escribir
        if (nameError && value.trim()) {
            setNameError('');
        }
    };
        const validateName = (name: string) => {
        if (!name.trim()) {
            setNameError('Este campo es requerido');
            return false;
        }
        setNameError('');
        return true;
    };
    const handleClone = () => {
        if (validateName(projectName)) {
        onClone(projectName); // Pass the validated projectName to parent component
    }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
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
            <div className='flex justify-between items-start mb-6'>
                <div>
                    <h2 className="text-2xl font-bold">Clonar Proyecto</h2>
                    <p className="text-gray-400 mt-2">Crea una copia de un proyecto existente</p>
                </div>
                <div className='cursor-pointer' onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-[#0A0F1F] border border-gray-700 rounded-lg p-4">
                    <p className="text-gray-300 text-sm mb-2">El nombre del nuevo proyecto será:</p>
                    <input
                        type="text"
                        className={`w-full px-4 py-2 bg-[#0A0F1F] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${nameError ? 'border-red-500' : 'border-gray-700'
                            }`}
                        placeholder="Ej: Selección de Laptop"
                        value={projectName}
                        onChange={handleNameChange}
                        onBlur={() => validateName(projectName)}
                    />
                    {nameError && (
                        <p className="text-red-400 text-sm mt-1">{nameError}</p>
                    )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-300 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleClone}
                        className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isLoading ? 'Clonando...' : 'Clonar Proyecto'}
                    </button>
                </div>
            </div>
        </ReactModal>
    );
}