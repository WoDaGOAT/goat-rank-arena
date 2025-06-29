
import { BarChart3 } from "lucide-react";
import { format } from "date-fns";

interface RankingHeaderProps {
  title: string;
  createdAt: string;
}

const RankingHeader = ({ title, createdAt }: RankingHeaderProps) => {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl flex items-center gap-3">
        <BarChart3 className="h-10 w-10 text-blue-400" />
        {title}
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Created on {format(new Date(createdAt), "MMMM d, yyyy")}
      </p>
    </header>
  );
};

export default RankingHeader;
