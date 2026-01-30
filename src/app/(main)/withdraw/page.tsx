"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { withdrawalTiers } from "@/lib/data";
import type { WithdrawalTier } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WithdrawDialog } from "@/components/withdraw-dialog";

export default function WithdrawPage() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<WithdrawalTier | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<"Google Play" | "UPI">("Google Play");

  const handleRedeemClick = (tier: WithdrawalTier, method: "Google Play" | "UPI") => {
    setSelectedTier(tier);
    setSelectedMethod(method);
    setIsDialogOpen(true);
  };
  
  const WithdrawalCard = ({ tier, method }: { tier: WithdrawalTier, method: "Google Play" | "UPI" }) => {
    const canAfford = user && user.points >= tier.points;
    return (
      <Card className={!canAfford ? 'bg-muted border-dashed border' : ''}>
        <CardHeader>
          <CardTitle className="font-headline text-primary">₹{tier.rs}</CardTitle>
          <CardDescription>{tier.points.toLocaleString()} Points</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            onClick={() => handleRedeemClick(tier, method)}
            disabled={!canAfford}
            className="w-full bg-gradient-primary text-primary-foreground shadow-md"
          >
            Redeem
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold font-headline mb-4">Withdrawal</h1>
      <Card className="mb-4 text-center">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Your Points Balance</p>
          <p className="text-3xl font-bold font-headline bg-gradient-primary text-transparent bg-clip-text">{user?.points.toLocaleString() || 0}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="google-play" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="google-play">Google Play</TabsTrigger>
          <TabsTrigger value="upi">UPI</TabsTrigger>
        </TabsList>
        <TabsContent value="google-play">
          <div className="grid grid-cols-2 gap-4 mt-4">
            {withdrawalTiers.map(tier => (
              <WithdrawalCard key={tier.id} tier={tier} method="Google Play" />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="upi">
          <div className="grid grid-cols-2 gap-4 mt-4">
            {withdrawalTiers.map(tier => (
              <WithdrawalCard key={tier.id} tier={tier} method="UPI" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <WithdrawDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        tier={selectedTier}
        method={selectedMethod}
      />
    </div>
  );
}
