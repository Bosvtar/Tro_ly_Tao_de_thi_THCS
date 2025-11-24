
export type QuestionFormat = 'mcq' | 'short' | 'essay';
export type CognitiveLevel = 'Biết' | 'Hiểu' | 'Vận dụng';
export type SubjectType = 'Toán' | 'Vật lí' | 'Hóa học';
export type GradeType = '6' | '7' | '8' | '9';

export interface GeneratedQuestion {
  id: string;
  type: QuestionFormat;
  chapter: string;
  lesson?: string;
  difficulty: CognitiveLevel;
  question: string;
  options?: string[]; // Only for 'mcq'
  answer: string;
  solution: string;
  points?: number;
  tags?: string[];
}

export interface DifficultyConfig {
  mode: 'fixed' | 'ratio';
  fixedLevel?: CognitiveLevel;
  ratio: {
    biet: number;    // Percentage 0-100
    hieu: number;    // Percentage 0-100
    vandung: number; // Percentage 0-100
  }
}

export interface SelectedTopic {
  chapterName: string;
  lessons: string[];
}

export interface ExamConfig {
  subject: SubjectType;
  grade: GradeType;
  mode: 'quick' | 'full';
  topics: SelectedTopic[]; // List of chapters and selected lessons
  difficultyConfig: DifficultyConfig;
  counts: {
    mcq: number;
    short: number;
    essay: number;
  };
}

export interface ExamData {
  id: string;
  subject: string;
  grade: string;
  title: string;
  questions: GeneratedQuestion[];
  createdAt: number;
}
