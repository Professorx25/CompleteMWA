import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileStore, randomNickname } from "@/lib/store";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const nav = useNavigate();
  const p = profileStore.getProfile();
  const [name, setName] = useState(p.pseudonym || randomNickname());
  const [linkId, setLinkId] = useState(!!p.collegeId);
  const [college, setCollege] = useState(p.collegeId || "");

  useEffect(() => {
    // sync local
  }, []);

  function shuffle() {
    setName(randomNickname());
  }
  function save() {
    profileStore.setProfile({
      pseudonym: name,
      collegeId: linkId ? college : null,
    });
    alert(
      "Profile saved. You will remain anonymous until you share college ID with a counsellor.",
    );
    nav("/screening");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anonymous Onboarding</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Use a pseudonym to protect your privacy. You can link your college ID
          later if you choose professional support.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs">Pseudonym</label>
            <div className="flex gap-2 mt-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <Button onClick={shuffle} variant="outline">
                Shuffle
              </Button>
            </div>
          </div>
          <div>
            <label className="text-xs">Link college ID (optional)</label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={linkId ? "default" : "outline"}
                onClick={() => setLinkId(true)}
              >
                Link
              </Button>
              <Button
                variant={!linkId ? "default" : "outline"}
                onClick={() => {
                  setLinkId(false);
                  setCollege("");
                }}
              >
                Skip
              </Button>
            </div>
            {linkId && (
              <div className="mt-2">
                <Input
                  placeholder="College ID or Roll number"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={save}>Continue</Button>
        </div>
      </CardContent>
    </Card>
  );
}
