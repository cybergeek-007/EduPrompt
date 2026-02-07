import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import AuthForm, { AuthFormData } from "@/components/AuthForm";
import { signupApi } from "@/api/api";

const Signup = () => {
  const navigate = useNavigate();

  // Simple inline message state
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSignup = async (data: AuthFormData) => {
    try {
      if (data.password !== data.confirmPassword) {
        setIsError(true);
        setMessage("Passwords do not match!");
        return;
      }

      const res = await signupApi({
        name: data.name || "User",
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("user", JSON.stringify(res));

      setIsError(false);
      setMessage("Signup successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EduPrompt
            </span>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Start your personalized learning journey
          </p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-soft-lg border border-border">
          <AuthForm type="signup" onSubmit={handleSignup} />

          {/* SIMPLE STATIC MESSAGE */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-center text-sm 
              ${isError ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}
            >
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
