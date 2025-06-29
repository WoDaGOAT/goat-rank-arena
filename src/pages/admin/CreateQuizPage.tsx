
import QuizForm from "@/components/admin/QuizForm";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const CreateQuizPage = () => {
  return (
    <div 
      className="min-h-screen text-foreground"
      style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/quiz" 
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-6 transition-colors duration-200 hover:bg-white/10 px-3 py-2 rounded-md"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Quizzes
          </Link>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 mb-8">
            <h1 className="text-4xl font-bold mb-3 text-white">Create New Quiz</h1>
            <p className="text-gray-300 text-lg">Design an engaging 5-question daily quiz for WoDaGOAT users</p>
          </div>
          
          <QuizForm />
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
