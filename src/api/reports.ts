import axios from 'axios';
import { BASE_URL } from '../config/api';
import { getAuthHeader, getIdProjectLocalStorage } from '../helpers';
import type { ResultadoRanking } from './matriz';

const API_URL = `${BASE_URL}/api/v1`;

// Interfaces para los datos del reporte
export interface ProjectReport {
  proyecto: {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  escenarios: ScenarioReport[];
}

export interface ScenarioReport {
  id: number;
  name: string;
  description: string;
  corte: number;
  created_at: string;
  updated_at: string;
  criterios: CriterioReport[];
  alternativas: AlternativaReport[];
  matriz_decision: number[][];
  resultados_electre: {
    flujo_neto: string[];
    destilacion: string[];
    flujo_neto_detalle: ResultadoRanking[];
    destilacion_detalle: ResultadoRanking[];
  };
  // Presente cuando el escenario no tiene datos suficientes para ELECTRE III
  error?: string;
}

export interface CriterioReport {
  id: number;
  name: string;
  description: string;
  weight: number;
  is_benefit: boolean;
  preference_threshold: number;
  indifference_threshold: number;
  veto_threshold: number;
}

export interface AlternativaReport {
  id: number;
  name: string;
  description: string;
}

// Función para obtener el reporte completo de un proyecto
export const getProjectReport = async (): Promise<ProjectReport> => {
  const projectId = getIdProjectLocalStorage();
  
  if (!projectId) {
    throw new Error('No hay proyecto seleccionado');
  }
  
  const response = await axios.get(
    `${API_URL}/reportes/proyecto/${projectId}/reporte_completo`, 
    getAuthHeader()
  );
  
  return response.data;
};