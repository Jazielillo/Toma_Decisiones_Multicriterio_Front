import { useState } from "react";
import SideBar from "../../Components/SideBar";

export default function Weights() {
    const [weight, setWeight] = useState(3);

    const handleWeightChange = (e: any) => {
        // Convierte el valor del deslizador (string) a número
        const newWeight = parseInt(e.target.value, 10);
        setWeight(newWeight);
    };

    // Calcula el porcentaje para mostrar
    const weightPercentage = (weight / 10) * 100;

    // Calcula el ancho de la barra de color en función del peso
    const barWidth = `${weightPercentage}%`;

    return (
        <>
            <div className="mb-8">
                <h1 className="text-4xl font-bold">Pesos de los Criterios</h1>
                <p className="font-bold text-gray-400">Proyecto: Proyecto 1 | Escenario: Escenario perron</p>
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

            <div className="border border-gray-600 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-blue-500">
                        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                    </svg>
                    <h2 className="text-2xl font-bold">Configuración de pesos</h2>
                </div>
                <p className="text-gray-400 mb-6">Asigna la importancia relativa a cada criterio usando los deslizadores.</p>

                <div className="mb-10">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold">Precio</h3>
                        <div className="flex items-center">
                            <span className="text-xl font-bold mr-2">{weight}</span>
                            <span className="text-gray-400">({weightPercentage.toFixed(1)}%)</span>
                        </div>
                    </div>
                    <div className="relative w-full h-10 flex items-center">
                        <div className="absolute w-full h-2 bg-gray-800 rounded-full">
                            <div
                                className="absolute top-0 left-0 h-2 bg-blue-600 rounded-full"
                                style={{ width: barWidth }}
                            ></div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            value={weight}
                            onChange={handleWeightChange}
                            className="absolute top-0 left-0 w-full h-10 opacity-0 cursor-pointer z-10"
                        />
                        <div
                            className="absolute top-1/2 transform -translate-y-1/2 z-0"
                            style={{ left: barWidth }}
                        >
                            <div className="w-4 h-4 bg-blue-600 rounded-full -ml-2 cursor-grab"></div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-6 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Suma total de pesos:</h3>
                    <span className="text-xl font-bold">{weight}</span>
                </div>
            </div>
        </>
    );
}