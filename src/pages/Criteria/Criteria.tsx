import SideBar from "../../Components/SideBar";

export default function Criteria() {
    return (
        <SideBar>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Criterios</h1>
                    <p className="font-bold text-gray-400">Proyecto: Proyecto 1 | Escenario: Escenario perron</p>
                </div>
                <button className="bg-blue-800 cursor-pointer hover:bg-blue-700 rounded-md px-4 py-3 text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                    Nuevo Criterio
                </button>
            </div>

            <div className="flex gap-3 mb-6">
                <button className="border border-gray-600 hover:bg-gray-800 rounded-md px-4 py-2 text-white">
                    Ir a Alternativas
                </button>
                <button className="border border-gray-600 hover:bg-gray-800 rounded-md px-4 py-2 text-white">
                    Ir a Pesos
                </button>
            </div>

            <div className="border border-gray-600 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-blue-500">
                        <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                    </svg>
                    <h2 className="text-2xl font-bold">Criterios de evaluación</h2>
                </div>
                <p className="text-gray-400 mb-6">Define los criterios que utilizarás para evaluar las alternativas.</p>

                <div className="w-full">
                    <div className="grid grid-cols-12 border-b border-gray-600 pb-3 mb-4">
                        <div className="col-span-3">
                            <h3 className="font-bold text-gray-300">Nombre</h3>
                        </div>
                        <div className="col-span-4">
                            <h3 className="font-bold text-gray-300">Descripción</h3>
                        </div>
                        <div className="col-span-3">
                            <h3 className="font-bold text-gray-300">Objetivo</h3>
                        </div>
                        <div className="col-span-2">
                            <h3 className="font-bold text-gray-300">Acciones</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 items-center py-3">
                        <div className="col-span-3">
                            <p>Precio</p>
                        </div>
                        <div className="col-span-4">
                            <p>Quiero que sea lo mas barato posible</p>
                        </div>
                        <div className="col-span-3">
                            <p className="text-green-500">Maximizar</p>
                        </div>
                        <div className="col-span-2 flex gap-2">
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