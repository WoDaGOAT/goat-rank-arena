
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { sanitize } from "@/lib/sanitize";
import { Trophy, Target, Star } from "lucide-react";

export interface ProfileInfo {
  id?: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface QuizInfo {
  id: string;
  title: string;
  topic: string | null;
}

export interface QuizCompletedFeedData {
  user: ProfileInfo | null;
  quiz: QuizInfo | null;
  score: number;
  total_questions: number;
  completed_at: string;
}

interface QuizCompletedFeedItemProps {
  data: QuizCompletedFeedData;
  createdAt: string;
}

const QuizCompletedFeedItem = ({ data, createdAt }: QuizCompletedFeedItemProps) => {
  const { user, quiz, score, total_questions } = data;
  
  // Don't render if we don't have valid user data
  if (!user?.full_name || user.full_name.trim() === '' || !quiz?.title) {
    return null;
  }
  
  const userName = user.full_name;
  const userAvatar = user.avatar_url;
  const sanitizedUserName = sanitize(userName);
  const quizTitle = quiz.title;
  const accuracy = Math.round((score / total_questions) * 100);
  
  const getScoreColor = () => {
    if (accuracy === 100) return "text-yellow-400";
    if (accuracy >= 80) return "text-green-400";
    if (accuracy >= 60) return "text-blue-400";
    return "text-gray-400";
  };

  const getScoreIcon = () => {
    if (accuracy === 100) return Star;
    if (accuracy >= 80) return Trophy;
    return Target;
  };

  const ScoreIcon = getScoreIcon();

  return (
    <Card className="bg-white/5 text-white border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start gap-4 mb-3">
          {user.id ? (
            <Link to={`/users/${user.id}`}>
              <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src={userAvatar || undefined} alt={sanitizedUserName}/>
                <AvatarFallback>{sanitizedUserName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Avatar>
              <AvatarImage src={userAvatar || undefined} alt={sanitizedUserName}/>
              <AvatarFallback>{sanitizedUserName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            <p className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-blue-300" />
              {user.id ? (
                <Link to={`/users/${user.id}`} className="font-bold hover:underline hover:text-blue-300 transition-colors">
                  {sanitizedUserName}
                </Link>
              ) : (
                <span className="font-bold">{sanitizedUserName}</span>
              )}
              {' '} completed a quiz
            </p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Quiz details */}
        <div className="bg-white/10 rounded-lg p-4 ml-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-blue-300">{sanitize(quizTitle)}</h4>
            <div className="flex items-center gap-2">
              <ScoreIcon className={`w-4 h-4 ${getScoreColor()}`} />
              <span className={`font-bold ${getScoreColor()}`}>
                {score}/{total_questions}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`${getScoreColor()} border-current`}
            >
              {accuracy}% Accuracy
            </Badge>
            
            {accuracy === 100 && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/50">
                Perfect Score!
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCompletedFeedItem;
