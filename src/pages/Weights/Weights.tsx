import { useState, useEffect } from "react";
import { getCriterios, updateCriterio, type Criterio } from "../../api/criteria";
import { toast } from 'react-toastify';

type CriterionKey = 'precio' | 'rendimiento';
type ThresholdType = 'indiferencia' | 'preferencia' | 'veto';

type ThresholdsType = {
    [key in CriterionKey]: {
        indiferencia: number;
        preferencia: number;
        veto: number;
    }
};

export default function WeightsAndThresholds() {
    const [activeTab, setActiveTab] = useState("pesos");
    const [criterios, setCriterios] = useState<Criterio[]>([]);
    const [loading, setLoading] = useState(false);
    const [thresholdError, setThresholdError] = useState<string>("");
    const [weightError, setWeightError] = useState<string>("");
    const [weights, setWeights] = useState({
        precio: 0.593,
        rendimiento: 0.194
    });

    const [thresholds, setThresholds] = useState<ThresholdsType>({
        precio: {
            indiferencia: 100,
            preferencia: 200,
            veto: 500
        },
        rendimiento: {
            indiferencia: 0.5,
            preferencia: 1,
            veto: 2
        }
    });

    // Cargar criterios al montar el componente
    useEffect(() => {
        loadCriterios();
    }, []);

    // Validar pesos cuando cambien
    useEffect(() => {
        validateWeights();
    }, [weights]);

    const loadCriterios = async () => {
        try {
            setLoading(true);
            const data = await getCriterios();
            setCriterios(data);

            // Actualizar los estados con los datos de la API
            const newWeights: any = {};
            const newThresholds: any = {};

            data.forEach(criterio => {
                const key = criterio.name.toLowerCase() as CriterionKey;
                newWeights[key] = criterio.weight;
                newThresholds[key] = {
                    indiferencia: criterio.indifference_threshold,
                    preferencia: criterio.preference_threshold,
                    veto: criterio.veto_threshold
                };
            });

            setWeights(newWeights);
            setThresholds(newThresholds);
        } catch (error) {
            console.error("Error al cargar criterios:", error);
            toast.error('Error al cargar criterios', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colorful",
            });
        } finally {
            setLoading(false);
        }
    };

    const validateWeights = () => {
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        const roundedTotal = Math.round(totalWeight * 1000) / 1000; // Redondear a 3 decimales para evitar errores de precisión

        if (roundedTotal !== 1) {
            if (roundedTotal > 1) {
                setWeightError("Error: La suma de los pesos no puede ser mayor a 1");
            } else {
                setWeightError("Error: La suma de los pesos debe ser igual a 1");
            }
            return false;
        } else {
            setWeightError("");
            return true;
        }
    };

    const handleWeightChange = (criterion: CriterionKey, value: string) => {
        const newValue = parseFloat(value);
        const currentWeights = { ...weights };
        const oldValue = currentWeights[criterion];

        // Calcular la suma sin el criterio actual
        const otherWeightsSum = Object.entries(currentWeights)
            .filter(([key]) => key !== criterion)
            .reduce((sum, [, weight]) => sum + weight, 0);

        // Verificar si el nuevo valor haría que la suma exceda 1
        const maxAllowedValue = 1 - otherWeightsSum;

        // Limitar el valor si excede el máximo permitido
        const limitedValue = Math.min(newValue, maxAllowedValue);

        setWeights(prev => ({
            ...prev,
            [criterion]: limitedValue
        }));
    };

    const handleThresholdChange = (criterion: CriterionKey, thresholdType: ThresholdType, value: string) => {
        setThresholds(prev => ({
            ...prev,
            [criterion]: {
                ...prev[criterion],
                [thresholdType]: parseFloat(value) || 0
            }
        }));
        // Limpiar error cuando el usuario modifique valores
        setThresholdError("");
    };

    // Validar umbrales antes de guardar
    const validateThresholds = () => {
        for (const criterion in thresholds) {
            const { indiferencia, preferencia, veto } = thresholds[criterion as CriterionKey];

            if (indiferencia > preferencia) {
                setThresholdError(`Error en ${criterion}: El umbral de indiferencia debe ser menor o igual al de preferencia`);
                return false;
            }
            if (preferencia > veto) {
                setThresholdError(`Error en ${criterion}: El umbral de preferencia debe ser menor o igual al de veto`);
                return false;
            }
        }
        setThresholdError("");
        return true;
    };

    // Guardar umbrales
    const handleSaveThresholds = async () => {
        if (!validateThresholds()) return;

        try {
            setLoading(true);

            for (const criterio of criterios) {
                const key = criterio.name.toLowerCase() as CriterionKey;
                const thresholdData = thresholds[key];

                if (thresholdData) {
                    await updateCriterio(criterio.id, {
                        indifference_threshold: thresholdData.indiferencia,
                        preference_threshold: thresholdData.preferencia,
                        veto_threshold: thresholdData.veto
                    });
                }
            }

            toast.success('Umbrales guardados exitosamente', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colorful",
            });
            await loadCriterios(); // Recargar para sincronizar
        } catch (error) {
            console.error("Error al guardar umbrales:", error);
            toast.error('Error al guardar umbrales', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colorful",
            });
        } finally {
            setLoading(false);
        }
    };

    // Guardar pesos
    const handleSaveWeights = async () => {
        if (!validateWeights()) {
            return;
        }

        try {
            setLoading(true);

            // Actualizar cada criterio con su peso actual (ya validado que sume 1)
            for (const criterio of criterios) {
                const key = criterio.name.toLowerCase() as CriterionKey;
                const currentWeight = weights[key];

                if (currentWeight !== undefined) {
                    await updateCriterio(criterio.id, {
                        weight: currentWeight
                    });
                }
            }

            toast.success('Pesos guardados exitosamente', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colorful",
            });
            await loadCriterios(); // Recargar para sincronizar
        } catch (error) {
            console.error("Error al guardar pesos:", error);
            toast.error('Error al guardar pesos', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colorful",
            });
        } finally {
            setLoading(false);
        }
    };

    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

    const getPercentage = (value: any) => ((value / 1) * 100).toFixed(1);
    const getBarWidth = (value: any) => `${(value / 1) * 100}%`;

    if (loading) {
        return (
            <div className="min-h-screen text-white p-8 flex items-center justify-center">
                <div className="text-xl">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white">
            <div className="mb-8">
                <h1 className="text-4xl font-bold">Pesos y Umbrales</h1>
                <p className="text-gray-400">Proyecto: Selección de Laptop | Escenario: Uso Profesional</p>
            </div>

            <div className="flex gap-3 mb-6">
                <button className="border border-gray-600 hover:bg-gray-800 rounded-md px-4 py-2 text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Criterios
                </button>
                <button className="border border-gray-600 hover:bg-gray-800 rounded-md px-4 py-2 text-white flex items-center gap-2">
                    Matriz Valuada
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            </div>

            {/* Pestañas */}
            <div className="flex mb-6 gap-0.5">
                <button
                    onClick={() => setActiveTab("pesos")}
                    className={`flex cursor-pointer items-center gap-2 px-6 py-3 rounded-t-lg border-b-2 ${activeTab === "pesos"
                        ? "bg-gray-800 border-blue-500 text-white"
                        : "bg-gray-900 border-gray-600 text-gray-400 hover:text-white"
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                    </svg>
                    Pesos
                </button>
                <button
                    onClick={() => setActiveTab("umbrales")}
                    className={`flex cursor-pointer items-center gap-2 px-6 py-3 rounded-t-lg border-b-2 ${activeTab === "umbrales"
                        ? "bg-gray-800 border-blue-500 text-white"
                        : "bg-gray-900 border-gray-600 text-gray-400 hover:text-white"
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                    </svg>
                    Umbrales
                </button>
            </div>

            <div className="border border-gray-600 rounded-lg p-6">
                {activeTab === "pesos" && (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Configuración de pesos</h2>
                            <p className="text-gray-400">Asigna la importancia relativa a cada criterio. Los pesos deben sumar exactamente 1.</p>

                            {/* Error reactivo para pesos */}
                            {weightError && (
                                <div className="mt-3 p-3 bg-red-600 border border-red-500 rounded-lg">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 flex-shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                        </svg>
                                        <span className="text-white font-medium">{weightError}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {criterios.map((criterio) => {
                            const key = criterio.name.toLowerCase() as CriterionKey;
                            const weight = weights[key] || 0;

                            return (
                                <div key={criterio.id} className="mb-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold">{criterio.name}</h3>
                                            <p className="text-sm text-gray-400">{criterio.description}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-xl font-bold mr-2">{weight.toFixed(3)}</span>
                                        </div>
                                    </div>
                                    <div className="relative w-full h-10 flex items-center">
                                        <div className="absolute w-full h-2 bg-gray-700 rounded-full">
                                            <div
                                                className="absolute top-0 left-0 h-2 bg-blue-600 rounded-full"
                                                style={{ width: getBarWidth(weight) }}
                                            ></div>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.001"
                                            max="1"
                                            step="0.001"
                                            value={weight}
                                            onChange={(e) => handleWeightChange(key, e.target.value)}
                                            className="absolute top-0 left-0 w-full h-10 opacity-0 cursor-pointer z-10"
                                        />
                                        <div
                                            className="absolute top-1/2 transform -translate-y-1/2 z-0"
                                            style={{ left: getBarWidth(weight) }}
                                        >
                                            <div className="w-4 h-4 bg-blue-600 rounded-full -ml-2 cursor-grab"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>0.001</span>
                                        <span>1</span>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="border-t border-gray-700 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-sm text-gray-400">Suma actual: {totalWeight.toFixed(3)}</p>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={handleSaveWeights}
                                    disabled={loading || !!weightError}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    {loading ? "Guardando..." : "Establecer Pesos"}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "umbrales" && (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Configuración de umbrales</h2>
                            <p className="text-gray-400">Define los umbrales de preferencia, indiferencia y veto para cada criterio.</p>

                            {/* Error reactivo */}
                            {thresholdError && (
                                <div className="mt-3 p-3 bg-red-600 border border-red-500 rounded-lg">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 flex-shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                        </svg>
                                        <span className="text-white font-medium">{thresholdError}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {criterios.map((criterio) => {
                            const key = criterio.name.toLowerCase() as CriterionKey;
                            const threshold = thresholds[key];

                            if (!threshold) return null;

                            return (
                                <div key={criterio.id} className="mb-8 p-4 border border-gray-700 rounded-lg">
                                    <h3 className="text-lg font-bold mb-2">{criterio.name}</h3>
                                    <p className="text-sm text-gray-400 mb-4">{criterio.description}</p>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Umbral de Indiferencia (q)</label>
                                            <input
                                                type="number"
                                                step={criterio.name.toLowerCase() === 'rendimiento' ? "0.1" : "1"}
                                                value={threshold.indiferencia}
                                                onChange={(e) => handleThresholdChange(key, "indiferencia", e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">Diferencia máxima compatible con indiferencia</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Umbral de Preferencia (p)</label>
                                            <input
                                                type="number"
                                                step={criterio.name.toLowerCase() === 'rendimiento' ? "0.1" : "1"}
                                                value={threshold.preferencia}
                                                onChange={(e) => handleThresholdChange(key, "preferencia", e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">Diferencia máxima consistente con preferencia</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Umbral de Veto (v)</label>
                                            <input
                                                type="number"
                                                step={criterio.name.toLowerCase() === 'rendimiento' ? "0.1" : "1"}
                                                value={threshold.veto}
                                                onChange={(e) => handleThresholdChange(key, "veto", e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">Diferencia mínima incompatible con preferencia</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleSaveThresholds}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                {loading ? "Guardando..." : "Establecer Umbrales"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}