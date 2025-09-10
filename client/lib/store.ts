export type MoodEntry = { date: string; mood: number };
export type ScreeningRecord = {
  id: string;
  date: string;
  tool: "PHQ-9" | "GAD-7";
  score: number;
  severity: string;
};
export type Booking = {
  id: string;
  name: string;
  contact: string;
  mode: "online" | "offline";
  counselor: string;
  datetime: string;
};
export type ForumPost = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  upvotes: number;
  replies: ForumPost[];
  volunteer?: boolean;
};
export type JournalEntry = {
  id: string;
  date: string;
  transcript: string;
  sentiment: number; // -1..1
};

const key = (k: string) => `mindspace:${k}`;

function read<T>(k: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key(k));
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(k: string, v: T) {
  try {
    localStorage.setItem(key(k), JSON.stringify(v));
  } catch {}
}

export const store = {
  getMood(): MoodEntry[] {
    return read<MoodEntry[]>("mood", []);
  },
  addMood(mood: number) {
    const data = store.getMood();
    data.push({ date: new Date().toISOString(), mood });
    write("mood", data);
    store.addPoints(5);
  },
  getPoints(): number {
    return read<number>("points", 0);
  },
  addPoints(p: number) {
    write("points", store.getPoints() + p);
  },
  getScreenings(): ScreeningRecord[] {
    return read<ScreeningRecord[]>("screenings", []);
  },
  addScreening(r: ScreeningRecord) {
    const data = store.getScreenings();
    data.push(r);
    write("screenings", data);
  },
  getBookings(): Booking[] {
    return read<Booking[]>("bookings", []);
  },
  addBooking(b: Booking) {
    const data = store.getBookings();
    data.push(b);
    write("bookings", data);
  },
  getPosts(): ForumPost[] {
    return read<ForumPost[]>("posts", []);
  },
  savePosts(posts: ForumPost[]) {
    write("posts", posts);
  },
  getJournal(): JournalEntry[] {
    return read<JournalEntry[]>("journal", []);
  },
  addJournal(entry: JournalEntry) {
    const data = store.getJournal();
    data.push(entry);
    write("journal", data);
    store.addPoints(10);
  },
};

export function guid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function sentimentScore(text: string) {
  const pos = ["happy","good","calm","relaxed","hope","better","okay","progress"]; 
  const neg = ["sad","bad","anxious","depressed","stress","panic","hate","tired","worthless","hopeless","kill","die","suicide","self-harm"]; 
  const t = text.toLowerCase();
  let s = 0;
  pos.forEach(w => { if (t.includes(w)) s += 1; });
  neg.forEach(w => { if (t.includes(w)) s -= 1; });
  return Math.max(-1, Math.min(1, s / 5));
}

export function severityFromScore(tool: "PHQ-9"|"GAD-7", score: number) {
  if (tool === "PHQ-9") {
    if (score <= 4) return "Minimal";
    if (score <= 9) return "Mild";
    if (score <= 14) return "Moderate";
    if (score <= 19) return "Moderately Severe";
    return "Severe";
  } else {
    if (score <= 4) return "Minimal";
    if (score <= 9) return "Mild";
    if (score <= 14) return "Moderate";
    return "Severe";
  }
}

export function aiTriage(text: string) {
  const t = text.toLowerCase();
  const crisis = /(suicide|kill myself|end it|self\-?harm|hurt myself|overdose)/.test(t);
  if (crisis) return { level: "severe" as const, actions: ["Activate Crisis Mode", "Contact helpline"], suggestions: ["You are not alone. Immediate help is available."] };
  const severe = /(can\'t cope|panic attacks|no sleep for days|worthless|hopeless)/.test(t);
  if (severe) return { level: "severe" as const, actions: ["Book counsellor"], suggestions: ["Try grounding: 5-4-3-2-1 technique"] };
  const moderate = /(can\'t sleep|stress|anxious|overwhelmed|burnout)/.test(t);
  if (moderate) return { level: "moderate" as const, actions: ["Breathing exercise", "Short walk"], suggestions: ["Box breathing: inhale 4, hold 4, exhale 4, hold 4"] };
  return { level: "mild" as const, actions: ["Hydrate", "Stretch"], suggestions: ["A short break can help reset."] };
}

export function isHarmful(text: string) {
  return /(suicide|kill|self\-?harm|proana|harm others)/i.test(text);
}
