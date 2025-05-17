import { Link, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DropletIcon, Power, LogOut, Home } from "lucide-react";

interface NavBarProps {
  currentPage: "home" | "motor";
}

export function NavBar({ currentPage }: NavBarProps) {
  const { logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-primary text-primary-foreground p-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/home">
          <div className="flex items-center gap-2 cursor-pointer">
            <DropletIcon className="h-6 w-6" />
            <h1 className="text-xl font-bold hidden sm:block">Farmer Corner</h1>
          </div>
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          <Button 
            variant={currentPage === "home" ? "secondary" : "ghost"} 
            size="sm"
            className="text-primary-foreground"
            onClick={() => navigate("/home")}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </Button>

          <Button 
            variant={currentPage === "motor" ? "secondary" : "ghost"} 
            size="sm"
            className="text-primary-foreground"
            onClick={() => navigate("/motor")}
          >
            <Power className="mr-2 h-4 w-4" />
            <span>Motor Control</span>
          </Button>

          <Separator orientation="vertical" className="h-6 bg-primary-foreground/20" />

          <Button variant="ghost" size="sm" className="text-primary-foreground" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
