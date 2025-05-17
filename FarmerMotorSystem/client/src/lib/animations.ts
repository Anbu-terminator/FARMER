import { gsap } from "gsap";

export const animateSplashScreen = (onComplete?: () => void) => {
  const tl = gsap.timeline({
    onComplete: onComplete,
  });

  tl.from("#splash-logo", { 
    opacity: 0, 
    scale: 0.5, 
    duration: 1, 
    ease: "back.out(1.7)" 
  })
  .from("#splash-text", {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.3,
  });

  return tl;
};

export const animateMotorSystem = () => {
  // Create a looping animation for the motor system visualization
  const tl = gsap.timeline({ repeat: -1 });
  
  // Animation for motor spinning
  tl.to("#motor-spinner", {
    rotation: 360,
    duration: 8,
    ease: "none",
    repeat: -1,
  });

  // Animation for water flow
  gsap.to("#water-flow path", {
    strokeDashoffset: -50,
    duration: 2,
    ease: "none",
    repeat: -1,
  });

  return tl;
};

export const animateToggleButton = (isOn: boolean, button: HTMLElement) => {
  // Clear existing animations
  gsap.killTweensOf(button);
  
  // Button press animation
  gsap.fromTo(button, 
    { scale: 0.95 }, 
    { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" }
  );
  
  if (isOn) {
    // Pulsing animation when motor is on
    gsap.fromTo(button, 
      { boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.7)" },
      { 
        boxShadow: "0 0 0 20px rgba(76, 175, 80, 0)", 
        repeat: -1, 
        duration: 1.5, 
        ease: "power2.out" 
      }
    );
  }
};

export const animatePhaseChange = (activePhase: number) => {
  // Animate the phase indicators when phase changes
  gsap.to(".phase-indicator", {
    scale: 0.8,
    duration: 0.2,
    stagger: 0.1,
    onComplete: () => {
      gsap.to(".phase-indicator", {
        scale: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });
    }
  });
};

export const enterPageAnimation = (selector: string) => {
  return gsap.from(selector, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: "power2.out"
  });
};
