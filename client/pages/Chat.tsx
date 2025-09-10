import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { aiTriage } from "@/lib/store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role:"user"|"ai"; text:string}[]>([
    { role: "ai", text: "Hi, I'm your confidential first-aid companion. How are you feeling today?" },
  ]);

  function send() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    const triage = aiTriage(userMsg);
    const response = `I hear you. Based on what you shared, this may be ${triage.level.toUpperCase()}. Suggestions: ${triage.suggestions.join(", ")}. Actions: ${triage.actions.join(", ")}.`;
    setMessages((m) => [...m, { role: "ai", text: response }]);
    setInput("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>AI-Guided First Aid</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[420px] overflow-y-auto rounded-md border p-4 bg-muted/30 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className={`inline-block rounded-lg px-3 py-2 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type your concern..." className="min-h-12" />
            <Button onClick={send}>Send</Button>
          </div>
          <p className="text-xs text-muted-foreground">This is not a medical diagnosis. For emergencies use Crisis Mode.</p>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <Alert>
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Privacy</AlertTitle>
          <AlertDescription>Conversations are anonymous and stored locally on your device.</AlertDescription>
        </Alert>
        <Card>
          <CardHeader><CardTitle>Quick Coping</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full" onClick={()=>setInput("I feel anxious and can’t focus")}>Anxiety</Button>
            <Button variant="outline" className="w-full" onClick={()=>setInput("I can’t sleep due to stress")}>Sleep</Button>
            <Button variant="outline" className="w-full" onClick={()=>setInput("Feeling low and unmotivated")}>Low mood</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
