export interface QuizAnswer {
  id: string;
  answer_text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id:string;
  question_text: string;
  order: number;
  quiz_answers: QuizAnswer[];
}

export interface Quiz {
  id: string;
  title: string;
  topic: string | null;
  active_date: string;
  quiz_questions: QuizQuestion[];
}

export interface UserQuizAttemptForProfile {
  id: string;
  score: number;
  completed_at: string;
  quizzes: {
    title: string;
    quiz_questions: { id: string }[];
  } | null;
}

export interface UserAnswerSelection {
  [questionId: string]: string; // { questionId: answerId }
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  completed_at: string;
  answers: UserAnswerSelection;
}
