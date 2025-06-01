import { useState } from "react";

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

    const handleWeightChange = (criterion: CriterionKey, value: string) => {
        const newValue = parseFloat(value);
        setWeights(prev => ({
            ...prev,
            [criterion]: newValue
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
    };

    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

    const getPercentage = (value: any) => ((value / 1) * 100).toFixed(1);
    const getBarWidth = (value: any) => `${(value / 1) * 100}%`;

    return (
        <div className="min-h-screen text-white p-8">
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
                            <p className="text-gray-400">Asigna la importancia relativa a cada criterio. Los pesos se normalizan automáticamente para sumar 1.</p>
                        </div>

                        {/* Precio */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-bold">Precio</h3>
                                    <p className="text-sm text-gray-400">Costo de la laptop</p>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-xl font-bold mr-2">{weights.precio.toFixed(3)}</span>
                                    <span className="text-gray-400">({getPercentage(weights.precio)}%)</span>
                                </div>
                            </div>
                            <div className="relative w-full h-10 flex items-center">
                                <div className="absolute w-full h-2 bg-gray-700 rounded-full">
                                    <div
                                        className="absolute top-0 left-0 h-2 bg-blue-600 rounded-full"
                                        style={{ width: getBarWidth(weights.precio) }}
                                    ></div>
                                </div>
                                <input
                                    type="range"
                                    min="0.01"
                                    max="1"
                                    step="0.001"
                                    value={weights.precio}
                                    onChange={(e) => handleWeightChange("precio", e.target.value)}
                                    className="absolute top-0 left-0 w-full h-10 opacity-0 cursor-pointer z-10"
                                />
                                <div
                                    className="absolute top-1/2 transform -translate-y-1/2 z-0"
                                    style={{ left: getBarWidth(weights.precio) }}
                                >
                                    <div className="w-4 h-4 bg-blue-600 rounded-full -ml-2 cursor-grab"></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>0.01</span>
                                <span>1</span>
                            </div>
                        </div>

                        {/* Rendimiento */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-bold">Rendimiento</h3>
                                    <p className="text-sm text-gray-400">Velocidad y potencia de procesamiento</p>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-xl font-bold mr-2">{weights.rendimiento.toFixed(3)}</span>
                                    <span className="text-gray-400">({getPercentage(weights.rendimiento)}%)</span>
                                </div>
                            </div>
                            <div className="relative w-full h-10 flex items-center">
                                <div className="absolute w-full h-2 bg-gray-700 rounded-full">
                                    <div
                                        className="absolute top-0 left-0 h-2 bg-blue-600 rounded-full"
                                        style={{ width: getBarWidth(weights.rendimiento) }}
                                    ></div>
                                </div>
                                <input
                                    type="range"
                                    min="0.01"
                                    max="1"
                                    step="0.001"
                                    value={weights.rendimiento}
                                    onChange={(e) => handleWeightChange("rendimiento", e.target.value)}
                                    className="absolute top-0 left-0 w-full h-10 opacity-0 cursor-pointer z-10"
                                />
                                <div
                                    className="absolute top-1/2 transform -translate-y-1/2 z-0"
                                    style={{ left: getBarWidth(weights.rendimiento) }}
                                >
                                    <div className="w-4 h-4 bg-blue-600 rounded-full -ml-2 cursor-grab"></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>0.01</span>
                                <span>1</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-700 pt-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold">Suma total de pesos:</h3>
                                <p className="text-sm text-gray-400">Los pesos se ajustan automáticamente para sumar 1</p>
                            </div>
                            <span className="text-xl font-bold text-orange-400">{totalWeight.toFixed(3)}</span>
                        </div>
                    </>
                )}

                {activeTab === "umbrales" && (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Configuración de umbrales</h2>
                            <p className="text-gray-400">Define los umbrales de preferencia, indiferencia y veto para cada criterio.</p>
                        </div>

                        {/* Precio Umbrales */}
                        <div className="mb-8 p-4 border border-gray-700 rounded-lg">
                            <h3 className="text-lg font-bold mb-2">Precio</h3>
                            <p className="text-sm text-gray-400 mb-4">Costo de la laptop</p>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Umbral de Indiferencia (q)</label>
                                    <input
                                        type="number"
                                        value={thresholds.precio.indiferencia}
                                        onChange={(e) => handleThresholdChange("precio", "indiferencia", e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Diferencia máxima compatible con indiferencia</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Umbral de Preferencia (p)</label>
                                    <input
                                        type="number"
                                        value={thresholds.precio.preferencia}
                                        onChange={(e) => handleThresholdChange("precio", "preferencia", e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Diferencia máxima consistente con preferencia</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Umbral de Veto (v)</label>
                                    <input
                                        type="number"
                                        value={thresholds.precio.veto}
                                        onChange={(e) => handleThresholdChange("precio", "veto", e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Diferencia mínima incompatible con preferencia</p>
                                </div>
                            </div>
                        </div>

                        {/* Rendimiento Umbrales */}
                        <div className="mb-8 p-4 border border-gray-700 rounded-lg">
                            <h3 className="text-lg font-bold mb-2">Rendimiento</h3>
                            <p className="text-sm text-gray-400 mb-4">Velocidad y potencia de procesamiento</p>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Umbral de Indiferencia (q)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={thresholds.rendimiento.indiferencia}
                                        onChange={(e) => handleThresholdChange("rendimiento", "indiferencia", e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Diferencia máxima compatible con indiferencia</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Umbral de Preferencia (p)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={thresholds.rendimiento.preferencia}
                                        onChange={(e) => handleThresholdChange("rendimiento", "preferencia", e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Diferencia máxima consistente con preferencia</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Umbral de Veto (v)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={thresholds.rendimiento.veto}
                                        onChange={(e) => handleThresholdChange("rendimiento", "veto", e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Diferencia mínima incompatible con preferencia</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}