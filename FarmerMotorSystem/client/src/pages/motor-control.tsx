import { useState, useEffect, useRef } from "react";
import { NavBar } from "@/components/nav-bar";
import { PhaseModal } from "@/components/phase-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Power } from "lucide-react";
import { animateToggleButton, enterPageAnimation } from "@/lib/animations";
import { useAuth } from "../context/AuthContext";

export default function MotorControl() {
  const { user } = useAuth();
  const [motorState, setMotorState] = useState(false);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [activePhase, setActivePhase] = useState(1);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animate page entry
    if (pageRef.current) {
      enterPageAnimation(".animate-in");
    }
  }, []);
  
  const handleToggleMotor = () => {
    const newState = !motorState;
    setMotorState(newState);
    
    // Apply animation to toggle button
    if (toggleBtnRef.current) {
      animateToggleButton(newState, toggleBtnRef.current);
    }
  };
  
  const handleRefreshPhase = () => {
    // Randomly select a phase (in a real app, this would come from backend)
    const randomPhase = Math.floor(Math.random() * 3) + 1;
    setActivePhase(randomPhase);
  };

  // Format current time for "last updated"
  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  const [currentTime, setCurrentTime] = useState(getFormattedTime());
  
  useEffect(() => {
    // Update time when motor state changes
    setCurrentTime(getFormattedTime());
  }, [motorState]);

  return (
    <div ref={pageRef} className="min-h-screen bg-background flex flex-col">
      <NavBar currentPage="motor" />
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6 animate-in">Motor Control Panel</h1>
        
        {/* Motor Control Card */}
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="border-0 shadow-sm col-span-3 animate-in lg:col-span-2">
            <CardContent className="p-6">
              <div className="rounded-lg overflow-hidden mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1617979262072-00c4398936e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=500" 
                  alt="Modern irrigation control system" 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">Water Pump Status</h2>
                
                <div className="flex justify-center items-center mb-6 gap-2">
                  <Badge variant={motorState ? "default" : "destructive"} className="px-4 py-1 text-base">
                    {motorState ? "RUNNING" : "OFFLINE"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Last updated: Today, {currentTime}
                  </span>
                </div>
                
                <div className="flex justify-center mb-6">
                  <button
                    ref={toggleBtnRef}
                    onClick={handleToggleMotor}
                    className={`toggle-btn ${motorState ? 'on' : 'off'} focus:outline-none`}
                  >
                    <Power className="h-8 w-8 mb-2" />
                    <span>{motorState ? "STOP MOTOR" : "START MOTOR"}</span>
                  </button>
                </div>
                
                <p className="text-muted-foreground">
                  Tap the button above to control your motor.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Operation History & Phase Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm h-full animate-in" style={{ animationDelay: "100ms" }}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Operation History</h3>
              
              <div className="space-y-1">
                {motorState && (
                  <div className="flex justify-between py-2 border-b">
                    <div>Motor Started</div>
                    <div className="text-muted-foreground text-sm">Today, {currentTime}</div>
                  </div>
                )}
                {!motorState && (
                  <div className="flex justify-between py-2 border-b">
                    <div>Motor Stopped</div>
                    <div className="text-muted-foreground text-sm">Today, {currentTime}</div>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <div>Phase Change Detected</div>
                  <div className="text-muted-foreground text-sm">Today, {getFormattedTime()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm h-full animate-in" style={{ animationDelay: "200ms" }}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Current Phase Status</h3>
              
              <div className="flex justify-center mt-6">
                <div className={`phase-indicator ${activePhase === 1 ? 'phase-active' : 'phase-inactive'}`}>1</div>
                <div className={`phase-indicator ${activePhase === 2 ? 'phase-active' : 'phase-inactive'}`}>2</div>
                <div className={`phase-indicator ${activePhase === 3 ? 'phase-active' : 'phase-inactive'}`}>3</div>
              </div>
              
              <div className="text-center mt-4">
                <p className="mb-4">Phase {activePhase} is currently active</p>
                <Button 
                  variant="outline" 
                  onClick={handleRefreshPhase}
                  className="mt-2"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
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
