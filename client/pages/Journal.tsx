import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { store, guid, sentimentScore } from "@/lib/store";

export default function Journal(){
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [entries, setEntries] = useState(store.getJournal());
  const recognitionRef = useRef<any>();

  useEffect(()=>{
    const SpeechRecognition: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = "en-IN";
      recog.continuous = true;
      recog.interimResults = true;
      recog.onresult = (e: any) => {
        let t = "";
        for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
        setTranscript(t);
      };
      recognitionRef.current = recog;
    }
  }, []);

  function toggle(){
    const recog = recognitionRef.current;
    if (!recog) { alert("Speech recognition not supported in this browser."); return; }
    if (!recording) { recog.start(); setRecording(true); } else { recog.stop(); setRecording(false); }
  }

  function save(){
    const s = sentimentScore(transcript);
    const entry = { id: guid(), date: new Date().toISOString(), transcript, sentiment: s };
    store.addJournal(entry);
    setEntries(store.getJournal());
    setTranscript("");
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Voice Journal</CardTitle>
          <CardDescription>Record thoughts privately; AI gives reflective feedback.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-md border p-3 min-h-32 whitespace-pre-wrap">{transcript || "Press Record and start speaking..."}</div>
          <div className="flex gap-2">
            <Button onClick={toggle}>{recording? 'Stop' : 'Record'}</Button>
            <Button variant="outline" onClick={save} disabled={!transcript}>Save</Button>
          </div>
          {transcript && (
            <div className="text-sm text-muted-foreground">Sentiment: {sentimentScore(transcript).toFixed(2)} (−1 negative to +1 positive)</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>My Entries</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {entries.slice().reverse().map(e => (
            <div key={e.id} className="rounded-md border p-3">
              <div className="mb-1 text-xs text-muted-foreground">{new Date(e.date).toLocaleString()} • Sentiment {e.sentiment.toFixed(2)}</div>
              <div className="whitespace-pre-wrap">{e.transcript}</div>
            </div>
          ))}
          {entries.length===0 && <div className="text-sm text-muted-foreground">No entries yet.</div>}
        </CardContent>
      </Card>
    </div>
  );
}
