export type Language = 'uz' | 'en';
export type ThemeMode = 'dark' | 'light';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LocalizedText {
  uz: string;
  en: string;
}

export interface UserSummary {
  id: number;
  username: string;
  displayName: string;
  role: string;
  hasPassword: boolean;
  preferredLanguage: Language;
  theme: ThemeMode;
  experienceLevel: string;
  dailyGoalMinutes: number;
  learningGoal: string;
  explanationStyle: string;
  onboardingCompleted: boolean;
  placementScore: number | null;
  avatarColor: string;
  editorFontSize: number;
  editorTabSize: number;
  completedLessons: number;
  lastActiveAt: string;
}

export interface LessonExample {
  title: LocalizedText;
  stageLabel?: LocalizedText;
  code: string;
  expectedOutput?: string;
  explanation: LocalizedText;
}

export interface LessonCodeTraceStep {
  step: number;
  line: string;
  state: string;
  output?: string;
  note: LocalizedText;
}

export interface LessonCommonMistake {
  title: LocalizedText;
  wrongCode: string;
  errorSymptom: string;
  rootCause: LocalizedText;
  fixedCode: string;
  preventionTip: LocalizedText;
}

export interface LessonCompareItem {
  title: LocalizedText;
  criteria: {
    uz: string[];
    en: string[];
  };
  summary: LocalizedText;
}

export interface LessonHomework {
  title: LocalizedText;
  task: LocalizedText;
  requirements: {
    uz: string[];
    en: string[];
  };
  hint: LocalizedText;
  extensionChallenge: LocalizedText;
  estimatedMinutes: number;
}

export interface LessonQuizQuestion {
  id: string;
  question: LocalizedText;
  options: {
    uz: string[];
    en: string[];
  };
  correctIndex: number;
  explanation: LocalizedText;
}

export interface LessonPracticeTask {
  id: string;
  title: LocalizedText;
  prompt: LocalizedText;
  starterCode: string;
  expectedOutput?: string;
  hint: LocalizedText;
}

export interface LessonReviewCheckpoint {
  checkpointNumber: number;
  title: LocalizedText;
  summary: LocalizedText;
  deliverables: {
    uz: string[];
    en: string[];
  };
  starterCode: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  order: number;
  title: LocalizedText;
  difficulty: Difficulty;
  estimatedMinutes: number;
  contentVersion?: string;
  contentStatus?: 'published' | 'reviewed' | 'draft';
  timeBreakdown?: {
    explanation: number;
    examples: number;
    practice: number;
    review: number;
  };
  prerequisites: string[];
  conceptId: string;
  whyItMatters?: LocalizedText;
  mentalModel?: {
    analogy: LocalizedText;
    whereItStops: LocalizedText;
  };
  objectives: {
    uz: string[];
    en: string[];
  };
  theory: LocalizedText;
  examples: LessonExample[];
  codeTrace?: {
    title: LocalizedText;
    code: string;
    steps: LessonCodeTraceStep[];
  };
  commonMistakes?: LessonCommonMistake[];
  compareAndChoose?: LessonCompareItem;
  practiceTasks?: LessonPracticeTask[];
  quiz: LessonQuizQuestion[];
  homework?: LessonHomework;
  reviewCheckpoint?: LessonReviewCheckpoint;
  completionCriteria?: {
    uz: string[];
    en: string[];
  };
  relatedVideos: string[];
  relatedExercises: string[];
}

export interface CourseModule {
  id: string;
  title: LocalizedText;
  order: number;
}

export interface Course {
  id: string;
  number: number;
  category: 'core' | 'engineering' | 'backend' | 'data_ai';
  title: LocalizedText;
  description: LocalizedText;
  difficulty: Difficulty;
  estimatedHours: number;
  prerequisites: string[];
  objectives: {
    uz: string[];
    en: string[];
  };
  modules: CourseModule[];
}

export interface ExerciseTestCase {
  id: string;
  label: string;
  callExpression: string;
  expectedOutput: string;
  expectedError?: string;
  isHidden?: boolean;
}

export type ExerciseSkillLevel =
  | 'recognition'
  | 'guided'
  | 'independent'
  | 'applied'
  | 'challenge';

export type MasteryStatus =
  | 'not_started'
  | 'learning'
  | 'practicing'
  | 'needs_review'
  | 'proficient'
  | 'mastered';

export interface Exercise {
  id: string;
  title: LocalizedText;
  courseId: string;
  topic: LocalizedText;
  difficulty: Difficulty;
  skillLevel?: ExerciseSkillLevel;
  estimatedMinutes: number;
  instructions: LocalizedText;
  constraints: {
    uz: string[];
    en: string[];
  };
  progressiveHints?: {
    conceptual: LocalizedText;
    structural: LocalizedText;
    nearSolution: LocalizedText;
  };
  sampleInput: string;
  sampleOutput: string;
  starterCode: string;
  testCases: ExerciseTestCase[];
}

export type ExamQuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'output_prediction'
  | 'debugging';

export interface ExamQuestion {
  id: string;
  type: ExamQuestionType;
  conceptId: string;
  prompt: LocalizedText;
  codeSnippet?: string;
  options: {
    uz: string[];
    en: string[];
  };
  correctIndex: number;
  explanation: LocalizedText;
}

export interface Examination {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  difficulty: Difficulty;
  durationMinutes: number;
  passingScore: number;
  relatedCourseId: string;
  questions: ExamQuestion[];
}

export interface ProjectMilestone {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
}

export interface LearningProject {
  id: string;
  title: LocalizedText;
  difficulty: Difficulty;
  estimatedHours: number;
  summary: LocalizedText;
  problemStatement: LocalizedText;
  requirements: {
    uz: string[];
    en: string[];
  };
  architectureTips: {
    uz: string[];
    en: string[];
  };
  evaluationCriteria: {
    uz: string[];
    en: string[];
  };
  milestones: ProjectMilestone[];
  starterCode: string;
}

export interface VideoResource {
  id: string;
  title: string;
  provider: 'YouTube' | 'Official Docs';
  channel: string;
  url: string;
  language: 'en' | 'uz';
  difficulty: Difficulty;
  topics: string[];
  relatedCourse: string;
  relatedLessons: string[];
  description: LocalizedText;
  verified: boolean;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  uzTranslation: string;
  category: string;
  definition: LocalizedText;
  example: string;
  relatedCourseId: string;
}

export interface AchievementDefinition {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  criteriaText: LocalizedText;
  iconName: string;
}

export type ScreenId =
  | 'dashboard'
  | 'learning_path'
  | 'courses'
  | 'lesson'
  | 'code_lab'
  | 'ai_mentor'
  | 'exercises'
  | 'examinations'
  | 'projects'
  | 'videos'
  | 'notes'
  | 'glossary'
  | 'analytics'
  | 'achievements'
  | 'settings';
