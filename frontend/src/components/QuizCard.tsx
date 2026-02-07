import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface QuizCardProps {
  question: string;
  options: string[];
  selectedAnswer: string;
  onAnswerChange: (value: string) => void;
  questionNumber: number;
  showCorrect?: boolean;
  correctAnswer?: string;
}

const QuizCard = ({ 
  question, 
  options, 
  selectedAnswer, 
  onAnswerChange, 
  questionNumber,
  showCorrect,
  correctAnswer 
}: QuizCardProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-soft-md border border-border">
      <div className="mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold mb-3">
          {questionNumber}
        </span>
        <h3 className="text-lg font-semibold text-foreground">{question}</h3>
      </div>
      
      <RadioGroup value={selectedAnswer} onValueChange={onAnswerChange}>
        <div className="space-y-3">
          {options.map((option, index) => {
            const isCorrect = showCorrect && option === correctAnswer;
            const isWrong = showCorrect && option === selectedAnswer && option !== correctAnswer;
            
            return (
              <div 
                key={index} 
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                  isCorrect 
                    ? "border-success bg-success/5" 
                    : isWrong 
                    ? "border-destructive bg-destructive/5"
                    : selectedAnswer === option
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <RadioGroupItem value={option} id={`q${questionNumber}-opt${index}`} />
                <Label 
                  htmlFor={`q${questionNumber}-opt${index}`} 
                  className="flex-1 cursor-pointer font-medium"
                >
                  {option}
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
};

export default QuizCard;
