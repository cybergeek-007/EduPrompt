import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import AuthForm, { AuthFormData } from "@/components/AuthForm";
import { loginApi } from "@/api/api";

const Login = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleLogin = async (data: AuthFormData) => {
    try {
      const res = await loginApi({ email: data.email, password: data.password });
      console.log("Login success:", res);
      localStorage.setItem("user", JSON.stringify(res));

      setIsError(false);
      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || "Login failed");
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
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Login to continue your learning
          </p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-soft-lg border border-border">
          <AuthForm type="login" onSubmit={handleLogin} />

          {/* SIMPLE STATIC MESSAGE (NO TOAST) */}
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
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
