import SideBar from "../../Components/SideBar";
import { useState } from "react";

type AlternativeKey = 'alternativeA' | 'alternativeB';
type CriteriaKey = 'criteriaA' | 'criteriaB';

interface ValueMatrix {
    alternativeA: {
        criteriaA: number | string;
        criteriaB: number | string;
    };
    alternativeB: {
        criteriaA: number | string;
        criteriaB: number | string;
    };
}

export default function ValueMatrix() {
    const [values, setValues] = useState<ValueMatrix>({
        alternativeA: {
            criteriaA: 10,
            criteriaB: 5
        },
        alternativeB: {
            criteriaA: 2,
            criteriaB: 8
        }
    });

    const handleValueChange = (alternative: AlternativeKey, criteria: CriteriaKey, value: number | string) => {
        setValues(prev => ({
            ...prev,
            [alternative]: {
                ...prev[alternative],
                [criteria]: value
            }
        }));
    };

    const calculateResults = () => {
        // In a real implementation, this would calculate the ELECTRE III results
        console.log("Calculating results with values:", values);
    };

    const clearResults = () => {
        setValues({
            alternativeA: {
                criteriaA: "",
                criteriaB: ""
            },
            alternativeB: {
                criteriaA: "",
                criteriaB: ""
            }
        });
    };

    return (
        <>
            {/* Responsive Header Section */}
            <div className="mb-4 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Value Matrix</h1>
                    <p className="font-bold text-gray-400 text-sm md:text-base">Project: Coco | Scenario: asdasd</p>
                </div>
            </div>

            {/* Responsive Navigation Buttons */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
                <button className="border border-gray-600 hover:bg-gray-800 rounded-md px-3 py-1 md:px-4 md:py-2 text-white text-sm md:text-base">
                    Weights
                </button>
                <button className="border border-gray-600 hover:bg-gray-800 rounded-md px-3 py-1 md:px-4 md:py-2 text-white text-sm md:text-base">
                    Go to Reports
                </button>
            </div>

            {/* Responsive Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Left column - Matrix */}
                <div className="border border-gray-600 rounded-lg p-3 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 md:size-6 text-blue-500">
                            <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
                        </svg>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Evaluation Matrix</h2>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">Enter values for each alternative according to each criterion.</p>

                    <div className="w-full overflow-x-auto">
                        <div className="min-w-[300px] md:min-w-[400px]">
                            {/* Header row with criteria */}
                            <div className="grid grid-cols-3 mb-3 md:mb-4">
                                <div className="col-span-1"></div>
                                <div className="col-span-1 text-center">
                                    <p className="font-bold text-gray-300 text-sm md:text-base">Criterion A</p>
                                    <p className="text-xs md:text-sm text-gray-400">[MAX]</p>
                                </div>
                                <div className="col-span-1 text-center">
                                    <p className="font-bold text-gray-300 text-sm md:text-base">Criterion B</p>
                                    <p className="text-xs md:text-sm text-gray-400">[MAX]</p>
                                </div>
                            </div>

                            {/* Alternative A row */}
                            <div className="grid grid-cols-3 items-center mb-3 md:mb-4">
                                <div className="col-span-1">
                                    <p className="font-bold text-gray-300 text-sm md:text-base">Alternative A</p>
                                </div>
                                <div className="col-span-1 px-1 md:px-2">
                                    <input
                                        type="number"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-md p-1 md:p-2 text-center text-sm md:text-base"
                                        value={values.alternativeA.criteriaA}
                                        onChange={(e) => handleValueChange('alternativeA', 'criteriaA', e.target.value)}
                                    />
                                </div>
                                <div className="col-span-1 px-1 md:px-2">
                                    <input
                                        type="number"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-md p-1 md:p-2 text-center text-sm md:text-base"
                                        value={values.alternativeA.criteriaB}
                                        onChange={(e) => handleValueChange('alternativeA', 'criteriaB', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Alternative B row */}
                            <div className="grid grid-cols-3 items-center mb-3 md:mb-4">
                                <div className="col-span-1">
                                    <p className="font-bold text-gray-300 text-sm md:text-base">Alternative B</p>
                                </div>
                                <div className="col-span-1 px-1 md:px-2">
                                    <input
                                        type="number"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-md p-1 md:p-2 text-center text-sm md:text-base"
                                        value={values.alternativeB.criteriaA}
                                        onChange={(e) => handleValueChange('alternativeB', 'criteriaA', e.target.value)}
                                    />
                                </div>
                                <div className="col-span-1 px-1 md:px-2">
                                    <input
                                        type="number"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-md p-1 md:p-2 text-center text-sm md:text-base"
                                        value={values.alternativeB.criteriaB}
                                        onChange={(e) => handleValueChange('alternativeB', 'criteriaB', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col xs:flex-row flex-wrap gap-2 md:gap-4 mt-4 md:mt-8 justify-center md:justify-end">
                                <button
                                    className="bg-blue-700 hover:bg-blue-600 rounded-md px-3 py-2 md:px-4 md:py-3 text-white text-sm md:text-base w-full xs:w-auto"
                                    onClick={calculateResults}
                                >
                                    Calculate Results
                                </button>
                                <button
                                    className="bg-transparent border border-gray-600 hover:bg-gray-800 rounded-md px-3 py-2 md:px-4 md:py-3 text-white text-sm md:text-base w-full xs:w-auto"
                                    onClick={clearResults}
                                >
                                    Clear Results
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column - Results */}
                <div className="border border-gray-600 rounded-lg p-3 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 md:size-6 text-blue-500">
                            <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
                        </svg>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">ELECTRE III Results</h2>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">Classification of alternatives according to the ELECTRE III method.</p>

                    <div>
                        <h3 className="text-base md:text-xl font-bold mb-2 md:mb-4">Final Classification</h3>
                        <div className="border border-gray-600 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                            <ol className="list-decimal list-inside space-y-1 md:space-y-2 pl-1 md:pl-2">
                                <li className="text-base md:text-lg">Alternative A</li>
                                <li className="text-base md:text-lg">Alternative B</li>
                            </ol>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3">Descending Distillation</h3>
                                <div className="border border-gray-600 rounded-lg p-3 md:p-4">
                                    <ol className="list-decimal list-inside space-y-1 md:space-y-2 pl-1 md:pl-2">
                                        <li className="text-sm md:text-base">Alternative A</li>
                                        <li className="text-sm md:text-base">Alternative B</li>
                                    </ol>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3">Ascending Distillation</h3>
                                <div className="border border-gray-600 rounded-lg p-3 md:p-4">
                                    <ol className="list-decimal list-inside space-y-1 md:space-y-2 pl-1 md:pl-2">
                                        <li className="text-sm md:text-base">Alternative A</li>
                                        <li className="text-sm md:text-base">Alternative B</li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-4 md:mt-8">
                            <button className="bg-transparent border border-gray-600 hover:bg-gray-800 rounded-md px-3 py-2 md:px-4 md:py-3 text-white text-sm md:text-base">
                                View Complete Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}