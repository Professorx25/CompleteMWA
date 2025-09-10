import { Button } from "@/components/ui/button";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HeartPulse,
  MessageCircle,
  Stethoscope,
  GraduationCap,
  Users,
  Activity,
  Sparkles,
  Mic,
  Shield,
  BellRing,
  BookOpen,
} from "lucide-react";
import { store } from "@/lib/store";
import { HERO_BG } from "@/assets/logo";
import { useEffect, useMemo, useState } from "react";

const features = [
  {
    icon: MessageCircle,
    title: "AI First-Aid",
    desc: "24x7 stigma-free guidance with triage.",
    to: "/chat",
  },
  {
    icon: Stethoscope,
    title: "Confidential Booking",
    desc: "Book with campus counsellor or helpline.",
    to: "/booking",
  },
  {
    icon: BookOpen,
    title: "Resource Hub",
    desc: "Guides, videos, relaxation audio in regional languages.",
    to: "/resources",
  },
  {
    icon: Users,
    title: "Peer Support",
    desc: "Anonymous moderated forum with trained volunteers.",
    to: "/forum",
  },
  {
    icon: Activity,
    title: "Admin Analytics",
    desc: "Anonymous trends and early warnings.",
    to: "/dashboard",
  },
  {
    icon: Mic,
    title: "Voice Journal",
    desc: "Record, transcribe, reflect with feedback.",
    to: "/journal",
  },
];

const moods = ["😢", "🙁", "😐", "🙂", "😊"];

export default function Index() {
  const [mood, setMood] = useState<number | null>(null);
  const points = store.getPoints();

  useEffect(() => {
    const idle = setTimeout(
      () => {
        // Gentle nudge
        const evt = new CustomEvent("nudge", {
          detail: { message: "Time for a stretch and sip of water?" },
        });
        window.dispatchEvent(evt);
      },
      1000 * 60 * 3,
    );
    return () => clearTimeout(idle);
  }, []);

  const recentMood = useMemo(() => store.getMood().slice(-7), []);

  return (
    <div className="space-y-10">
      <section
        className="grid items-center gap-8 md:grid-cols-2 rounded-lg overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(2,6,23,0.6), rgba(2,6,23,0.4)), url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="space-y-5">
          <Badge>Department of Student Welfare • IQAC</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Digital Psychological Intervention for Your Campus
          </h1>
          <p className="text-muted-foreground text-lg">
            Anonymous first-aid, screening, booking, peer support, and admin
            analytics — tailored for Indian colleges with regional language
            support.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/screening">
                <Sparkles className="mr-2" />
                Start Screening
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/chat">
                <MessageCircle className="mr-2" />
                Talk to AI First-Aid
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="#crisis">
                <HeartPulse className="mr-2" />
                Crisis Mode
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4" />
              Smart Nudges
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              GDPR-style privacy
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Campus-ready
            </div>
          </div>
        </div>
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Daily Mood Check-in</CardTitle>
            <CardDescription>
              1-click anonymous mood; negative streaks trigger help suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              {moods.map((m, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setMood(i);
                    store.addMood(i);
                  }}
                  className={`text-3xl md:text-4xl transition-transform hover:scale-110 ${mood === i ? "opacity-100" : "opacity-70"}`}
                  aria-label={`Select mood ${i + 1}`}
                >
                  {m}
                </button>
              ))}
            </div>
            {recentMood.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Last 7 days: {recentMood.map((m) => moods[m.mood]).join(" ")}
              </div>
            )}
            <div className="rounded-md bg-secondary p-3 text-sm">
              You have{" "}
              <span className="font-semibold">{points} wellness points</span>.
              Earn more by journaling, breathing exercises, and helping peers.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <f.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">{f.title}</CardTitle>
              </div>
              <CardDescription>{f.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to={f.to}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section id="crisis" className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Crisis Mode</CardTitle>
            <CardDescription>
              If you or someone you know is in immediate danger, seek help now.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <a
              href="tel:112"
              className="block rounded-md border p-3 hover:bg-accent"
            >
              Emergency: 112
            </a>
            <a
              href="tel:18005990019"
              className="block rounded-md border p-3 hover:bg-accent"
            >
              KIRAN Helpline: 1800-599-0019
            </a>
            <a
              href="tel:9152987821"
              className="block rounded-md border p-3 hover:bg-accent"
            >
              AASRA: 91-22-27546669
            </a>
            <Link
              to="/booking"
              className="block rounded-md border p-3 hover:bg-accent"
            >
              Contact Campus Counsellor
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Relaxation Audio</CardTitle>
            <CardDescription>Breathing and grounding exercises</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <audio controls className="w-full" />
            <p className="text-sm text-muted-foreground">
              Add your own guided audio in regional language.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
