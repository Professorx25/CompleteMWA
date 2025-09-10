import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const resources = [
  { title: "Box Breathing (4x4)", desc: "Guided breathing to calm the nervous system.", url: "https://www.youtube.com/watch?v=tEmt1Znux58", type: "Video" },
  { title: "Progressive Muscle Relaxation", desc: "Release tension step by step.", url: "https://www.youtube.com/watch?v=ihO02wUzgkc", type: "Video" },
  { title: "Grounding 5-4-3-2-1", desc: "Mindfulness for panic and anxiety.", url: "https://www.youtube.com/watch?v=30VMIEmA114", type: "Video" },
  { title: "Sleep Hygiene Guide (हिंदी)", desc: "Better sleep tips in Hindi.", url: "https://www.aiims.edu/images/pdf/aiims/Notice/2020/sleep_hygiene_hindi.pdf", type: "Guide" },
  { title: "Stress Management (मराठी)", desc: "Regional language guide.", url: "https://nrhm.maharashtra.gov.in/Site/Uploads/Publication/62_Down_Marathi.pdf", type: "Guide" },
];

export default function Resources(){
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map(r => (
        <Card key={r.title} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{r.title}</CardTitle>
            <CardDescription>{r.type}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{r.desc}</p>
            <a href={r.url} target="_blank" rel="noreferrer" className="text-primary underline">Open</a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
