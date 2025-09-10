import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { store, guid } from "@/lib/store";

const counselors = [
  { name: "Dr. Meera Sharma", dept: "Psychology", slots: ["Mon 3:00 PM", "Tue 11:00 AM", "Thu 2:00 PM"] },
  { name: "Mr. Arjun Patel", dept: "Student Welfare", slots: ["Wed 10:00 AM", "Fri 4:00 PM"] },
  { name: "Ms. Riya Sen", dept: "Counselling Centre", slots: ["Tue 2:00 PM", "Thu 11:00 AM"] },
];

export default function Booking(){
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [mode, setMode] = useState<"online"|"offline">("online");
  const [counselor, setCounselor] = useState(counselors[0].name);
  const [slot, setSlot] = useState(counselors[0].slots[0]);

  function submit(){
    store.addBooking({ id: guid(), name, contact, mode, counselor, datetime: slot });
    setName(""); setContact("");
    alert("Appointment requested. The counsellor will confirm shortly.");
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Confidential Appointment</CardTitle>
          <CardDescription>Choose a counsellor and slot. Connect college ID later if needed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Name or Nickname</Label>
              <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Anonymous is okay" />
            </div>
            <div>
              <Label>Contact (phone/email)</Label>
              <Input value={contact} onChange={(e)=>setContact(e.target.value)} placeholder="For confirmation" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Mode</Label>
              <div className="flex gap-2 mt-2">
                <Button variant={mode==='online'? 'default':'outline'} onClick={()=>setMode('online')}>Online</Button>
                <Button variant={mode==='offline'? 'default':'outline'} onClick={()=>setMode('offline')}>In-person</Button>
              </div>
            </div>
            <div>
              <Label>Counsellor</Label>
              <select className="mt-2 w-full rounded-md border p-2 bg-background" value={counselor} onChange={(e)=>{
                const c = counselors.find(x=>x.name===e.target.value)!; setCounselor(c.name); setSlot(c.slots[0]);
              }}>
                {counselors.map(c=> <option key={c.name} value={c.name}>{c.name} • {c.dept}</option>)}
              </select>
            </div>
            <div>
              <Label>Slot</Label>
              <select className="mt-2 w-full rounded-md border p-2 bg-background" value={slot} onChange={(e)=>setSlot(e.target.value)}>
                {counselors.find(c=>c.name===counselor)!.slots.map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <Button onClick={submit}>Request Appointment</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Helplines</CardTitle>
          <CardDescription>24x7 mental health support</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <a className="block rounded-md border p-2 hover:bg-accent" href="tel:18005990019">KIRAN: 1800-599-0019</a>
          <a className="block rounded-md border p-2 hover:bg-accent" href="tel:9152987821">AASRA: 91-22-27546669</a>
          <a className="block rounded-md border p-2 hover:bg-accent" href="tel:112">Emergency: 112</a>
        </CardContent>
      </Card>
    </div>
  );
}
