import { useState, useEffect } from "react";
import { actualizarValoresMatriz, calcularElectre, completarMatriz, reinicializarMatriz, type CeldaMatrizExtendida, type UpdateCeldaMatriz, type Alternativa, type Criterio } from "../../api/matriz";
import { getIdScenarioLocalStorage } from "../../helpers";

export default function ValueMatrix() {
    const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
    const [matrizData, setMatrizData] = useState<CeldaMatrizExtendida[]>([]);
    const [alternativas, setAlternativas] = useState<Alternativa[]>([]);
    const [criterios, setCriterios] = useState<Criterio[]>([]);
    const [loading, setLoading] = useState(false);
    const [electreResults, setElectreResults] = useState<string[]>([]);
    const [calculatingResults, setCalculatingResults] = useState(false);
    const [clearingMatrix, setClearingMatrix] = useState(false);

    // Load initial data
    useEffect(() => {
        const scenarioId = getIdScenarioLocalStorage();
        setCurrentScenarioId(scenarioId);

        if (scenarioId) {
            loadMatriz();
        }
    }, []);

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

            // SEGUNDO: Después de actualizar, calcular los resultados ELECTRE
            console.log('Calculando resultados ELECTRE...');
            const results = await calcularElectre();
            setElectreResults(results);
        } catch (error) {
            console.error('Error calculating ELECTRE results:', error);
        } finally {
            setCalculatingResults(false);
        }
    };

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
            <div className="text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">No hay escenario seleccionado</h2>
                    <p className="text-gray-500">Selecciona un escenario para comenzar a evaluar la matriz.</p>
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

                    <div className="space-y-6">
                        {/* Dynamic Alternatives */}
                        {alternativas.map((alternativa) => (
                            <div key={alternativa.id}>
                                <h3 className="text-lg font-semibold mb-4 text-gray-200">
                                    {alternativa.name}
                                    {alternativa.description && (
                                        <span className="text-sm font-normal text-gray-400 ml-2">
                                            - {alternativa.description}
                                        </span>
                                    )}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex flex-col md:grid-cols-2 gap-4">
                                        {criterios.map((criterio) => (
                                            <div key={criterio.id} className="flex-1 min-w-0">
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    {criterio.name}
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        [{criterio.is_benefit ? 'MAX' : 'MIN'}]
                                                    </span>
                                                    {criterio.weight && (
                                                        <span className="text-xs text-blue-400 ml-1">
                                                            (Peso: {criterio.weight})
                                                        </span>
                                                    )}
                                                </label>
                                                {criterio.description && (
                                                    <p className="text-xs text-gray-500 mb-2">{criterio.description}</p>
                                                )}
                                                <input
                                                    type="number"
                                                    className="w-full bg-gray-800 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={getValue(alternativa.id, criterio.id)}
                                                    onChange={(e) => handleValueChange(getCeldaId(alternativa.id, criterio.id), e.target.value)}
                                                    placeholder={`Ingrese valor para ${criterio.name.toLowerCase()}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 rounded-md px-6 py-3 text-white font-medium transition-colors flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={calculateResults}
                                disabled={calculatingResults}
                            >
                                {calculatingResults ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Calculando...
                                    </div>
                                ) : (
                                    'Calcular Resultados'
                                )}
                            </button>
                            <button
                                className="bg-transparent border border-gray-600 hover:bg-gray-800 rounded-md px-6 py-3 text-white font-medium transition-colors flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={clearMatrix}
                                disabled={clearingMatrix}
                            >
                                {clearingMatrix ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Limpiando...
                                    </div>
                                ) : (
                                    'Limpiar Matriz'
                                )}
                            </button>
                        </div>
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
                        Clasificación de alternativas según el método ELECTRE III.
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