import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { TrendingUp, BookOpen, Brain, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fetchTopicsApi } from "@/api/api";

const Progress = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchTopicsApi();
        setTopics(res || []);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading your progress...
      </div>
    );
  }

  const totalTopics = topics.length;
  const completedTopics = topics.filter((t) => t.progress === 100).length;
  const totalDays = topics.reduce((sum, t) => sum + (t.completedDays || 0), 0);
  const avgProgress =
    totalTopics > 0
      ? Math.round(
          topics.reduce((sum, t) => sum + (t.progress || 0), 0) / totalTopics
        )
      : 0;

  const stats = [
    {
      icon: BookOpen,
      label: "Topics Started",
      value: totalTopics,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Target,
      label: "Topics Completed",
      value: completedTopics,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      icon: Brain,
      label: "Days Learned",
      value: totalDays,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: TrendingUp,
      label: "Average Progress",
      value: `${avgProgress}%`,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Your Learning Progress
            </h1>
            <p className="text-muted-foreground">
              Track your achievements and growth
            </p>
          </div>

          {/* Empty state */}
          {topics.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">
                You haven’t started any topics yet!
              </p>
              <Link to="/new-topic">
                <Button className="bg-gradient-primary hover:opacity-90">
                  Start Learning
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => (
                  <Card
                    key={index}
                    className="p-6 shadow-soft-md border border-border"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center mb-4`}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </Card>
                ))}
              </div>

              {/* Topic Breakdown */}
              <Card className="p-8 shadow-soft-lg border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Topic Breakdown
                </h2>

                <div className="space-y-4">
                  {topics.map((topic) => (
                    <div
                      key={topic._id}   // ✅ FIXED UNIQUE KEY
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {topic.name}   {/* ✅ FIXED title -> name */}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {topic.completedDays || 0} of {topic.totalDays || 0}{" "}
                          days completed
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-success transition-all"
                            style={{ width: `${topic.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-foreground w-12 text-right">
                          {topic.progress || 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Motivation Card */}
              <Card className="mt-8 p-8 bg-gradient-hero border border-border">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Keep Going! 🚀
                </h3>
                <p className="text-muted-foreground">
                  You’re making great progress! Consistency is key to mastering
                  new skills. Complete your daily lessons to stay on track.
                </p>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
