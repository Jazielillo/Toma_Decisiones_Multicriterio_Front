import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScenarioId } from "../../helpers/index"; // Asumiendo que tienes este hook
import {
    getMatriz,
    crearMatriz,
    completarMatriz,
    actualizarValoresMatriz,
    calcularElectre,
    type CeldaMatriz,
    type UpdateCeldaMatriz,
    reinicializarMatriz
} from "../../api/matriz"; // Ajusta la ruta según tu estructura

interface MatrizData {
    [key: string]: {
        [key: string]: number | string;
    };
}

export default function ValueMatrix() {
    const navigate = useNavigate();
    const scenarioId = useScenarioId();

    const [matrizData, setMatrizData] = useState<CeldaMatriz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [calculating, setCalculating] = useState(false);

    // Estados para manejar la estructura de la matriz
    const [values, setValues] = useState<MatrizData>({});
    const [alternativas, setAlternativas] = useState<string[]>([]);
    const [criterios, setCriterios] = useState<string[]>([]);
    const [resultadosElectre, setResultadosElectre] = useState<string[]>([]);

    // Cargar matriz cuando cambie el escenario
    useEffect(() => {
        if (scenarioId) {
            cargarMatriz();
        }
    }, [scenarioId]);

    const cargarMatriz = async () => {
        if (!scenarioId) return;

        setLoading(true);
        setError(null);

        try {
            // Primero intentamos obtener la matriz existente
            let matriz = await getMatriz();

            // Si la matriz está vacía, la creamos
            if (matriz.length === 0) {
                console.log("Matriz vacía, creando nueva matriz...");
                matriz = await crearMatriz();
            }

            // Siempre ejecutamos completarMatriz para asegurar consistencia
            matriz = await completarMatriz();

            setMatrizData(matriz);
            procesarDatosMatriz(matriz);

        } catch (err) {
            console.error("Error al cargar la matriz:", err);
        } finally {
            setLoading(false);
        }
    };

    const procesarDatosMatriz = (matriz: CeldaMatriz[]) => {
        if (matriz.length === 0) return;

        // Extraer alternativas y criterios únicos
        const alternativasUnicas = [...new Set(matriz.map(celda => celda.alternativa_id))];
        const criteriosUnicos = [...new Set(matriz.map(celda => celda.criterio_id))];

        setAlternativas(alternativasUnicas.map(id => `Alternativa ${id}`));
        setCriterios(criteriosUnicos.map(id => `Criterio ${id}`));

        // Estructurar los valores para el estado local
        const nuevosValues: MatrizData = {};

        alternativasUnicas.forEach(altId => {
            nuevosValues[`alternativa${altId}`] = {};
            criteriosUnicos.forEach(critId => {
                const celda = matriz.find(c =>
                    c.alternativa_id === altId && c.criterio_id === critId
                );
                nuevosValues[`alternativa${altId}`][`criterio${critId}`] = celda?.value || "";
            });
        });

        setValues(nuevosValues);
    };

    const handleValueChange = async (alternativaKey: string, criterioKey: string, value: number | string) => {
        // Actualizar estado local inmediatamente para UX responsiva
        setValues(prev => ({
            ...prev,
            [alternativaKey]: {
                ...prev[alternativaKey],
                [criterioKey]: value
            }
        }));

        // Encontrar la celda correspondiente para actualizar en la API
        const alternativaId = parseInt(alternativaKey.replace('alternativa', ''));
        const criterioId = parseInt(criterioKey.replace('criterio', ''));

        const celda = matrizData.find(c =>
            c.alternativa_id === alternativaId && c.criterio_id === criterioId
        );

        if (celda) {
            try {
                const updateData: UpdateCeldaMatriz[] = [{
                    id: celda.id,
                    value: typeof value === 'string' ? parseFloat(value) || 0 : value
                }];

                await actualizarValoresMatriz(updateData);

                // Recargar matriz para mantener sincronización
                const matrizActualizada = await getMatriz();
                setMatrizData(matrizActualizada);

            } catch (err) {
                console.error("Error al actualizar valor:", err);
                // Revertir cambio local en caso de error
                cargarMatriz();
            }
        }
    };

    const calculateResults = async () => {
        setCalculating(true);
        try {
            const resultados = await calcularElectre();
            setResultadosElectre(resultados);
            console.log("Resultados ELECTRE:", resultados);
        } catch (err) {
            console.error("Error al calcular resultados:", err);
            setError("Error al calcular resultados ELECTRE");
        } finally {
            setCalculating(false);
        }
    };

    const clearResults = async () => {
        try {
            // Reinicializar la matriz
            const matrizReiniciada = await reinicializarMatriz();
            setMatrizData(matrizReiniciada);
            procesarDatosMatriz(matrizReiniciada);
            setResultadosElectre([]);
        } catch (err) {
            console.error("Error al limpiar resultados:", err);
            setError("Error al limpiar la matriz");
        }
    };

    if (loading) {
        return (
            <div className="text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Cargando matriz...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={cargarMatriz}
                        className="bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2"
                    >
                        Reintentar
                    </button>
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
                    Escenario ID: {scenarioId} | {matrizData.length} celdas cargadas
                </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
                <button
                    onClick={() => navigate('/pesos')}
                    className="border border-gray-600 hover:bg-gray-800 rounded-md px-3 py-2 md:px-4 md:py-2 text-white text-sm md:text-base transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Pesos
                </button>
                <button
                    onClick={() => navigate('/informes')}
                    className="border border-gray-600 hover:bg-gray-800 rounded-md px-3 py-2 md:px-4 md:py-2 text-white text-sm md:text-base transition-colors"
                >
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
                        {/* Renderizar alternativas dinámicamente */}
                        {alternativas.map((alternativa, altIndex) => (
                            <div key={`alternativa${altIndex + 1}`}>
                                <h3 className="text-lg font-semibold mb-4 text-gray-200">{alternativa}</h3>
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-4">
                                        {criterios.map((criterio, critIndex) => (
                                            <div key={`criterio${critIndex + 1}`} className="flex-1 min-w-0">
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    {criterio}
                                                </label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-gray-800 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={values[`alternativa${altIndex + 1}`]?.[`criterio${critIndex + 1}`] || ""}
                                                    onChange={(e) => handleValueChange(`alternativa${altIndex + 1}`, `criterio${critIndex + 1}`, e.target.value)}
                                                    placeholder={`Ingrese valor para ${criterio.toLowerCase()}`}
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
                                className="bg-blue-600 hover:bg-blue-700 rounded-md px-6 py-3 text-white font-medium transition-colors flex-1 sm:flex-none disabled:opacity-50"
                                onClick={calculateResults}
                                disabled={calculating}
                            >
                                {calculating ? "Calculando..." : "Calcular Resultados"}
                            </button>
                            <button
                                className="bg-transparent border border-gray-600 hover:bg-gray-800 rounded-md px-6 py-3 text-white font-medium transition-colors flex-1 sm:flex-none"
                                onClick={clearResults}
                            >
                                Limpiar Resultados
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

                    {/* Results Display */}
                    {resultadosElectre.length > 0 ? (
                        <div className="space-y-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-3 text-green-400">Ranking de Alternativas</h3>
                                <div className="space-y-2">
                                    {resultadosElectre.map((resultado, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                                            <span className="font-medium">#{index + 1}</span>
                                            <span>{resultado}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
                                disabled={calculating}
                            >
                                {calculating ? "Calculando..." : "Calcular Resultados"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}