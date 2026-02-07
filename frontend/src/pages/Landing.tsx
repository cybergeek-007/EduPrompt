import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, TrendingUp, Target } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 mesh-gradient opacity-20 pointer-events-none" />

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-2xl shadow-primary/30 animate-pulse">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Welcome to <span className="bg-gradient-primary bg-clip-text text-transparent">EduPrompt</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Turn any topic into a daily learning plan. Master new skills with AI-powered study plans and adaptive quizzes.
          </p>

          <Link to="/login">
            <Button size="lg" className="text-lg px-10 py-7 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-105 rounded-xl">
              Start Learning
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto">
          <div className="glass-card rounded-2xl p-8 text-center animate-fade-in-up animate-delay-100">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Plans</h3>
            <p className="text-muted-foreground leading-relaxed">Get structured 7-10 day learning plans tailored to any topic</p>
          </div>

          <div className="glass-card rounded-2xl p-8 text-center animate-fade-in-up animate-delay-200">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Adaptive Quizzes</h3>
            <p className="text-muted-foreground leading-relaxed">Test your knowledge with smart quizzes after each topic</p>
          </div>

          <div className="glass-card rounded-2xl p-8 text-center animate-fade-in-up animate-delay-300">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
            <p className="text-muted-foreground leading-relaxed">Monitor your learning journey and celebrate milestones</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
