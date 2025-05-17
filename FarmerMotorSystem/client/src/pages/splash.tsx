import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { DropletIcon } from "lucide-react";
import { animateSplashScreen } from "@/lib/animations";

export default function Splash() {
  const [, navigate] = useLocation();
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Create animation
    animationRef.current = animateSplashScreen(() => {
      // Navigate to home after animation completes
      setTimeout(() => {
        navigate("/home");
      }, 500);
    });

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
      <div id="splash-logo" className="text-center">
        <DropletIcon className="h-24 w-24 text-white mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-white">Farmer Corner</h1>
        <p id="splash-text" className="text-xl text-white/70 mt-3">
          Automatic Motor Control System
        </p>
      </div>
    </div>
  );
}
