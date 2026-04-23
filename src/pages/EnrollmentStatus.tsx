import { useParams, Link } from "wouter";
import { useGetEnrollment, getGetEnrollmentQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mail,
  MessageCircle,
  Terminal,
  Clock,
  CheckCircle2,
  Copy,
  ArrowLeft,
  Sparkles,
  Loader2,
  Download,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

const TIER_META: Record<string, { name: string; basePrice: number }> = {
  beginner: { name: "Beginner Core", basePrice: 1500 },
  pro: { name: "Full Stack Pro", basePrice: 6000 },
};

function formatKsh(n: number): string {
  return `KSh ${n.toLocaleString("en-KE")}`;
}

export default function EnrollmentStatus() {
  const params = useParams();
  const code = params.code as string;
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError, refetch } = useGetEnrollment(code, {
    query: {
      queryKey: getGetEnrollmentQueryKey(code),
      refetchInterval: (q) =>
        (q.state.data as { status?: string } | undefined)?.status === "confirmed"
          ? false
          : 6000,
    },
  });

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (isLoading) {
    return (
      <Wrapper>
        <div className="flex items-center justify-center py-32 text-muted-foreground gap-3">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading your enrollment...
        </div>
      </Wrapper>
    );
  }

  if (isError || !data) {
    return (
      <Wrapper>
        <div className="text-center py-24 space-y-4">
          <h1 className="text-3xl font-bold">Enrollment not found</h1>
          <p className="text-muted-foreground">
            We couldn't find an enrollment with code <span className="font-mono">{code}</span>.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </Wrapper>
    );
  }

  const tierMeta = TIER_META[data.tier] ?? { name: data.tier, basePrice: 0 };
  const discount = data.discount ?? 0;
  const totalDue = Math.max(tierMeta.basePrice - discount, 0);
  const totalLabel = formatKsh(totalDue);
  const tier = { name: tierMeta.name, price: totalLabel };
  const isConfirmed = data.status === "confirmed";

  return (
    <Wrapper>
      <div className="space-y-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Button asChild variant="ghost" size="sm" className="font-mono">
            <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> HOME</Link>
          </Button>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
              isConfirmed
                ? "bg-primary/15 text-primary border-primary/30"
                : "bg-yellow-500/10 text-yellow-300 border-yellow-500/30"
            }`}
          >
            {isConfirmed ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {isConfirmed ? "PAYMENT CONFIRMED" : "AWAITING PAYMENT"}
          </div>
        </div>

        <Card className="bg-card/50 border-border/50 p-8 space-y-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider">Enrollment code</p>
              <div className="flex items-center gap-3 mt-1">
                <h1 className="text-3xl font-bold font-mono text-primary">{data.code}</h1>
                <button
                  onClick={() => handleCopy(data.code)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copy code"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {copied && <span className="text-xs text-primary">Copied!</span>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider">Tier</p>
              <p className="font-bold mt-1">{tier.name}</p>
              {discount > 0 ? (
                <div className="font-mono">
                  <p className="text-xs text-muted-foreground line-through">{formatKsh(tierMeta.basePrice)}</p>
                  <p className="text-primary font-bold">{tier.price}</p>
                  <p className="text-xs text-primary">− {formatKsh(discount)} referral</p>
                </div>
              ) : (
                <p className="text-primary font-mono">{tier.price}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-sm pt-4 border-t border-border/30">
            <div>
              <p className="text-muted-foreground font-mono text-xs uppercase">Student</p>
              <p className="font-medium mt-1">{data.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-mono text-xs uppercase">Starting language</p>
              <p className="font-medium mt-1">{data.language}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-mono text-xs uppercase">WhatsApp</p>
              <p className="font-medium mt-1">{data.whatsapp}</p>
            </div>
          </div>
        </Card>

        {!isConfirmed ? (
          <Card className="bg-background/40 border-border/40 p-8 space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Pay {tier.price} to unlock your AI plan</h2>
                <p className="text-muted-foreground mt-1">
                  Once Reynold confirms your payment, your personalized {data.language} syllabus and full learning plan will appear here automatically.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border/40 bg-card/40 p-6 space-y-4">
              <h3 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">Payment instructions</h3>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="font-mono font-bold text-primary">1.</span>
                  <span>Send <span className="font-bold text-primary">{tier.price}</span> via M-Pesa to <span className="font-mono font-bold">0786282873</span> (Reynold Mwendia).</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono font-bold text-primary">2.</span>
                  <span>Send Reynold a WhatsApp message with your enrollment code <span className="font-mono font-bold text-primary">{data.code}</span> and the M-Pesa confirmation message.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono font-bold text-primary">3.</span>
                  <span>Keep this page open — your AI plan will appear here within minutes of confirmation.</span>
                </li>
              </ol>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild className="font-mono gap-2">
                  <a
                    href={`https://wa.me/254786282873?text=${encodeURIComponent(
                      `Hi Reynold, I just paid ${tier.price} for the ${tier.name} tier. My enrollment code is ${data.code}.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4" /> SEND ON WHATSAPP
                  </a>
                </Button>
                <Button asChild variant="outline" className="font-mono gap-2">
                  <a href={`mailto:reynoldmwendia@gmail.com?subject=Enrollment ${data.code}&body=Hi Reynold, I just paid ${tier.price} for the ${tier.name} tier. My enrollment code is ${data.code}.`}>
                    <Mail className="w-4 h-4" /> EMAIL REYNOLD
                  </a>
                </Button>
                <Button onClick={() => refetch()} variant="ghost" className="font-mono">
                  REFRESH STATUS
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground font-mono">
              This page checks for confirmation every few seconds.
            </p>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card className="bg-card border-primary/40 p-8 shadow-[0_0_60px_-20px_rgba(22,163,74,0.5)] no-print">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4 flex-1 min-w-[260px]">
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Welcome aboard, {data.name.split(" ")[0]}.</h2>
                    <p className="text-muted-foreground mt-2">
                      Your payment is confirmed. Below is your personalized {data.language} syllabus and full learning plan, generated by Reynold's AI assistant.
                    </p>
                  </div>
                </div>
                <Button onClick={() => window.print()} className="font-mono gap-2">
                  <Download className="w-4 h-4" /> DOWNLOAD PDF
                </Button>
              </div>
            </Card>

            <div className="print-area space-y-8">
              <div className="print-only mb-6">
                <h1 className="text-3xl font-bold mb-1">MasterCoding with Reynold</h1>
                <p className="text-sm">
                  Personalized learning plan for <strong>{data.name}</strong> · Starting with <strong>{data.language}</strong> · Code <strong>{data.code}</strong>
                </p>
                <hr className="my-4" />
              </div>

              {data.syllabus && (
                <Card className="bg-background/40 border-border/40 p-8 md:p-10">
                  <Markdown content={data.syllabus} />
                </Card>
              )}

              {data.plan && (
                <Card className="bg-card/40 border-border/40 p-8 md:p-10">
                  <Markdown content={data.plan} />
                </Card>
              )}

              <div className="print-only text-xs mt-6">
                <hr className="my-3" />
                <p>Questions? Reach Reynold on WhatsApp 0786282873 or email reynoldmwendia@gmail.com</p>
              </div>
            </div>

            <Card className="bg-card/60 border-primary/30 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Earn referrals — your friends save KSh 200</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your code <span className="font-mono font-bold text-primary">{data.code}</span>. Anyone who enrolls with it gets KSh 200 off.
                  </p>
                </div>
              </div>
              <Button asChild className="font-mono gap-2 w-full sm:w-auto">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `I'm learning to code with MasterCoding with Reynold — a no-fluff coding course where you actually build real software. Beginner Core (KSh 1,500) or Full Stack Pro (KSh 6,000), with a personalized AI syllabus for any language. Use my referral code ${data.code} for KSh 200 off: ${typeof window !== "undefined" ? `${window.location.origin}/?ref=${data.code}` : ""}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4" /> SHARE ON WHATSAPP
                </a>
              </Button>
            </Card>

            <Card className="bg-background/40 border-border/40 p-6">
              <p className="text-sm text-muted-foreground mb-3 font-mono uppercase tracking-wider">Need help? Reach Reynold directly:</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" className="font-mono gap-2">
                  <a href="https://wa.me/254786282873" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" /> WHATSAPP
                  </a>
                </Button>
                <Button asChild variant="outline" className="font-mono gap-2">
                  <a href="mailto:reynoldmwendia@gmail.com">
                    <Mail className="w-4 h-4" /> EMAIL
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-mono font-bold text-lg">
            <Terminal className="w-5 h-5 text-primary" />
            <span>Master<span className="text-primary">Coding</span></span>
          </Link>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-12">{children}</div>
    </div>
  );
}

function Markdown({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h2:text-primary prose-h2:font-mono prose-h2:mt-8 prose-h3:text-xl prose-strong:text-foreground prose-li:my-1 prose-p:leading-relaxed max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
