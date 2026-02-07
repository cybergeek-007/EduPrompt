import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Trophy, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchTopicsApi } from "@/api/api";

const Profile = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Fetch topics from backend
        const res = await fetchTopicsApi();
        setTopics(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Error fetching topics:", err);
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  if (!topics.length) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
          <User className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            Welcome {user?.name || "New User"}!
          </h2>
          <p className="text-muted-foreground">
            You haven’t started learning yet. Go to the dashboard and pick a topic.
          </p>
          <Button onClick={() => (window.location.href = "/dashboard")} className="mt-6">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const completedTopics = topics.filter((t) => t.progress === 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* USER CARD */}
          <Card className="p-8 shadow-soft-lg border border-border mb-8">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-1">
                    {user?.name || "Guest User"}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email || "guest@example.com"}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.href = "/";
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* STAT CARDS */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold text-foreground mb-1">{topics.length}</p>
                <p className="text-sm text-muted-foreground">Topics Started</p>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold text-success mb-1">{completedTopics.length}</p>
                <p className="text-sm text-muted-foreground">Topics Completed</p>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold text-accent mb-1">
                  {topics.reduce((sum, t) => sum + (t.completedDays || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Days Learned</p>
              </div>
            </div>
          </Card>

          {/* COMPLETED TOPICS */}
          <Card className="p-8 shadow-soft-lg border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Completed Topics</h2>
            </div>

            {completedTopics.length ? (
              <div className="space-y-3">
                {completedTopics.map((topic) => (
                  <div
                    key={topic._id}   // 🔥 FIXED UNIQUE KEY
                    className="flex items-center justify-between p-4 bg-success/5 border-2 border-success/20 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-foreground">{topic.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Completed all {topic.totalDays || 0} days
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-success" />
                      <span className="text-sm font-semibold text-success">100%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No completed topics yet. Keep learning!</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
