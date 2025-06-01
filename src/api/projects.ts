// src/api/projects.ts
import axios from 'axios';
import { BASE_URL } from '../config/api';
import { getAuthHeader } from '../helpers';

const API_URL = `${BASE_URL}/api/v1`;

// Interfaces para tipar las respuestas
export interface Project {
    title: string;
    description: string;
    id: number;
    owner_id: number;
    created_at: string;
    updated_at: string;
}

export interface CreateProjectData {
    title: string;
    description: string;
}

export interface UpdateProjectData {
    title?: string;
    description?: string;
}


// Obtener todos los proyectos del usuario
export const getProjects = async (): Promise<Project[]> => {
    const response = await axios.get(`${API_URL}/proyectos`, getAuthHeader());
    return response.data;
};

// Obtener un proyecto específico por ID
export const getProjectById = async (projectId: number): Promise<Project> => {
    const response = await axios.get(`${API_URL}/proyectos/${projectId}`, getAuthHeader());
    return response.data;
};

// Crear un nuevo proyecto
export const createProject = async (data: CreateProjectData): Promise<Project> => {
    const response = await axios.post(`${API_URL}/proyectos`, data, getAuthHeader());
    return response.data;
};

// Actualizar un proyecto existente
export const updateProject = async (projectId: number, data: UpdateProjectData): Promise<Project> => {
    const response = await axios.put(`${API_URL}/proyectos/${projectId}`, data, getAuthHeader());
    return response.data;
};

// Eliminar un proyecto
export const deleteProject = async (projectId: number): Promise<void> => {
    await axios.delete(`${API_URL}/proyectos/${projectId}`, getAuthHeader());
};

// Clonar un proyecto
export const cloneProject = async (projectId: number, newTitle: string): Promise<Project> => {
    const response = await axios.post(
        `${API_URL}/proyectos/${projectId}/clonar`, 
        { title: newTitle }, 
        getAuthHeader()
    );
    return response.data;
};