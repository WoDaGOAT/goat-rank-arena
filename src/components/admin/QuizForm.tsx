
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const answerSchema = z.object({
  answer_text: z.string().min(1, "Answer text cannot be empty."),
});

const questionSchema = z.object({
  question_text: z.string().min(1, "Question text cannot be empty."),
  answers: z.array(answerSchema).min(2, "Must have at least two answers."),
  correct_answer_index: z.coerce.number().min(0, "A correct answer must be selected."),
});

const quizFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  topic: z.string().optional(),
  active_date: z.date({ required_error: "An active date is required." }),
  questions: z.array(questionSchema).min(1, "Must have at least one question."),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

const QuizForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: "",
      topic: "",
      questions: [],
    },
  });

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
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

      const { data, error } = await supabase.rpc('create_quiz', {
        p_title: values.title,
        p_topic: values.topic || null,
        p_active_date: format(values.active_date, 'yyyy-MM-dd'),
        p_questions: formattedQuestions,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Quiz created successfully!");
      queryClient.invalidateQueries({ queryKey: ['todaysQuiz'] }); // Invalidate any quiz queries
      navigate("/quiz");
    },
    onError: (error) => {
      toast.error("Failed to create quiz.", { description: error.message });
    },
  });

  function onSubmit(data: QuizFormValues) {
    createQuizMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Premier League Trivia" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl><Input placeholder="e.g., Football" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Active Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {questionFields.map((questionItem, qIndex) => (
          <Card key={questionItem.id} className="bg-white/5 border-white/10 relative">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Question {qIndex + 1}</CardTitle>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeQuestion(qIndex)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name={`questions.${qIndex}.question_text`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl><Input placeholder="What is the question?" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AnswerFields form={form} qIndex={qIndex} />
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="outline" onClick={() => appendQuestion({ question_text: "", answers: [{ answer_text: "" }, { answer_text: "" }], correct_answer_index: -1 })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Question
        </Button>

        <Button type="submit" disabled={createQuizMutation.isPending}>
          {createQuizMutation.isPending ? "Creating..." : "Create Quiz"}
        </Button>
      </form>
    </Form>
  );
};

const AnswerFields = ({ form, qIndex }: { form: any, qIndex: number }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `questions.${qIndex}.answers`,
  });

  return (
    <div className="space-y-4 pl-4 border-l-2 border-white/20">
      <FormField
        control={form.control}
        name={`questions.${qIndex}.correct_answer_index`}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Answers (select the correct one)</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
                className="space-y-2"
              >
                {fields.map((answerItem, aIndex) => (
                  <FormItem key={answerItem.id} className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={String(aIndex)} />
                    </FormControl>
                    <FormField
                      control={form.control}
                      name={`questions.${qIndex}.answers.${aIndex}.answer_text`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl><Input placeholder={`Answer ${aIndex + 1}`} {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="button" size="icon" variant="ghost" onClick={() => remove(aIndex)} className="shrink-0 text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" size="sm" variant="ghost" onClick={() => append({ answer_text: "" })}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Answer
      </Button>
    </div>
  );
};

export default QuizForm;
