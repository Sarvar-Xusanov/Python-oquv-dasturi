import type {
  Difficulty,
  Lesson,
  LessonCodeTraceStep,
  LessonCommonMistake,
  LessonExample,
  LessonHomework,
  LessonPracticeTask,
  LessonQuizQuestion,
  LessonReviewCheckpoint,
  LocalizedText,
} from '../../types/domain';

export function loc(uz: string, en: string): LocalizedText {
  return { uz, en };
}

export function ex(
  titleUz: string,
  titleEn: string,
  code: string,
  expectedOutput: string,
  expUz: string,
  expEn: string,
  stageUz?: string,
  stageEn?: string,
): LessonExample {
  return {
    title: { uz: titleUz, en: titleEn },
    stageLabel: stageUz && stageEn ? { uz: stageUz, en: stageEn } : undefined,
    code: code.trim(),
    expectedOutput: expectedOutput.trim(),
    explanation: { uz: expUz, en: expEn },
  };
}

export function traceStep(
  step: number,
  line: string,
  state: string,
  noteUz: string,
  noteEn: string,
  output?: string,
): LessonCodeTraceStep {
  return {
    step,
    line,
    state,
    output,
    note: { uz: noteUz, en: noteEn },
  };
}

export function mistake(
  titleUz: string,
  titleEn: string,
  wrongCode: string,
  errorSymptom: string,
  fixedCode: string,
  causeUz: string,
  causeEn: string,
  tipUz: string,
  tipEn: string,
): LessonCommonMistake {
  return {
    title: { uz: titleUz, en: titleEn },
    wrongCode: wrongCode.trim(),
    errorSymptom,
    fixedCode: fixedCode.trim(),
    rootCause: { uz: causeUz, en: causeEn },
    preventionTip: { uz: tipUz, en: tipEn },
  };
}

export function pt(
  id: string,
  titleUz: string,
  titleEn: string,
  promptUz: string,
  promptEn: string,
  starterCode: string,
  expectedOutput: string,
  hintUz: string,
  hintEn: string,
): LessonPracticeTask {
  return {
    id,
    title: { uz: titleUz, en: titleEn },
    prompt: { uz: promptUz, en: promptEn },
    starterCode: starterCode.trim(),
    expectedOutput: expectedOutput.trim(),
    hint: { uz: hintUz, en: hintEn },
  };
}

export function q(
  id: string,
  qUz: string,
  qEn: string,
  optsUz: string[],
  optsEn: string[],
  correctIndex: number,
  expUz: string,
  expEn: string,
): LessonQuizQuestion {
  return {
    id,
    question: { uz: qUz, en: qEn },
    options: { uz: optsUz, en: optsEn },
    correctIndex,
    explanation: { uz: expUz, en: expEn },
  };
}

export function hw(
  titleUz: string,
  titleEn: string,
  taskUz: string,
  taskEn: string,
  reqUz: string[],
  reqEn: string[],
  hintUz: string,
  hintEn: string,
  extUz: string,
  extEn: string,
  estimatedMinutes = 25,
): LessonHomework {
  return {
    title: { uz: titleUz, en: titleEn },
    task: { uz: taskUz, en: taskEn },
    requirements: { uz: reqUz, en: reqEn },
    hint: { uz: hintUz, en: hintEn },
    extensionChallenge: { uz: extUz, en: extEn },
    estimatedMinutes,
  };
}

export function review(
  checkpointNumber: number,
  titleUz: string,
  titleEn: string,
  summaryUz: string,
  summaryEn: string,
  delivUz: string[],
  delivEn: string[],
  starterCode: string,
): LessonReviewCheckpoint {
  return {
    checkpointNumber,
    title: { uz: titleUz, en: titleEn },
    summary: { uz: summaryUz, en: summaryEn },
    deliverables: { uz: delivUz, en: delivEn },
    starterCode: starterCode.trim(),
  };
}

