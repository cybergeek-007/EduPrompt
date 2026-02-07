import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { fetchSubtopicContentApi, toggleSubtopicCompleteApi } from "@/api/api";

const CACHE_KEY_PREFIX = "subtopic_content_v1_";

const SubtopicDetail = () => {
  const { topicId, subId } = useParams();
  const [subtopicData, setSubtopicData] = useState<any>(null);
  const [completed, setCompleted] = useState<boolean>(false);
  const [busy, setBusy] = useState(false); // prevents rapid repeated toggles
  const navigate = useNavigate();

  useEffect(() => {
    if (!subId) return;
    let mounted = true;

    // Try sessionStorage cache first (fast)
    try {
      const cached = sessionStorage.getItem(CACHE_KEY_PREFIX + subId);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (mounted) {
          setSubtopicData(parsed);
          setCompleted(!!parsed.completed);
        }
        // Still try to refresh in background (stale-while-revalidate)
        (async () => {
          try {
            const fresh = await fetchSubtopicContentApi(subId);
            // Only update if different (simple string compare)
            if (mounted && JSON.stringify(fresh) !== JSON.stringify(parsed)) {
              setSubtopicData(fresh);
              setCompleted(!!fresh.completed);
              sessionStorage.setItem(
                CACHE_KEY_PREFIX + subId,
                JSON.stringify(fresh)
              );
            }
          } catch {
            /* ignore background refresh errors */
          }
        })();
        return () => {
          mounted = false;
        };
      }
    } catch {
      // If sessionStorage blows up (private mode), continue to network fetch
    }

    (async () => {
      try {
        const res = await fetchSubtopicContentApi(subId);
        if (!mounted) return;
        setSubtopicData(res);
        setCompleted(!!res.completed);
        try {
          sessionStorage.setItem(CACHE_KEY_PREFIX + subId, JSON.stringify(res));
        } catch {
          // ignore storage errors
        }
      } catch (error) {
        console.error("Error fetching subtopic content:", error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [subId]);

  const handleMarkComplete = useCallback(async () => {
    if (!subId || busy) return;
    setBusy(true);

    // optimistic UI update
    setCompleted((prev) => !prev);

    // Update cached object immediately (if exists)
    try {
      const key = CACHE_KEY_PREFIX + subId;
      const cached = sessionStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.completed = !completed;
        try {
          sessionStorage.setItem(key, JSON.stringify(parsed));
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }

    // Fire API but don't block UI for long — handle errors silently and revert if needed
    try {
      await toggleSubtopicCompleteApi(subId, !completed);
    } catch (err) {
      console.error("Error toggling completion:", err);
      // revert optimistic change on error
      setCompleted((prev) => !prev);
    } finally {
      setBusy(false);
    }
  }, [subId, completed, busy]);

  const contentParagraph = useMemo(
    () => subtopicData?.text || "No content available for this subtopic.",
    [subtopicData]
  );

  if (!subtopicData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground mb-4">No content found for this subtopic.</p>
          <Link to={`/topic/${topicId}`}>
            <Button variant="outline">Back to Study Plan</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link
          to={`/topic/${topicId}`}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Study Plan
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-soft-lg border border-border">
            <div className="mb-6">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm font-semibold mb-4">
                #
              </span>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {subtopicData?.name || "Subtopic"}
              </h1>
            </div>

            <div className="prose prose-blue max-w-none mb-8">
              <p className="text-lg text-foreground leading-relaxed whitespace-pre-line">
                {contentParagraph}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleMarkComplete}
                disabled={busy}
                className={completed ? "bg-gradient-success" : "bg-gradient-primary"}
              >
                <Check className="w-4 h-4 mr-2" />
                {completed ? "Completed" : "Mark as Complete"}
              </Button>

              <Button variant="outline" onClick={() => navigate(`/topic/${topicId}`)}>
                Back to Study Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtopicDetail;
