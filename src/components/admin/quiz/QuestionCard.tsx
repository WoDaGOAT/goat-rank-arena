
import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, HelpCircle, CheckCircle2 } from "lucide-react";
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

  const questionText = form.watch(`questions.${questionIndex}.question_text`);
  const isCompleted = questionText && questionText.trim().length > 0;

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-md border border-white/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
      
      <CardHeader className="border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : questionIndex + 1}
            </div>
            Question {questionIndex + 1} of 5
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full font-medium">
              1 point
            </div>
            {isCompleted && (
              <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                ✓ Complete
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        <FormField
          control={form.control}
          name={`questions.${questionIndex}.question_text`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blue-500" />
                Question Text
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="What is the question?" 
                  {...field} 
                  className="bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4 pl-6 border-l-2 border-blue-100">
          <FormField
            control={form.control}
            name={`questions.${questionIndex}.correct_answer_index`}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-gray-700 font-medium">
                  Answer Options (select the correct one)
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString() || "0"}
                    className="space-y-3"
                  >
                    {answerFields.map((answerItem, answerIndex) => (
                      <FormItem key={answerItem.id} className="flex items-center space-x-3 space-y-0 p-3 rounded-lg bg-gray-50/80 border border-gray-100">
                        <FormControl>
                          <RadioGroupItem 
                            value={answerIndex.toString()} 
                            className="text-blue-600"
                          />
                        </FormControl>
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.answers.${answerIndex}.answer_text`}
                          render={({ field }) => (
                            <FormItem className="flex-grow">
                              <FormControl>
                                <Input 
                                  placeholder={`Answer ${answerIndex + 1}`} 
                                  {...field} 
                                  className="bg-white/80 border-gray-200 focus:border-blue-400"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {answerFields.length > 2 && (
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => remove(answerIndex)} 
                            className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
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
          
          {answerFields.length < 6 && (
            <Button 
              type="button" 
              size="sm" 
              variant="ghost" 
              onClick={() => append({ answer_text: "" })}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> 
              Add Answer Option
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
