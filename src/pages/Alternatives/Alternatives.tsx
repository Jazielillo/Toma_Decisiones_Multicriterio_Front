import SideBar from "../../Components/SideBar";

export default function Alternatives() {
    return (
        <SideBar>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Alternativas</h1>
                    <p className="font-bold text-gray-400">Proyecto: Proyecto 1 | Escenario: Escenario perron</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-3 text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                    Nueva Alternativa
                </button>
            </div>

            <div className="flex gap-3 mb-6">
                <button className="border border-gray-600 hover:bg-gray-800 rounded-md px-4 py-2 text-white">
                    Ir a Criterios
                </button>
                <button className="border border-gray-600 hover:bg-gray-800 rounded-md px-4 py-2 text-white">
                    Ir a Pesos
                </button>
            </div>

            <div className="border border-gray-600 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-blue-500">
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                    </svg>
                    <h2 className="text-2xl font-bold">Alternativas disponibles</h2>
                </div>
                <p className="text-gray-400 mb-6">Define todas las alternativas que deseas evaluar en este escenario.</p>

                <div className="w-full">
                    <div className="grid grid-cols-12 mb-4">
                        <div className="col-span-4">
                            <h3 className="font-bold text-gray-300">Nombre</h3>
                        </div>
                        <div className="col-span-6">
                            <h3 className="font-bold text-gray-300">Descripción</h3>
                        </div>
                        <div className="col-span-2">
                            <h3 className="font-bold text-gray-300 text-right">Acciones</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 items-center py-3 border-t border-gray-700">
                        <div className="col-span-4">
                            <p className="font-medium">Opción A</p>
                        </div>
                        <div className="col-span-6">
                            <p className="text-gray-300">No ir</p>
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                            <button className="bg-transparent cursor-pointer rounded-md border border-gray-600 p-2 text-white flex items-center gap-2 hover:bg-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                            <button className="bg-transparent cursor-pointer rounded-md border border-gray-600 p-2 text-white flex items-center gap-2 hover:bg-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SideBar>
    )
}