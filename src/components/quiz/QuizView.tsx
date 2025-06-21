
import { useState } from "react";
import { Quiz, UserAnswerSelection } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

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
  
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const allQuestionsAnswered = questions.length === 5 && answeredQuestions === 5;
  const progressPercentage = (answeredQuestions / 5) * 100;

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gray-800/60 border-gray-700 text-white">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">{quiz.title}</CardTitle>
        <CardDescription className="text-gray-300">{quiz.topic}</CardDescription>
        
        {/* Progress Section */}
        <div className="space-y-3 mt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="font-semibold text-primary">{answeredQuestions}/5 Questions</span>
          </div>
          <Progress value={progressPercentage} className="w-full h-2" />
          <div className="flex justify-center gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex items-center">
                {index < answeredQuestions ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {questions.map((question, index) => {
          const isAnswered = selectedAnswers[question.id];
          return (
            <div key={question.id} className={cn(
              "p-4 rounded-lg border transition-all",
              isAnswered ? "border-green-500/50 bg-green-500/10" : "border-gray-600"
            )}>
              <div className="flex items-start justify-between mb-4">
                <p className="font-semibold text-lg flex-1">
                  <span className="text-primary mr-2">{index + 1}.</span>
                  {question.question_text}
                </p>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">1 point</span>
                  {isAnswered && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                </div>
              </div>
              
              <RadioGroup 
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                value={selectedAnswers[question.id] || ""}
              >
                <div className="space-y-3">
                  {question.quiz_answers.map((answer) => (
                    <div key={answer.id} className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg border border-gray-600 transition-all hover:border-gray-500",
                      selectedAnswers[question.id] === answer.id && "bg-blue-500/20 border-blue-400"
                    )}>
                      <RadioGroupItem value={answer.id} id={answer.id} className="text-primary border-gray-500"/>
                      <Label htmlFor={answer.id} className="flex-1 cursor-pointer">{answer.answer_text}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          );
        })}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-gray-400">
          {!allQuestionsAnswered && (
            <p>Answer all 5 questions to submit your quiz</p>
          )}
          {allQuestionsAnswered && (
            <p className="text-green-400 font-semibold">Ready to submit! Maximum score: 5 points</p>
          )}
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={!allQuestionsAnswered} 
          size="lg"
          className="w-full"
        >
          {allQuestionsAnswered ? "Submit Quiz (5/5 Complete)" : `Continue (${answeredQuestions}/5)`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizView;
