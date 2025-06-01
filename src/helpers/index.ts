import { useEffect, useState } from "react";

export const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getIdProjectLocalStorage = (): string | null => {
    try {
        const idProject = localStorage.getItem('id_project_selected');
        return idProject;
    } catch (error) {
        console.error('Error getting project ID from localStorage:', error);
        return null;
    }
};

/**
 * Establece el ID del proyecto seleccionado en localStorage
 * y emite un evento personalizado para notificar el cambio
 */
export const setIdProjectLocalStorage = (projectId: string | null): void => {
    try {
        if (projectId) {
            localStorage.setItem('id_project_selected', projectId);
        } else {
            localStorage.removeItem('id_project_selected');
        }
        
        // Emitir evento personalizado para notificar el cambio
        const event = new CustomEvent('projectIdChanged', {
            detail: { projectId }
        });
        window.dispatchEvent(event);
    } catch (error) {
        console.error('Error setting project ID in localStorage:', error);
    }
};

/**
 * Obtiene el ID del escenario seleccionado
 */
export const getIdScenarioLocalStorage = (): string | null => {
    try {
        const idScenario = localStorage.getItem('id_scenario_selected');
        return idScenario;
    } catch (error) {
        console.error('Error getting scenario ID from localStorage:', error);
        return null;
    }
};

/**
 * Establece el ID del escenario seleccionado en localStorage
 */
export const setIdScenarioLocalStorage = (scenarioId: string | null): void => {
    try {
        if (scenarioId) {
            localStorage.setItem('id_scenario_selected', scenarioId);
        } else {
            localStorage.removeItem('id_scenario_selected');
        }
        
        // Emitir evento personalizado para notificar el cambio
        const event = new CustomEvent('scenarioIdChanged', {
            detail: { scenarioId }
        });
        window.dispatchEvent(event);
    } catch (error) {
        console.error('Error setting scenario ID in localStorage:', error);
    }
};

/**
 * Hook personalizado para escuchar cambios en el proyecto seleccionado
 */
export const useProjectId = () => {
    const [projectId, setProjectId] = useState<string | null>(getIdProjectLocalStorage());

    useEffect(() => {
        // Función para manejar cambios en localStorage
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'id_project_selected') {
                setProjectId(e.newValue);
            }
        };

        // Función para manejar eventos personalizados
        const handleCustomChange = (e: CustomEvent) => {
            setProjectId(e.detail.projectId);
        };

        // Agregar listeners
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('projectIdChanged', handleCustomChange as EventListener);

        // Polling como respaldo para detectar cambios no capturados
        const interval = setInterval(() => {
            const currentId = getIdProjectLocalStorage();
            if (currentId !== projectId) {
                setProjectId(currentId);
            }
        }, 1000); // Reducido a 1 segundo para mayor responsividad

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('projectIdChanged', handleCustomChange as EventListener);
            clearInterval(interval);
        };
    }, [projectId]);

    return projectId;
};

/**
 * Hook personalizado para escuchar cambios en el escenario seleccionado
 */
export const useScenarioId = () => {
    const [scenarioId, setScenarioId] = useState<string | null>(getIdScenarioLocalStorage());

    useEffect(() => {
        // Función para manejar cambios en localStorage
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'id_scenario_selected') {
                setScenarioId(e.newValue);
            }
        };

        // Función para manejar eventos personalizados
        const handleCustomChange = (e: CustomEvent) => {
            setScenarioId(e.detail.scenarioId);
        };

        // Agregar listeners
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('scenarioIdChanged', handleCustomChange as EventListener);

        // Polling como respaldo
        const interval = setInterval(() => {
            const currentId = getIdScenarioLocalStorage();
            if (currentId !== scenarioId) {
                setScenarioId(currentId);
            }
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('scenarioIdChanged', handleCustomChange as EventListener);
            clearInterval(interval);
        };
    }, [scenarioId]);

    return scenarioId;
};


