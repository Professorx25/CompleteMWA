import { Link, NavLink, Outlet } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeartPulse } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { LOGO_URL } from "@/assets/logo";

const nav = [
  { to: "/onboarding", label: "Onboarding" },
  { to: "/", label: "Home" },
  { to: "/chat", label: "AI First-Aid" },
  { to: "/screening", label: "Screening" },
  { to: "/booking", label: "Booking" },
  { to: "/resources", label: "Resources" },
  { to: "/forum", label: "Peer Support" },
  { to: "/dashboard", label: "Admin" },
  { to: "/journal", label: "Journal" },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/40">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img
              src={LOGO_URL}
              alt="MindSpace"
              className="h-8 w-8 rounded-md bg-primary p-1 object-contain"
            />
            <span>MindSpace</span>
            <Badge variant="secondary" className="hidden sm:inline">
              Beta
            </Badge>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="destructive">
              <a href="#crisis" className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4" /> Crisis
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Outlet />
      </main>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} MindSpace. For education only, not a
            substitute for professional care.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.nimhans.ac.in/"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              NIMHANS
            </a>
            <a
              href="https://www.mohfw.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              MoHFW
            </a>
            <a href="tel:18005990019" className="hover:underline">
              KIRAN: 1800-599-0019
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
