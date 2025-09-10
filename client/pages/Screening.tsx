import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { store, guid, severityFromScore } from "@/lib/store";

const options = ["Not at all", "Several days", "More than half the days", "Nearly every day"];

const phq9 = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way",
];

const gad7 = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
];

function Quiz({ items, tool }: { items: string[]; tool: "PHQ-9"|"GAD-7" }) {
  const [answers, setAnswers] = useState<number[]>(Array(items.length).fill(0));
  const score = useMemo(()=>answers.reduce((a,b)=>a+b,0),[answers]);
  const severity = severityFromScore(tool, score);
  return (
    <div className="space-y-4">
      <ol className="space-y-4">
        {items.map((q, i) => (
          <li key={i} className="rounded-lg border p-4">
            <p className="font-medium mb-3">{i+1}. {q}</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {options.map((o, idx) => (
                <label key={o} className={`cursor-pointer rounded-md border p-2 text-sm ${answers[i]===idx? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
                  <input type="radio" name={`q-${tool}-${i}`} className="hidden" onChange={()=>{
                    const a=[...answers]; a[i]=idx; setAnswers(a);
                  }} />
                  {o}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="flex items-center justify-between rounded-md bg-secondary p-3">
        <div>Score: <span className="font-semibold">{score}</span> • Severity: <span className="font-semibold">{severity}</span></div>
        <Button onClick={()=>{
          store.addScreening({ id: guid(), date:new Date().toISOString(), tool, score, severity });
        }}>Save Baseline</Button>
      </div>
    </div>
  );
}

export default function Screening(){
  return (
    <Card>
      <CardHeader>
        <CardTitle>Anonymous Screening</CardTitle>
        <CardDescription>Gamified PHQ-9 and GAD-7. Data is stored locally; share with counsellor if you wish.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="phq">
          <TabsList>
            <TabsTrigger value="phq">PHQ-9</TabsTrigger>
            <TabsTrigger value="gad">GAD-7</TabsTrigger>
          </TabsList>
          <TabsContent value="phq"><Quiz items={phq9} tool="PHQ-9"/></TabsContent>
          <TabsContent value="gad"><Quiz items={gad7} tool="GAD-7"/></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
