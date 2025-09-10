import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { store } from "@/lib/store";
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell } from "recharts";

export default function Dashboard(){
  const screenings = store.getScreenings();
  const mood = store.getMood();

  const byDay = useMemo(()=>{
    const map = new Map<string, { date: string; mood: number; phq: number; gad: number }>();
    mood.forEach(m => {
      const d = new Date(m.date).toDateString();
      const entry = map.get(d) || { date: d, mood: 0, phq: 0, gad: 0 };
      entry.mood += m.mood;
      map.set(d, entry);
    });
    screenings.forEach(s => {
      const d = new Date(s.date).toDateString();
      const entry = map.get(d) || { date: d, mood: 0, phq: 0, gad: 0 };
      if (s.tool === "PHQ-9") entry.phq += s.score; else entry.gad += s.score;
      map.set(d, entry);
    });
    return Array.from(map.values()).sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [screenings, mood]);

  const severityDist = useMemo(()=>{
    const buckets: Record<string, number> = { Minimal:0, Mild:0, Moderate:0, "Moderately Severe":0, Severe:0 };
    screenings.forEach(s => { buckets[s.severity] = (buckets[s.severity]||0)+1; });
    return Object.entries(buckets).map(([name, value])=>({ name, value }));
  }, [screenings]);

  const colors = ["#16a34a", "#86efac", "#f59e0b", "#ef4444", "#7c3aed"];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Trends</CardTitle>
          <CardDescription>Anonymized daily metrics (mood average, PHQ/GAD totals)</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#3b82f6" name="Mood (avg)" />
              <Line type="monotone" dataKey="phq" stroke="#ef4444" name="PHQ-9 total" />
              <Line type="monotone" dataKey="gad" stroke="#22c55e" name="GAD-7 total" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Severity Distribution</CardTitle>
          <CardDescription>Across saved screenings</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={severityDist} dataKey="value" nameKey="name" outerRadius={100}>
                {severityDist.map((_, i) => <Cell key={i} fill={colors[i%colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Early Warning</CardTitle>
          <CardDescription>Highlight periods with negative mood streaks or high scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">This demo estimates risk based on local data only. Integrate with institutional databases for department-level heatmaps.</div>
        </CardContent>
      </Card>
    </div>
  );
}
