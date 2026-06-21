import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Zap, Tv, Wifi, Battery, Microwave, Lamp, Gamepad2, Printer, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vampire")({
  head: () => ({
    meta: [
      { title: "Vampire Power Finder — SustainIQ" },
      { name: "description", content: "Tap around a virtual room to find hidden standby power drains and unplug them." },
    ],
  }),
  component: VampirePage,
});

type Drain = {
  id: string; label: string; watts: number; icon: any;
  // % positions on the room canvas
  x: number; y: number;
};
const drains: Drain[] = [
  { id: "tv", label: "TV on standby", watts: 5, icon: Tv, x: 18, y: 35 },
  { id: "router", label: "Wi-Fi router", watts: 7, icon: Wifi, x: 78, y: 18 },
  { id: "charger", label: "Phone charger (idle)", watts: 2, icon: Battery, x: 60, y: 70 },
  { id: "microwave", label: "Microwave clock", watts: 3, icon: Microwave, x: 35, y: 60 },
  { id: "lamp", label: "Smart lamp standby", watts: 1.5, icon: Lamp, x: 88, y: 55 },
  { id: "console", label: "Game console rest mode", watts: 12, icon: Gamepad2, x: 28, y: 78 },
  { id: "printer", label: "Printer on standby", watts: 4, icon: Printer, x: 70, y: 38 },
];

function VampirePage() {
  const [found, setFound] = useState<Set<string>>(new Set());
  const totalWatts = drains.reduce((a, d) => a + d.watts, 0);
  const foundWatts = drains.filter((d) => found.has(d.id)).reduce((a, d) => a + d.watts, 0);
  const kwhYear = (foundWatts * 24 * 365) / 1000;
  const usd = kwhYear * 0.16;
  const co2 = kwhYear * 0.4;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Vampire Power Finder</h1>
        <p className="mt-2 text-muted-foreground">
          Tap the glowing pulses in your virtual room to "detect" silent energy thieves.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[color:var(--mint)]/60 via-white to-[color:var(--sun)]/30 shadow-[var(--shadow-glass)]">
          {/* Room sketch */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[color:var(--earth)]/30 to-transparent" />
          <div className="absolute left-6 right-6 top-6 h-px bg-foreground/10" />

          {drains.map((d) => {
            const isFound = found.has(d.id);
            const Icon = d.icon;
            return (
              <button
                key={d.id}
                onClick={() => setFound((p) => new Set(p).add(d.id))}
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                aria-label={d.label}
              >
                {!isFound && (
                  <>
                    <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-destructive/40" />
                    <span className="absolute inset-0 -m-1 animate-pulse rounded-full bg-destructive/20" />
                  </>
                )}
                <span
                  className={cn(
                    "relative grid size-12 place-items-center rounded-2xl border-2 transition-all",
                    isFound
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-destructive/60 bg-white text-destructive hover:scale-110",
                  )}
                >
                  {isFound ? <Check className="size-5" /> : <Icon className="size-5" />}
                </span>
                <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground/90 px-2 py-0.5 text-[10px] font-bold text-background opacity-0 group-hover:opacity-100">
                  {d.label} · {d.watts}W
                </span>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl gradient-hero p-6 text-primary-foreground">
            <div className="flex items-center gap-2 text-white/80"><Zap className="size-4" /> <span className="text-xs font-semibold uppercase tracking-wider">Annual drain unplugged</span></div>
            <div className="mt-2 text-4xl font-extrabold tabular-nums">{kwhYear.toFixed(0)} <span className="text-base font-semibold text-white/80">kWh / yr</span></div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-white/15 p-3">
                <div className="text-xs text-white/70">Money saved</div>
                <div className="font-bold tabular-nums">${usd.toFixed(0)}</div>
              </div>
              <div className="rounded-xl bg-white/15 p-3">
                <div className="text-xs text-white/70">CO₂ avoided</div>
                <div className="font-bold tabular-nums">{co2.toFixed(0)} kg</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl glass p-5">
            <h3 className="font-bold">Your unplug checklist</h3>
            <p className="text-xs text-muted-foreground">{found.size} / {drains.length} found · {foundWatts}W of {totalWatts}W</p>
            <ul className="mt-4 space-y-2 text-sm">
              {drains.map((d) => {
                const isFound = found.has(d.id);
                const Icon = d.icon;
                return (
                  <li key={d.id} className={cn("flex items-center gap-3 rounded-xl border p-2.5", isFound ? "border-primary/30 bg-secondary" : "border-border bg-card/60")}>
                    <Icon className="size-4 text-primary" />
                    <span className={cn("flex-1 truncate", isFound && "line-through opacity-70")}>{d.label}</span>
                    <span className="text-xs font-bold tabular-nums text-muted-foreground">{d.watts}W</span>
                  </li>
                );
              })}
            </ul>
            <Button variant="outline" className="mt-4 w-full" onClick={() => setFound(new Set())}>Reset room</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
