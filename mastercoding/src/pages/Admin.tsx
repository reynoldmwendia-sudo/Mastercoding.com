import { useState } from "react";
import { Link } from "wouter";
import {
  useAdminMe,
  useAdminLogin,
  useAdminLogout,
  useListEnrollments,
  useConfirmEnrollment,
  getAdminMeQueryKey,
  getListEnrollmentsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Terminal,
  Loader2,
  CheckCircle2,
  Clock,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function Admin() {
  const me = useAdminMe({ query: { queryKey: getAdminMeQueryKey() } });

  if (me.isLoading) {
    return (
      <Wrapper>
        <div className="flex items-center justify-center py-32 text-muted-foreground gap-3">
          <Loader2 className="w-5 h-5 animate-spin" /> Checking session...
        </div>
      </Wrapper>
    );
  }

  if (!me.data?.authenticated) {
    return (
      <Wrapper>
        <LoginForm />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Dashboard />
    </Wrapper>
  );
}

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();
  const login = useAdminLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login.mutateAsync({ data: { password } });
      await qc.invalidateQueries({ queryKey: getAdminMeQueryKey() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-16">
      <Card className="bg-card/60 border-border/50 p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin sign in</h1>
            <p className="text-sm text-muted-foreground">For Reynold only.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Admin password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          {error && (
            <div className="text-sm text-destructive border border-destructive/40 bg-destructive/10 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          <Button type="submit" disabled={login.isPending} className="w-full h-12 font-mono">
            {login.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "SIGN IN"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Dashboard() {
  const qc = useQueryClient();
  const list = useListEnrollments({ query: { queryKey: getListEnrollmentsQueryKey() } });
  const confirm = useConfirmEnrollment();
  const logout = useAdminLogout();
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const handleConfirm = async (id: number) => {
    setConfirmingId(id);
    try {
      const result = await confirm.mutateAsync({ id });
      await qc.invalidateQueries({ queryKey: getListEnrollmentsQueryKey() });
      if (result.referrerWhatsapp && result.referrerName) {
        const firstName = result.referrerName.split(" ")[0];
        const friendFirst = result.name.split(" ")[0];
        const phone = result.referrerWhatsapp.replace(/\D/g, "").replace(/^0/, "254");
        const message = `Hi ${firstName}, great news — your friend ${friendFirst} just enrolled in MasterCoding using your referral code ${result.referredBy}. They saved KSh 200 thanks to you. Keep sharing — Reynold.`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank", "noopener");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to confirm");
    } finally {
      setConfirmingId(null);
    }
  };

  const notifyReferrer = (e: { name: string; referredBy?: string | null; referrerName?: string | null; referrerWhatsapp?: string | null }) => {
    if (!e.referrerWhatsapp || !e.referrerName) return;
    const firstName = e.referrerName.split(" ")[0];
    const friendFirst = e.name.split(" ")[0];
    const phone = e.referrerWhatsapp.replace(/\D/g, "").replace(/^0/, "254");
    const message = `Hi ${firstName}, great news — your friend ${friendFirst} just enrolled in MasterCoding using your referral code ${e.referredBy}. They saved KSh 200 thanks to you. Keep sharing — Reynold.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  };

  const handleLogout = async () => {
    await logout.mutateAsync();
    await qc.invalidateQueries({ queryKey: getAdminMeQueryKey() });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Enrollments</h1>
          <p className="text-muted-foreground">Confirm payment to generate the student's AI plan.</p>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm" className="font-mono gap-2">
          <LogOut className="w-4 h-4" /> SIGN OUT
        </Button>
      </div>

      {list.isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-3">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading...
        </div>
      ) : list.data && list.data.length > 0 ? (
        <div className="space-y-4">
          {list.data.map((e) => {
            const tierLabel = e.tier === "pro" ? "Full Stack Pro · KSh 6,000" : "Beginner Core · KSh 1,500";
            const isConfirmed = e.status === "confirmed";
            return (
              <Card key={e.id} className="bg-card/40 border-border/50 p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-primary">{e.code}</span>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                          isConfirmed
                            ? "bg-primary/15 text-primary border-primary/30"
                            : "bg-yellow-500/10 text-yellow-300 border-yellow-500/30"
                        }`}
                      >
                        {isConfirmed ? "CONFIRMED" : "PENDING"}
                      </span>
                    </div>
                    <p className="text-lg font-semibold">{e.name}</p>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      <p>{e.email} · WhatsApp {e.whatsapp}</p>
                      <p className="font-mono text-xs">{tierLabel} · Starts with {e.language}</p>
                      {e.discount > 0 && (
                        <p className="font-mono text-xs text-primary">
                          Referred by {e.referredBy} · KSh {e.discount.toLocaleString("en-KE")} discount · Owes KSh {(e.tier === "pro" ? 6000 - e.discount : 1500 - e.discount).toLocaleString("en-KE")}
                        </p>
                      )}
                      <p className="font-mono text-xs">Submitted {new Date(e.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {isConfirmed ? (
                      <>
                        <span className="inline-flex items-center gap-2 text-primary text-sm font-mono">
                          <CheckCircle2 className="w-4 h-4" /> AI plan generated
                        </span>
                        {e.referrerWhatsapp && (
                          <Button
                            onClick={() => notifyReferrer(e)}
                            variant="outline"
                            size="sm"
                            className="font-mono text-xs gap-1"
                          >
                            NOTIFY {e.referrerName?.split(" ")[0]?.toUpperCase()} ON WHATSAPP
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button
                        onClick={() => handleConfirm(e.id)}
                        disabled={confirmingId === e.id}
                        className="font-mono gap-2"
                      >
                        {confirmingId === e.id ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> GENERATING PLAN...</>
                        ) : (
                          <><Clock className="w-4 h-4" /> CONFIRM PAYMENT</>
                        )}
                      </Button>
                    )}
                    <Button asChild variant="ghost" size="sm" className="font-mono text-xs gap-1">
                      <Link href={`/enroll/${e.code}`}>
                        VIEW STUDENT PAGE <ExternalLink className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-card/40 border-border/40 p-12 text-center">
          <p className="text-muted-foreground">No enrollments yet. Share your site with students.</p>
        </Card>
      )}
    </div>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-mono font-bold text-lg">
            <Terminal className="w-5 h-5 text-primary" />
            <span>Master<span className="text-primary">Coding</span> <span className="text-muted-foreground">/admin</span></span>
          </Link>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-12">{children}</div>
    </div>
  );
}
