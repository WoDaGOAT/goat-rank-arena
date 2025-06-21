
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trophy, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface QuizResultProps {
  score: number;
  totalQuestions: number;
}

const QuizResult = ({ score, totalQuestions }: QuizResultProps) => {
  // Ensure we're working with the 5-question format
  const maxScore = 5;
  const actualScore = Math.min(score, maxScore);
  const percentage = Math.round((actualScore / maxScore) * 100);
  
  const getResultMessage = () => {
    if (actualScore === 5) return "Perfect Score! 🐐";
    if (actualScore >= 4) return "Excellent! 🏆";
    if (actualScore >= 3) return "Good Job! 👏";
    if (actualScore >= 2) return "Not Bad! 👍";
    return "Keep Practicing! 💪";
  };

  const getResultColor = () => {
    if (actualScore === 5) return "text-yellow-400";
    if (actualScore >= 4) return "text-green-400";
    if (actualScore >= 3) return "text-blue-400";
    if (actualScore >= 2) return "text-orange-400";
    return "text-gray-400";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800/60 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="text-3xl font-bold text-primary">Daily Quiz Complete!</span>
          </div>
          <p className={`text-xl font-semibold ${getResultColor()}`}>
            {getResultMessage()}
          </p>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="text-center space-y-6">
        {/* Score Display */}
        <div className="space-y-4">
          <div className="text-6xl font-bold text-primary mb-2">
            {actualScore} <span className="text-2xl text-gray-400">/ 5</span>
          </div>
          <div className="space-y-2">
            <Progress value={percentage} className="w-full h-3" />
            <p className="text-xl font-semibold text-primary">{percentage}%</p>
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${index < actualScore 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-600 text-gray-300'
                }`}>
                {index + 1}
              </div>
              <div className="text-xs text-gray-400">
                {index < actualScore ? '✓' : '✗'}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="flex justify-center gap-8 py-4 border-t border-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500 h-5 w-5" />
            <span className="font-semibold">{actualScore} Correct</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="text-red-500 h-5 w-5" />
            <span className="font-semibold">{maxScore - actualScore} Incorrect</span>
          </div>
        </div>

        {/* Encouragement Message */}
        <div className="bg-white/5 rounded-lg p-4">
          {actualScore === 5 ? (
            <p className="text-sm text-gray-300">
              🎉 Perfect score! You're a true sports GOAT! Come back tomorrow for another challenge.
            </p>
          ) : actualScore >= 3 ? (
            <p className="text-sm text-gray-300">
              Great work! You scored {actualScore} out of 5. Keep up the momentum with tomorrow's quiz!
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              Don't give up! Every quiz makes you stronger. Try again tomorrow to improve your streak!
            </p>
          )}
        </div>

        <Link to="/">
          <Button size="lg" className="mt-4">
            Back to Home
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default QuizResult;
