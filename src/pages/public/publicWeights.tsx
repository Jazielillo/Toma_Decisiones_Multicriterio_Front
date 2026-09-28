import { useState, useEffect, useMemo } from "react";
import { toast } from 'react-toastify';
import PublicSidebar from "./PublicSidebar";

interface Criterion {
    id: string;
    name: string;
    weight: number;
    indiferencia: number;
    preferencia: number;
    veto: number;
}

// Funciones para manejar cookies
const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

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

// Funciones para gestionar criterios en cookies
const loadCriteriaListFromCookie = (): any[] => {
    const data = getCookie('public_criteria_list');
    if (data) {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error('Error parsing criteria list from cookie:', error);
            return getDefaultCriteriaList();
        }
    }
    return getDefaultCriteriaList();
};

const getDefaultCriteriaList = (): any[] => [
    {
        id: 1,
        name: 'Precio',
        description: 'Costo total del producto o servicio',
        isBenefit: false
    },
    {
        id: 2,
        name: 'Rendimiento',
        description: 'Eficiencia y desempeño general',
        isBenefit: true
    }
];

const saveCriteriaToCookie = (criteria: Criterion[]) => {
    setCookie('public_criteria_weights', JSON.stringify(criteria), 30);
};

const loadCriteriaFromCookie = (): Criterion[] => {
    // Primero intentar cargar de la cookie de pesos/umbrales
    const weightsData = getCookie('public_criteria_weights');
    if (weightsData) {
        try {
            return JSON.parse(weightsData);
        } catch (error) {
            console.error('Error parsing criteria weights from cookie:', error);
        }
    }
    
    // Si no hay datos de pesos, crear estructura desde la lista de criterios
    const criteriaList = loadCriteriaListFromCookie();
    return criteriaList.map((crit, index) => ({
        id: crit.name.toLowerCase(),
        name: crit.name,
        weight: index === 0 ? 0.5 : 0.5,
        indiferencia: index === 0 ? 100 : 0.5,
        preferencia: index === 0 ? 200 : 1,
        veto: index === 0 ? 500 : 2
    }));
};

const saveLambdaToCookie = (lambda: number) => {
    setCookie('public_lambda', lambda.toString(), 30);
};

const loadLambdaFromCookie = (): number => {
    const data = getCookie('public_lambda');
    return data ? parseFloat(data) : 0.7;
};

