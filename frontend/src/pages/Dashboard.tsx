import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import TopicCard from "@/components/TopicCard";
import { Button } from "@/components/ui/button";
import { fetchTopicsApi } from "@/api/api";

const Dashboard = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch topics
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const res = await fetchTopicsApi();

        const cleanTopics = Array.isArray(res) ? res : res?.topics || [];

        // Calculate subtopics + progress
        const computed = cleanTopics.map((t: any) => {
          const subtopics = t.subtopics || [];

          const total = subtopics.length;
          const completed = subtopics.filter((s: any) => s.completed).length;

          const progress = total > 0 ? (completed / total) * 100 : 0;

          return {
            ...t,
            totalDays: total,
            completedDays: completed,
            progress: Math.round(progress),
          };
        });

        setTopics(computed);
      } catch (err) {
        console.error("Error fetching topics:", err);
        setError("Failed to load topics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 mesh-gradient opacity-10 pointer-events-none fixed" />

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-12 animate-fade-in-up">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
                My Learning Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">Continue your learning journey</p>
            </div>

            <Link to="/new-topic">
              <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                New Topic
              </Button>
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-center text-muted-foreground text-lg py-20">
              Loading your topics...
            </p>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-20">
              <p className="text-destructive text-lg mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="bg-gradient-primary text-white">
                Retry
              </Button>
            </div>
          )}

          {/* Topics Grid */}
          {!loading && !error && topics.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <TopicCard
                  key={topic._id}
                  topicId={topic._id}
                  title={topic.name || "Untitled Topic"}
                  progress={topic.progress}
                  totalDays={topic.totalDays}
                  completedDays={topic.completedDays}
                />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && topics.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">
                No topics yet. Start your learning journey!
              </p>
              <Link to="/new-topic">
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Topic
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default Dashboard;
