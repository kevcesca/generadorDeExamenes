"use client";

import { useEffect, useState } from "react";
import { ExamData, Question } from "../utils/xmlParser";

interface ExamResultsProps {
    examData: ExamData;
    answers: Record<string, string>;
    passingScore: number;
    onRetry: () => void;
}

export default function ExamResults({ examData, answers, passingScore, onRetry }: ExamResultsProps) {
    const [score, setScore] = useState(0);
    const [passed, setPassed] = useState(false);

    useEffect(() => {
        let correctCount = 0;
        examData.questions.forEach((q) => {
            const selectedOptionId = answers[q.id];
            const correctOption = q.options.find((o) => o.isCorrect);
            if (selectedOptionId === correctOption?.id) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setPassed(correctCount >= passingScore);
    }, [examData, answers, passingScore]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 print:shadow-none print:border-none print:p-0">
            {/* Header Result */}
            <div className="text-center mb-10 print:mb-6">
                <h2 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">{examData.title}</h2>
                {examData.subtitle && <p className="text-zinc-500 dark:text-zinc-400 mb-6">{examData.subtitle}</p>}

                <div className={`inline-flex flex-col items-center justify-center p-6 rounded-2xl border-2 ${passed
                        ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                        : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                    }`}>
                    <span className={`text-5xl font-bold mb-2 ${passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {score} / {examData.questions.length}
                    </span>
                    <span className={`text-lg font-medium px-4 py-1 rounded-full ${passed
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        }`}>
                        {passed ? "¡Aprobado!" : "Reprobado"}
                    </span>
                </div>
            </div>

            {/* Detailed Review */}
            <div className="space-y-8">
                <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 border-b pb-2 border-zinc-200 dark:border-zinc-700">
                    Revisión de Respuestas
                </h3>

                {examData.questions.map((q, index) => {
                    const selectedOptionId = answers[q.id];
                    const correctOption = q.options.find((o) => o.isCorrect);
                    const isCorrect = selectedOptionId === correctOption?.id;
                    const selectedOption = q.options.find(o => o.id === selectedOptionId);

                    return (
                        <div key={q.id} className={`p-6 rounded-lg border ${isCorrect
                                ? "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
                                : "border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10"
                            } break-inside-avoid`}>
                            <div className="flex gap-3 mb-4">
                                <span className="font-bold text-zinc-400">#{index + 1}</span>
                                <p className="font-medium text-zinc-900 dark:text-zinc-100">{q.text}</p>
                            </div>

                            <div className="space-y-2 pl-8">
                                {/* User Answer */}
                                <div className="flex items-start gap-2 text-sm">
                                    <span className="font-semibold min-w-[80px] text-zinc-500">Tu respuesta:</span>
                                    <span className={`${isCorrect ? "text-green-600 dark:text-green-400 font-medium" : "text-red-600 dark:text-red-400 font-medium"
                                        }`}>
                                        {selectedOption ? selectedOption.text : "Sin responder"}
                                    </span>
                                </div>

                                {/* Correct Answer (if wrong) */}
                                {!isCorrect && (
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="font-semibold min-w-[80px] text-zinc-500">Correcta:</span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">
                                            {correctOption?.text}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center print:hidden">
                <button
                    onClick={onRetry}
                    className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium rounded-lg transition-colors"
                >
                    Volver al Inicio
                </button>
                <button
                    onClick={handlePrint}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                    </svg>
                    Imprimir / Guardar PDF
                </button>
            </div>
        </div>
    );
}