export default function PublicWeights() {
    const [activeTab, setActiveTab] = useState("pesos");
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const [lambda, setLambda] = useState<number>(0.7);
    const [loading, setLoading] = useState(true);
    const [weightError, setWeightError] = useState<string>("");
    const [thresholdError, setThresholdError] = useState<string>("");
    const [lambdaError, setLambdaError] = useState<string>("");

    // Cargar datos de cookies al montar
    useEffect(() => {
        const loadedCriteria = loadCriteriaFromCookie();
        const loadedLambda = loadLambdaFromCookie();
        setCriteria(loadedCriteria);
        setLambda(loadedLambda);
        setLoading(false);
    }, []);

    // Calcular total de pesos sin modificar estado
    const totalWeight = useMemo(() => {
        return criteria.reduce((sum, crit) => sum + crit.weight, 0);
    }, [criteria]);

    // Verificar si los pesos son válidos
    const areWeightsValid = useMemo(() => {
        const roundedTotal = Math.round(totalWeight * 1000) / 1000;
        return roundedTotal === 1;
    }, [totalWeight]);

    // Verificar si lambda es válido
    const isLambdaValid = useMemo(() => {
        return lambda >= -1 && lambda <= 1;
    }, [lambda]);

    // Validar pesos (para usar al guardar)
    const validateWeights = () => {
        const roundedTotal = Math.round(totalWeight * 1000) / 1000;

        if (roundedTotal !== 1) {
            if (roundedTotal > 1) {
                setWeightError(`La suma de los pesos es ${roundedTotal.toFixed(3)}. Debe ser exactamente 1.000`);
            } else {
                setWeightError(`La suma de los pesos es ${roundedTotal.toFixed(3)}. Debe ser exactamente 1.000`);
            }
            return false;
        } else {
            setWeightError("");
            return true;
        }
    };

    // Validar umbrales
    const validateThresholds = () => {
        for (const criterion of criteria) {
            if (criterion.indiferencia > criterion.preferencia) {
                setThresholdError(`${criterion.name}: El umbral de indiferencia (${criterion.indiferencia}) no puede ser mayor que el de preferencia (${criterion.preferencia})`);
                return false;
            }
            if (criterion.preferencia > criterion.veto) {
                setThresholdError(`${criterion.name}: El umbral de preferencia (${criterion.preferencia}) no puede ser mayor que el de veto (${criterion.veto})`);
                return false;
            }
        }
        setThresholdError("");
        return true;
    };

    // Validar lambda
    const validateLambda = (value: number): boolean => {
        if (value < -1 || value > 1) {
            setLambdaError("El valor lambda debe estar entre -1 y 1");
            return false;
        }
        setLambdaError("");
        return true;
    };

    const handleWeightChange = (criterionId: string, value: string) => {
        const newValue = parseFloat(value) || 0;
        
        setCriteria(prev =>
            prev.map(crit =>
                crit.id === criterionId ? { ...crit, weight: newValue } : crit
            )
        );
    };

    const handleThresholdChange = (criterionId: string, thresholdType: 'indiferencia' | 'preferencia' | 'veto', value: string) => {
        const newValue = parseFloat(value) || 0;
        
        setCriteria(prev =>
            prev.map(crit =>
                crit.id === criterionId ? { ...crit, [thresholdType]: newValue } : crit
            )
        );
        setThresholdError("");
    };

    const handleLambdaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setLambda(value);
        validateLambda(value);
    };

    const handleSaveWeights = () => {
        if (validateWeights()) {
            saveCriteriaToCookie(criteria);
            toast.success('Pesos guardados exitosamente', {
                position: "bottom-right",
                autoClose: 2000,
                theme: "colorful",
            });
        }
    };

    const handleSaveThresholds = () => {
        if (validateThresholds()) {
            saveCriteriaToCookie(criteria);
            toast.success('Umbrales guardados exitosamente', {
                position: "bottom-right",
                autoClose: 2000,
                theme: "colorful",
            });
        }
    };

    const handleSaveLambda = () => {
        if (validateLambda(lambda)) {
            saveLambdaToCookie(lambda);
            toast.success('Valor de corte guardado exitosamente', {
                position: "bottom-right",
                autoClose: 2000,
                theme: "colorful",
            });
        }
    };

    const getPercentage = (value: number) => ((value / 1) * 100).toFixed(1);
    const getBarWidth = (value: number) => `${(value / 1) * 100}%`;

    if (loading) {
        return (
            <div className="flex flex-col md:flex-row bg-gray-900 min-h-screen">
                <PublicSidebar />
                <div className="flex-1 min-w-0 p-4 md:p-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row bg-gray-900 min-h-screen">
            <PublicSidebar />
            
            <div className="flex-1 min-w-0 p-4 md:p-8 text-white">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">Pesos y Umbrales</h1>
                    <p className="text-gray-400 mt-2">Configura los pesos y umbrales para el análisis ELECTRE III</p>
                </div>

                {/* Pestañas */}
                <div className="flex mb-6 gap-0.5">
                    <button
                        onClick={() => setActiveTab("pesos")}
                        className={`px-6 py-3 font-medium transition-colors ${
                            activeTab === "pesos"
                                ? "bg-gray-700 text-white border-b-2 border-blue-500"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-750"
                        }`}
                    >
                        Pesos
                    </button>
                    <button
                        onClick={() => setActiveTab("umbrales")}
                        className={`px-6 py-3 font-medium transition-colors ${
                            activeTab === "umbrales"
                                ? "bg-gray-700 text-white border-b-2 border-blue-500"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-750"
                        }`}
                    >
                        Umbrales
                    </button>
                    <button
                        onClick={() => setActiveTab("corte")}
                        className={`px-6 py-3 font-medium transition-colors ${
                            activeTab === "corte"
                                ? "bg-gray-700 text-white border-b-2 border-blue-500"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-750"
                        }`}
                    >
                        Valor de Corte (λ)
                    </button>
                </div>

                <div className="border border-gray-600 rounded-lg p-6">
                    {/* Tab de Pesos */}
                    {activeTab === "pesos" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Configuración de Pesos</h2>
                            <p className="text-gray-400 mb-6">
                                Define la importancia relativa de cada criterio. La suma debe ser exactamente 1.
                            </p>

                            <div className="space-y-6">
                                {criteria.map((criterion) => (
                                    <div key={criterion.id} className="bg-gray-800 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="text-lg font-semibold">{criterion.name}</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="number"
                                                    step="0.001"
                                                    min="0"
                                                    max="1"
                                                    value={criterion.weight}
                                                    onChange={(e) => handleWeightChange(criterion.id, e.target.value)}
                                                    className="w-24 bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white focus:outline-none focus:border-blue-500"
                                                />
                                                <span className="text-gray-400 w-16">{getPercentage(criterion.weight)}%</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-3">
                                            <div
                                                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                                                style={{ width: getBarWidth(criterion.weight) }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}

                                <div className="bg-gray-800 rounded-lg p-4 border-2 border-blue-500">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold">Total</span>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xl font-bold ${
                                                Math.abs(totalWeight - 1) < 0.001 ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                {totalWeight.toFixed(3)}
                                            </span>
                                            <span className="text-gray-400 w-16">{getPercentage(totalWeight)}%</span>
                                        </div>
                                    </div>
                                    {weightError && (
                                        <p className="text-red-400 text-sm mt-2">{weightError}</p>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSaveWeights}
                                        disabled={!areWeightsValid}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md px-6 py-2 text-white font-medium transition-colors"
                                    >
                                        Guardar Pesos
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab de Umbrales */}
                    {activeTab === "umbrales" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Configuración de Umbrales</h2>
                            <p className="text-gray-400 mb-6">
                                Define los umbrales de indiferencia, preferencia y veto para cada criterio.
                                <br />
                                <span className="text-sm">Indiferencia ≤ Preferencia ≤ Veto</span>
                            </p>

                            {thresholdError && (
                                <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-6">
                                    <p className="text-red-400">{thresholdError}</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                {criteria.map((criterion) => (
                                    <div key={criterion.id} className="bg-gray-800 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold mb-4">{criterion.name}</h3>
                                        
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">
                                                    Indiferencia (q)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    value={criterion.indiferencia}
                                                    onChange={(e) => handleThresholdChange(criterion.id, 'indiferencia', e.target.value)}
                                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">
                                                    Preferencia (p)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    value={criterion.preferencia}
                                                    onChange={(e) => handleThresholdChange(criterion.id, 'preferencia', e.target.value)}
                                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">
                                                    Veto (v)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    value={criterion.veto}
                                                    onChange={(e) => handleThresholdChange(criterion.id, 'veto', e.target.value)}
                                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSaveThresholds}
                                        className="bg-blue-600 hover:bg-blue-700 rounded-md px-6 py-2 text-white font-medium transition-colors"
                                    >
                                        Guardar Umbrales
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab de Valor de Corte */}
                    {activeTab === "corte" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Valor de Corte (λ - Lambda)</h2>
                            <p className="text-gray-400 mb-6">
                                Define el umbral de concordancia global. Debe estar entre -1 y 1.
                            </p>

                            <div className="bg-gray-800 rounded-lg p-6 max-w-md">
                                <label className="block text-lg font-semibold mb-4">Lambda (λ)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="-1"
                                    max="1"
                                    value={lambda}
                                    onChange={handleLambdaChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white text-lg focus:outline-none focus:border-blue-500"
                                />
                                
                                {lambdaError && (
                                    <p className="text-red-400 text-sm mt-2">{lambdaError}</p>
                                )}

                                <div className="mt-4 p-4 bg-gray-900 rounded">
                                    <p className="text-sm text-gray-400">
                                        <strong>Valor actual:</strong> {lambda}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Un valor más alto requiere mayor concordancia para establecer relaciones de preferencia.
                                    </p>
                                </div>

                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={handleSaveLambda}
                                        disabled={!isLambdaValid}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md px-6 py-2 text-white font-medium transition-colors"
                                    >
                                        Guardar Valor de Corte
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
