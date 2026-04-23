import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateEnrollment } from "@workspace/api-client-react";
import { Loader2, ArrowRight, Tag } from "lucide-react";

type Tier = "beginner" | "pro";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: Tier;
}

const TIER_PRICE: Record<Tier, number> = { beginner: 1500, pro: 6000 };
const TIER_NAME: Record<Tier, string> = { beginner: "Beginner Core", pro: "Full Stack Pro" };

function formatKsh(n: number): string {
  return `KSh ${n.toLocaleString("en-KE")}`;
}

function readRefFromUrl(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return (params.get("ref") || "").trim().toUpperCase();
}

export function EnrollDialog({ open, onOpenChange, tier }: Props) {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [language, setLanguage] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const fromUrl = readRefFromUrl();
      if (fromUrl && !referredBy) setReferredBy(fromUrl);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const create = useCreateEnrollment();
  const basePrice = TIER_PRICE[tier];
  const discount = referredBy.trim() ? 200 : 0;
  const total = basePrice - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !whatsapp || !language) {
      setError("Please fill in every field.");
      return;
    }
    try {
      const result = await create.mutateAsync({
        data: {
          name,
          email,
          whatsapp,
          tier,
          language,
          referredBy: referredBy.trim() || null,
        },
      });
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      onOpenChange(false);
      setLocation(`/enroll/${result.code}`);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `${base}/enroll/${result.code}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enroll. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-xl">
            Enroll — {TIER_NAME[tier]}
          </DialogTitle>
          <DialogDescription>
            Tell us who you are and what language you want to start with.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Wanjiru" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp number</Label>
              <Input id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="0712 345 678" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Programming language to start with</Label>
            <Input id="language" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="e.g. Python, JavaScript, Java" />
            <p className="text-xs text-muted-foreground">Your AI-generated syllabus will be tailored to this language.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="referredBy" className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" /> Referral code <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="referredBy"
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value.toUpperCase())}
              placeholder="MC-XXXXXX"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Got a code from a friend? Enter it for KSh 200 off.
            </p>
          </div>

          <div className="rounded-lg border border-border/50 bg-card/50 p-4 space-y-2 font-mono text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Tuition</span>
              <span>{formatKsh(basePrice)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-primary">
                <span>Referral discount</span>
                <span>− {formatKsh(discount)}</span>
              </div>
            )}
            <div className="border-t border-border/40 pt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">{formatKsh(total)}</span>
            </div>
            {discount > 0 && (
              <p className="text-xs text-muted-foreground font-sans pt-1">
                Discount applies only if the referrer's payment is already confirmed.
              </p>
            )}
          </div>

          {error && (
            <div className="text-sm text-destructive border border-destructive/40 bg-destructive/10 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          <Button type="submit" disabled={create.isPending} className="w-full h-12 font-mono text-base gap-2">
            {create.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> SUBMITTING...</>
            ) : (
              <>CONTINUE TO PAYMENT <ArrowRight className="w-4 h-4" /></>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
