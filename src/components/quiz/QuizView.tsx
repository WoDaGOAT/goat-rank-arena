
import { useState } from "react";
import { Quiz, UserAnswerSelection } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface QuizViewProps {
  quiz: Quiz;
  onSubmit: (answers: UserAnswerSelection) => void;
}

const QuizView = ({ quiz, onSubmit }: QuizViewProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<UserAnswerSelection>({});
  const questions = quiz.quiz_questions.sort((a, b) => a.order - b.order);

  const handleAnswerChange = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = () => {
    onSubmit(selectedAnswers);
  };
  
  const allQuestionsAnswered = questions.length > 0 && questions.length === Object.keys(selectedAnswers).length;

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gray-800/60 border-gray-700 text-white">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">{quiz.title}</CardTitle>
        <CardDescription className="text-gray-300">{quiz.topic}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.id}>
            <p className="font-semibold text-lg mb-4">{index + 1}. {question.question_text}</p>
            <RadioGroup onValueChange={(value) => handleAnswerChange(question.id, value)}>
              <div className="space-y-2">
                {question.quiz_answers.map((answer) => (
                  <div key={answer.id} className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border border-gray-600 transition-all",
                    selectedAnswers[question.id] === answer.id && "bg-blue-500/20 border-blue-400"
                  )}>
                    <RadioGroupItem value={answer.id} id={answer.id} className="text-primary border-gray-500"/>
                    <Label htmlFor={answer.id} className="flex-1 cursor-pointer">{answer.answer_text}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleSubmit} disabled={!allQuestionsAnswered} size="lg">
          Submit Answers
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizView;
