import { createFileRoute } from "@tanstack/react-router";
import { useFootprint } from "@/lib/footprint-store";
import { Button } from "@/components/ui/button";
import { Flame, Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "21-Day Challenges — SustainIQ" },
      { name: "description", content: "Join habit-loop challenges, check in daily, and build a green streak." },
    ],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const { challenges, toggleJoin, checkIn } = useFootprint();
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">21-Day Habit Loops</h1>
        <p className="mt-2 text-muted-foreground">
          Tiny habits compound. Pick a challenge, check in daily, build the streak.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {challenges.map((c) => {
          const progress = Math.min(21, c.checkIns.length);
          const pct = (progress / 21) * 100;
          const checkedToday = c.checkIns.some((t) => Date.now() - t < 1000 * 60 * 60 * 12);
          return (
            <div key={c.id} className="flex flex-col rounded-3xl glass p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{c.emoji}</div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.description}</p>
                </div>
                <div className="relative grid size-20 shrink-0 place-items-center">
                  <svg viewBox="0 0 100 100" className="size-20 -rotate-90">
                    <circle cx="50" cy="50" r="42" stroke="oklch(0.93 0.05 155)" strokeWidth="10" fill="none" />
                    <circle cx="50" cy="50" r="42" stroke="oklch(0.55 0.16 150)" strokeWidth="10" fill="none"
                      strokeDasharray={`${pct * 2.64} 999`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-lg font-extrabold tabular-nums text-primary">{progress}</div>
                    <div className="text-[10px] font-bold uppercase text-muted-foreground">/ 21</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--sun)]/40 px-2.5 py-1 font-bold text-[color:var(--earth)]">
                  <Flame className="size-3.5" /> {c.checkIns.length} day streak
                </span>
                {c.joined && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-bold text-primary">
                    <Check className="size-3.5" /> Joined
                  </span>
                )}
              </div>

              {/* 21 dots */}
              <div className="mt-5 grid grid-cols-21 gap-1" style={{ gridTemplateColumns: "repeat(21, minmax(0,1fr))" }}>
                {Array.from({ length: 21 }).map((_, i) => (
                  <span key={i} className={cn("aspect-square rounded-sm", i < progress ? "bg-primary" : "bg-secondary")} />
                ))}
              </div>

              <div className="mt-5 flex gap-2">
                {c.joined ? (
                  <Button
                    className="flex-1"
                    disabled={checkedToday}
                    onClick={() => {
                      checkIn(c.id);
                      toast.success(`Checked in: ${c.title}`, { description: `Streak: ${c.checkIns.length + 1} days` });
                    }}
                  >
                    <Check className="mr-1 size-4" />
                    {checkedToday ? "Checked in today" : "Check in"}
                  </Button>
                ) : (
                  <Button className="flex-1" variant="outline" onClick={() => toggleJoin(c.id)}>
                    <Plus className="mr-1 size-4" /> Join challenge
                  </Button>
                )}
                {c.joined && (
                  <Button variant="ghost" onClick={() => toggleJoin(c.id)}>Leave</Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
