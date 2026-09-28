import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { getProjectById } from '../api/projects';
import { getScenarioById } from '../api/scenarios';
import { useProjectId, useScenarioId } from '../helpers';

interface WorkContextHeaderProps {
    // Solo se muestra en pantallas pequeñas, donde el menú lateral está oculto
    onOpenMenu?: () => void;
    showMenuButton?: boolean;
}

/**
 * Encabezado presente en todas las secciones privadas que indica
 * con qué Proyecto y Escenario se está trabajando.
 */
export default function WorkContextHeader({ onOpenMenu, showMenuButton }: WorkContextHeaderProps) {
    const projectId = useProjectId();
    const scenarioId = useScenarioId();
    const { pathname } = useLocation();
    const [projectName, setProjectName] = useState<string | null>(null);
    const [scenarioName, setScenarioName] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Refrescar los nombres cuando se editan el proyecto o el escenario
    useEffect(() => {
        const handleChange = () => setRefreshKey(prev => prev + 1);
        window.addEventListener('workContextChanged', handleChange);
        return () => window.removeEventListener('workContextChanged', handleChange);
    }, []);

    useEffect(() => {
        let cancelled = false;
        if (!projectId) {
            setProjectName(null);
            return;
        }
        getProjectById(Number(projectId))
            .then(project => { if (!cancelled) setProjectName(project.title); })
            .catch(() => { if (!cancelled) setProjectName(null); });
        return () => { cancelled = true; };
    }, [projectId, pathname, refreshKey]);

    useEffect(() => {
        let cancelled = false;
        if (!scenarioId) {
            setScenarioName(null);
            return;
        }
        getScenarioById(Number(scenarioId))
            .then(scenario => { if (!cancelled) setScenarioName(scenario.name); })
            .catch(() => { if (!cancelled) setScenarioName(null); });
        return () => { cancelled = true; };
    }, [scenarioId, pathname, refreshKey]);

    return (
        <header className="sticky -top-3 md:-top-7 z-20 -mx-3 md:-mx-7 -mt-3 md:-mt-7 mb-4 md:mb-6 px-3 md:px-7 py-3 bg-[#020612]/95 backdrop-blur border-b border-gray-800">
            <div className="flex items-center gap-3">
                {showMenuButton && (
                    <button
                        type="button"
                        onClick={onOpenMenu}
                        className="p-2 -ml-1 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
                        aria-label="Abrir menú"
                    >
                        <Bars3Icon className="size-6" />
                    </button>
                )}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:text-base min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-gray-400">Proyecto:</span>
                        <Link
                            to="/projects"
                            className={`font-semibold truncate hover:underline ${projectName ? 'text-white' : 'text-gray-500 italic'}`}
                            title="Cambiar de proyecto"
                        >
                            {projectName ?? 'Sin seleccionar'}
                        </Link>
                    </div>
                    <span className="text-gray-600 hidden sm:inline">|</span>
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-gray-400">Escenario:</span>
                        <Link
                            to="/scenarios"
                            className={`font-semibold truncate hover:underline ${scenarioName ? 'text-blue-400' : 'text-gray-500 italic'}`}
                            title="Cambiar de escenario"
                        >
                            {scenarioName ?? 'Sin seleccionar'}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
