import axios from 'axios';
import { BASE_URL } from '../config/api';
import { getAuthHeader, getIdScenarioLocalStorage } from '../helpers';

const API_URL = `${BASE_URL}/api/v1`;

export interface Alternativa {
  id: number;
  name: string;
  description: string;
  escenario_id: number;
}

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

// Interfaces
export interface CeldaMatrizExtendida {
  id: number;
  value: number;
  escenario_id: number;
  criterio: Criterio;
  alternativa: Alternativa;
}

export interface UpdateCeldaMatriz {
  id: number;
  value: number;
}

// Resultado de ELECTRE III por alternativa (mayor score es mejor).
// Las alternativas con el mismo score comparten posición.
export interface ResultadoRanking {
  alternativa: string;
  score: number;
  posicion: number;
}

// Obtener la matriz
export const getMatriz = async (): Promise<CeldaMatrizExtendida[]> => {
  const escenarioId = getIdScenarioLocalStorage();
  if (!escenarioId) throw new Error('No hay escenario seleccionado');

  const response = await axios.get(`${API_URL}/evaluaciones/escenario/${escenarioId}`, getAuthHeader());
  return response.data;
};


// Reinicializar matriz
export const reinicializarMatriz = async (): Promise<CeldaMatrizExtendida[]> => {
  const escenarioId = getIdScenarioLocalStorage();
  if (!escenarioId) throw new Error('No hay escenario seleccionado');

  const response = await axios.post(`${API_URL}/evaluaciones/matriz/escenario/${escenarioId}/reinicializar`, {}, getAuthHeader());
  return response.data;
};

// Completar matriz si hay cambios
export const completarMatriz = async (): Promise<CeldaMatrizExtendida[]> => {
  const escenarioId = getIdScenarioLocalStorage();
  if (!escenarioId) throw new Error('No hay escenario seleccionado');

  const response = await axios.post(`${API_URL}/evaluaciones/matriz/escenario/${escenarioId}/completar`, {}, getAuthHeader());
  return response.data;
};

// Actualizar valores de la matriz
export const actualizarValoresMatriz = async (datos: UpdateCeldaMatriz[]): Promise<CeldaMatrizExtendida[]> => {
  const escenarioId = getIdScenarioLocalStorage();
  if (!escenarioId) throw new Error('No hay escenario seleccionado');

  const response = await axios.put(`${API_URL}/evaluaciones/matriz/escenario/${escenarioId}`, datos, getAuthHeader());
  return response.data;
};

// Calcular resultados ELECTRE (con score y posición de cada alternativa)
export const calcularElectreFlujoNeto = async (): Promise<ResultadoRanking[]> => {
  const escenarioId = getIdScenarioLocalStorage();
  if (!escenarioId) throw new Error('No hay escenario seleccionado');

  const response = await axios.get(`${API_URL}/electre/escenarios/${escenarioId}/resultados_flujo_neto`, {
    ...getAuthHeader(),
    params: { detalle: true },
  });
  return response.data;
};

export const calcularElectreDestilacion = async (): Promise<ResultadoRanking[]> => {
  const escenarioId = getIdScenarioLocalStorage();
  if (!escenarioId) throw new Error('No hay escenario seleccionado');

  const response = await axios.get(`${API_URL}/electre/escenarios/${escenarioId}/resultados_destilacion`, {
    ...getAuthHeader(),
    params: { detalle: true },
  });
  return response.data;
};
