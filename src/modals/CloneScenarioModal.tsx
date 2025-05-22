import ReactModal from 'react-modal';
import { useState } from 'react';

interface CloneScenarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onClone: (name: string) => void;
}

export function CloneScenarioModal({ isOpen, onClose, onClone }: CloneScenarioModalProps) {
    const [scenarioName, setScenarioName] = useState('');

    const handleClone = () => {
        onClone(scenarioName);
        onClose();
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
                    <h2 className="text-2xl font-bold">Clonar Escenario</h2>
                </div>
                <div className='cursor-pointer' onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre del nuevo escenario
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 bg-[#0A0F1F] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingresa un nombre para el nuevo escenario"
                        value={scenarioName}
                        onChange={(e) => setScenarioName(e.target.value)}
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-300 bg-transparent border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleClone}
                        className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={!scenarioName.trim()}
                    >
                        Clonar Escenario
                    </button>
                </div>
            </div>
        </ReactModal>
    );
}