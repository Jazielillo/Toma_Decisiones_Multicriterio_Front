// src/api/criterios.ts
import axios from 'axios';
import { BASE_URL } from '../config/api';
import { getAuthHeader, getIdScenarioLocalStorage } from '../helpers';

const API_URL = `${BASE_URL}/api/v1`;

// Interfaces
export interface Criterio {
    id: number;
    name: string;
    description: string;
    weight: number;
    is_benefit: boolean;
    preference_threshold: number;
    indifference_threshold: number;
    veto_threshold: number;
    escenario_id: number;
}

export interface CreateCriterioData {
    name: string;
    description: string;
    weight: number;
    is_benefit: boolean;
    preference_threshold: number;
    indifference_threshold: number;
    veto_threshold: number;
    escenario_id: number;
}

export interface UpdateCriterioData {
    name?: string;
    description?: string;
    weight?: number;
    is_benefit?: boolean;
    preference_threshold?: number;
    indifference_threshold?: number;
    veto_threshold?: number;
}

// Obtener criterios de un escenario
export const getCriterios = async (): Promise<Criterio[]> => {
    const currentScenarioId = getIdScenarioLocalStorage();

    if (!currentScenarioId) {
        throw new Error('No hay escenario seleccionado');
    }

    const response = await axios.get(`${API_URL}/criterios/escenario/${currentScenarioId}`, getAuthHeader());
    return response.data;
};

// Crear un nuevo criterio
export const createCriterio = async (data: CreateCriterioData): Promise<Criterio> => {
    const response = await axios.post(`${API_URL}/criterios/`, data, getAuthHeader());
    return response.data;
};

// Actualizar un criterio
export const updateCriterio = async (criterioId: number, data: UpdateCriterioData): Promise<Criterio> => {
    const response = await axios.put(`${API_URL}/criterios/${criterioId}`, data, getAuthHeader());
    return response.data;
};

// Eliminar un criterio
export const deleteCriterio = async (criterioId: number): Promise<void> => {
    await axios.delete(`${API_URL}/criterios/${criterioId}`, getAuthHeader());
};
