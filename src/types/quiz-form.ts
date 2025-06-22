
import { z } from "zod";

const answerSchema = z.object({
  answer_text: z.string().min(1, "Answer text cannot be empty."),
});

const questionSchema = z.object({
  question_text: z.string().min(1, "Question text cannot be empty."),
  answers: z.array(answerSchema).min(2, "Must have at least two answers."),
  correct_answer_index: z.number().min(0, "A correct answer must be selected."),
});

export const quizFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  topic: z.string().optional(),
  active_date: z.date({ required_error: "An active date is required." }),
  status: z.enum(['draft', 'scheduled', 'published'], { required_error: "Please select a status." }),
  timezone: z.string().default("UTC"),
  publication_time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  questions: z.array(questionSchema).length(5, "Daily quizzes must have exactly 5 questions."),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;

export const getDefaultQuizFormValues = (): QuizFormValues => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return {
    title: "",
    topic: "",
    active_date: tomorrow,
    status: "draft",
    timezone: "UTC",
    publication_time: "09:00",
    questions: Array(5).fill(null).map(() => ({
      question_text: "",
      answers: [{ answer_text: "" }, { answer_text: "" }],
      correct_answer_index: 0,
    })),
  };
};
