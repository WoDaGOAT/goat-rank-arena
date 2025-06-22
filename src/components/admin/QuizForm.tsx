
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
import { Info } from "lucide-react";

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Daily Quiz Format:</strong> All daily quizzes must have exactly 5 questions. Each question awards 1 point for a maximum score of 5 points per quiz.
          </AlertDescription>
        </Alert>

        <QuizDetailsSection form={form} />
        <PublicationSettingsSection form={form} />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Questions (5 Required)</h3>
            <div className="text-sm text-muted-foreground">
              Progress: {completedQuestions}/5
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

        <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
          <div className="text-sm text-muted-foreground">
            Total Questions: 5 • Maximum Score: 5 points
          </div>
          <Button type="submit" disabled={createQuizMutation.isPending} size="lg">
            {createQuizMutation.isPending ? "Creating Quiz..." : 
             form.watch("status") === "published" ? "Publish Quiz Now" :
             form.watch("status") === "scheduled" ? "Schedule Quiz" :
             "Save as Draft"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuizForm;
