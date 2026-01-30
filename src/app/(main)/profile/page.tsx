"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { applyReferralCode } from "@/lib/data";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LogOut, Mail, FileText, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  mobile: z.string().regex(/^\d{10}$/, "Must be a valid 10-digit mobile number."),
});

const referralFormSchema = z.object({
  code: z.string().min(3, "Referral code is too short."),
});

export default function ProfilePage() {
  const { user, logout, updateUser, updateProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.withdrawalInfo.name || user?.name || "",
      mobile: user?.withdrawalInfo.mobile || "",
    },
  });

  const referralForm = useForm<z.infer<typeof referralFormSchema>>({
    resolver: zodResolver(referralFormSchema),
    defaultValues: { code: "" },
  });

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  async function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
    await updateProfile(data);
    toast({
      title: "Profile Updated",
      description: "Your information has been saved.",
    });
  }

  async function onReferralSubmit(data: z.infer<typeof referralFormSchema>) {
    if (!user) return;
    const result = await applyReferralCode(user.id, data.code);
    if (result.success && result.user) {
      updateUser(result.user);
      toast({
        title: "Success!",
        description: result.message,
      });
      referralForm.reset();
    } else {
      toast({
        title: "Oops!",
        description: result.message,
        variant: "destructive",
      });
    }
  }

  if (!user) return null;

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <Image
          src={user.avatarUrl || userAvatar?.imageUrl || ''}
          alt={user.name}
          width={80}
          height={80}
          className="rounded-full border-4 border-primary"
          data-ai-hint={userAvatar?.imageHint}
        />
        <h1 className="text-2xl font-bold font-headline">{user.name}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="text-lg font-bold font-headline bg-gradient-primary text-transparent bg-clip-text">{user.points.toLocaleString()} Points</p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Update Your Info</CardTitle>
          <CardDescription>Keep your withdrawal information up to date.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField control={profileForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={profileForm.control} name="mobile" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl><Input type="tel" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-md">Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Referral Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...referralForm}>
            <form onSubmit={referralForm.handleSubmit(onReferralSubmit)} className="space-y-2">
              <div className="flex items-center space-x-2">
                <FormField control={referralForm.control} name="code" render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl><Input placeholder="Enter code" {...field} disabled={user.hasUsedReferral} /></FormControl>
                  </FormItem>
                )} />
                <Button type="submit" disabled={user.hasUsedReferral} className="bg-gradient-primary text-primary-foreground shadow-md">Apply</Button>
              </div>
              <FormMessage>{referralForm.formState.errors.code?.message}</FormMessage>
              {user.hasUsedReferral && <p className="text-sm text-accent bg-accent/20 p-2 rounded-md mt-2">You have already applied a referral code.</p>}
            </form>
          </Form>
          <Separator className="my-4" />
          <Label>Your Referral Code</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Input readOnly value={user.referralCode} className="font-mono text-center border-dashed" />
            <Button variant="outline" className="border shadow-sm" onClick={() => {
                navigator.clipboard.writeText(user.referralCode);
                toast({ title: "Copied!", description: "Your referral code has been copied." });
            }}>Copy</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start border shadow-sm" asChild>
            <Link href="/terms">
              <FileText className="mr-2 h-4 w-4" />
              Terms &amp; Conditions
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start border shadow-sm" asChild>
            <Link href="/privacy">
              <Shield className="mr-2 h-4 w-4" />
              Privacy Policy
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start border shadow-sm" asChild>
            <a href="mailto:shaithakshar007@gmail.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
            </a>
          </Button>
          <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
          </Button>
      </div>

    </div>
  );
}
