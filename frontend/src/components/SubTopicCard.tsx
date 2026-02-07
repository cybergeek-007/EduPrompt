import { Link } from "react-router-dom";
import { ChevronRight, CheckCircle, Circle } from "lucide-react";
import { Button } from "./ui/button";

interface SubTopicCardProps {
  topicId: string;
  subId: string;
  name: string;
  completed: boolean;
  onToggle?: () => void;
}

const SubTopicCard = ({
  topicId,
  subId,
  name,
  completed,
  onToggle,
}: SubTopicCardProps) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-soft-sm border border-border hover:shadow-soft-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* ✅ Circle / Check icon instead of numeric ID */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              completed
                ? "bg-gradient-success text-white"
                : "bg-secondary text-secondary-foreground"
            }`}
            onClick={onToggle}
          >
            {completed ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
          </div>

          {/* ✅ Show only subtopic name */}
          <h3 className="text-base font-medium text-foreground">
            {name || "Untitled Subtopic"}
          </h3>
        </div>

        {/* ✅ View Button */}
        <Link to={`/topic/${topicId}/subtopic/${subId}`}>
          <Button variant="ghost" size="sm">
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SubTopicCard;
