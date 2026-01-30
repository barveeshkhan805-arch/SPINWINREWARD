"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { SpinWheel } from "@/components/spin-wheel";
import { RewardAdDialog } from "@/components/reward-ad-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Coins, LogOut, RotateCw } from "lucide-react";

const DAILY_SPIN_LIMIT = 200;

export default function EarnPage() {
  const { user, addPoints, logout } = useAuth();
  const { toast } = useToast();
  const [isAdOpen, setIsAdOpen] = useState(false);
  const [pointsWon, setPointsWon] = useState(0);
  const [spinsToday, setSpinsToday] = useState(0);

  useEffect(() => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const dailySpins = (user.lastSpinDate === today) ? (user.dailySpins || 0) : 0;
      setSpinsToday(dailySpins);
    }
  }, [user]);

  const spinsLeft = DAILY_SPIN_LIMIT - spinsToday;

  const handleSpinComplete = (value: number) => {
    setPointsWon(value);
    setIsAdOpen(true);
  };

  const handleAdClose = (awarded: boolean) => {
    setIsAdOpen(false);
    if (awarded) {
      addPoints(pointsWon);
      if (pointsWon > 0) {
        toast({
            title: "Points Awarded!",
            description: `You've earned ${pointsWon} points.`,
        });
      } else {
        toast({
            title: "Better luck next time!",
            description: "You won 0 points. Keep spinning!",
        });
      }
    } else {
        addPoints(0);
        toast({
            title: "Ad Skipped",
            description: "You skipped the ad and didn't receive any points.",
            variant: "destructive"
        });
    }
  };

  return (
    <div className="relative flex flex-col h-full p-4 space-y-4">
        <div className="absolute top-4 right-4 z-10">
            <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
            </Button>
        </div>
      <Card className="text-center shadow-lg overflow-hidden">
        <CardHeader className="pb-2 pt-6">
          <CardTitle className="text-base font-semibold text-muted-foreground">
            Your Points Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2">
            <Coins className="w-8 h-8 bg-gradient-primary text-transparent bg-clip-text" />
            <p className="text-5xl font-bold font-headline bg-gradient-primary text-transparent bg-clip-text">
              {user?.points.toLocaleString() || 0}
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-card/50 p-3 mt-4">
            <div className="flex items-center justify-center w-full gap-2 text-foreground">
                <RotateCw className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">{spinsLeft < 0 ? 0 : spinsLeft} spins left today</span>
            </div>
        </CardFooter>
      </Card>
      
      <div className="flex-grow flex items-center justify-center">
        <SpinWheel 
            onSpinComplete={handleSpinComplete} 
            onSpinStartCheck={() => spinsToday < DAILY_SPIN_LIMIT}
        />
      </div>

      <RewardAdDialog 
        isOpen={isAdOpen}
        pointsWon={pointsWon}
        onClose={handleAdClose}
      />
    </div>
  );
}
