import { GoogleGenAI } from '@google/genai';

export const ACTIVE_GEMINI_MODEL = 'gemini-4-hydrogen';

export type MentorMode =
  | 'teacher'
  | 'debugger'
  | 'reviewer'
  | 'practice_coach'
  | 'socratic'
  | 'project_mentor'
  | 'exam_evaluator';

export interface StudentContext {
  displayName: string;
  preferredLanguage: 'uz' | 'en';
  experienceLevel: string;
  completedLessonsCount: number;
  currentCourseTitle?: string;
  currentLessonTitle?: string;
  weakTopics: string[];
  activeCode?: string;
}

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const MODE_INSTRUCTIONS: Record<MentorMode, string> = {
  teacher:
    'Prompt v1.0 [Teacher]: Explain Python concepts clearly step-by-step with practical examples. Keep explanations approachable for beginners while maintaining technical accuracy.',
  debugger:
    'Prompt v1.0 [Debugger]: Diagnose errors, tracebacks, and logical bugs in student Python code. Explain WHY the bug happens, pinpoint the exact line, and guide the student to fix it.',
  reviewer:
    'Prompt v1.0 [Code Reviewer]: Evaluate Python code for readability, PEP 8 style, edge cases, time/space complexity, and Pythonic idioms.',
  practice_coach:
    'Prompt v1.0 [Practice Coach]: Give progressive hints before revealing full solutions. Encourage the student to try writing the next step themselves.',
  socratic:
    'Prompt v1.0 [Socratic Tutor]: Ask 1–2 focused guiding questions that help the student discover the answer independently instead of lecturing.',
  project_mentor:
    'Prompt v1.0 [Project Mentor]: Help structure software architecture, break projects into clean modules/functions, and review milestone readiness.',
  exam_evaluator:
    'Prompt v1.0 [Exam Evaluator]: Assess student answers objectively, identify conceptual gaps, and suggest specific lessons or exercises to review.',
};

export function buildMentorSystemInstruction(
  mode: MentorMode,
  ctx: StudentContext,
): string {
  const langRule =
    ctx.preferredLanguage === 'en'
      ? 'Respond in clear English, keeping Python terminology accurate and well-structured.'
      : "O'zbek tilida tushunarli, samimiy va aniq o'rgating. Dasturlash atamalarini (masalan: variable, function, loop, list, dictionary, class, decorator, exception, recursion) ingliz tilida saqlab, yonida o'zbekcha izoh bering.";

  return [
    'You are the Python Mastery AI Mentor.',
    MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS.teacher,
    langRule,
    'Core Pedagogical Rules:',
    '- Give hints before full solutions when the student is solving an exercise.',
    '- Explain code line by line when helpful.',
    '- Never invent Python behavior; distinguish verified facts from suggestions.',
    '- Never claim you executed code unless execution output was explicitly provided.',
    '- Use clean Markdown with ```python fenced code blocks.',
    'Current Student Learning Context (scoped to this user only):',
    `- Student: ${ctx.displayName}`,
    `- Experience level: ${ctx.experienceLevel}`,
    `- Completed lessons: ${ctx.completedLessonsCount}`,
    ctx.currentCourseTitle ? `- Current course: ${ctx.currentCourseTitle}` : '',
    ctx.currentLessonTitle ? `- Current lesson: ${ctx.currentLessonTitle}` : '',
    ctx.weakTopics.length > 0 ? `- Weak topics to reinforce: ${ctx.weakTopics.join(', ')}` : '',
    ctx.activeCode ? `- Student active editor code:\n\`\`\`python\n${ctx.activeCode.slice(0, 4000)}\n\`\`\`` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function streamMentorReply(params: {
  mode: MentorMode;
  context: StudentContext;
  history: Array<{ role: 'user' | 'model'; content: string }>;
  userMessage: string;
  onChunk: (text: string) => void;
  signal?: AbortSignal;
}): Promise<string> {
  const ai = getAiClient();
  const systemInstruction = buildMentorSystemInstruction(params.mode, params.context);

  const contents = [
    ...params.history.slice(-12).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    })),
    {
      role: 'user' as const,
      parts: [{ text: params.userMessage }],
    },
  ];

  const stream = await ai.models.generateContentStream({
    model: ACTIVE_GEMINI_MODEL,
    contents,
    config: {
      systemInstruction,
    },
  });

  let fullText = '';
  for await (const chunk of stream) {
    if (params.signal?.aborted) {
      break;
    }
    const delta = chunk.text ?? '';
    if (delta) {
      fullText += delta;
      params.onChunk(delta);
    }
  }
  return fullText;
}

export async function generateExerciseHint(params: {
  exerciseTitle: string;
  instructions: string;
  studentCode: string;
  language: 'uz' | 'en';
}): Promise<string> {
  const ai = getAiClient();
  const systemInstruction =
    params.language === 'en'
      ? 'You are a Python Practice Coach. Give a concise 2-3 sentence hint without writing the complete solution.'
      : "Siz Python amaliyot murabbiyisiz. To'liq yechimni bermasdan, faqat 2-3 jumlalik aniq yo'naltiruvchi maslahat (hint) bering. Texnik atamalarni inglizcha qoldiring.";

  const response = await ai.models.generateContent({
    model: ACTIVE_GEMINI_MODEL,
    contents: `Exercise: ${params.exerciseTitle}\nInstructions: ${params.instructions}\nStudent current code:\n\`\`\`python\n${params.studentCode.slice(0, 3000)}\n\`\`\``,
    config: {
      systemInstruction,
    },
  });

  return response.text ?? '';
}
