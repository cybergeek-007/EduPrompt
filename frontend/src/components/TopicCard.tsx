import { Link } from "react-router-dom";
import { BookOpen, Brain } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { Button } from "./ui/button";

interface TopicCardProps {
  topicId: string;
  title: string;
  progress: number; // 0–100
  totalDays: number;
  completedDays: number;
}

const TopicCard = ({ topicId, title, progress, totalDays, completedDays }: TopicCardProps) => {
  // Quiz allowed only when plan is 100% complete
  const quizLocked = progress < 100;

  return (
    <div className="glass-card rounded-2xl p-6 relative group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-foreground tracking-tight">{title}</h3>
            {progress === 100 && (
              <span className="bg-success/10 text-success text-xs px-2 py-0.5 rounded-full font-medium">
                Done
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            {progress}% completed
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="mb-6">
        <ProgressBar value={progress} className="h-2" />
      </div>

      <div className="flex gap-3">
        <Link to={`/topic/${topicId}`} className="flex-1">
          <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary">
            <BookOpen className="w-4 h-4 mr-2" />
            Plan
          </Button>
        </Link>

        {/* Quiz button disabled until 100% complete */}
        <Link
          to={quizLocked ? "#" : `/quiz/${topicId}`}
          className="flex-1"
        >
          <Button
            className={`w-full shadow-md ${quizLocked
                ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                : "bg-primary hover:bg-primary/90 text-white shadow-primary/25"
              }`}
            disabled={quizLocked}
          >
            <Brain className="w-4 h-4 mr-2" />
            Quiz
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TopicCard;
