import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import QuizCard from "@/components/QuizCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchTopicQuizApi, fetchTopicProgressApi } from "@/api/api";

const Quiz = () => {
  const { id } = useParams(); // id = topicId
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------------------------
     🛑 BLOCK QUIZ UNLESS PROGRESS = 100%
  ---------------------------------------------------- */
  useEffect(() => {
    const checkProgress = async () => {
      try {
        if (!id) return;

        const { progress } = await fetchTopicProgressApi(id);

        if (progress < 100) {
          toast({
            title: "Quiz Locked",
            description: "Complete all lessons to unlock the quiz.",
            variant: "destructive",
          });

          navigate(`/topic/${id}`); // redirect back to study plan
        }
      } catch (error) {
        console.error("Progress check error:", error);
      }
    };

    checkProgress();
  }, [id, navigate]);

  /* ----------------------------------------------------
     🟢 Fetch topic-level quiz
  ---------------------------------------------------- */
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        if (!id) return;

        const backendRes = await fetchTopicQuizApi(id);

        // Always stable structure
        const questions = Array.isArray(backendRes.quiz)
          ? backendRes.quiz
          : [];

        setQuiz({
          questions,
          topicName: backendRes.topicName || "Quiz",
        });

      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast({
          title: "Quiz Load Failed",
          description: "Could not load quiz. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleSubmit = () => {
    if (!quiz || !quiz.questions) return;

    const answeredAll = quiz.questions.every((_: any, i: number) => answers[i]);
    if (!answeredAll) {
      toast({
        title: "Incomplete quiz",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    let correctCount = 0;
    quiz.questions.forEach((q: any, i: number) => {
      if (answers[i] === q.answer) correctCount++;
    });

    setScore(correctCount);
    setSubmitted(true);

    toast({
      title: "Quiz Completed!",
      description: `You scored ${correctCount} out of ${quiz.questions.length}.`,
    });
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Loading quiz...</p>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">
            No quiz found for this topic.
          </p>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------
     UI BELOW REMAINS EXACTLY THE SAME
  ---------------------------------------------------- */
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-soft-lg border border-border mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {quiz.topicName}
            </h1>
            <p className="text-muted-foreground">
              Test your knowledge with {quiz.questions.length} questions
            </p>
          </div>

          {submitted && (
            <div className="bg-gradient-primary rounded-2xl p-8 mb-8 text-center">
              <Trophy className="w-16 h-16 text-white mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                Your Score: {score}/{quiz.questions.length}
              </h2>
              <p className="text-white/90 mb-6">
                {score === quiz.questions.length
                  ? "Perfect score! You've mastered this topic! 🎉"
                  : score >= quiz.questions.length * 0.7
                  ? "Great job! You have a good understanding! 👏"
                  : "Keep learning! Review the material and try again. 📚"}
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retry Quiz
                </Button>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    className="bg-white/10 text-white border-white hover:bg-white/20"
                  >
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {quiz.questions.map((q: any, i: number) => (
              <QuizCard
                key={i}
                question={q.question}
                options={q.options}
                selectedAnswer={answers[i] || ""}
                onAnswerChange={(a) => handleAnswerChange(i, a)}
                questionNumber={i + 1}
                showCorrect={submitted}
                correctAnswer={q.answer}
              />
            ))}
          </div>

          {!submitted && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="bg-gradient-primary hover:opacity-90 px-12"
              >
                Submit Quiz
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
