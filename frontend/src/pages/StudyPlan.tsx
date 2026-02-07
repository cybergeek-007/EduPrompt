import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SubTopicCard from "@/components/SubTopicCard";
import ProgressBar from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Brain, ArrowLeft } from "lucide-react";
import {
  fetchSubtopicsApi,
  fetchTopicsApi,
  toggleSubtopicCompleteApi,
} from "@/api/api";

const StudyPlan = () => {
  const { id } = useParams();

  // State
  const [topic, setTopic] = useState<any>(null);
  const [subtopics, setSubtopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------------
     FAST FETCH: PARALLEL CALLS + NO DOUBLE STATE UPDATES
  ------------------------------------------------------------- */
  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const load = async () => {
      try {
        // Fetch topics + subtopics in parallel (WAY FASTER)
        const [topicsRes, subsRes] = await Promise.all([
          fetchTopicsApi(),
          fetchSubtopicsApi(id),
        ]);

        if (!isMounted) return;

        const found = topicsRes.find((t: any) => t._id === id) || null;
        setTopic(found);

        // Clean data
        const fixedSubs = (subsRes || []).map((s: any) => ({
          ...s,
          name: s.name || "Untitled Subtopic",
          completed: !!s.completed,
        }));

        setSubtopics(fixedSubs);
      } catch (err) {
        console.error("Error fetching study plan:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  /* -------------------------------------------------------------
     OPTIMIZED TOGGLE (NO FULL RE-RENDER)
  ------------------------------------------------------------- */
  const handleToggleDay = useCallback(
    async (subtopicId: string) => {
      setSubtopics((prev) =>
        prev.map((sub) =>
          sub._id === subtopicId
            ? { ...sub, completed: !sub.completed }
            : sub
        )
      );

      const sub = subtopics.find((s) => s._id === subtopicId);
      toggleSubtopicCompleteApi(subtopicId, !sub?.completed);
    },
    [subtopics]
  );

  /* -------------------------------------------------------------
     MEMOIZED CALCULATIONS (PREVENTS EXTRA RENDERING)
  ------------------------------------------------------------- */
  const completedCount = useMemo(
    () => subtopics.filter((s) => s.completed).length,
    [subtopics]
  );

  const progress = useMemo(
    () => (subtopics.length > 0 ? (completedCount / subtopics.length) * 100 : 0),
    [completedCount, subtopics.length]
  );

  const allCompleted = useMemo(
    () => subtopics.length > 0 && completedCount === subtopics.length,
    [completedCount, subtopics.length]
  );

  /* -------------------------------------------------------------
     UI
  ------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Loading your study plan...</p>
      </div>
    );
  }

  if (!topic || subtopics.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center">
        <Navbar />
        <h1 className="text-2xl font-semibold mb-4">No Study Plan Found</h1>
        <p className="text-muted-foreground mb-6">
          It looks like your learning plan hasn’t been created yet.
        </p>
        <Link to="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

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

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-soft-lg border border-border mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {topic?.name || "Learning Plan"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {subtopics.length}-Day Structured Learning Path
            </p>

            <ProgressBar value={progress} />

            {allCompleted && (
              <div className="mt-6 p-4 bg-gradient-success rounded-lg">
                <p className="text-success-foreground font-semibold mb-2">
                  🎉 Congratulations! You've completed all lessons!
                </p>
                <Link to={`/quiz/${id}`}>
                  <Button className="bg-white text-success hover:bg-white/90">
                    <Brain className="w-4 h-4 mr-2" />
                    Take the Final Quiz
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {subtopics.map((sub) => (
              <SubTopicCard
                key={sub._id}
                topicId={id || ""}
                subId={sub._id}
                name={sub.name}
                completed={sub.completed}
                onToggle={() => handleToggleDay(sub._id)}
              />
            ))}
          </div>

          {!allCompleted && (
            <div className="mt-8 text-center p-6 bg-gradient-hero rounded-xl">
              <p className="text-muted-foreground">
                Complete all lessons to unlock the quiz and test your knowledge!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;
