
"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, CheckCircle } from "lucide-react";

import { QuizDetailsSection } from "./quiz/QuizDetailsSection";
import { PublicationSettingsSection } from "./quiz/PublicationSettingsSection";
import { QuestionCard } from "./quiz/QuestionCard";
import { quizFormSchema, QuizFormValues, getDefaultQuizFormValues } from "@/types/quiz-form";

const QuizForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: getDefaultQuizFormValues(),
  });

  const { fields: questionFields } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const createQuizMutation = useMutation({
    mutationFn: async (values: QuizFormValues) => {
      const formattedQuestions = values.questions.map((q, qIndex) => ({
        question_text: q.question_text,
        order: qIndex + 1,
        answers: q.answers.map((a, aIndex) => ({
          answer_text: a.answer_text,
          is_correct: q.correct_answer_index === aIndex,
        })),
      }));

      // Create publication datetime by combining date and time
      const [hours, minutes] = values.publication_time.split(':').map(Number);
      const publicationDateTime = new Date(values.active_date);
      publicationDateTime.setHours(hours, minutes, 0, 0);

      const { data, error } = await supabase.rpc('create_quiz', {
        p_title: values.title,
        p_topic: values.topic || null,
        p_active_date: format(values.active_date, 'yyyy-MM-dd'),
        p_questions: formattedQuestions,
        p_publication_datetime: publicationDateTime.toISOString(),
        p_status: values.status,
        p_timezone: values.timezone,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      const statusMessage = variables.status === 'published' ? 'published' : 
                           variables.status === 'scheduled' ? 'scheduled' : 'saved as draft';
      toast.success(`5-question daily quiz ${statusMessage} successfully!`);
      queryClient.invalidateQueries({ queryKey: ['todaysQuiz'] });
      navigate("/quiz");
    },
    onError: (error) => {
      toast.error("Failed to create quiz.", { description: error.message });
    },
  });

  function onSubmit(data: QuizFormValues) {
    createQuizMutation.mutate(data);
  }

  const completedQuestions = questionFields.filter((_, index) => 
    form.watch(`questions.${index}.question_text`)
  ).length;

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Alert className="bg-blue-50 border-blue-200 shadow-sm">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Daily Quiz Format:</strong> All daily quizzes must have exactly 5 questions. Each question awards 1 point for a maximum score of 5 points per quiz.
            </AlertDescription>
          </Alert>

          <QuizDetailsSection form={form} />
          <PublicationSettingsSection form={form} />

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                Questions (5 Required)
                {completedQuestions === 5 && <CheckCircle className="h-5 w-5 text-green-500" />}
              </h3>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Progress: {completedQuestions}/5
                </div>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300" 
                    style={{ width: `${(completedQuestions / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            {questionFields.map((questionItem, qIndex) => (
              <QuestionCard
                key={questionItem.id}
                form={form}
                questionIndex={qIndex}
              />
            ))}
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <div className="font-medium">Quiz Summary</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Total Questions: 5 • Maximum Score: 5 points
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={createQuizMutation.isPending || completedQuestions < 5} 
                size="lg"
                className="min-w-[200px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg disabled:opacity-50"
              >
                {createQuizMutation.isPending ? "Creating Quiz..." : 
                 form.watch("status") === "published" ? "Publish Quiz Now" :
                 form.watch("status") === "scheduled" ? "Schedule Quiz" :
                 "Save as Draft"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuizForm;
