"use client";

import { useMemo } from "react";
import { useAuth } from "@/providers/auth-provider";
import type { WithdrawalRequest } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, orderBy, query, type Timestamp } from "firebase/firestore";

export default function HistoryPage() {
  const { user } = useAuth();
  const firestore = useFirestore();

  const withdrawalHistoryQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.id}/withdrawal_requests`), orderBy('requestTime', 'desc'));
  }, [user, firestore]);

  const { data: history, isLoading: loading } = useCollection<WithdrawalRequest>(withdrawalHistoryQuery);

  const StatusBadge = ({ status }: { status: WithdrawalRequest['status'] }) => {
    const statusStyles: { [key: string]: string } = {
        Completed: "bg-accent/20 text-accent hover:bg-accent/30",
        Pending: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        Failed: "bg-destructive/20 text-destructive hover:bg-destructive/30",
    }

    return (
        <Badge
            className={cn("border-transparent font-semibold", statusStyles[status])}
        >
            {status}
        </Badge>
    );
  }
  
  const getFormattedDate = (firebaseTimestamp?: Timestamp) => {
    if (!firebaseTimestamp) return '';
    const date = firebaseTimestamp.toDate();
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };


  if (loading) {
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold font-headline">Withdrawal History</h1>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold font-headline mb-4">Withdrawal History</h1>
      {history?.length === 0 ? (
        <Card className="text-center py-10">
          <CardContent>
            <p className="text-muted-foreground">You have no withdrawal requests yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history?.map((item) => (
            <Card key={item.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium font-headline">
                        ₹{item.amount} via {item.method}
                    </CardTitle>
                    <StatusBadge status={item.status} />
                </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {getFormattedDate(item.requestTime)}
                </p>
                <p className="text-sm font-bold text-primary">
                  -{item.points.toLocaleString()} Points
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
