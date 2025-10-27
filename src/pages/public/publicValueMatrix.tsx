import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import PublicSidebar from "./PublicSidebar";
import { BASE_URL } from "../../config/api";

interface Alternative {
    id: number;
    name: string;
    description: string;
}

interface Criterion {
    id: string;
    name: string;
    weight: number;
    indiferencia: number;
    preferencia: number;
    veto: number;
}

interface MatrixValue {
    alternativeId: number;
    criterionId: string;
    value: number;
}

// Funciones para manejar cookies
const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Cargar alternativas
const loadAlternativesFromCookie = (): Alternative[] => {
    const data = getCookie('public_alternatives');
    if (data) {
        try {
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }
    return [];
};

// Cargar criterios con pesos y umbrales
const loadCriteriaFromCookie = (): Criterion[] => {
    const weightsData = getCookie('public_criteria_weights');
    if (weightsData) {
        try {
            return JSON.parse(weightsData);
        } catch (error) {
            console.error('Error parsing criteria weights:', error);
        }
    }
    
    // Fallback a criterios por defecto
    return getDefaultCriteria();
};

const getDefaultCriteria = (): Criterion[] => [
    {
        id: 'precio',
        name: 'Precio',
        weight: 0.5,
        indiferencia: 100,
        preferencia: 200,
        veto: 500
    },
    {
        id: 'rendimiento',
        name: 'Rendimiento',
        weight: 0.5,
        indiferencia: 0.5,
        preferencia: 1,
        veto: 2
    }
];

// Cargar matriz
const loadMatrixFromCookie = (): MatrixValue[] => {
    const data = getCookie('public_matrix');
    if (data) {
        try {
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }
    return [];
};

// Guardar matriz
const saveMatrixToCookie = (matrix: MatrixValue[]) => {
    setCookie('public_matrix', JSON.stringify(matrix), 30);
};

// Función para generar CSV desde la matriz en el formato requerido
const generateCSV = (
    alternatives: Alternative[],
    criteria: Criterion[],
    matrixValues: MatrixValue[]
): string => {
    const lines: string[] = [];
    
    // Primera línea: encabezados (- seguido de los nombres de criterios)
    const headers = ['-', ...criteria.map(c => c.name)];
    lines.push(headers.join(',') + ';');
    
    // Filas de alternativas con sus valores
    alternatives.forEach(alt => {
        const row = [alt.name];
        criteria.forEach(crit => {
            const value = matrixValues.find(
                m => m.alternativeId === alt.id && m.criterionId === crit.id
            );
            row.push(value?.value.toString() || '0');
        });
        lines.push(row.join(',') + ';');
    });
    
    // Fila W (Pesos - Weights)
    const weightsRow = ['W', ...criteria.map(c => c.weight.toString())];
    lines.push(weightsRow.join(',') + ';');
    
    // Fila P (Umbral de Preferencia)
    const prefRow = ['P', ...criteria.map(c => c.preferencia.toString())];
    lines.push(prefRow.join(',') + ';');
    
    // Fila Q (Umbral de Indiferencia)
    const indiffRow = ['Q', ...criteria.map(c => c.indiferencia.toString())];
    lines.push(indiffRow.join(',') + ';');
    
    // Fila V (Umbral de Veto)
    const vetoRow = ['V', ...criteria.map(c => c.veto.toString())];
    lines.push(vetoRow.join(',') + ';');
    
    // Fila D (Dirección: 1 = Maximizar, 0 = Minimizar)
    // Necesitamos obtener la información de si cada criterio es benefit o cost
    const directionRow = ['D', ...criteria.map(c => {
        // Buscar en la lista de criterios si es benefit (maximizar)
        const criteriaListData = getCookie('public_criteria_list');
        if (criteriaListData) {
            try {
                const criteriaList = JSON.parse(criteriaListData);
                const criterion = criteriaList.find((item: any) => 
                    item.name.toLowerCase() === c.name.toLowerCase()
                );
                return criterion?.isBenefit ? '1' : '0';
            } catch (error) {
                console.error('Error parsing criteria list:', error);
            }
        }
        // Por defecto, asumir maximizar
        return '1';
    })];
    lines.push(directionRow.join(',') + ';');
    
    return lines.join('\n');
};;

// Función para llamar al endpoint ELECTRE
const callElectreAPI = async (
    csvContent: string,
    lambda: number,
    mode: 'destilacion' | 'flujo'
): Promise<any> => {
    try {
        // Crear un Blob con el contenido en formato TSV (tab-separated)
        const blob = new Blob([csvContent], { type: 'text/tab-separated-values' });
        const file = new File([blob], 'matrix.txt', { type: 'text/plain' });
        
        // Crear FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('lambda_corte', lambda.toString());
        
        // Determinar el endpoint según el modo
        const endpoint = mode === 'flujo' 
            ? '/api/v1/electre/ejecutar_directo_flujo_neto' 
            : '/api/v1/electre/ejecutar_directo_destilacion';
        
        console.log('Enviando archivo a:', `${BASE_URL}${endpoint}`);
        console.log('Lambda:', lambda);
        console.log('Contenido del archivo:\n', csvContent);
        
        // Hacer la petición
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error calling ELECTRE API:', error);
        throw error;
    }
};

export default function PublicValueMatrix() {
    const [alternatives, setAlternatives] = useState<Alternative[]>([]);
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const [matrixValues, setMatrixValues] = useState<MatrixValue[]>([]);
    const [loading, setLoading] = useState(true);
    const [electreResults, setElectreResults] = useState<string[]>([]);
    const [calculatingResults, setCalculatingResults] = useState(false);
    const [calculationMode, setCalculationMode] = useState<'destilacion' | 'flujo'>('destilacion');

    // Cargar datos al montar
    useEffect(() => {
        const loadedAlternatives = loadAlternativesFromCookie();
        const loadedCriteria = loadCriteriaFromCookie();
        const loadedMatrix = loadMatrixFromCookie();

        setAlternatives(loadedAlternatives);
        setCriteria(loadedCriteria);
        setMatrixValues(loadedMatrix);
        setLoading(false);
    }, []);

    // Inicializar matriz si está vacía
    useEffect(() => {
        if (alternatives.length > 0 && criteria.length > 0 && matrixValues.length === 0) {
            const initialMatrix: MatrixValue[] = [];
            alternatives.forEach(alt => {
                criteria.forEach(crit => {
                    initialMatrix.push({
                        alternativeId: alt.id,
                        criterionId: crit.id,
                        value: 0
                    });
                });
            });
            setMatrixValues(initialMatrix);
        }
    }, [alternatives, criteria]);

    // Guardar matriz cada vez que cambia
    useEffect(() => {
        if (!loading && matrixValues.length > 0) {
            saveMatrixToCookie(matrixValues);
        }
    }, [matrixValues, loading]);

    const getValue = (alternativeId: number, criterionId: string): number => {
        const item = matrixValues.find(
            m => m.alternativeId === alternativeId && m.criterionId === criterionId
        );
        return item?.value || 0;
    };

    const handleValueChange = (alternativeId: number, criterionId: string, newValue: string) => {
        const numericValue = parseFloat(newValue) || 0;
        
        setMatrixValues(prev => {
            const existingIndex = prev.findIndex(
                m => m.alternativeId === alternativeId && m.criterionId === criterionId
            );
            
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = { ...updated[existingIndex], value: numericValue };
                return updated;
            } else {
                return [...prev, { alternativeId, criterionId, value: numericValue }];
            }
        });
    };

    const clearMatrix = () => {
        const clearedMatrix = matrixValues.map(m => ({ ...m, value: 0 }));
        setMatrixValues(clearedMatrix);
        setElectreResults([]);
        toast.success('Matriz limpiada', {
            position: "bottom-right",
            autoClose: 2000,
            theme: "colorful",
        });
    };

    const calculateResults = async () => {
        try {
            setCalculatingResults(true);
            setElectreResults([]);

            // Obtener lambda de las cookies
            const lambdaStr = getCookie('public_lambda');
            const lambda = lambdaStr ? parseFloat(lambdaStr) : 0.7;

            // Generar CSV
            const csvContent = generateCSV(alternatives, criteria, matrixValues);
            
            console.log('CSV generado:', csvContent);
            console.log('Lambda:', lambda);
            console.log('Modo:', calculationMode);

            // Llamar al endpoint
            const resultado = await callElectreAPI(csvContent, lambda, calculationMode);
            
            console.log('Resultado ELECTRE:', resultado);

            // Formatear resultados
            const formattedResults = formatElectreResults(resultado, calculationMode);
            setElectreResults(formattedResults);
            
            toast.success('Cálculo completado exitosamente', {
                position: "bottom-right",
                autoClose: 2000,
                theme: "colorful",
            });
        } catch (error) {
            console.error('Error al calcular resultados:', error);
            toast.error(`Error: ${error instanceof Error ? error.message : 'Error al calcular ELECTRE III'}`, {
                position: "bottom-right",
                autoClose: 4000,
                theme: "colorful",
            });
            
            // Mostrar resultados de error
            setElectreResults([
                '❌ Error al calcular resultados',
                '',
                'Detalles:',
                error instanceof Error ? error.message : 'Error desconocido',
                '',
                'Verifica:',
                '- Que el servidor esté ejecutándose',
                '- Que todos los valores de la matriz sean números válidos',
                '- Que los pesos sumen 1',
                '- Que los umbrales estén correctamente configurados'
            ]);
        } finally {
            setCalculatingResults(false);
        }
    };

    // Función para formatear los resultados del API
    const formatElectreResults = (resultado: any, mode: string): string[] => {
        const lines: string[] = [];
        
        lines.push(`Método: ${mode === 'destilacion' ? 'Destilación' : 'Flujo Neto'}`);
        lines.push('');
        
        // Si el resultado es directamente un array (como ['hola', 'JEJE'])
        if (Array.isArray(resultado)) {
            lines.push('Ranking de Alternativas:');
            lines.push('─────────────────────────');
            resultado.forEach((item: any, idx: number) => {
                const nombre = typeof item === 'string' ? item : (item.alternativa || item.nombre || JSON.stringify(item));
                lines.push(`${idx + 1}. ${nombre}`);
            });
        }
        // Si el resultado es un objeto con propiedad ranking
        else if (resultado.ranking) {
            lines.push('Ranking de Alternativas:');
            lines.push('─────────────────────────');
            resultado.ranking.forEach((item: any, idx: number) => {
                const nombre = typeof item === 'string' ? item : (item.alternativa || item.nombre || JSON.stringify(item));
                lines.push(`${idx + 1}. ${nombre}`);
            });
        }
        
        if (resultado.flujos_netos) {
            lines.push('');
            lines.push('Flujos Netos:');
            lines.push('─────────────────────────');
            Object.entries(resultado.flujos_netos).forEach(([alt, flujo]) => {
                lines.push(`${alt}: ${typeof flujo === 'number' ? flujo.toFixed(4) : flujo}`);
            });
        }
        
        if (resultado.matriz_concordancia) {
            lines.push('');
            lines.push('Matriz de Concordancia calculada');
        }
        
        if (resultado.matriz_discordancia) {
            lines.push('Matriz de Discordancia calculada');
        }
        
        return lines;
    };

    if (loading) {
        return (
            <div className="flex bg-gray-900 min-h-screen">
                <PublicSidebar />
                <div className="flex-1 p-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (alternatives.length === 0 || criteria.length === 0) {
        return (
            <div className="flex bg-gray-900 min-h-screen">
                <PublicSidebar />
                <div className="flex-1 p-8 text-white">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-red-400 mb-2">Configuración incompleta</h2>
                            <p className="text-gray-400">
                                Debes crear al menos 1 alternativa antes de usar la matriz valuada.
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                Actualmente hay: {alternatives.length} alternativa(s) y {criteria.length} criterio(s)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-900 min-h-screen">
            <PublicSidebar />
            
            <div className="flex-1 p-8 text-white">
                <div className="mb-6">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">Matriz Valuada</h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        Ingresa los valores para evaluar cada alternativa según los criterios definidos
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                    {/* Matriz de Evaluación */}
                    <div className="border border-gray-600 rounded-lg p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                            </svg>
                            <h2 className="text-xl md:text-2xl font-bold">Matriz de Evaluación</h2>
                        </div>
                        <p className="text-gray-400 text-sm md:text-base mb-6">
                            Ingresa los valores para cada alternativa según cada criterio.
                        </p>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-800">
                                        <th className="border border-gray-600 px-4 py-3 text-left">Alternativa</th>
                                        {criteria.map(criterion => (
                                            <th key={criterion.id} className="border border-gray-600 px-4 py-3 text-center">
                                                {criterion.name}
                                                <div className="text-xs text-gray-400 font-normal">
                                                    (Peso: {criterion.weight})
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {alternatives.map(alternative => (
                                        <tr key={alternative.id} className="hover:bg-gray-800">
                                            <td className="border border-gray-600 px-4 py-3 font-semibold">
                                                {alternative.name}
                                            </td>
                                            {criteria.map(criterion => (
                                                <td key={criterion.id} className="border border-gray-600 px-2 py-2">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={getValue(alternative.id, criterion.id)}
                                                        onChange={(e) => handleValueChange(alternative.id, criterion.id, e.target.value)}
                                                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center text-white focus:outline-none focus:border-blue-500"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-6">
                            <button
                                onClick={clearMatrix}
                                className="border border-gray-600 hover:bg-gray-800 rounded-md px-4 py-2 text-white transition-colors"
                            >
                                Limpiar Matriz
                            </button>
                            <button
                                onClick={() => {
                                    const csv = generateCSV(alternatives, criteria, matrixValues);
                                    console.log('CSV generado:\n', csv);
                                    const blob = new Blob([csv], { type: 'text/csv' });
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'matriz_electre.csv';
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                    toast.success('Archivo descargado', {
                                        position: "bottom-right",
                                        autoClose: 2000,
                                        theme: "colorful",
                                    });
                                }}
                                className="border border-blue-600 hover:bg-blue-800 rounded-md px-4 py-2 text-blue-400 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Descargar Matriz ELECTRE
                            </button>
                        </div>
                    </div>

                    {/* Panel de Resultados */}
                    <div className="border border-gray-600 rounded-lg p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                            <h2 className="text-xl md:text-2xl font-bold">Resultados ELECTRE III</h2>
                        </div>

                        {/* Selector de método */}
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2">Método de cálculo:</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCalculationMode('destilacion')}
                                    className={`px-4 py-2 rounded-md transition-colors ${
                                        calculationMode === 'destilacion'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    Destilación
                                </button>
                                <button
                                    onClick={() => setCalculationMode('flujo')}
                                    className={`px-4 py-2 rounded-md transition-colors ${
                                        calculationMode === 'flujo'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    Flujo Neto
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={calculateResults}
                            disabled={calculatingResults}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-md px-4 py-3 text-white font-medium transition-colors mb-4 flex items-center justify-center gap-2"
                        >
                            {calculatingResults ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Calculando...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                    </svg>
                                    Calcular Resultados ELECTRE III
                                </>
                            )}
                        </button>

                        {electreResults.length > 0 && (
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-3 text-green-400">Resultados:</h3>
                                <div className="space-y-1">
                                    {electreResults.map((result, index) => (
                                        <p key={index} className="text-gray-300 font-mono text-sm">
                                            {result}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {electreResults.length === 0 && (
                            <div className="bg-gray-800 rounded-lg p-6 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-500 mb-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                </svg>
                                <p className="text-gray-400">
                                    No hay resultados aún. Completa la matriz y haz clic en "Calcular Resultados".
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
