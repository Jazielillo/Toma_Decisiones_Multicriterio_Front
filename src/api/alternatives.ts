import axios from 'axios';
import { BASE_URL } from '../config/api';
import { getAuthHeader, getIdScenarioLocalStorage } from '../helpers/index';

const API_URL = `${BASE_URL}/api/v1`;

// Interfaces
export interface Alternative {
    name: string;
    description: string;
    id: number;
    escenario_id: number;
}

export interface CreateAlternativeData {
    name: string;
    description: string;
    escenario_id: number;
}

export interface UpdateAlternativeData {
    name?: string;
    description?: string;
}

// Obtener alternativas de un escenario
export const getAlternatives = async (): Promise<Alternative[]> => {
    const currentScenarioId = getIdScenarioLocalStorage();
    
    if (!currentScenarioId) {
        throw new Error('No hay escenario seleccionado');
    }

    const response = await axios.get(`${API_URL}/alternatives/escenario/${currentScenarioId}`, getAuthHeader());
    return response.data;
};

// Crear nueva alternativa
export const createAlternative = async (data: CreateAlternativeData): Promise<Alternative> => {
    const response = await axios.post(`${API_URL}/alternatives/`, data, getAuthHeader());
    return response.data;
};

// Actualizar alternativa
export const updateAlternative = async (alternativeId: number, data: UpdateAlternativeData): Promise<Alternative> => {
    const response = await axios.put(`${API_URL}/alternatives/${alternativeId}`, data, getAuthHeader());
    return response.data;
};

// Eliminar alternativa
export const deleteAlternative = async (alternativeId: number): Promise<void> => {
    await axios.delete(`${API_URL}/alternatives/${alternativeId}`, getAuthHeader());
};
