import { useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { animatePhaseChange } from "@/lib/animations";

interface PhaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePhase: number;
}

export function PhaseModal({ open, onOpenChange, activePhase }: PhaseModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (open && contentRef.current) {
      animatePhaseChange(activePhase);
    }
  }, [open, activePhase]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" ref={contentRef}>
        <DialogHeader className="bg-secondary text-secondary-foreground p-4 rounded-t-lg">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Phase Detection
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center p-6">
          <div className="mb-4">
            <Zap className="h-12 w-12 mx-auto text-accent" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Current Active Phase</h3>
          
          <div className="flex justify-center space-x-4 my-6">
            <div className={`phase-indicator ${activePhase === 1 ? 'phase-active' : 'phase-inactive'}`}>1</div>
            <div className={`phase-indicator ${activePhase === 2 ? 'phase-active' : 'phase-inactive'}`}>2</div>
            <div className={`phase-indicator ${activePhase === 3 ? 'phase-active' : 'phase-inactive'}`}>3</div>
          </div>
          
          <DialogDescription className="text-lg">
            Phase {activePhase} is currently active on your system
          </DialogDescription>
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