export interface MakeLessonInput {
  id: string;
  courseId: string;
  moduleId: string;
  order: number;
  titleUz: string;
  titleEn: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  prerequisites: string[];
  conceptId: string;
  whyUz: string;
  whyEn: string;
  analogyUz: string;
  analogyEn: string;
  stopsUz: string;
  stopsEn: string;
  objUz: string[];
  objEn: string[];
  theoryUz: string;
  theoryEn: string;
  examples: LessonExample[];
  traceTitleUz: string;
  traceTitleEn: string;
  traceCode: string;
  traceSteps: LessonCodeTraceStep[];
  commonMistakes: LessonCommonMistake[];
  compareTitleUz: string;
  compareTitleEn: string;
  compareUz: string[];
  compareEn: string[];
  compareSummaryUz: string;
  compareSummaryEn: string;
  practiceTasks: LessonPracticeTask[];
  quiz: LessonQuizQuestion[];
  homework: LessonHomework;
  reviewCheckpoint?: LessonReviewCheckpoint;
  relatedVideos?: string[];
  relatedExercises?: string[];
}

export function makeLesson(input: MakeLessonInput): Lesson {
  const theoryMin = Math.max(10, Math.round(input.estimatedMinutes * 0.35));
  const examplesMin = Math.max(8, Math.round(input.estimatedMinutes * 0.25));
  const practiceMin = Math.max(10, Math.round(input.estimatedMinutes * 0.28));
  const reviewMin = Math.max(4, input.estimatedMinutes - theoryMin - examplesMin - practiceMin);

  return {
    id: input.id,
    courseId: input.courseId,
    moduleId: input.moduleId,
    order: input.order,
    title: { uz: input.titleUz, en: input.titleEn },
    difficulty: input.difficulty,
    estimatedMinutes: input.estimatedMinutes,
    contentVersion: '2.0',
    contentStatus: 'published',
    timeBreakdown: {
      explanation: theoryMin,
      examples: examplesMin,
      practice: practiceMin,
      review: reviewMin,
    },
    prerequisites: input.prerequisites,
    conceptId: input.conceptId,
    whyItMatters: { uz: input.whyUz, en: input.whyEn },
    mentalModel: {
      analogy: { uz: input.analogyUz, en: input.analogyEn },
      whereItStops: { uz: input.stopsUz, en: input.stopsEn },
    },
    objectives: { uz: input.objUz, en: input.objEn },
    theory: { uz: input.theoryUz.trim(), en: input.theoryEn.trim() },
    examples: input.examples,
    codeTrace: {
      title: { uz: input.traceTitleUz, en: input.traceTitleEn },
      code: input.traceCode.trim(),
      steps: input.traceSteps,
    },
    commonMistakes: input.commonMistakes,
    compareAndChoose: {
      title: { uz: input.compareTitleUz, en: input.compareTitleEn },
      criteria: { uz: input.compareUz, en: input.compareEn },
      summary: { uz: input.compareSummaryUz, en: input.compareSummaryEn },
    },
    practiceTasks: input.practiceTasks,
    quiz: input.quiz,
    homework: input.homework,
    reviewCheckpoint: input.reviewCheckpoint,
    completionCriteria: {
      uz: [
        'Nazariy bo‘limlar va xotira/arxitektura diagrammasini o‘rganish',
        `${input.examples.length} ta kod misolini sandbox da ishga tushirish`,
        `${input.practiceTasks.length} ta amaliy mashqni yechish`,
        `${input.quiz.length} ta test savolidan kamida 70% ball olish`,
      ],
      en: [
        'Study all theory subsections and architecture diagrams',
        `Execute all ${input.examples.length} runnable code examples`,
        `Complete all ${input.practiceTasks.length} interactive practice tasks`,
        `Score at least 70% on the ${input.quiz.length}-question lesson quiz`,
      ],
    },
    relatedVideos: input.relatedVideos ?? ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
    relatedExercises: input.relatedExercises ?? [],
  };
}
