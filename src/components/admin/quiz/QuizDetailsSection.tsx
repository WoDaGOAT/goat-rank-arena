
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { QuizFormValues } from "@/types/quiz-form";

interface QuizDetailsSectionProps {
  form: UseFormReturn<QuizFormValues>;
}

export const QuizDetailsSection: React.FC<QuizDetailsSectionProps> = ({ form }) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <FileText className="h-5 w-5 text-blue-600" />
          Quiz Details
        </CardTitle>
        <CardDescription className="text-gray-600">
          Create a new 5-question daily quiz for WoDaGOAT users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Quiz Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Premier League Trivia" 
                  {...field} 
                  className="bg-white/70 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Topic (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Football" 
                  {...field} 
                  className="bg-white/70 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="active_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-gray-700 font-medium">Active Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal bg-white/70 border-gray-200 hover:bg-white/90",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white shadow-xl border" align="start">
                  <Calendar 
                    mode="single" 
                    selected={field.value} 
                    onSelect={field.onChange} 
                    disabled={(date) => date < new Date()}
                    initialFocus 
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
