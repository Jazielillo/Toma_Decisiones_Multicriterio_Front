import ReactModal from 'react-modal';
import { useState, useEffect } from 'react';
import type { Project } from '../api/projects';


interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string) => void;
    onUpdate: (projectId: number, name: string, description: string) => void;
    project?: Project; // Si se pasa un proyecto, es modo edición
}

export function NewProjectModal({ isOpen, onClose, onCreate, onUpdate, project }: ProjectModalProps) {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [nameError, setNameError] = useState('');

    const isEditMode = !!project;

    // Cargar datos del proyecto cuando se abre en modo edición
    useEffect(() => {
        if (isOpen) {
            if (isEditMode && project) {
                setProjectName(project.title);
                setProjectDescription(project.description || '');
            } else {
                setProjectName('');
                setProjectDescription('');
            }
            setNameError('');
        }
    }, [isOpen, isEditMode, project]);

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
        setProjectName(value);

        // Limpiar error si el usuario empieza a escribir
        if (nameError && value.trim()) {
            setNameError('');
        }
    };

    const handleSubmit = () => {
        if (!validateName(projectName)) {
            return;
        }

        if (isEditMode && project) {
            onUpdate(project.id, projectName.trim(), projectDescription.trim());
        } else {
            onCreate(projectName.trim(), projectDescription.trim());
        }

        onClose();
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
                    {isEditMode ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
                </h2>
                <div className='cursor-pointer' onClick={handleClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>

            <p className="text-gray-400 mb-6">
                {isEditMode ? 'Modifica la información del proyecto' : 'Ingresa la información básica del proyecto'}
            </p>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre del Proyecto *
                    </label>
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

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Descripción (Opcional)
                    </label>
                    <textarea
                        className="w-full px-4 py-2 bg-[#0A0F1F] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Describe el propósito del proyecto"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
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
                        disabled={!projectName.trim()}
                    >
                        {isEditMode ? 'Guardar Cambios' : 'Crear Proyecto'}
                    </button>
                </div>
            </div>
        </ReactModal>
    );
}