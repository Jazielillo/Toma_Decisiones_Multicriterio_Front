import axios from 'axios';
import { BASE_URL } from '../config/api';
import { getAuthHeader, getIdScenarioLocalStorage } from '../helpers';

const API_URL = `${BASE_URL}/api/v1`;

// Interfaces
export interface CeldaMatriz {
  id: number;
  value: number;
  alternativa_id: number;
  criterio_id: number;
  escenario_id: number;
}

export interface UpdateCeldaMatriz {
  id: number;
  value: number;
}

// Obtener la matriz
export const getMatriz = async (): Promise<CeldaMatriz[]> => {
  const escenarioId = getIdScenarioLocalStorage();
  if (!escenarioId) throw new Error('No hay escenario seleccionado');

  const response = await axios.get(`${API_URL}/evaluaciones/escenario/${escenarioId}`, getAuthHeader());
  return response.data;
};

// Crear la matriz por primera vez
export const crearMatriz = async (): Promise<CeldaMatriz[]> => {
  const escenarioId = getIdScenarioLocalStorage();
  if (!escenarioId) throw new Error('No hay escenario seleccionado');

  console.log('escenarioId', escenarioId);
  const response = await axios.post(`${API_URL}/evaluaciones/matriz/escenario/${escenarioId}`, {}, getAuthHeader());
  return response.data;
};

// Reinicializar matriz
export const reinicializarMatriz = async (): Promise<CeldaMatriz[]> => {
  const escenarioId = getIdScenarioLocalStorage();
  if (!escenarioId) throw new Error('No hay escenario seleccionado');

  const response = await axios.post(`${API_URL}/evaluaciones/matriz/escenario/${escenarioId}/reinicializar`, {}, getAuthHeader());
  return response.data;
};

// Completar matriz si hay cambios
export const completarMatriz = async (): Promise<CeldaMatriz[]> => {
  const escenarioId = getIdScenarioLocalStorage();
  if (!escenarioId) throw new Error('No hay escenario seleccionado');

  const response = await axios.post(`${API_URL}/evaluaciones/matriz/escenario/${escenarioId}/completar`, {}, getAuthHeader());
  return response.data;
};

// Actualizar valores de la matriz
export const actualizarValoresMatriz = async (datos: UpdateCeldaMatriz[]): Promise<CeldaMatriz[]> => {
  const escenarioId = getIdScenarioLocalStorage();
  if (!escenarioId) throw new Error('No hay escenario seleccionado');

  const response = await axios.put(`${API_URL}/evaluaciones/matriz/escenario/${escenarioId}`, datos, getAuthHeader());
  return response.data;
};

// Calcular resultados ELECTRE
export const calcularElectre = async (): Promise<string[]> => {
  const escenarioId = getIdScenarioLocalStorage();
  if (!escenarioId) throw new Error('No hay escenario seleccionado');

  const response = await axios.get(`${API_URL}/electre/escenarios/${escenarioId}/resultados_flujo_neto`, getAuthHeader());
  return response.data;
};
