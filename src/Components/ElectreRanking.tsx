import type { ResultadoRanking } from '../api/matriz';

export type MetodoElectre = 'flujo' | 'destilacion';

export interface GrupoRanking {
    posicion: number;
    score: number;
    alternativas: string[];
}

/**
 * Agrupa las alternativas que comparten posición (mismo score).
 * Espera el ranking ya ordenado de mejor a peor.
 */
export const agruparRanking = (ranking: ResultadoRanking[]): GrupoRanking[] => {
    const grupos: GrupoRanking[] = [];
    ranking.forEach(({ alternativa, score, posicion }) => {
        const grupo = grupos.find(g => g.posicion === posicion);
        if (grupo) {
            grupo.alternativas.push(alternativa);
        } else {
            grupos.push({ posicion, score, alternativas: [alternativa] });
        }
    });
    return grupos.sort((a, b) => a.posicion - b.posicion);
};

// Alternativas en primer lugar (puede haber empate)
export const mejoresAlternativas = (ranking: ResultadoRanking[]): string[] =>
    ranking.filter(r => r.posicion === 1).map(r => r.alternativa);

export const formatearScore = (score: number): string =>
    Number.isInteger(score) ? String(score) : String(Number(score.toFixed(4)));

export const descripcionScore = (metodo: MetodoElectre): string =>
    metodo === 'flujo'
        ? 'Score = flujo neto de la alternativa (mayor es mejor).'
        : 'Score = nivel alcanzado en la destilación (mayor es mejor).';

const ACCENTS = {
    green: { border: 'border-green-600', badge: 'bg-green-600', text: 'text-green-400' },
    purple: { border: 'border-purple-600', badge: 'bg-purple-600', text: 'text-purple-400' },
};

interface ElectreRankingProps {
    ranking: ResultadoRanking[];
    metodo: MetodoElectre;
    accent?: keyof typeof ACCENTS;
}

/**
 * Ranking de ELECTRE III con el score de cada alternativa.
 * Las alternativas empatadas aparecen juntas en la misma posición.
 */
export default function ElectreRanking({ ranking, metodo, accent = 'green' }: ElectreRankingProps) {
    const colors = ACCENTS[accent];
    const grupos = agruparRanking(ranking);

    return (
        <div>
            <div className="space-y-3">
                {grupos.map(grupo => {
                    const isBest = grupo.posicion === 1;
                    const isTie = grupo.alternativas.length > 1;
                    return (
                        <div
                            key={grupo.posicion}
                            className={`bg-gray-800 border ${isBest ? colors.border : 'border-gray-600'} rounded-lg p-3 md:p-4`}
                        >
                            <div className="flex items-center gap-3 md:gap-4">
                                <span className="bg-gray-700 min-w-10 h-10 px-2 flex items-center justify-center rounded-full font-bold shrink-0">
                                    {grupo.posicion}º
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {grupo.alternativas.map(alternativa => (
                                            <span
                                                key={alternativa}
                                                className={`font-medium ${isTie ? 'bg-gray-700 px-2 py-0.5 rounded' : ''}`}
                                            >
                                                {alternativa}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                                        {isBest && (
                                            <span className={`${colors.badge} text-white px-2 py-0.5 rounded`}>
                                                {isTie ? 'Mejores opciones' : 'Mejor opción'}
                                            </span>
                                        )}
                                        {isTie && (
                                            <span className="text-yellow-400">
                                                Empate entre {grupo.alternativas.length} alternativas
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-xs text-gray-400">Score</div>
                                    <div className={`text-lg font-bold ${isBest ? colors.text : 'text-white'}`}>
                                        {formatearScore(grupo.score)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className="text-xs text-gray-500 mt-3">
                {descripcionScore(metodo)} Las alternativas con el mismo score comparten posición.
            </p>
        </div>
    );
}
