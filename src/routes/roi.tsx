import { createFileRoute } from "@tanstack/react-router";
import { useFootprint } from "@/lib/footprint-store";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { DollarSign, Leaf, Lightbulb, Beef, Bike, Droplets } from "lucide-react";

export const Route = createFileRoute("/roi")({
  head: () => ({
    meta: [
      { title: "Eco-Financial ROI — SustainIQ" },
      { name: "description", content: "See exact dollars saved when you cut carbon. Money + planet, side by side." },
    ],
  }),
  component: ROIPage,
});

type Lever = {
  id: string; title: string; icon: any;
  // returns { co2 kg/yr saved, $ saved/yr }
  calc: (amount: number) => { co2: number; usd: number };
  max: number; step: number; unitLabel: string; defaultVal: number;
};

const levers: Lever[] = [
  { id: "led", title: "Swap to LED bulbs", icon: Lightbulb, max: 50, step: 1, unitLabel: "bulbs", defaultVal: 10,
    calc: (n) => ({ co2: n * 40, usd: n * 8 }) },
  { id: "meat", title: "Reduce meat meals", icon: Beef, max: 21, step: 1, unitLabel: "meals/wk cut", defaultVal: 4,
    calc: (n) => ({ co2: n * 52 * 3.5, usd: n * 52 * 4.5 }) },
  { id: "bike", title: "Bike instead of drive", icon: Bike, max: 200, step: 5, unitLabel: "km/wk", defaultVal: 40,
    calc: (n) => ({ co2: n * 52 * 0.18, usd: n * 52 * 0.22 }) },
  { id: "shower", title: "Shorter showers", icon: Droplets, max: 20, step: 1, unitLabel: "min/day saved", defaultVal: 3,
    calc: (n) => ({ co2: n * 365 * 0.3, usd: n * 365 * 0.18 }) },
];

function ROIPage() {
  const { footprint } = useFootprint();
  const [vals, setVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(levers.map((l) => [l.id, l.defaultVal])),
  );

  const results = levers.map((l) => {
    const r = l.calc(vals[l.id]);
    return { name: l.title, CO2: Math.round(r.co2), Dollars: Math.round(r.usd), id: l.id };
  });
  const totalCo2 = results.reduce((a, r) => a + r.CO2, 0);
  const totalUsd = results.reduce((a, r) => a + r.Dollars, 0);
  const pctReduction = footprint.total > 0 ? Math.min(100, Math.round((totalCo2 / footprint.total) * 100)) : 0;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Eco-Financial ROI Simulator</h1>
        <p className="mt-2 text-muted-foreground">
          Every kilogram of CO₂ you cut puts real money back in your wallet. Move the levers.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <BigStat label="CO₂ saved / yr" value={`${(totalCo2 / 1000).toFixed(2)} t`} icon={<Leaf />} tone="green" />
        <BigStat label="Money saved / yr" value={`$${totalUsd.toLocaleString()}`} icon={<DollarSign />} tone="gold" />
        <BigStat label="Footprint reduction" value={`${pctReduction}%`} icon={<Leaf />} tone="green" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          {levers.map((l) => {
            const Icon = l.icon;
            const r = l.calc(vals[l.id]);
            return (
              <div key={l.id} className="rounded-2xl glass p-5">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold">{l.title}</div>
                    <div className="text-xs text-muted-foreground">{l.unitLabel}</div>
                  </div>
                  <div className="text-2xl font-extrabold tabular-nums text-primary">{vals[l.id]}</div>
                </div>
                <Slider
                  className="mt-4"
                  value={[vals[l.id]]}
                  min={0} max={l.max} step={l.step}
                  onValueChange={([v]) => setVals((p) => ({ ...p, [l.id]: v }))}
                />
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-[color:var(--mint)]/40 p-2.5">
                    <div className="text-xs text-muted-foreground">CO₂ saved</div>
                    <div className="font-bold tabular-nums text-primary">{r.co2.toLocaleString()} kg/yr</div>
                  </div>
                  <div className="rounded-lg bg-[color:var(--sun)]/30 p-2.5">
                    <div className="text-xs text-muted-foreground">Money saved</div>
                    <div className="font-bold tabular-nums text-[color:var(--earth)]">${r.usd.toLocaleString()}/yr</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl glass p-6">
          <h2 className="text-lg font-bold">Side-by-side impact</h2>
          <p className="text-sm text-muted-foreground">CO₂ (kg) vs. Dollars saved per year</p>
          <div className="mt-4 h-[420px]">
            <ResponsiveContainer>
              <BarChart data={results} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid stroke="oklch(0.90 0.02 145)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="oklch(0.48 0.03 150)" fontSize={11} />
                <YAxis dataKey="id" type="category" stroke="oklch(0.48 0.03 150)" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid oklch(0.90 0.02 145)", borderRadius: 12 }}
                />
                <Legend />
                <Bar dataKey="CO2" name="CO₂ (kg)" fill="oklch(0.55 0.16 150)" radius={[0, 8, 8, 0]} />
                <Bar dataKey="Dollars" fill="oklch(0.72 0.13 50)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function BigStat({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone: "green" | "gold" }) {
  const bg = tone === "green" ? "from-[color:var(--mint)]/60 to-white" : "from-[color:var(--sun)]/50 to-white";
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${bg} p-5 shadow-[var(--shadow-soft)] border border-white/60`}>
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <span className="text-primary">{icon}</span>{label}
      </div>
      <div className="mt-1 text-3xl font-extrabold tabular-nums text-foreground">{value}</div>
    </div>
  );
}
