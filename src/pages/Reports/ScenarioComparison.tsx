import { useState, useEffect } from "react";
import { getProjectReport, type ProjectReport, type ScenarioReport } from "../../api/reports";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "react-toastify";
import type { ResultadoRanking } from "../../api/matriz";
import StepNavigation from "../../Components/StepNavigation";
import { agruparRanking, formatearScore, mejoresAlternativas } from "../../Components/ElectreRanking";

type ComparisonMode = 'flujo_neto' | 'destilacion';

// Ranking con score y posición de un escenario (vacío si el escenario no tiene resultados)
const rankingDe = (scenario: ScenarioReport, mode: ComparisonMode): ResultadoRanking[] =>
  (mode === 'flujo_neto'
    ? scenario.resultados_electre?.flujo_neto_detalle
    : scenario.resultados_electre?.destilacion_detalle) ?? [];

// Mejor(es) alternativa(s) de un escenario; los empates se listan juntos
const ganadorDe = (scenario: ScenarioReport, mode: ComparisonMode): string =>
  mejoresAlternativas(rankingDe(scenario, mode)).sort().join(', ');

export default function ScenarioComparison() {
  const [reportData, setReportData] = useState<ProjectReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScenarios, setSelectedScenarios] = useState<number[]>([]);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('flujo_neto');
  
  // Cargar datos del reporte al montar el componente
  useEffect(() => {
    loadReport();
  }, []);
  
  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getProjectReport();
      setReportData(data);
      
      // Preseleccionar los primeros dos escenarios con resultados si existen
      const conResultados = data.escenarios.filter(escenario => !escenario.error);
      setSelectedScenarios(conResultados.slice(0, 2).map(escenario => escenario.id));
      
    } catch (error) {
      console.error("Error loading report:", error);
      setError("No se pudo cargar el reporte. Asegúrate de tener un proyecto seleccionado o contar con escenarios.");
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  const toggleScenarioSelection = (scenarioId: number) => {
    const escenario = reportData?.escenarios.find(e => e.id === scenarioId);
    if (escenario?.error) {
      toast.info("Este escenario aún no tiene resultados para comparar", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }
    if (selectedScenarios.includes(scenarioId)) {
      setSelectedScenarios(selectedScenarios.filter(id => id !== scenarioId));
    } else {
      // Limitar a máximo 3 escenarios seleccionados
      if (selectedScenarios.length < 4) {
        setSelectedScenarios([...selectedScenarios, scenarioId]);
      } else {
        toast.warning("Máximo 4 escenarios para comparar", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    }
  };
  
  // Obtener escenarios seleccionados completos
  const getSelectedScenariosData = (): ScenarioReport[] => {
    if (!reportData) return [];
    return reportData.escenarios.filter(scenario => selectedScenarios.includes(scenario.id) && !scenario.error);
  };
  
  // Obtener todas las alternativas únicas de los escenarios seleccionados
  const getAllUniqueAlternatives = (): string[] => {
    const selectedScenariosData = getSelectedScenariosData();
    const allAlternatives = new Set<string>();
    
    selectedScenariosData.forEach(scenario => {
      rankingDe(scenario, comparisonMode).forEach(({ alternativa }) => {
        allAlternatives.add(alternativa);
      });
    });
    
    return Array.from(allAlternatives);
  };
  
  // Renderizar estado de carga
  if (loading) {
    return (
      <div className="text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando comparación de escenarios...</p>
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
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error al cargar la comparación</h2>
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
  
  // No hay escenarios para comparar
  if (reportData.escenarios.length === 0) {
    return (
      <div className="text-white min-h-screen">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Comparación de Escenarios</h1>
          <p className="text-gray-400 text-sm md:text-base">
            Compara los resultados de diferentes escenarios del proyecto
          </p>
        </div>
        
        <div className="border border-gray-600 rounded-lg p-6 bg-gray-800">
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-500 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No hay escenarios disponibles</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              No se encontraron escenarios para comparar. Crea al menos dos escenarios para poder utilizar esta función.
            </p>
            <a 
              href="/scenarios" 
              className="bg-blue-600 hover:bg-blue-700 rounded-md px-6 py-2 text-white font-medium transition-colors inline-block"
            >
              Ir a Escenarios
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  const selectedScenariosData = getSelectedScenariosData();
  const uniqueAlternatives = getAllUniqueAlternatives();
  
  return (
    <div className="text-white min-h-screen pb-10">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Comparación de Escenarios</h1>
        <p className="text-gray-400 text-sm md:text-base">
          Compara los resultados de diferentes escenarios del proyecto {reportData.proyecto.title}
        </p>
      </div>

      <StepNavigation />
      
      {/* Scenarios Selection */}
      <div className="border border-gray-600 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Selecciona escenarios para comparar (máximo 4)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportData.escenarios.map((escenario) => (
            <div
              key={escenario.id}
              onClick={() => toggleScenarioSelection(escenario.id)}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedScenarios.includes(escenario.id)
                  ? 'bg-blue-900 border-blue-700'
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  {escenario.name}
                  <span className="ml-2 text-xs text-gray-400">ID: {escenario.id}</span>
                </h3>
                <div className="w-5 h-5 border rounded-md flex items-center justify-center">
                  {selectedScenarios.includes(escenario.id) && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              </div>
              {escenario.description && (
                <p className="text-sm text-gray-400 mt-1 truncate">
                  {escenario.description}
                </p>
              )}
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">
                  {formatDate(escenario.updated_at)}
                </span>
                {escenario.error ? (
                  <span className="bg-yellow-900/40 text-yellow-300 text-xs px-2 py-1 rounded">
                    Sin resultados
                  </span>
                ) : (
                  <span className="bg-gray-700 text-xs px-2 py-1 rounded">
                    λ = {escenario.corte}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Comparison Type */}
      <div className="border border-gray-600 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Método de comparación</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setComparisonMode('flujo_neto')}
            className={`px-4 py-2 rounded-md flex gap-2 items-center transition-colors ${
              comparisonMode === 'flujo_neto'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
            </svg>
            Flujo Neto
          </button>
          <button
            onClick={() => setComparisonMode('destilacion')}
            className={`px-4 py-2 rounded-md flex gap-2 items-center transition-colors ${
              comparisonMode === 'destilacion'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 01-.879 2.121l-2.377 2.377a9.845 9.845 0 015.091 1.013 8.315 8.315 0 005.713.636l.285-.071-3.954-3.955a3 3 0 01-.879-2.121v-5.02a23.614 23.614 0 00-3 0zm4.5.138a.75.75 0 00.093-1.495A24.837 24.837 0 0012 2.25a25.048 25.048 0 00-3.093.191A.75.75 0 009 3.936v4.882a1.5 1.5 0 01-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0115 8.818V3.936z" clipRule="evenodd" />
            </svg>
            Destilación
          </button>
        </div>
      </div>
      
      {/* Comparison Results */}
      {selectedScenarios.length === 0 ? (
        <div className="border border-gray-600 rounded-lg p-6 bg-gray-800">
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-500 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            <h3 className="text-lg font-medium mb-2">Selecciona escenarios para comparar</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Selecciona al menos un escenario para ver sus resultados y comparar con otros escenarios.
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-gray-600 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            Comparación de resultados ELECTRE III
            <span className="ml-2 text-sm font-normal text-gray-400">
              {comparisonMode === 'flujo_neto' ? 'por Flujo Neto' : 'por Destilación'}
            </span>
          </h2>
          
          {/* Alternative Rankings Comparison */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-3 text-left border border-gray-600">Posición</th>
                  {selectedScenariosData.map(scenario => (
                    <th key={scenario.id} className="p-3 text-center border border-gray-600">
                      <div className="font-medium">{scenario.name}</div>
                      <div className="text-xs text-gray-400">λ = {scenario.corte}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Mostrar hasta 10 posiciones como máximo; las alternativas empatadas comparten posición */}
                {Array.from({ length: Math.min(10, Math.max(...selectedScenariosData.map(s => agruparRanking(rankingDe(s, comparisonMode)).length))) }, (_, index) => (
                  <tr key={index} className={`hover:bg-gray-800/50 transition-colors ${index === 0 ? 'bg-blue-900/20' : ''}`}>
                    <td className="p-3 border border-gray-600">
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
                            <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.937 6.937 0 006.174 6.174.75.75 0 00.858-.584c.212-1.012.395-2.036.543-3.07a.75.75 0 00-1.455-.365c-.122.828-.26 1.645-.416 2.45a5.437 5.437 0 01-4.541-4.541c.804-.156 1.622-.293 2.45-.415a.75.75 0 00-.365-1.456H5.75A.75.75 0 004.5 2.25v-.308a.75.75 0 00-1.5 0v.308a.75.75 0 00.674.746c1.036.148 2.059.331 3.071.543a.75.75 0 00.584-.859A6.937 6.937 0 001.3 8.838a.75.75 0 00-.859.584c-.212 1.012-.395 2.036-.543 3.071a.75.75 0 001.456.365c.122-.828.26-1.645.416-2.45a5.437 5.437 0 014.541 4.541c-.804.156-1.622.294-2.45.416a.75.75 0 00.365 1.455h-.295a.75.75 0 001.5 0v-.308a.75.75 0 00-.674-.746c-1.036-.148-2.059-.331-3.071-.543a.75.75 0 00-.584.859 6.937 6.937 0 006.174 6.174.75.75 0 00.858-.584c.212-1.012.395-2.036.543-3.071a.75.75 0 00-1.455-.365c-.122.828-.26 1.645-.416 2.45a5.437 5.437 0 01-4.541-4.541c.804-.156 1.622-.294 2.45-.416a.75.75 0 00-.365-1.455h.295z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="font-medium">
                          {index + 1}º lugar
                        </span>
                      </div>
                    </td>
                    
                    {selectedScenariosData.map(scenario => {
                      const grupo = agruparRanking(rankingDe(scenario, comparisonMode))[index];
                      return (
                        <td key={`${scenario.id}-rank-${index}`} className="p-3 text-center border border-gray-600">
                          {grupo ? (
                            <div>
                              <span className={`font-medium ${index === 0 ? 'text-yellow-400' : ''}`}>
                                {grupo.alternativas.join(', ')}
                              </span>
                              <div className="text-xs text-gray-400">
                                Score: {formatearScore(grupo.score)}
                                {grupo.alternativas.length > 1 && ' (empate)'}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Alternative Performance Analysis */}
          <div className="mt-12">
            <h3 className="text-lg font-medium mb-4">Análisis de consistencia de alternativas</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-3 text-left border border-gray-600">Alternativa</th>
                    {selectedScenariosData.map(scenario => (
                      <th key={scenario.id} className="p-3 text-center border border-gray-600">
                        {scenario.name}
                      </th>
                    ))}
                    <th className="p-3 text-center border border-gray-600">
                      <div className="text-sm">Posición</div>
                      <div className="text-xs text-gray-400">Promedio</div>
                    </th>
                    <th className="p-3 text-center border border-gray-600">
                      <div className="text-sm">Variación</div>
                      <div className="text-xs text-gray-400">Desv. Estándar</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueAlternatives.map(alternative => {
                    const positions = selectedScenariosData.map(scenario => {
                      const resultado = rankingDe(scenario, comparisonMode).find(r => r.alternativa === alternative);
                      return resultado ? resultado.posicion : null;
                    });
                    
                    const validPositions = positions.filter((pos): pos is number => pos !== null);
                    const avgPosition = validPositions.length > 0 
                      ? validPositions.reduce((sum, pos) => sum + pos, 0) / validPositions.length 
                      : null;
                    
                    // Calculate standard deviation
                    const stdDev = validPositions.length > 1
                      ? Math.sqrt(
                        validPositions.reduce((sum, pos) => sum + Math.pow(pos - (avgPosition || 0), 2), 0) / validPositions.length
                      )
                      : 0;
                    
                    // Determinar consistencia basado en desviación estándar
                    let consistencyClass = '';
                    let consistencyLabel = '';
                    
                    if (validPositions.length <= 1) {
                      consistencyClass = 'bg-gray-700 text-gray-300';
                      consistencyLabel = 'N/A';
                    } else if (stdDev < 0.5) {
                      consistencyClass = 'bg-green-900/40 text-green-300';
                      consistencyLabel = 'Alta';
                    } else if (stdDev < 1.5) {
                      consistencyClass = 'bg-yellow-900/40 text-yellow-300';
                      consistencyLabel = 'Media';
                    } else {
                      consistencyClass = 'bg-red-900/40 text-red-300';
                      consistencyLabel = 'Baja';
                    }
                    
                    return (
                      <tr key={alternative} className="hover:bg-gray-800/50 transition-colors">
                        <td className="p-3 border border-gray-600 font-medium">
                          {alternative}
                        </td>
                        
                        {positions.map((position, idx) => (
                          <td 
                            key={`${alternative}-${selectedScenariosData[idx].id}`} 
                            className="p-3 text-center border border-gray-600"
                          >
                            {position === null ? (
                              <span className="text-gray-500">-</span>
                            ) : position === 1 ? (
                              <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded-md flex items-center justify-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                  <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.937 6.937 0 006.174 6.174.75.75 0 00.858-.584c.212-1.012.395-2.036.543-3.07a.75.75 0 00-1.455-.365c-.122.828-.26 1.645-.416 2.45a5.437 5.437 0 01-4.541-4.541c.804-.156 1.622-.293 2.45-.415a.75.75 0 00-.365-1.456H5.75A.75.75 0 004.5 2.25v-.308a.75.75 0 00-1.5 0v.308a.75.75 0 00.674.746c1.036.148 2.059.331 3.071.543a.75.75 0 00.584-.859A6.937 6.937 0 001.3 8.838a.75.75 0 00-.859.584c-.212 1.012-.395 2.036-.543 3.071a.75.75 0 001.456.365c.122-.828.26-1.645.416-2.45a5.437 5.437 0 014.541 4.541c-.804.156-1.622.294-2.45.416a.75.75 0 00.365 1.455h-.295a.75.75 0 001.5 0v-.308a.75.75 0 00-.674-.746c-1.036-.148-2.059-.331-3.071-.543a.75.75 0 00-.584.859 6.937 6.937 0 006.174 6.174.75.75 0 00.858-.584c.212-1.012.395-2.036.543-3.071a.75.75 0 00-1.455-.365c-.122.828-.26 1.645-.416 2.45a5.437 5.437 0 01-4.541-4.541c.804-.156 1.622-.294 2.45-.416a.75.75 0 00-.365-1.455h.295z" clipRule="evenodd" />
                                </svg>
                                {position}º
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-700 rounded-md">
                                {position}º
                              </span>
                            )}
                          </td>
                        ))}
                        
                        <td className="p-3 text-center border border-gray-600">
                          {avgPosition !== null ? (
                            <span className="font-medium">
                              {avgPosition.toFixed(1)}º
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        
                        <td className="p-3 text-center border border-gray-600">
                          {validPositions.length > 1 ? (
                            <span className={`px-2 py-1 ${consistencyClass} rounded-md`}>
                              {stdDev.toFixed(2)} ({consistencyLabel})
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Explanation and Legend */}
          <div className="mt-8 bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium mb-3">Interpretación de resultados</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>
                  <strong>Consistencia Alta</strong> (Desv. Est. &lt; 0.5): La alternativa mantiene posiciones similares en todos los escenarios.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span>
                  <strong>Consistencia Media</strong> (Desv. Est. 0.5 - 1.5): La alternativa muestra algunas variaciones en su posición.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span>
                  <strong>Consistencia Baja</strong> (Desv. Est. &gt; 1.5): La alternativa muestra grandes variaciones en su posición entre diferentes escenarios.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Scenario Differences Analysis */}
      {selectedScenariosData.length >= 2 && (
        <div className="border border-gray-600 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Análisis de diferencias entre escenarios</h2>
          
          <div className="space-y-6">
            {/* Parameter Differences Table */}
            <div>
              <h3 className="text-lg font-medium mb-3">Parámetros de escenarios</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="p-3 text-left border border-gray-600">Parámetro</th>
                      {selectedScenariosData.map(scenario => (
                        <th key={`param-${scenario.id}`} className="p-3 text-center border border-gray-600">
                          {scenario.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-800/50">
                      <td className="p-3 border border-gray-600">Valor de corte (λ)</td>
                      {selectedScenariosData.map(scenario => (
                        <td key={`lambda-${scenario.id}`} className="p-3 text-center border border-gray-600">
                          <span className="bg-gray-700 px-2 py-1 rounded">
                            {scenario.corte}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-800/50">
                      <td className="p-3 border border-gray-600">Número de criterios</td>
                      {selectedScenariosData.map(scenario => (
                        <td key={`criteria-${scenario.id}`} className="p-3 text-center border border-gray-600">
                          {scenario.criterios.length}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-800/50">
                      <td className="p-3 border border-gray-600">Número de alternativas</td>
                      {selectedScenariosData.map(scenario => (
                        <td key={`alternatives-${scenario.id}`} className="p-3 text-center border border-gray-600">
                          {scenario.alternativas.length}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-gray-800/50">
                      <td className="p-3 border border-gray-600">Fecha de actualización</td>
                      {selectedScenariosData.map(scenario => (
                        <td key={`date-${scenario.id}`} className="p-3 text-center border border-gray-600">
                          <span className="text-sm text-gray-400">
                            {formatDate(scenario.updated_at)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Winner Analysis */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-3">Análisis de ganadores</h3>
              
              <div className="space-y-3">
                {/* Flujo Neto Winners */}
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Ganadores por Flujo Neto:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedScenariosData.map(scenario => (
                      <div key={`flow-winner-${scenario.id}`} className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                        <div className="bg-blue-900/50 w-8 h-8 flex items-center justify-center rounded-full text-blue-300">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">{scenario.name}</div>
                          <div className="font-medium">
                            {ganadorDe(scenario, 'flujo_neto') || "No disponible"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Destilacion Winners */}
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Ganadores por Destilación:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedScenariosData.map(scenario => (
                      <div key={`destil-winner-${scenario.id}`} className="bg-gray-700 rounded-lg p-3 flex items-center gap-3">
                        <div className="bg-purple-900/50 w-8 h-8 flex items-center justify-center rounded-full text-purple-300">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 01-.879 2.121l-2.377 2.377a9.845 9.845 0 015.091 1.013 8.315 8.315 0 005.713.636l.285-.071-3.954-3.955a3 3 0 01-.879-2.121v-5.02a23.614 23.614 0 00-3 0zm4.5.138a.75.75 0 00.093-1.495A24.837 24.837 0 0012 2.25a25.048 25.048 0 00-3.093.191A.75.75 0 009 3.936v4.882a1.5 1.5 0 01-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0115 8.818V3.936z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">{scenario.name}</div>
                          <div className="font-medium">
                            {ganadorDe(scenario, 'destilacion') || "No disponible"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Agreement Analysis */}
              <div className="mt-4 p-4 rounded-lg bg-gray-700">
                <h4 className="font-medium mb-2">Consenso en resultados:</h4>
                
                {/* Flujo Neto Consensus */}
                {(() => {
                  const flowWinners = selectedScenariosData.map(s => ganadorDe(s, 'flujo_neto')).filter(Boolean);
                  const uniqueFlowWinners = [...new Set(flowWinners)];
                  const flowConsensus = flowWinners.length > 0 && uniqueFlowWinners.length === 1;
                  
                  return (
                    <div className="flex items-start gap-2 mb-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${flowConsensus ? 'bg-green-500' : 'bg-red-500'}`}>
                        {flowConsensus ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <span className="text-sm">Flujo Neto: </span>
                        {flowConsensus ? (
                          <span className="text-green-400">
                            Todos los escenarios coinciden en que <strong>{uniqueFlowWinners[0]}</strong> {uniqueFlowWinners[0].includes(', ') ? 'son las mejores alternativas' : 'es la mejor alternativa'}.
                          </span>
                        ) : (
                          <span className="text-red-400">
                            Los escenarios no coinciden en la mejor alternativa. 
                            {uniqueFlowWinners.length > 0 && ` Opciones: ${uniqueFlowWinners.join(', ')}.`}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
                
                {/* Destilacion Consensus */}
                {(() => {
                  const destilWinners = selectedScenariosData.map(s => ganadorDe(s, 'destilacion')).filter(Boolean);
                  const uniqueDestilWinners = [...new Set(destilWinners)];
                  const destilConsensus = destilWinners.length > 0 && uniqueDestilWinners.length === 1;
                  
                  return (
                    <div className="flex items-start gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${destilConsensus ? 'bg-green-500' : 'bg-red-500'}`}>
                        {destilConsensus ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <span className="text-sm">Destilación: </span>
                        {destilConsensus ? (
                          <span className="text-green-400">
                            Todos los escenarios coinciden en que <strong>{uniqueDestilWinners[0]}</strong> {uniqueDestilWinners[0].includes(', ') ? 'son las mejores alternativas' : 'es la mejor alternativa'}.
                          </span>
                        ) : (
                          <span className="text-red-400">
                            Los escenarios no coinciden en la mejor alternativa. 
                            {uniqueDestilWinners.length > 0 && ` Opciones: ${uniqueDestilWinners.join(', ')}.`}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <h3 className="font-medium mb-3 text-blue-300 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                Recomendaciones
              </h3>
              
              <ul className="space-y-2 text-sm">
                {/* Generar recomendaciones dinámicamente basadas en el análisis */}
                {(() => {
                  const flowWinners = selectedScenariosData.map(s => ganadorDe(s, 'flujo_neto')).filter(Boolean);
                  const destilWinners = selectedScenariosData.map(s => ganadorDe(s, 'destilacion')).filter(Boolean);
                  const uniqueFlowWinners = [...new Set(flowWinners)];
                  const uniqueDestilWinners = [...new Set(destilWinners)];
                  const flowConsensus = flowWinners.length > 0 && uniqueFlowWinners.length === 1;
                  const destilConsensus = destilWinners.length > 0 && uniqueDestilWinners.length === 1;
                  
                  const recommendations = [];
                  
                  // Si hay consenso en ambos métodos y coinciden
                  if (flowConsensus && destilConsensus && uniqueFlowWinners[0] === uniqueDestilWinners[0]) {
                    recommendations.push(
                      <li key="rec-1" className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-400 flex-shrink-0">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <span>
                          Hay un fuerte consenso en todos los escenarios: <strong>{uniqueFlowWinners[0]}</strong> {uniqueFlowWinners[0].includes(', ') ? 'son claramente las mejores alternativas' : 'es claramente la mejor alternativa'}
                          según ambos métodos. Esta es una recomendación muy robusta.
                        </span>
                      </li>
                    );
                  }
                  
                  // Si hay consenso en ambos métodos pero no coinciden
                  else if (flowConsensus && destilConsensus && uniqueFlowWinners[0] !== uniqueDestilWinners[0]) {
                    recommendations.push(
                      <li key="rec-2" className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400 flex-shrink-0">
                          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                        </svg>
                        <span>
                          Hay consenso dentro de cada método, pero los diferentes métodos favorecen alternativas distintas: 
                          <strong> {uniqueFlowWinners[0]}</strong> (Flujo Neto) vs <strong>{uniqueDestilWinners[0]}</strong> (Destilación).
                          Considere un análisis más profundo de estas dos alternativas.
                        </span>
                      </li>
                    );
                  }
                  
                  // Si hay variación de corte lambda
                  const lambdaValues = selectedScenariosData.map(s => s.corte);
                  const minLambda = Math.min(...lambdaValues);
                  const maxLambda = Math.max(...lambdaValues);
                  
                  if (maxLambda - minLambda > 0.5) {
                    recommendations.push(
                      <li key="rec-3" className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400 flex-shrink-0">
                          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <span>
                          Hay una variación significativa en los valores de corte λ entre escenarios (de {minLambda} a {maxLambda}). 
                          Esto puede explicar algunas de las diferencias en los resultados. Considere estandarizar este parámetro 
                          para comparaciones más consistentes.
                        </span>
                      </li>
                    );
                  }
                  
                  // Si hay pocas alternativas en común
                  const alternativeSets = selectedScenariosData.map(s => 
                    new Set([...rankingDe(s, 'flujo_neto'), ...rankingDe(s, 'destilacion')].map(r => r.alternativa))
                  );
                  
                  if (alternativeSets.length >= 2) {
                    const intersection = [...alternativeSets[0]].filter(alt => 
                      alternativeSets.slice(1).every(set => set.has(alt))
                    );
                    
                    if (intersection.length < Math.min(...alternativeSets.map(set => set.size)) / 2) {
                      recommendations.push(
                        <li key="rec-4" className="flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400 flex-shrink-0">
                            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                          </svg>
                          <span>
                            Los escenarios seleccionados tienen pocas alternativas en común. Esto dificulta la comparación directa.
                            Considere revisar y estandarizar el conjunto de alternativas entre escenarios.
                          </span>
                        </li>
                      );
                    }
                  }
                  
                  return recommendations.length > 0 ? recommendations : (
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                      <span>
                        Seleccione al menos dos escenarios para generar recomendaciones específicas basadas en su comparación.
                      </span>
                    </li>
                  );
                })()}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}