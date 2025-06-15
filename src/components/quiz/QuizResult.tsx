
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface QuizResultProps {
  score: number;
  totalQuestions: number;
}

const QuizResult = ({ score, totalQuestions }: QuizResultProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800/60 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold text-primary">Quiz Complete!</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-lg mb-2">You scored:</p>
        <p className="text-5xl font-bold mb-4">{score} / {totalQuestions}</p>
        <p className="text-2xl font-semibold text-primary mb-6">{percentage}%</p>
        <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" />
                <span>{score} Correct</span>
            </div>
             <div className="flex items-center gap-2">
                <XCircle className="text-red-500" />
                <span>{totalQuestions - score} Incorrect</span>
            </div>
        </div>
        <Link to="/">
            <Button>Back to Home</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default QuizResult;
