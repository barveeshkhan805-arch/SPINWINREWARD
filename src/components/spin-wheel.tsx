"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SpinWheelSlice } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const slices: SpinWheelSlice[] = [
  { value: 10, color: "hsl(var(--primary))" },
  { value: 200, color: "hsl(var(--accent))" },
  { value: 25, color: "hsl(var(--primary))" },
  { value: 0, color: "hsl(var(--accent))" },
  { value: 50, color: "hsl(var(--primary))" },
  { value: 150, color: "hsl(var(--accent))" },
  { value: 100, color: "hsl(var(--primary))" },
  { value: 40, color: "hsl(var(--accent))" },
];

const sliceCount = slices.length;
const sliceAngle = 360 / sliceCount;

interface SpinWheelProps {
  onSpinComplete: (value: number) => void;
  onSpinStartCheck: () => boolean;
}

export function SpinWheel({ onSpinComplete, onSpinStartCheck }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const { toast } = useToast();

  const handleSpin = () => {
    if (isSpinning) return;

    if (!onSpinStartCheck()) {
      toast({
        title: "Spin Limit Reached",
        description: "You have used all your spins for today. Come back tomorrow!",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    
    const spins = 10;
    const randomExtraRotation = Math.random() * 360;
    const newRotation = Math.ceil(rotation / 360) * 360 + (spins * 360) + randomExtraRotation;

    setRotation(newRotation);

    setTimeout(() => {
      // After animation, calculate the winning slice based on final position.
      const finalAngle = newRotation % 360;
      // The pointer is at 180 degrees (left side). We find which slice angle from the original wheel now sits at 180 degrees.
      const winningAngle = (180 - finalAngle + 360) % 360;
      
      // Determine the index of the winning slice
      const winningSliceIndex = Math.floor(winningAngle / sliceAngle);
      const winningValue = slices[winningSliceIndex].value;

      setIsSpinning(false);
      onSpinComplete(winningValue);
    }, 5000); // Corresponds to animation duration
  };

  const conicGradient = slices.map((slice, i) => `${slice.color} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`).join(", ");

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative w-72 h-72 md:w-80 md:h-80">
        <div
          className="relative w-full h-full rounded-full border-8 border-card shadow-inner"
          style={{
            transition: "transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)",
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(${conicGradient})` }}
          ></div>
          {slices.map((slice, index) => {
            const textRotation = index * sliceAngle + sliceAngle / 2;
            return (
              <div
                key={index}
                className="absolute w-1/2 h-1/2 top-0 left-1/4 flex items-start justify-center pt-4 text-2xl font-bold text-white"
                style={{
                  transform: `rotate(${textRotation}deg)`,
                  transformOrigin: "50% 100%",
                }}
              >
                <span style={{ transform: `rotate(-90deg)` }} className="drop-shadow-sm">{slice.value}</span>
              </div>
            );
          })}
        </div>
        <div 
          onClick={handleSpin}
          className={cn(
            "absolute inset-0 flex items-center justify-center cursor-pointer"
          )}
        >
            <div 
              className={cn(
                "flex items-center justify-center h-20 w-20 rounded-full font-headline text-2xl shadow-lg border-4 border-background/20 transition-transform active:scale-95",
                isSpinning ? "cursor-wait bg-destructive/50" : "bg-destructive text-destructive-foreground"
              )}
            >
                {isSpinning ? "..." : "SPIN"}
            </div>
        </div>
      </div>
    </div>
  );
}
