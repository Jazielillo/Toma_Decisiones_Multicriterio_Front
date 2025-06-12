import React from 'react';
import { Link } from 'react-router-dom';

export default function ElectreInfo() {
  return (
    <div className="text-white min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg overflow-hidden mb-10">
        <div className="absolute inset-0">
          <svg className="absolute right-0 bottom-0 opacity-10" width="450" height="450" viewBox="0 0 450 450" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M275 120.5L210.5 169.5L140 104.5L189.5 49.5L275 120.5Z" stroke="white" strokeWidth="4"/>
            <path d="M301.5 178L375 240.5L303 318L235.5 240.5L301.5 178Z" stroke="white" strokeWidth="4"/>
            <path d="M124 149.5L63.5 222L124 307.5L192 222L124 149.5Z" stroke="white" strokeWidth="4"/>
            <path d="M256.5 264.5L188 349L132.5 307.5L188 242L256.5 264.5Z" stroke="white" strokeWidth="4"/>
            <circle cx="188" cy="222" r="15" fill="white" fillOpacity="0.2"/>
            <circle cx="124" cy="306" r="15" fill="white" fillOpacity="0.2"/>
            <circle cx="235" cy="240" r="15" fill="white" fillOpacity="0.2"/>
            <circle cx="303" cy="177" r="15" fill="white" fillOpacity="0.2"/>
            <circle cx="257" cy="265" r="15" fill="white" fillOpacity="0.2"/>
            <circle cx="190" cy="50" r="15" fill="white" fillOpacity="0.2"/>
            <circle cx="275" cy="120" r="15" fill="white" fillOpacity="0.2"/>
            <circle cx="140" cy="105" r="15" fill="white" fillOpacity="0.2"/>
          </svg>
        </div>
        <div className="relative z-10 py-16 px-6 md:px-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              ELECTRE III
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 font-light max-w-3xl">
              Método de Toma de Decisiones Multicriterio para Problemas Complejos
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                to="/projects"
                className="bg-white text-blue-900 hover:bg-blue-50 transition-colors px-5 py-3 rounded-lg font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                </svg>
                Comenzar un Proyecto
              </Link>
              <a 
                href="#learn-more"
                className="border border-white text-white hover:bg-white hover:text-blue-900 transition-colors px-5 py-3 rounded-lg font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                Aprender más
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* What is ELECTRE III */}
      <div id="learn-more" className="max-w-6xl mx-auto px-4 mb-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">¿Qué es ELECTRE III?</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              ELECTRE III (ELimination Et Choix Traduisant la REalité - Eliminación y Elección Expresando la Realidad) es un 
              método de análisis multicriterio desarrollado por Bernard Roy en 1978.
            </p>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              A diferencia de muchos otros métodos, ELECTRE III no busca una solución óptima única, 
              sino que establece relaciones de superación entre alternativas, considerando 
              umbrales de preferencia e indiferencia.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Este método es especialmente útil para problemas de decisión complejos donde:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-300">
              <li>Hay múltiples criterios en conflicto</li>
              <li>Las escalas de medición son heterogéneas</li>
              <li>Existe incertidumbre y ambigüedad en los datos</li>
              <li>Se busca un análisis más matizado y menos compensatorio</li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" stroke="white" strokeWidth="0.5" d="M10,30 L90,30" />
                <path fill="none" stroke="white" strokeWidth="0.5" d="M10,50 L90,50" />
                <path fill="none" stroke="white" strokeWidth="0.5" d="M10,70 L90,70" />
                <path fill="none" stroke="white" strokeWidth="0.5" d="M30,10 L30,90" />
                <path fill="none" stroke="white" strokeWidth="0.5" d="M50,10 L50,90" />
                <path fill="none" stroke="white" strokeWidth="0.5" d="M70,10 L70,90" />
                <circle cx="30" cy="30" r="5" fill="white" />
                <circle cx="50" cy="30" r="5" fill="white" />
                <circle cx="70" cy="50" r="5" fill="white" />
                <circle cx="30" cy="70" r="5" fill="white" />
                <circle cx="50" cy="70" r="5" fill="white" />
                <path fill="none" stroke="white" strokeWidth="1" d="M30,30 L50,30 L70,50 L50,70 L30,70" />
              </svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-4 text-blue-300">Características principales</h3>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="bg-blue-600 p-3 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zm-8.962 3.712a.75.75 0 010 1.061l-1.591 1.591a.75.75 0 11-1.061-1.06l1.591-1.592a.75.75 0 011.06 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">No compensatorio</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Un mal desempeño en un criterio no puede ser compensado por un buen desempeño en otro.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-purple-600 p-3 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Relaciones de superación</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Establece si una alternativa supera a otra, es superada, o son incomparables entre sí.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-green-600 p-3 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Umbrales y pseudocriterios</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Utiliza umbrales de preferencia, indiferencia y veto para modelar la imprecisión.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-red-600 p-3 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Preferencias del decisor</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Incorpora explícitamente las preferencias subjetivas del decisor en el proceso.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="max-w-6xl mx-auto px-4 mb-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Proceso del Método ELECTRE III</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
        </div>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gray-700"></div>
          
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 -top-2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                1
              </div>
              
              <div className="ml-12 md:ml-0 md:grid md:grid-cols-2 md:gap-8">
                <div className="md:text-right md:pr-6 mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-blue-400">Definición del problema</h3>
                  <p className="text-gray-300 mt-2">
                    Identificar alternativas disponibles, criterios relevantes y su dirección de preferencia.
                  </p>
                </div>
                <div className="md:pl-6 bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-medium text-white">En la plataforma:</h4>
                  <ul className="mt-2 space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Crea un nuevo proyecto
                    </li>
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Define las alternativas disponibles
                    </li>
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Establece los criterios de evaluación
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 -top-2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                2
              </div>
              
              <div className="ml-12 md:ml-0 md:grid md:grid-cols-2 md:gap-8">
                <div className="md:text-right md:pr-6 mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-blue-400">Valoración de alternativas</h3>
                  <p className="text-gray-300 mt-2">
                    Evaluar cada alternativa según cada criterio y construir la matriz de evaluación.
                  </p>
                </div>
                <div className="md:pl-6 bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-medium text-white">En la plataforma:</h4>
                  <ul className="mt-2 space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Ingresa los valores de cada alternativa para cada criterio
                    </li>
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Revisa la matriz de valoración completa
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 -top-2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                3
              </div>
              
              <div className="ml-12 md:ml-0 md:grid md:grid-cols-2 md:gap-8">
                <div className="md:text-right md:pr-6 mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-blue-400">Definición de parámetros</h3>
                  <p className="text-gray-300 mt-2">
                    Establecer umbrales de preferencia, indiferencia y veto, así como los pesos de los criterios.
                  </p>
                </div>
                <div className="md:pl-6 bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-medium text-white">En la plataforma:</h4>
                  <ul className="mt-2 space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Asigna pesos a cada criterio
                    </li>
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Define los umbrales de indiferencia, preferencia y veto para cada criterio
                    </li>
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Configura el valor de corte λ para la credibilidad
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="relative">
              <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 -top-2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                4
              </div>
              
              <div className="ml-12 md:ml-0 md:grid md:grid-cols-2 md:gap-8">
                <div className="md:text-right md:pr-6 mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-blue-400">Cálculo de índices de concordancia y discordancia</h3>
                  <p className="text-gray-300 mt-2">
                    Calcular los índices para cada par de alternativas y construir la matriz de credibilidad.
                  </p>
                </div>
                <div className="md:pl-6 bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-medium text-white">En la plataforma:</h4>
                  <ul className="mt-2 space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      El sistema calcula automáticamente los índices de concordancia y discordancia
                    </li>
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Genera la matriz de credibilidad
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Step 5 */}
            <div className="relative">
              <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 -top-2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                5
              </div>
              
              <div className="ml-12 md:ml-0 md:grid md:grid-cols-2 md:gap-8">
                <div className="md:text-right md:pr-6 mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-blue-400">Algoritmo de clasificación</h3>
                  <p className="text-gray-300 mt-2">
                    Aplicar destilación ascendente y descendente o calcular flujos netos para obtener la clasificación final.
                  </p>
                </div>
                <div className="md:pl-6 bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-medium text-white">En la plataforma:</h4>
                  <ul className="mt-2 space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Obtén la clasificación por Destilación
                    </li>
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Obtén la clasificación por Flujo Neto
                    </li>
                    <li className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 flex-shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      Compara resultados entre diferentes escenarios
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Terminology */}
      <div className="max-w-6xl mx-auto px-4 mb-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Terminología clave</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2 text-blue-300">Umbral de indiferencia (q)</h3>
            <p className="text-gray-300">
              Es el valor máximo de diferencia entre dos alternativas por debajo del cual el decisor es indiferente. 
              Si la diferencia entre A y B es menor que q, se consideran equivalentes para ese criterio.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2 text-blue-300">Umbral de preferencia (p)</h3>
            <p className="text-gray-300">
              Es el valor mínimo de diferencia entre dos alternativas a partir del cual existe una preferencia estricta.
              Si la diferencia entre A y B es mayor que p, A es estrictamente preferida a B para ese criterio.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2 text-blue-300">Umbral de veto (v)</h3>
            <p className="text-gray-300">
              Es el valor de diferencia entre alternativas a partir del cual se rechaza la afirmación de que una supera a otra,
              independientemente de su desempeño en los demás criterios. Representa un poder de veto.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2 text-blue-300">Índice de concordancia</h3>
            <p className="text-gray-300">
              Mide en qué medida un conjunto de criterios concuerda con la afirmación de que una alternativa es al menos tan buena como otra.
              Se calcula como la suma ponderada de los criterios que apoyan esta afirmación.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2 text-blue-300">Índice de discordancia</h3>
            <p className="text-gray-300">
              Mide el grado en que un criterio específico se opone a la afirmación de que una alternativa supera a otra.
              Se relaciona con la magnitud de las diferencias desfavorables entre alternativas.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2 text-blue-300">Nivel de corte (λ)</h3>
            <p className="text-gray-300">
              Es el valor umbral de credibilidad a partir del cual se establece una relación de superación entre alternativas.
              Valores altos de λ implican condiciones más estrictas para establecer relaciones de superación.
            </p>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="max-w-6xl mx-auto px-4 mb-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Aplicaciones de ELECTRE III</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 rounded-xl p-6 border border-blue-800/50">
            <div className="mb-4">
              <div className="bg-blue-700/50 p-3 rounded-lg inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                  <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                  <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Educación</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Selección de programas académicos</li>
              <li>• Evaluación de instituciones educativas</li>
              <li>• Asignación de becas y recursos</li>
              <li>• Planificación curricular</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/60 to-emerald-900/60 rounded-xl p-6 border border-green-800/50">
            <div className="mb-4">
              <div className="bg-green-700/50 p-3 rounded-lg inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M1.5 9.832v1.793c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875V9.832a3 3 0 00-.722-1.952l-3.285-3.832A3 3 0 0016.215 3h-8.43a3 3 0 00-2.278 1.048L2.222 7.88A3 3 0 001.5 9.832zM7.785 4.5a1.5 1.5 0 00-1.139.524L3.881 8.25h3.165a3 3 0 012.496 1.336l.164.246a1.5 1.5 0 001.248.668h2.092a1.5 1.5 0 001.248-.668l.164-.246a3 3 0 012.496-1.336h3.165l-2.765-3.226a1.5 1.5 0 00-1.139-.524h-8.43z" clipRule="evenodd" />
                  <path d="M2.813 15c-.725 0-1.313.588-1.313 1.313V18a3 3 0 003 3h15a3 3 0 003-3v-1.688c0-.724-.588-1.312-1.313-1.312h-4.233a3 3 0 00-2.496 1.336l-.164.246a1.5 1.5 0 01-1.248.668h-2.092a1.5 1.5 0 01-1.248-.668l-.164-.246A3 3 0 007.046 15H2.812z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Gestión ambiental</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Ubicación de plantas de tratamiento</li>
              <li>• Gestión de recursos naturales</li>
              <li>• Evaluación de impacto ambiental</li>
              <li>• Selección de tecnologías sostenibles</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/60 to-violet-900/60 rounded-xl p-6 border border-purple-800/50">
            <div className="mb-4">
              <div className="bg-purple-700/50 p-3 rounded-lg inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Gestión empresarial</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Selección de proveedores</li>
              <li>• Evaluación de proyectos de inversión</li>
              <li>• Localización de instalaciones</li>
              <li>• Gestión de recursos humanos</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-orange-900/60 to-amber-900/60 rounded-xl p-6 border border-orange-800/50">
            <div className="mb-4">
              <div className="bg-orange-700/50 p-3 rounded-lg inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                  <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z" clipRule="evenodd" />
                  <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Urbanismo y Planificación</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Selección de sitios para infraestructura</li>
              <li>• Evaluación de proyectos de transporte</li>
              <li>• Planeamiento urbano</li>
              <li>• Programas de renovación urbana</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-red-900/60 to-rose-900/60 rounded-xl p-6 border border-red-800/50">
            <div className="mb-4">
              <div className="bg-red-700/50 p-3 rounded-lg inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 01-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0113.5 1.5H15a3 3 0 012.663 1.618zM12 4.5A1.5 1.5 0 0113.5 3H15a1.5 1.5 0 011.5 1.5H12z" clipRule="evenodd" />
                  <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 019 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0116.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625v-12z" />
                  <path d="M10.5 10.5a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963 5.23 5.23 0 00-3.434-1.279h-1.875a.375.375 0 01-.375-.375V10.5z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Salud</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Evaluación de tecnologías sanitarias</li>
              <li>• Asignación de recursos hospitalarios</li>
              <li>• Selección de tratamientos médicos</li>
              <li>• Ubicación de centros de salud</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-900/60 to-sky-900/60 rounded-xl p-6 border border-cyan-800/50">
            <div className="mb-4">
              <div className="bg-cyan-700/50 p-3 rounded-lg inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Energía</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Selección de fuentes de energía</li>
              <li>• Ubicación de plantas generadoras</li>
              <li>• Estrategias de eficiencia energética</li>
              <li>• Evaluación de tecnologías renovables</li>
            </ul>
          </div>
        </div>
      </div>

      {/* References */}
      <div className="max-w-6xl mx-auto px-4 mb-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Referencias y recursos adicionales</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Bibliografía recomendada</h3>
          <ul className="space-y-4">
           
            <li className="flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
              <div>
                <p className="font-medium text-gray-200">Roy, B. (1991)</p>
                <p className="text-gray-400">The outranking approach and the foundations of ELECTRE methods. Theory and Decision, 31, 49-73.</p>
              </div>
            </li>
            <li className="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-200">Figueira, J., Greco, S., & Słowiński, R. (2005)</p>
                    <p className="text-gray-400">ELECTRE methods with respect to the foundations of ELECTRE methods. In Multiple Criteria Decision Analysis: State of the Art Surveys (pp. 133-162). Springer.</p>
                </div>
            </li>
            <li className="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89 .166 2.75 .47a .75 .75 0 001-.708V4.262a .75 .75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                </svg>
                <div>
                    <p className="font-medium text-gray-200">Słowiński, R., & Wallenius, J. (1992)</p>
                    <p className="text-gray-400">ELECTRE methods in decision making. In Multiple criteria decision making: Theory and applications (pp. 1-20). Springer.</p>
                </div>
            </li>
            <li className="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89 .166 2.75 .47a .75 .75 0 001-.708V4.262a .75 .75 0 00-.5-.707A9.735 9.735 0 0018 3a
                            9.707 9.707 0 00-5.25 1.533v16.103z" />
                </svg>
                <div>
                    <p className="font-medium text-gray-200">Vincke, P. (1992)</p>
                    <p className="text-gray-400">Multicriteria decision-aid. Wiley.</p>
                </div>
            </li>
            <li className="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89 .166 2.75 .47a .75 .75 0 001-.708V4.262a .75 .75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                </svg>
                <div>
                    <p className="font-medium text-gray-200">Greco, S., & Słowiński, R. (1998)</p>
                    <p className="text-gray-400">Axiomatic foundations of ELECTRE methods. European Journal of Operational Research, 109(2), 160-175.</p>   
                </div>
            </li> 

          </ul>
          <h3 className="text-xl font-semibold mt-8 mb-4">Recursos en línea</h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89 .166 2.75 .47a .75 .75 0 001-.708V4.262a .75 .75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
              <div>
                <a href="https://www.xlstat.com/solutions/features/multicriteria-decision-aid-electre-methods" className="text-blue-400 hover:underline">Explicacion sobre ELECTRE III</a>
                <p className="text-gray-400">Recursos, tutoriales y documentación sobre los métodos ELECTRE.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89 .166 2.75 .47a .75 .75 0 001-.708V4.262a .75 .75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>  
              <div>
                <a href="https://www.researchgate.net/publication/220123456_ELECTRE_Methods" className="text-blue-400 hover:underline">ELECTRE Methods on ResearchGate</a>
                <p className="text-gray-400">Artículos académicos y publicaciones sobre los métodos ELECTRE.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89 .166 2.75 .47a .75 .75 0 001-.708V4.262a .75 .75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
              <div>
                <a href="https://www.youtube.com/results?search_query=ELECTRE+III" className="text-blue-400 hover:underline">Videos sobre ELECTRE III en YouTube</a>
                <p className="text-gray-400">Tutoriales y explicaciones visuales sobre el método ELECTRE III.</p>
              </div>
            </li>
            </ul>
        </div>
      </div>
      </div>

      );
  }