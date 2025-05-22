import ReactModal from 'react-modal';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            preventScroll={true}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    zIndex: 1000
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '20px',
                    maxWidth: '600px',
                    width: '90%'
                }
            }}
        >
            {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
            {children}
            <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Cerrar
            </button>
        </ReactModal>
    );
}