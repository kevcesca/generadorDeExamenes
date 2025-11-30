"use client";

import { useState, useEffect } from "react";
import { parseExamXML, ExamData } from "../utils/xmlParser";

interface ExamSetupProps {
    onStartExam: (examData: ExamData, config: { passingScore: number; maxQuestions: number }) => void;
}

const DEFAULT_XML = `<Titulo>Examen de practica</Titulo>

<Pregunta>Pregunta 1</Pregunta>
<OpcionCorr>Opción correcta</OpcionCorr>
<OpcionInco1>Opción incorrecta 1</OpcionInco1>
<OpcionInco2>Opción incorrecta 2</OpcionInco2>
<OpcionInco3>Opción incorrecta 3</OpcionInco3>

<Pregunta>Pregunta 2</Pregunta>
<OpcionCorr>Opción correcta</OpcionCorr>
<OpcionInco1>Opción incorrecta 1</OpcionInco1>
<OpcionInco2>Opción incorrecta 2</OpcionInco2>
<OpcionInco3>Opción incorrecta 3</OpcionInco3>`;

export default function ExamSetup({ onStartExam }: ExamSetupProps) {
    const [xmlInput, setXmlInput] = useState(DEFAULT_XML);
    const [maxQuestions, setMaxQuestions] = useState<number | "">("");
    const [passingScore, setPassingScore] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    // Auto-update settings when XML changes
    useEffect(() => {
        try {
            const parsed = parseExamXML(xmlInput);
            const total = parsed.questions.length;

            if (total > 0) {
                setMaxQuestions(total);
                // Default passing score to 80%
                setPassingScore(Math.ceil(total * 0.8));
                setError(null);
            } else {
                setMaxQuestions("");
                setPassingScore(0);
            }
        } catch (e) {
            // Silent fail during typing, error will be shown on start
            console.log("Parsing error during typing:", e);
        }
    }, [xmlInput]);

    const handleStart = () => {
        try {
            const parsed = parseExamXML(xmlInput);
            if (parsed.questions.length === 0) {
                setError("No se encontraron preguntas en el texto XML.");
                return;
            }

            const totalQuestions = parsed.questions.length;
            const limit = maxQuestions === "" ? totalQuestions : Number(maxQuestions);

            if (limit > totalQuestions) {
                setError(`Solo hay ${totalQuestions} preguntas disponibles.`);
                return;
            }

            if (limit <= 0) {
                setError("La cantidad de preguntas debe ser mayor a 0.");
                return;
            }

            // Validate passing score
            if (passingScore > limit) {
                setError(`El criterio de aprobación (${passingScore}) no puede ser mayor que la cantidad de preguntas (${limit}).`);
                return;
            }

            onStartExam(parsed, { passingScore, maxQuestions: limit });
        } catch (e) {
            setError("Error al procesar el XML. Verifique el formato.");
            console.error(e);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-100">Configuración del Examen</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Fuente de Preguntas (XML)
                    </label>
                    <textarea
                        className="w-full h-64 p-4 text-sm font-mono bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y"
                        value={xmlInput}
                        onChange={(e) => setXmlInput(e.target.value)}
                        placeholder="Pegue aquí su XML..."
                    />
                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                        Use las etiquetas &lt;Pregunta&gt;, &lt;OpcionCorr&gt;, &lt;OpcionInco1&gt;...
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Cantidad de Preguntas
                        </label>
                        <input
                            type="number"
                            min="1"
                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Todas (dejar vacío)"
                            value={maxQuestions}
                            onChange={(e) => setMaxQuestions(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Aciertos para Aprobar
                        </label>
                        <input
                            type="number"
                            min="1"
                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={passingScore}
                            onChange={(e) => setPassingScore(Number(e.target.value))}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleStart}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    Iniciar Examen
                </button>
            </div>
        </div>
    );
}
