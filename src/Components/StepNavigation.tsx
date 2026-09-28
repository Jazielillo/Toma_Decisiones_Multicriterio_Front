import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS, isActivePath } from './navigation';

/**
 * Botones para ir a la sección anterior y siguiente del flujo de trabajo,
 * en el mismo orden que el menú lateral.
 */
export default function StepNavigation({ className = 'mb-6' }: { className?: string }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const index = NAV_ITEMS.findIndex(item => isActivePath(item.path, pathname));
    if (index === -1) return null;

    const previous = NAV_ITEMS[index - 1];
    const next = NAV_ITEMS[index + 1];

    const buttonClass = "border border-gray-600 hover:bg-gray-800 rounded-md px-3 py-2 md:px-4 md:py-2 text-white text-sm md:text-base transition-colors flex items-center gap-2 cursor-pointer";

    return (
        <div className={`flex flex-wrap gap-2 md:gap-3 ${className}`}>
            {previous && (
                <button type="button" className={buttonClass} onClick={() => navigate(previous.path)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Ir a {previous.label}
                </button>
            )}
            {next && (
                <button type="button" className={buttonClass} onClick={() => navigate(next.path)}>
                    Ir a {next.label}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            )}
        </div>
    );
}
