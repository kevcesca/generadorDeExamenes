"use client";

import { useState } from "react";
import { ExamData, Question, Option } from "../utils/xmlParser";

interface ExamTakerProps {
    examData: ExamData;
    onFinish: (answers: Record<string, string>) => void;
}

export default function ExamTaker({ examData, onFinish }: ExamTakerProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> optionId

    const currentQuestion = examData.questions[currentQuestionIndex];
    const totalQuestions = examData.questions.length;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    const handleOptionSelect = (optionId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: optionId,
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleSubmit = () => {
        // Ensure all questions are answered? Or allow skipping?
        // User didn't specify, but usually exams allow skipping or warn.
        // Let's just submit what we have.
        onFinish(answers);
    };

    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex flex-col min-h-[600px]">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{examData.title}</h2>
                        {examData.subtitle && <p className="text-zinc-500 dark:text-zinc-400 text-sm">{examData.subtitle}</p>}
                    </div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Pregunta {currentQuestionIndex + 1} de {totalQuestions}
                    </span>
                </div>
                <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question Content */}
            <div className="flex-grow">
                <h3 className="text-lg md:text-xl font-medium text-zinc-900 dark:text-zinc-50 mb-6 leading-relaxed">
                    {currentQuestion.text}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                        const isSelected = answers[currentQuestion.id] === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-4 group
                  ${isSelected
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                        : "border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                    }
                `}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                  ${isSelected
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-zinc-300 dark:border-zinc-600 group-hover:border-blue-400"
                                    }
                `}>
                                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                </div>
                                <span className={`text-base ${isSelected ? "text-blue-900 dark:text-blue-100" : "text-zinc-700 dark:text-zinc-300"}`}>
                                    {option.text}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer / Navigation */}
            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <button
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors
            ${currentQuestionIndex === 0
                            ? "text-zinc-400 cursor-not-allowed"
                            : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }
          `}
                >
                    Anterior
                </button>

                {isLastQuestion ? (
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        Finalizar Examen
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        Siguiente
                    </button>
                )}
            </div>
        </div>
    );
}
