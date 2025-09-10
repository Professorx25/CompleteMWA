import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ForumPost, guid, isHarmful, store } from "@/lib/store";

export default function Forum(){
  const [posts, setPosts] = useState<ForumPost[]>(()=> store.getPosts());
  const [draft, setDraft] = useState("");

  useEffect(()=>{ store.savePosts(posts); }, [posts]);

  function addPost(){
    if (!draft.trim()) return;
    if (isHarmful(draft)) { alert("Your post may contain self-harm content. Please use Crisis Mode or rephrase."); return; }
    const p: ForumPost = { id: guid(), author: "Anon", content: draft.trim(), createdAt: new Date().toISOString(), upvotes: 0, replies: [] };
    setPosts([p, ...posts]);
    setDraft("");
  }

  function upvote(id: string){
    setPosts(posts.map(p => p.id===id ? { ...p, upvotes: p.upvotes+1 } : p));
  }

  function reply(id: string){
    const text = prompt("Reply:");
    if (!text) return;
    if (isHarmful(text)) { alert("This reply may contain harmful content."); return; }
    setPosts(posts.map(p => p.id===id ? { ...p, replies: [{ id: guid(), author: "Peer", content: text, createdAt: new Date().toISOString(), upvotes: 0, replies: [], volunteer: true }, ...p.replies] } : p));
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Peer Support Forum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Textarea placeholder="Share anonymously. Be kind and supportive." value={draft} onChange={(e)=>setDraft(e.target.value)} />
            <Button onClick={addPost}>Post</Button>
          </div>
          <div className="space-y-4">
            {posts.map(p => (
              <div key={p.id} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{p.author}</span>
                  {p.volunteer && <Badge>Volunteer</Badge>}
                  <span>• {new Date(p.createdAt).toLocaleString()}</span>
                </div>
                <p className="mb-3 whitespace-pre-wrap">{p.content}</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={()=>upvote(p.id)}>▲ {p.upvotes}</Button>
                  <Button variant="ghost" onClick={()=>reply(p.id)}>Reply</Button>
                </div>
                {p.replies.length>0 && (
                  <div className="mt-3 space-y-2 border-t pt-3">
                    {p.replies.map(r => (
                      <div key={r.id} className="rounded-md border p-2 text-sm">
                        <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{r.author}</span>
                          {r.volunteer && <Badge>Volunteer</Badge>}
                          <span>• {new Date(r.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{r.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Guidelines</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Be respectful and supportive.</p>
          <p>• No personal info. Keep it anonymous.</p>
          <p>• If you see harmful content, use Crisis Mode and alert moderators.</p>
        </CardContent>
      </Card>
    </div>
  );
}
