import { useState, useEffect } from "react";
import { actualizarValoresMatriz, calcularElectreFlujoNeto, calcularElectreDestilacion, completarMatriz, reinicializarMatriz, type CeldaMatrizExtendida, type UpdateCeldaMatriz, type Alternativa, type Criterio } from "../../api/matriz";
import { getIdScenarioLocalStorage } from "../../helpers";
import { useNavigate } from "react-router-dom";

export default function ValueMatrix() {
    const router = useNavigate();
    const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
    const [matrizData, setMatrizData] = useState<CeldaMatrizExtendida[]>([]);
    const [alternativas, setAlternativas] = useState<Alternativa[]>([]);
    const [criterios, setCriterios] = useState<Criterio[]>([]);
    const [loading, setLoading] = useState(false);
    const [electreResults, setElectreResults] = useState<string[]>([]);
    const [calculatingResults, setCalculatingResults] = useState(false);
    const [clearingMatrix, setClearingMatrix] = useState(false);
    const [calculationMode, setCalculationMode] = useState<'destilacion' | 'flujo'>('destilacion');
    const [showCalculationOptions, setShowCalculationOptions] = useState(false);
    // Load initial data
    useEffect(() => {
        const scenarioId = getIdScenarioLocalStorage();
        setCurrentScenarioId(scenarioId);

        if (scenarioId) {
            loadMatriz();
        }
    }, []);
    const goToScenarios = () => {
        router('/scenarios');
    };
    // Watch for scenario changes
    useEffect(() => {
        const interval = setInterval(() => {
            const newScenarioId = getIdScenarioLocalStorage();
            if (newScenarioId !== currentScenarioId) {
                setCurrentScenarioId(newScenarioId);
                if (newScenarioId) {
                    loadMatriz();
                } else {
                    // Clear data if no scenario selected
                    setMatrizData([]);
                    setAlternativas([]);
                    setCriterios([]);
                    setElectreResults([]);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [currentScenarioId]);

    const loadMatriz = async () => {
        try {
            setLoading(true);
            const data = await completarMatriz();
            setMatrizData(data);

            // Extract unique alternatives and criteria from matrix data
            const uniqueAlternativas = data.reduce((acc: Alternativa[], current) => {
                const exists = acc.find(alt => alt.id === current.alternativa.id);
                if (!exists) {
                    acc.push(current.alternativa);
                }
                return acc;
            }, []);

            const uniqueCriterios = data.reduce((acc: Criterio[], current) => {
                const exists = acc.find(crit => crit.id === current.criterio.id);
                if (!exists) {
                    acc.push(current.criterio);
                }
                return acc;
            }, []);

            setAlternativas(uniqueAlternativas);
            setCriterios(uniqueCriterios);
        } catch (error) {
            console.error('Error loading matriz:', error);
        } finally {
            setLoading(false);
        }
    };

    // Simplified handleValueChange - only updates local state
    const handleValueChange = (celdaId: number, newValue: number | string) => {
        const numericValue = typeof newValue === 'string' ? parseFloat(newValue) || 0 : newValue;

        // Update local state immediately for better UX
        setMatrizData(prev =>
            prev.map(celda =>
                celda.id === celdaId
                    ? { ...celda, value: numericValue }
                    : celda
            )
        );
    };



// Modifica la función calculateResults para usar el modo seleccionado
const calculateResults = async () => {
    try {
        setCalculatingResults(true);
        // Limpiar resultados anteriores
        setElectreResults([]);

        // PRIMERO: Actualizar todos los valores de la matriz en la base de datos
        const updateData: UpdateCeldaMatriz[] = matrizData.map(celda => ({
            id: celda.id,
            value: celda.value
        }));

        console.log('Actualizando valores de la matriz...');
        await actualizarValoresMatriz(updateData);

        // SEGUNDO: Calcular los resultados ELECTRE según el modo seleccionado
        console.log(`Calculando resultados ELECTRE por ${calculationMode}...`);
        let results;
        if (calculationMode === 'destilacion') {
            results = await calcularElectreDestilacion();
        } else {
            results = await calcularElectreFlujoNeto();
        }
        setElectreResults(results);
    } catch (error) {
        console.error(`Error calculating ELECTRE results by ${calculationMode}:`, error);
    } finally {
        setCalculatingResults(false);
    }
};

// Reemplaza los botones de acción por esta implementación

    const clearMatrix = async () => {
        try {
            setClearingMatrix(true);
            setElectreResults([]);

            // Usar reinicializarMatriz para limpiar la matriz
            await reinicializarMatriz();

            // Recargar la matriz después de reinicializarla
            await loadMatriz();
        } catch (error) {
            console.error('Error clearing matrix:', error);
        } finally {
            setClearingMatrix(false);
        }
    };

    // Helper functions to get values by alternative and criteria
    const getValue = (alternativaId: number, criterioId: number): number => {
        const celda = matrizData.find(c => c.alternativa.id === alternativaId && c.criterio.id === criterioId);
        return celda?.value || 0;
    };

    const getCeldaId = (alternativaId: number, criterioId: number): number => {
        const celda = matrizData.find(c => c.alternativa.id === alternativaId && c.criterio.id === criterioId);
        return celda?.id || 0;
    };

    if (loading) {
        return (
            <div className="text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando matriz...</p>
                </div>
            </div>
        );
    }

      if (!currentScenarioId) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="text-center">
                    <div className="mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-20 mx-auto text-gray-500">
                            <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-200 mb-4">
                        Debes seleccionar un escenario
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Para ver y gestionar la matriz valuada, primero necesitas seleccionar un escenario.
                    </p>
                    <button
                        onClick={goToScenarios}
                        className="bg-blue-600 hover:bg-blue-700 rounded-md px-6 py-3 text-white font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        Ir a Seleccionar Escenario
                    </button>
                </div>
            </div>
        );
    }

    // Validación: debe haber al menos 1 criterio y 1 alternativa
    if (alternativas.length < 1 || criterios.length < 1) {
        return (
            <div className="text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-red-400 mb-2">Configuración incompleta</h2>
                    <p className="text-gray-400">Debe existir al menos 1 criterio y 1 alternativa</p>
                    <p className="text-gray-500 text-sm mt-2">
                        Actualmente hay: {alternativas.length} alternativa(s) y {criterios.length} criterio(s)
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="text-white min-h-screen">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Matriz Valuada</h1>
                <p className="text-gray-400 text-sm md:text-base">
                    Escenario: {currentScenarioId ? `ID: ${currentScenarioId}` : 'No seleccionado'}
                </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
                <button className="border border-gray-600 hover:bg-gray-800 rounded-md px-3 py-2 md:px-4 md:py-2 text-white text-sm md:text-base transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Pesos
                </button>
                <button className="border border-gray-600 hover:bg-gray-800 rounded-md px-3 py-2 md:px-4 md:py-2 text-white text-sm md:text-base transition-colors">
                    Ir a Informes
                </button>
            </div>

            {/* Main Content - Responsive Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column - Evaluation Matrix */}
                {/* Left Column - Evaluation Matrix */}
                <div className="border border-gray-600 rounded-lg p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
                            <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
                        </svg>
                        <h2 className="text-xl md:text-2xl font-bold">Matriz de Valoración</h2>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base mb-6">
                        Ingresa los valores para cada alternativa según cada criterio.
                    </p>

                    {/* Matriz literal en formato de tabla */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-800">
                                    <th className="p-3 text-left border border-gray-600">Alternativas</th>
                                    {criterios.map((criterio) => (
                                        <th key={criterio.id} className="p-3 text-left border border-gray-600">
                                            <div>
                                                {criterio.name}
                                                <span className="text-xs text-gray-500 ml-1">
                                                    [{criterio.is_benefit ? 'MAX' : 'MIN'}]
                                                </span>
                                            </div>
                                            {criterio.weight && (
                                                <div className="text-xs text-blue-400">
                                                    Peso: {criterio.weight}
                                                </div>
                                            )}
                                            {criterio.description && (
                                                <div className="text-xs text-gray-500 mt-1 truncate max-w-[150px]" title={criterio.description}>
                                                    {criterio.description}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {alternativas.map((alternativa) => (
                                    <tr key={alternativa.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-3 border border-gray-600">
                                            <div className="font-medium">{alternativa.name}</div>
                                            {alternativa.description && (
                                                <div className="text-xs text-gray-400">{alternativa.description}</div>
                                            )}
                                        </td>
                                        {criterios.map((criterio) => (
                                            <td key={`${alternativa.id}-${criterio.id}`} className="p-3 border border-gray-600">
                                                <input
                                                    type="number"
                                                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={getValue(alternativa.id, criterio.id) || ''}
                                                    onChange={(e) => handleValueChange(getCeldaId(alternativa.id, criterio.id), e.target.value)}
                                                    placeholder="Valor"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-gray-700">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1 sm:flex-none">
                                <button
                                    className="w-full bg-blue-600 hover:bg-blue-700 rounded-md px-6 py-3 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setShowCalculationOptions(!showCalculationOptions)}
                                    disabled={calculatingResults}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                                    </svg>
                                    Calcular por {calculationMode === 'destilacion' ? 'Destilación' : 'Flujo Neto'}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                
                                {/* Dropdown menu */}
                                {showCalculationOptions && (
                                    <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg">
                                        <div className="p-1">
                                            <button
                                                onClick={() => {
                                                    setCalculationMode('destilacion');
                                                    setShowCalculationOptions(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 rounded-md ${calculationMode === 'destilacion' ? 'bg-blue-800' : 'hover:bg-gray-800'}`}
                                            >
                                                <div className="font-medium">Destilación</div>
                                                <div className="text-xs text-gray-400">Método de clasificación por destilación ascendente y descendente</div>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setCalculationMode('flujo');
                                                    setShowCalculationOptions(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 rounded-md ${calculationMode === 'flujo' ? 'bg-blue-800' : 'hover:bg-gray-800'}`}
                                            >
                                                <div className="font-medium">Flujo Neto</div>
                                                <div className="text-xs text-gray-400">Método de clasificación por cálculo de flujos netos</div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <button
                                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 rounded-md px-6 py-3 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                onClick={calculateResults}
                                disabled={calculatingResults}
                            >
                                {calculatingResults ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Calculando...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        Ejecutar cálculo
                                    </>
                                )}
                            </button>
                        </div>
                        
                        <button
                            className="bg-transparent border border-gray-600 hover:bg-gray-800 rounded-md px-6 py-3 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            onClick={clearMatrix}
                            disabled={clearingMatrix}
                        >
                            {clearingMatrix ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Limpiando...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    Limpiar Matriz
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Column - ELECTRE III Results */}
                <div className="border border-gray-600 rounded-lg p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
                            <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
                        </svg>
                        <h2 className="text-xl md:text-2xl font-bold">Resultados ELECTRE III</h2>
                        </div>
                        <p className="text-gray-400 text-sm md:text-base mb-6">
                            Clasificación de alternativas según el método ELECTRE III ({calculationMode === 'destilacion' ? 'Destilación' : 'Flujo Neto'}).
                        </p>

                    {electreResults.length > 0 ? (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-green-400 mb-4">Ranking de Alternativas:</h3>
                            {electreResults.map((result, index) => (
                                <div key={index} className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{index + 1}. {result}</span>
                                        <div className="flex items-center">
                                            {index === 0 && (
                                                <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                                                    Mejor opción
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* No Results State */
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                            <div className="mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125-.504 1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">No hay resultados</h3>
                            <p className="text-gray-500 mb-4">
                                Completa la matriz de valoración y calcula los resultados.
                            </p>
                            <button
                                className="bg-transparent border border-gray-600 hover:bg-gray-800 rounded-md px-6 py-3 text-white font-medium transition-colors"
                                onClick={calculateResults}
                                disabled={calculatingResults}
                            >
                                {calculatingResults ? 'Calculando...' : 'Ver Informe Completo'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}