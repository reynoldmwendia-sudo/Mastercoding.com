import { useGetReferrerLeaderboard, getGetReferrerLeaderboardQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Trophy, Users } from "lucide-react";

export function ReferrerLeaderboard() {
  const { data } = useGetReferrerLeaderboard({
    query: { queryKey: getGetReferrerLeaderboardQueryKey() },
  });

  if (!data || data.length === 0) return null;

  const medals = ["text-yellow-300", "text-slate-300", "text-amber-600"];

  return (
    <section className="py-24 bg-card/30 border-y border-border/30 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-semibold">
            <Trophy className="w-3 h-3" /> TOP REFERRERS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Students who pay it forward.</h2>
          <p className="text-muted-foreground">
            These students are bringing their friends along — and earning them KSh 200 off in the process. Refer 5 friends, get bragging rights for life.
          </p>
        </div>

        <Card className="bg-background/50 border-border/40 p-2 md:p-4">
          <ul className="divide-y divide-border/30">
            {data.map((entry, i) => (
              <li
                key={entry.code}
                className="flex items-center justify-between gap-4 px-4 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center font-mono font-bold">
                    <Trophy
                      className={`w-5 h-5 ${i < 3 ? medals[i] : "text-muted-foreground"}`}
                      fill={i < 3 ? "currentColor" : "none"}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{entry.firstName}</p>
                    <p className="font-mono text-xs text-muted-foreground">#{i + 1} · code {entry.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary font-mono">
                  <Users className="w-4 h-4" />
                  <span className="font-bold text-xl">{entry.count}</span>
                  <span className="text-xs text-muted-foreground">
                    {entry.count === 1 ? "friend" : "friends"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
