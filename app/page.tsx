"use client";

import { useState } from "react";
import Image from "next/image";
import ExamSetup from "./components/ExamSetup";
import ExamTaker from "./components/ExamTaker";
import ExamResults from "./components/ExamResults";
import { ThemeToggle } from "./components/ThemeToggle";
import { ExamData, randomizeExam } from "./utils/xmlParser";

type AppState = "SETUP" | "TAKING" | "RESULTS";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("SETUP");
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [passingScore, setPassingScore] = useState(0);

  const handleStartExam = (data: ExamData, config: { passingScore: number; maxQuestions: number }) => {
    const randomized = randomizeExam(data, config.maxQuestions);
    setExamData(randomized);
    setPassingScore(config.passingScore);
    setAppState("TAKING");
    setUserAnswers({});
  };

  const handleFinishExam = (answers: Record<string, string>) => {
    setUserAnswers(answers);
    setAppState("RESULTS");
  };

  const handleRetry = () => {
    setAppState("SETUP");
    setExamData(null);
    setUserAnswers({});
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="mb-12 print:hidden relative">
          {/* Logo - Top left on desktop, centered on mobile */}
          <div className="absolute left-0 top-0 hidden md:block">
            <a
              href="https://www.linkedin.com/in/kevinceresc"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-80 transition-opacity"
            >
              <Image
                src="https://res.cloudinary.com/dpsygq9p6/image/upload/v1696988507/Botines/kevinceronlogo.png"
                alt="Logo Kevin Ceron"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </a>
          </div>

          {/* Theme Toggle - Top right */}
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>

          {/* Centered content */}
          <div className="flex flex-col items-center justify-center">
            {/* Logo centered on mobile only */}
            <div className="mb-6 md:hidden">
              <a
                href="https://www.linkedin.com/in/kevinceresc"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80 transition-opacity"
              >
                <Image
                  src="https://res.cloudinary.com/dpsygq9p6/image/upload/v1696988507/Botines/kevinceronlogo.png"
                  alt="Logo Kevin Ceron"
                  width={150}
                  height={150}
                  className="object-contain"
                  priority
                />
              </a>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Generador de Exámenes
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center">
              Crea, practica y evalúa tus conocimientos.
            </p>
          </div>
        </header>

        <div className="transition-all duration-500 ease-in-out">
          {appState === "SETUP" && (
            <ExamSetup onStartExam={handleStartExam} />
          )}

          {appState === "TAKING" && examData && (
            <ExamTaker
              examData={examData}
              onFinish={handleFinishExam}
            />
          )}

          {appState === "RESULTS" && examData && (
            <ExamResults
              examData={examData}
              answers={userAnswers}
              passingScore={passingScore}
              onRetry={handleRetry}
            />
          )}
        </div>
      </div>
    </main>
  );
}
