import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const NewTopic = () => {
  const [topicName, setTopicName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

 const handleGeneratePlan = async () => {
  if (!topicName.trim()) {
    toast({
      title: "Topic name required",
      description: "Please enter a topic name to generate a learning plan",
      variant: "destructive",
    });
    return;
  }

  setIsGenerating(true);

  try {
    const response = await fetch(`${BASE_URL}/api/content/generate/plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ important for auth cookies
      body: JSON.stringify({ topicName }), // ✅ backend expects topicName, not name
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create topic");
    }

    toast({
      title: "Learning plan generated!",
      description: `Created learning plan for "${topicName}"`,
    });

    navigate("/dashboard"); // ✅ redirect after success
  } catch (error: any) {
    console.error("❌ Error creating topic:", error);
    toast({
      title: "Error",
      description: "Something went wrong while generating your plan.",
      variant: "destructive",
    });
  } finally {
    setIsGenerating(false);
  }
};


  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-soft-lg border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Create New Topic</h1>
                <p className="text-muted-foreground">
                  Enter any topic to generate a personalized learning plan
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="topic-name"
                  className="text-base font-semibold mb-2 block"
                >
                  What do you want to learn?
                </Label>
                <Input
                  id="topic-name"
                  type="text"
                  placeholder="e.g., Machine Learning, Web Development, Spanish Basics..."
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className="text-lg h-12"
                  onKeyPress={(e) => e.key === "Enter" && handleGeneratePlan()}
                />
              </div>

              <Button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                size="lg"
                className="w-full bg-gradient-primary hover:opacity-90 text-lg h-12"
              >
                {isGenerating ? (
                  <>Generating Plan...</>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Learning Plan
                  </>
                )}
              </Button>
            </div>

            <div className="mt-8 p-4 bg-gradient-hero rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>💡 Tip:</strong> Be specific with your topic for better results.{" "}
                We'll create a structured plan with daily lessons and quizzes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTopic;
