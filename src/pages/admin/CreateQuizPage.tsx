
import QuizForm from "@/components/admin/QuizForm";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const CreateQuizPage = () => {
  return (
    <div className="bg-background text-foreground flex-grow flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <Link to="/quiz" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="h-4 w-4" />
            Back to Quizzes
          </Link>
          <h1 className="text-4xl font-bold mb-2">Create New Quiz</h1>
          <p className="text-muted-foreground mb-8">Fill out the form below to create a new daily quiz.</p>
          <QuizForm />
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
