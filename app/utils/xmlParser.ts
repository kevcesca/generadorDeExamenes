export interface Question {
    id: string;
    text: string;
    options: Option[];
}

export interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface ExamData {
    title: string;
    subtitle: string;
    questions: Question[];
}

export function parseExamXML(xmlContent: string): ExamData {
    const titleMatch = xmlContent.match(/<Titulo>(.*?)<\/Titulo>/);
    const subtitleMatch = xmlContent.match(/<Subitulo>(.*?)<\/Subitulo>/) || xmlContent.match(/<Subtitulo>(.*?)<\/Subtitulo>/); // Handle potential typo in user example "Subitulo"

    const title = titleMatch ? titleMatch[1].trim() : "Examen Sin Título";
    const subtitle = subtitleMatch ? subtitleMatch[1].trim() : "";

    const questions: Question[] = [];

    // Split by <Pregunta> to isolate question blocks, but we need to be careful.
    // A better approach might be to regex for the whole block or iterate.
    // Given the structure, let's try matching all questions.

    // We can split the content by <Pregunta> tag.
    const parts = xmlContent.split(/<Pregunta>/g);

    // The first part is header stuff, ignore or already processed.
    // Subsequent parts start with the question text.

    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        // The question text is until the next tag start, usually <Opcion...
        const questionTextMatch = part.match(/^([\s\S]*?)<Opcion/);

        if (!questionTextMatch) continue; // Malformed or empty

        const questionText = questionTextMatch[1].replace(/<\/Pregunta>/, '').trim();

        const options: Option[] = [];

        // Find Correct Option
        const corrMatch = part.match(/<OpcionCorr>(.*?)<\/OpcionCorr>/);
        if (corrMatch) {
            options.push({
                id: `q${i}-opt-corr`,
                text: corrMatch[1].trim(),
                isCorrect: true
            });
        }

        // Find Incorrect Options (OpcionInco1, OpcionInco2, etc.)
        // We can use a global regex to find all OpcionInco tags
        const incoRegex = /<OpcionInco\d+>(.*?)<\/OpcionInco\d+>/g;
        let match;
        let incoCount = 0;
        while ((match = incoRegex.exec(part)) !== null) {
            incoCount++;
            options.push({
                id: `q${i}-opt-inco-${incoCount}`,
                text: match[1].trim(),
                isCorrect: false
            });
        }

        if (options.length > 0) {
            questions.push({
                id: `q${i}`,
                text: questionText,
                options: options
            });
        }
    }

    return {
        title,
        subtitle,
        questions
    };
}

export function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export function randomizeExam(exam: ExamData, maxQuestions?: number): ExamData {
    // 1. Shuffle questions
    let shuffledQuestions = shuffleArray(exam.questions);

    // 2. Limit number of questions if needed
    if (maxQuestions && maxQuestions > 0 && maxQuestions < shuffledQuestions.length) {
        shuffledQuestions = shuffledQuestions.slice(0, maxQuestions);
    }

    // 3. Shuffle options for each question
    shuffledQuestions = shuffledQuestions.map(q => ({
        ...q,
        options: shuffleArray(q.options)
    }));

    return {
        ...exam,
        questions: shuffledQuestions
    };
}
