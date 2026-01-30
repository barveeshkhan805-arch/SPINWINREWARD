
"use client";

import { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createWithdrawalRequest } from "@/lib/data";
import type { WithdrawalTier } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  mobile: z.string().regex(/^\d{10}$/, { message: "Must be a valid 10-digit mobile number." }),
});

interface WithdrawDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tier: WithdrawalTier | null;
  method: "Google Play" | "UPI";
}

export function WithdrawDialog({ isOpen, onOpenChange, tier, method }: WithdrawDialogProps) {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      form.reset({
        name: user.withdrawalInfo?.name || user.name || "",
        email: user.email || "",
        mobile: user.withdrawalInfo?.mobile || "",
      });
    }
  }, [isOpen, user, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user || !tier) return;
    
    const result = await createWithdrawalRequest(user.id, tier, method, data);
    
    if (result.success && result.user) {
      updateUser(result.user);
      toast({
        title: "Success!",
        description: result.message,
      });
      onOpenChange(false);
      form.reset();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  }

  if (!tier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Confirm Withdrawal</DialogTitle>
          <DialogDescription>
            Redeeming {tier.points} points for a {method} voucher worth ₹{tier.rs}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gmail ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Gmail ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Your 10-digit mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="bg-gradient-primary text-primary-foreground">Redeem</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
