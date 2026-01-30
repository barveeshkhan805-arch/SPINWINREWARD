"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconEarn, IconWithdraw, IconHistory, IconProfile } from "@/components/icons";

const navItems = [
  { href: "/earn", label: "Earn", icon: IconEarn },
  { href: "/withdraw", label: "Withdraw", icon: IconWithdraw },
  { href: "/history", label: "History", icon: IconHistory },
  { href: "/profile", label: "Profile", icon: IconProfile },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 mx-auto w-full max-w-sm border-t border-border/40 bg-card/95 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors",
                isActive ? "text-primary" : "hover:text-primary"
              )}
            >
              <div className={cn("h-6 w-6 transition-all", isActive && "scale-110")}>
                <item.icon
                  className={cn(
                    "h-6 w-6 stroke-current"
                  )}
                />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
