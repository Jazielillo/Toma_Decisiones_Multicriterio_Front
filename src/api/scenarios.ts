// src/api/scenarios.ts
import axios from 'axios';
import { BASE_URL } from '../config/api';
import { getAuthHeader, getIdProjectLocalStorage } from '../helpers';

const API_URL = `${BASE_URL}/api/v1`;

// Interfaces
export interface Scenario {
    name: string;
    description: string;
    id: number;
    proyecto_id: number;
    created_at: string;
    updated_at: string;
    corte?: number; 
}

export interface CreateScenarioData {
    name: string;
    description: string;
    proyecto_id: number;
}

export interface UpdateScenarioData {
    name?: string;
    description?: string;
    corte?: number;
}

// Obtener escenarios de un proyecto
export const getScenarios = async (): Promise<Scenario[]> => {
    // Obtener el ID del proyecto en tiempo real
    const currentProjectId = getIdProjectLocalStorage();
    
    if (!currentProjectId) {
        throw new Error('No hay proyecto seleccionado');
    }
    
    const response = await axios.get(`${API_URL}/escenarios/proyecto/${currentProjectId}`, getAuthHeader());
    return response.data;
};

// Obtener un escenario por su ID
export const getScenarioById = async (scenarioId: number): Promise<Scenario> => {
    const response = await axios.get(`${API_URL}/escenarios/${scenarioId}`, getAuthHeader());
    return response.data;
};

// Crear un nuevo escenario
export const createScenario = async (data: CreateScenarioData): Promise<Scenario> => {
    const response = await axios.post(`${API_URL}/escenarios/`, data, getAuthHeader());
    return response.data;
};

// Actualizar un escenario
export const updateScenario = async (scenarioId: number, data: UpdateScenarioData): Promise<Scenario> => {
    const response = await axios.put(`${API_URL}/escenarios/${scenarioId}`, data, getAuthHeader());
    return response.data;
};

// Eliminar un escenario
export const deleteScenario = async (scenarioId: number): Promise<void> => {
    await axios.delete(`${API_URL}/escenarios/${scenarioId}`, getAuthHeader());
};



// Clonar un escenario
export const cloneScenario = async (scenarioId: number, newName: string): Promise<Scenario> => {
    const response = await axios.post(
        `${API_URL}/escenarios/${scenarioId}/clonar`,
        {},
        { 
            ...getAuthHeader(),
            params: { nuevo_nombre: newName } // Send as query parameter
        }
    );
    return response.data;
};