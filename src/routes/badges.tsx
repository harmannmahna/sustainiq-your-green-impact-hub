import { createFileRoute } from "@tanstack/react-router";
import { useFootprint } from "@/lib/footprint-store";
import { Button } from "@/components/ui/button";
import { Leaf, Award, Linkedin, Twitter, Copy, Sparkles, Trophy, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/badges")({
  head: () => ({
    meta: [
      { title: "Eco Badges & Share Kit — SustainIQ" },
      { name: "description", content: "Earn shareable badges based on your climate score and post your wins in one click." },
    ],
  }),
  component: BadgesPage,
});

const tiers = [
  { min: 0, name: "Carbon Curious", color: "from-stone-300 to-stone-100", icon: Leaf },
  { min: 25, name: "Eco Rookie", color: "from-[color:var(--mint)] to-white", icon: Star },
  { min: 50, name: "Climate Guardian", color: "from-[color:var(--leaf)]/70 to-[color:var(--mint)]", icon: Award },
  { min: 70, name: "Planet Protector", color: "from-primary to-[color:var(--leaf)]", icon: Trophy },
  { min: 85, name: "Carbon Neutral Champion", color: "from-[color:var(--forest)] to-primary", icon: Sparkles },
];

function BadgesPage() {
  const { footprint, trees, challenges } = useFootprint();
  const avgUS = 16000;
  const score = Math.max(0, Math.min(100, Math.round((1 - footprint.total / avgUS) * 100)));
  const totalCheckIns = challenges.reduce((a, c) => a + c.checkIns.length, 0);

  const currentTier = [...tiers].reverse().find((t) => score >= t.min) ?? tiers[0];
  const reductionPct = Math.round(((avgUS - footprint.total) / avgUS) * 100);

  const shareText = `I just hit "${currentTier.name}" on SustainIQ 🌍 — reduced my footprint by ${Math.max(0, reductionPct)}%, planted ${trees.length} trees, and ${totalCheckIns} green check-ins. Join me: sustainiq.app`;

  const copy = async () => {
    await navigator.clipboard.writeText(shareText);
    toast.success("Copied! Paste anywhere.");
  };

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Your Eco Badges</h1>
        <p className="mt-2 text-muted-foreground">
          Earned through real action. Built for sharing. Built in public.
        </p>
      </header>

      {/* Featured badge card (shareable) */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${currentTier.color} p-8 shadow-[var(--shadow-glass)]`}>
        <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/30 blur-3xl" />
        <div className="relative grid gap-6 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <div className="grid size-24 place-items-center rounded-3xl bg-white/80 shadow-xl backdrop-blur animate-float">
            <currentTier.icon className="size-12 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/70">Current tier</p>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">{currentTier.name}</h2>
            <p className="mt-1 text-sm text-foreground/80">Score {score}/100 · {trees.length} trees · {totalCheckIns} check-ins</p>
          </div>
          <div className="text-right">
            <div className="text-6xl font-extrabold tabular-nums text-foreground">{score}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-foreground/70">Eco-Score</div>
          </div>
        </div>
      </div>

      {/* All tiers */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {tiers.map((t) => {
          const unlocked = score >= t.min;
          const Icon = t.icon;
          return (
            <div key={t.name} className={`rounded-2xl border p-4 text-center transition-all ${unlocked ? "border-primary/30 bg-secondary" : "border-border bg-card opacity-60"}`}>
              <div className={`mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${t.color} ${unlocked ? "" : "grayscale"}`}>
                <Icon className="size-6 text-primary" />
              </div>
              <div className="mt-3 text-sm font-bold">{t.name}</div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Score ≥ {t.min}</div>
            </div>
          );
        })}
      </div>

      {/* Share kit */}
      <div className="mt-8 rounded-3xl glass p-6">
        <h3 className="flex items-center gap-2 text-lg font-bold"><Sparkles className="size-5 text-primary" /> Build-in-Public Share Kit</h3>
        <p className="text-sm text-muted-foreground">Auto-generated. One click to your favorite feed.</p>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm text-foreground/90">
          {shareText}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={copy} variant="outline"><Copy className="mr-1 size-4" /> Copy</Button>
          <Button asChild className="bg-[#0a66c2] text-white hover:bg-[#0a66c2]/90">
            <a target="_blank" rel="noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://sustainiq.app")}&summary=${encodeURIComponent(shareText)}`}>
              <Linkedin className="mr-1 size-4" /> LinkedIn
            </a>
          </Button>
          <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
            <a target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}>
              <Twitter className="mr-1 size-4" /> Post on X
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
