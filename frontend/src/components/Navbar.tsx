import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, BarChart3, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = async () => {
    try { await (await import('../api/api')).logoutApi(); } catch(e) { console.error(e); }
    navigate("/login");
  };
  
  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-soft-sm backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EduPrompt
            </span>
          </Link>
          
          <div className="flex items-center gap-1">
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive("/dashboard") 
                  ? "bg-primary text-primary-foreground shadow-soft-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            
            <Link 
              to="/progress" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive("/progress") 
                  ? "bg-primary text-primary-foreground shadow-soft-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Progress</span>
            </Link>
            
            <Link 
              to="/profile" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive("/profile") 
                  ? "bg-primary text-primary-foreground shadow-soft-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
