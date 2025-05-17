import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { NavBar } from "@/components/nav-bar";
import { PhaseModal } from "@/components/phase-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { animateMotorSystem, enterPageAnimation } from "@/lib/animations";
import { Droplet, Power, Zap, Settings, RefreshCw } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [activePhase, setActivePhase] = useState(1);
  const [motorStatus, setMotorStatus] = useState(false);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate page entry
    if (pageRef.current) {
      enterPageAnimation(".animate-in");
    }

    // Setup motor animation
    animationRef.current = animateMotorSystem();

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  const handleCheckPhase = () => {
    // Randomly select a phase (in a real app, this would come from the backend)
    const randomPhase = Math.floor(Math.random() * 3) + 1;
    setActivePhase(randomPhase);
    setShowPhaseModal(true);
  };

  const handleMotorToggle = () => {
    setMotorStatus(!motorStatus);
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-background flex flex-col">
      <NavBar currentPage="home" />
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6 animate-in">Welcome back, {user?.username || 'Farmer'}!</h1>
        
        {/* Animation Container */}
        <Card className="border-0 shadow-sm mb-6 animate-in">
          <CardContent className="p-0">
            <div className="bg-muted rounded-lg relative" style={{ height: "280px" }}>
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1591335496805-cb0696f7bed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
                  alt="Irrigation system" 
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
              
              <div id="motor-animation" className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <div id="motor-spinner" className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center bg-white/80 mb-4">
                  <Power className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold bg-background/80 p-2 rounded-md">
                  Automatic Motor System
                </h3>
                <p className="mt-2 text-sm bg-background/80 p-2 rounded-md max-w-md">
                  This animation demonstrates how the automatic irrigation 
                  system works by detecting power phases and controlling motor operation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow feature-card animate-in" 
                style={{ animationDelay: "100ms" }}
                onClick={() => navigate("/motor")}>
            <CardContent className="p-6 flex flex-col items-center text-center h-full">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Power className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Motor Control</h2>
              <p className="text-muted-foreground mb-6">
                Turn your irrigation motor on or off with a simple tap.
              </p>
              <Button className="mt-auto" onClick={() => navigate("/motor")}>
                Control Motor
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow feature-card animate-in"
                style={{ animationDelay: "200ms" }}>
            <CardContent className="p-6 flex flex-col items-center text-center h-full">
              <div className="p-3 rounded-full bg-secondary/10 mb-4">
                <Zap className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Phase Detection</h2>
              <p className="text-muted-foreground mb-6">
                Check which power phase is currently active in your system.
              </p>
              <Button variant="secondary" className="mt-auto" onClick={handleCheckPhase}>
                Check Phase
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Status and Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm col-span-2 animate-in" style={{ animationDelay: "300ms" }}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-primary text-white mr-3">
                    <Droplet className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Water Pump</h4>
                    <p className="text-sm text-muted-foreground">
                      {motorStatus ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-accent text-accent-foreground mr-3">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Power Supply</h4>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm animate-in" style={{ animationDelay: "400ms" }}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleMotorToggle}>
                  <Power className="mr-2 h-4 w-4" />
                  Toggle Motor
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleCheckPhase}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Phase Modal */}
      <PhaseModal 
        open={showPhaseModal}
        onOpenChange={setShowPhaseModal}
        activePhase={activePhase}
      />
    </div>
  );
}
