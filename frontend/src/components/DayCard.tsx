import { CheckCircle2, Circle } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

interface DayCardProps {
  day: number;
  title: string;
  explanation: string;
  completed: boolean;
  onToggle: () => void;
}

const DayCard = ({ day, title, explanation, completed, onToggle }: DayCardProps) => {
  return (
    <div className={`bg-card rounded-xl p-6 shadow-soft-sm border-2 transition-all ${
      completed 
        ? "border-success bg-gradient-to-br from-success/5 to-transparent" 
        : "border-border hover:border-primary/50"
    }`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 pt-1">
          {completed ? (
            <CheckCircle2 className="w-6 h-6 text-success" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {day}
            </span>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          
          <p className="text-muted-foreground leading-relaxed mb-4">{explanation}</p>
          
          <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox 
              checked={completed}
              onCheckedChange={onToggle}
              className="border-2"
            />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Mark as complete
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DayCard;
