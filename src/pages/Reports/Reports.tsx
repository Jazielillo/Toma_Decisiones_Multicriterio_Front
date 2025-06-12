import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProjectReport, type ProjectReport, type ScenarioReport } from "../../api/reports";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Reports() {
  const [reportData, setReportData] = useState<ProjectReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState<number>(0);
  
  useEffect(() => {
    loadReport();
  }, []);
  
  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getProjectReport();
      setReportData(data);
      
    } catch (error) {
      console.error("Error loading report:", error);
      setError("No se pudo cargar el reporte. Asegúrate de tener un proyecto seleccionado o contar con escenarios.");
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      // Use format from date-fns with only two arguments
      return format(new Date(dateString), "d 'de' MMMM, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  // Renderizar estado de carga
  if (loading) {
    return (
      <div className="text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando reporte del proyecto...</p>
        </div>
      </div>
    );
  }
  
  // Renderizar error
  if (error || !reportData) {
    return (
      <div className="text-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-lg p-6">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error al cargar el reporte</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            className="bg-blue-600 hover:bg-blue-700 rounded-md px-6 py-2 text-white font-medium transition-colors"
            onClick={loadReport}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const activeScenario = reportData.escenarios[activeScenarioIndex];
  
  return (
    <div className="text-white min-h-screen pb-10">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Reporte del Proyecto</h1>
        <p className="text-gray-400 text-sm md:text-base">
          Análisis completo y resultados del proyecto
        </p>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
        <Link 
          to="/scenarios"
          className="border border-gray-600 hover:bg-gray-800 rounded-md px-3 py-2 md:px-4 md:py-2 text-white text-sm md:text-base transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Volver a Escenarios
        </Link>

        <button 
          onClick={loadReport}
          className="border border-gray-600 hover:bg-gray-800 rounded-md px-3 py-2 md:px-4 md:py-2 text-white text-sm md:text-base transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Actualizar Datos
        </button>
      </div>
      
      {/* Project Information Card */}
      <div className="border border-gray-600 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">
              {reportData.proyecto.title}
              <span className="ml-2 text-sm font-normal text-gray-500">ID: {reportData.proyecto.id}</span>
            </h2>
            {reportData.proyecto.description && (
              <p className="text-gray-400 mt-1">{reportData.proyecto.description}</p>
            )}
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-md">
            <div className="text-xs text-gray-400">Creado el</div>
            <div className="text-sm">{formatDate(reportData.proyecto.created_at)}</div>
            <div className="text-xs text-gray-400 mt-1">Actualizado el</div>
            <div className="text-sm">{formatDate(reportData.proyecto.updated_at)}</div>
          </div>
        </div>
      </div>
      
      {/* Scenarios Selection */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Escenarios del Proyecto</h2>
        {reportData.escenarios.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-gray-400">No hay escenarios disponibles para este proyecto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportData.escenarios.map((escenario, index) => (
              <button
                key={escenario.id}
                onClick={() => setActiveScenarioIndex(index)}
                className={`text-left border rounded-lg p-4 transition-colors ${
                  index === activeScenarioIndex
                    ? 'bg-blue-900 border-blue-700'
                    : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                }`}
              >
                <h3 className="font-medium">
                  {escenario.name}
                  <span className="ml-2 text-xs text-gray-400">ID: {escenario.id}</span>
                </h3>
                {escenario.description && (
                  <p className="text-sm text-gray-400 mt-1 truncate">
                    {escenario.description}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    {formatDate(escenario.updated_at)}
                  </span>
                  {index === activeScenarioIndex && (
                    <span className="bg-blue-600 text-xs text-white px-2 py-1 rounded">
                      Seleccionado
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Active Scenario Report */}
      {activeScenario && (
        <div className="space-y-8">
          {/* Scenario Header */}
          <div className="border border-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
              <h2 className="text-xl md:text-2xl font-bold">{activeScenario.name}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Información del Escenario</h3>
                  <div className="bg-gray-800 rounded-lg p-4">
                    {activeScenario.description && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-400">Descripción</p>
                        <p>{activeScenario.description}</p>
                      </div>
                    )}
                    <div className="mb-3">
                      <p className="text-sm text-gray-400">Valor de Corte (λ)</p>
                      <p className="flex items-center">
                        <span className="text-lg">{activeScenario.corte}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          {activeScenario.corte > 0.5 ? '(Estricto)' : 
                           activeScenario.corte < -0.5 ? '(Permisivo)' : '(Moderado)'}
                        </span>
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-400">Fecha de creación</p>
                        <p>{formatDate(activeScenario.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Última actualización</p>
                        <p>{formatDate(activeScenario.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Alternativas</h3>
                  <div className="space-y-2">
                    {activeScenario.alternativas.map(alternativa => (
                      <div key={alternativa.id} className="bg-gray-800 rounded-lg p-4">
                        <h4 className="font-medium">
                          {alternativa.name}
                          <span className="ml-2 text-xs text-gray-400">ID: {alternativa.id}</span>
                        </h4>
                        {alternativa.description && (
                          <p className="text-sm text-gray-400 mt-1">{alternativa.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Criterios</h3>
                <div className="space-y-3">
                  {activeScenario.criterios.map(criterio => (
                    <div key={criterio.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium">
                          {criterio.name}
                          <span className="ml-2 text-xs text-gray-400">
                            [{criterio.is_benefit ? 'MAX' : 'MIN'}]
                          </span>
                        </h4>
                        <span className="bg-blue-600 px-2 py-1 rounded text-xs">
                          Peso: {criterio.weight}
                        </span>
                      </div>
                      
                      {criterio.description && (
                        <p className="text-sm text-gray-400 mt-1 mb-3">{criterio.description}</p>
                      )}
                      
                      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                        <div className="bg-gray-700 rounded p-2">
                          <p className="text-xs text-gray-400">Preferencia</p>
                          <p className="font-medium">{criterio.preference_threshold}</p>
                        </div>
                        <div className="bg-gray-700 rounded p-2">
                          <p className="text-xs text-gray-400">Indiferencia</p>
                          <p className="font-medium">{criterio.indifference_threshold}</p>
                        </div>
                        <div className="bg-gray-700 rounded p-2">
                          <p className="text-xs text-gray-400">Veto</p>
                          <p className="font-medium">{criterio.veto_threshold}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Decision Matrix */}
          <div className="border border-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
                <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
              </svg>
              <h2 className="text-xl md:text-2xl font-bold">Matriz de Decisión</h2>
            </div>
            <p className="text-gray-400 text-sm md:text-base mb-6">
              Valores asignados a cada alternativa según los criterios definidos.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-3 text-left border border-gray-600">Alternativas</th>
                    {activeScenario.criterios.map((criterio) => (
                      <th key={criterio.id} className="p-3 text-center border border-gray-600">
                        <div>{criterio.name}</div>
                        <div className="text-xs text-blue-400">
                          Peso: {criterio.weight}
                        </div>
                        <div className="text-xs text-gray-500">
                          [{criterio.is_benefit ? 'MAX' : 'MIN'}]
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeScenario.alternativas.map((alternativa, altIndex) => (
                    <tr key={alternativa.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="p-3 border border-gray-600 font-medium">
                        {alternativa.name}
                      </td>
                      {activeScenario.matriz_decision[altIndex].map((value, critIndex) => (
                        <td 
                          key={`${alternativa.id}-${critIndex}`} 
                          className="p-3 text-center border border-gray-600"
                        >
                          <span className="bg-gray-800 px-3 py-1 rounded">{value}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* ELECTRE Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Flujo Neto Results */}
            <div className="border border-gray-600 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500">
                  <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
                </svg>
                <h2 className="text-xl font-bold">Resultados ELECTRE (Flujo Neto)</h2>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Ranking de alternativas ordenadas según el método de flujo neto.
              </p>
              
              <div className="space-y-4">
                {activeScenario.resultados_electre.flujo_neto.map((alternativa, index) => (
                  <div 
                    key={index} 
                    className={`bg-gray-800 border ${
                      index === 0 ? 'border-green-600' : 'border-gray-600'
                    } rounded-lg p-4`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="bg-gray-700 w-8 h-8 flex items-center justify-center rounded-full">
                          {index + 1}
                        </span>
                        <span className="font-medium">{alternativa}</span>
                      </div>
                      {index === 0 && (
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                          Mejor opción
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Destilación Results */}
            <div className="border border-gray-600 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-500">
                  <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 01-.879 2.121l-2.377 2.377a9.845 9.845 0 015.091 1.013 8.315 8.315 0 005.713.636l.285-.071-3.954-3.955a3 3 0 01-.879-2.121v-5.02a23.614 23.614 0 00-3 0zm4.5.138a.75.75 0 00.093-1.495A24.837 24.837 0 0012 2.25a25.048 25.048 0 00-3.093.191A.75.75 0 009 3.936v4.882a1.5 1.5 0 01-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0115 8.818V3.936z" clipRule="evenodd" />
                </svg>
                <h2 className="text-xl font-bold">Resultados ELECTRE (Destilación)</h2>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Ranking de alternativas ordenadas según el método de destilación.
              </p>
              
              <div className="space-y-4">
                {activeScenario.resultados_electre.destilacion.map((alternativa, index) => (
                  <div 
                    key={index} 
                    className={`bg-gray-800 border ${
                      index === 0 ? 'border-purple-600' : 'border-gray-600'
                    } rounded-lg p-4`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="bg-gray-700 w-8 h-8 flex items-center justify-center rounded-full">
                          {index + 1}
                        </span>
                        <span className="font-medium">{alternativa}</span>
                      </div>
                      {index === 0 && (
                        <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm">
                          Mejor opción
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Comparative Analysis */}
          <div className="border border-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              <h2 className="text-xl md:text-2xl font-bold">Análisis Comparativo</h2>
            </div>
            
            {/* Check if both methods yield the same winner */}
            {activeScenario.resultados_electre.flujo_neto[0] === activeScenario.resultados_electre.destilacion[0] ? (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-green-400">Coincidencia en la mejor alternativa</p>
                    <p className="text-gray-300">
                      Ambos métodos (Flujo Neto y Destilación) coinciden en que 
                      <span className="font-bold text-white mx-1">{activeScenario.resultados_electre.flujo_neto[0]}</span> 
                      es la mejor alternativa, lo que fortalece la confianza en los resultados.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <div>
                    <p className="font-medium text-yellow-400">Discrepancia en resultados</p>
                    <p className="text-gray-300">
                      El método de Flujo Neto selecciona 
                      <span className="font-bold text-white mx-1">{activeScenario.resultados_electre.flujo_neto[0]}</span> 
                      como mejor alternativa, mientras que Destilación selecciona 
                      <span className="font-bold text-white mx-1">{activeScenario.resultados_electre.destilacion[0]}</span>.
                      Esta discrepancia merece un análisis más detallado.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Diferencias en el Ranking</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="p-3 text-left border border-gray-600">Alternativa</th>
                      <th className="p-3 text-center border border-gray-600">Posición Flujo Neto</th>
                      <th className="p-3 text-center border border-gray-600">Posición Destilación</th>
                      <th className="p-3 text-center border border-gray-600">Diferencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeScenario.alternativas.map(alternativa => {
                      const positionFlujo = activeScenario.resultados_electre.flujo_neto.findIndex(
                        alt => alt === alternativa.name
                      ) + 1;
                      const positionDestilacion = activeScenario.resultados_electre.destilacion.findIndex(
                        alt => alt === alternativa.name
                      ) + 1;
                      const diff = Math.abs(positionFlujo - positionDestilacion);
                      
                      return (
                        <tr key={alternativa.id} className="hover:bg-gray-800/50 transition-colors">
                          <td className="p-3 border border-gray-600 font-medium">
                            {alternativa.name}
                          </td>
                          <td className="p-2 text-center border border-gray-600">
                            <span className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded">
                              {positionFlujo}
                            </span>
                          </td>
                          <td className="p-2 text-center border border-gray-600">
                            <span className="bg-purple-900/40 text-purple-300 px-2 py-1 rounded">
                              {positionDestilacion}
                            </span>
                          </td>
                          <td className="p-2 text-center border border-gray-600">
                            {diff === 0 ? (
                              <span className="text-green-400">Sin cambio</span>
                            ) : (
                              <span className={`text-${diff > 1 ? 'red' : 'yellow'}-400`}>
                                {diff} {diff === 1 ? 'posición' : 'posiciones'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Recomendaciones</h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                      <p>
                        {activeScenario.resultados_electre.flujo_neto[0] === activeScenario.resultados_electre.destilacion[0] ? (
                          <span>
                            La alternativa <span className="font-bold">{activeScenario.resultados_electre.flujo_neto[0]}</span> es 
                            claramente superior según ambos métodos, lo que sugiere una recomendación sólida.
                          </span>
                        ) : (
                          <span>
                            Considere evaluar más a fondo las alternativas 
                            <span className="font-bold">{" " + activeScenario.resultados_electre.flujo_neto[0]}</span> y
                            <span className="font-bold">{" " + activeScenario.resultados_electre.destilacion[0]}</span> ya que 
                            hay discrepancias entre los métodos.
                          </span>
                        )}
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <p>
                        {activeScenario.corte > 0.5 ? (
                          "El nivel de corte actual es estricto, lo que podría hacer más difícil que una alternativa supere a otra. Considere reducir el valor de corte para un análisis menos severo."
                        ) : activeScenario.corte < -0.5 ? (
                          "El nivel de corte actual es permisivo, lo que facilita que una alternativa supere a otra. Considere aumentar el valor de corte para un análisis más riguroso."
                        ) : (
                          "El nivel de corte actual es moderado, lo que proporciona un buen equilibrio para el análisis."
                        )}
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                      </svg>
                      <p>
                        Verifique la sensibilidad de los resultados modificando ligeramente los pesos de los criterios,
                        especialmente para {activeScenario.criterios.reduce((max, criterio) => 
                          criterio.weight > max.weight ? criterio : max, activeScenario.criterios[0]).name}, 
                        que tiene el mayor peso.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}