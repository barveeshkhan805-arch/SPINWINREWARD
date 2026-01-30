"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface RewardAdDialogProps {
  isOpen: boolean;
  pointsWon: number;
  onClose: (awarded: boolean) => void;
}

export function RewardAdDialog({ isOpen, pointsWon, onClose }: RewardAdDialogProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleClose = () => {
    onClose(false);
  };
  
  const handleClaim = () => {
    onClose(true);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0" onPointerDownOutside={(e) => e.preventDefault()} hideCloseButton={progress < 100}>
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-headline text-2xl text-center">Reward Ad</DialogTitle>
          <DialogDescription className="text-center">
            Watch the ad to claim your reward!
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-2">
            <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
                <Image
                    data-ai-hint="advertisement product"
                    src="https://picsum.photos/seed/ad1/400/225"
                    alt="Advertisement"
                    width={400}
                    height={225}
                    className="rounded-md"
                />
            </div>
            <Progress value={progress} className="w-full h-3" />
            <p className="text-center text-sm text-muted-foreground mt-2">
                {progress < 100 ? "Watching ad..." : "Ad finished!"}
            </p>
        </div>
        <DialogFooter className="bg-muted p-4 border-t">
          {progress < 100 ? (
            <Button variant="outline" onClick={handleClose}>Skip Ad (No Reward)</Button>
          ) : (
            <Button className="w-full bg-gradient-primary text-primary-foreground" onClick={handleClaim}>
              Claim {pointsWon} Points!
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
