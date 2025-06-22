
import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { QuizFormValues } from "@/types/quiz-form";

interface QuestionCardProps {
  form: UseFormReturn<QuizFormValues>;
  questionIndex: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ form, questionIndex }) => {
  const { fields: answerFields, append, remove } = useFieldArray({
    control: form.control,
    name: `questions.${questionIndex}.answers`,
  });

  return (
    <Card className="bg-white/5 border-white/10 relative">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Question {questionIndex + 1} of 5</CardTitle>
          <div className="text-xs text-muted-foreground">1 point</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name={`questions.${questionIndex}.question_text`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Text</FormLabel>
              <FormControl><Input placeholder="What is the question?" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4 pl-4 border-l-2 border-white/20">
          <FormField
            control={form.control}
            name={`questions.${questionIndex}.correct_answer_index`}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Answers (select the correct one)</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString() || "0"}
                    className="space-y-2"
                  >
                    {answerFields.map((answerItem, answerIndex) => (
                      <FormItem key={answerItem.id} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={answerIndex.toString()} />
                        </FormControl>
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.answers.${answerIndex}.answer_text`}
                          render={({ field }) => (
                            <FormItem className="flex-grow">
                              <FormControl><Input placeholder={`Answer ${answerIndex + 1}`} {...field} /></FormControl>
                            </FormItem>
                          )}
                        />
                        {answerFields.length > 2 && (
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => remove(answerIndex)} 
                            className="shrink-0 text-red-400 hover:text-red-300"
                          >
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
          <Button 
            type="button" 
            size="sm" 
            variant="ghost" 
            onClick={() => append({ answer_text: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Answer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
