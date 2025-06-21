
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
import { CalendarIcon, PlusCircle, Trash2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  questions: z.array(questionSchema).length(5, "Daily quizzes must have exactly 5 questions."),
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
      questions: Array(5).fill(null).map((_, index) => ({
        question_text: "",
        answers: [{ answer_text: "" }, { answer_text: "" }],
        correct_answer_index: -1,
      })),
    },
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
      toast.success("5-question daily quiz created successfully!");
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Daily Quiz Format:</strong> All daily quizzes must have exactly 5 questions. Each question awards 1 point for a maximum score of 5 points per quiz.
          </AlertDescription>
        </Alert>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
            <CardDescription>Create a new 5-question daily quiz for WoDaGOAT users</CardDescription>
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

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Questions (5 Required)</h3>
            <div className="text-sm text-muted-foreground">
              Progress: {questionFields.filter((_, index) => form.watch(`questions.${index}.question_text`)).length}/5
            </div>
          </div>
          
          {questionFields.map((questionItem, qIndex) => (
            <Card key={questionItem.id} className="bg-white/5 border-white/10 relative">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Question {qIndex + 1} of 5</CardTitle>
                  <div className="text-xs text-muted-foreground">1 point</div>
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
        </div>

        <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
          <div className="text-sm text-muted-foreground">
            Total Questions: 5 • Maximum Score: 5 points
          </div>
          <Button type="submit" disabled={createQuizMutation.isPending} size="lg">
            {createQuizMutation.isPending ? "Creating Quiz..." : "Create 5-Question Quiz"}
          </Button>
        </div>
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
                    {fields.length > 2 && (
                      <Button type="button" size="icon" variant="ghost" onClick={() => remove(aIndex)} className="shrink-0 text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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
