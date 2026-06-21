import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Recycle, Zap, Sprout, MapPin, Search } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Local Green Infrastructure — SustainIQ" },
      { name: "description", content: "Find nearby recycling centers, EV charging spots, and farmers markets by ZIP." },
    ],
  }),
  component: MapPage,
});

type Pin = { id: string; type: "recycle" | "ev" | "market"; name: string; distance: string; x: number; y: number };

function generatePins(zip: string): Pin[] {
  const seed = zip.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (i: number) => ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280;
  const items: Pin[] = [
    { id: "r1", type: "recycle", name: "GreenCycle Recycling Center", distance: "0.8 mi", x: 25, y: 30 },
    { id: "r2", type: "recycle", name: "Curbside e-Waste Drop", distance: "2.1 mi", x: 68, y: 40 },
    { id: "e1", type: "ev", name: "ChargePoint @ Whole Foods", distance: "1.2 mi", x: 40, y: 55 },
    { id: "e2", type: "ev", name: "Tesla Supercharger", distance: "3.4 mi", x: 80, y: 22 },
    { id: "e3", type: "ev", name: "EVgo Fast Charge", distance: "1.9 mi", x: 55, y: 75 },
    { id: "m1", type: "market", name: "Riverside Farmers Market", distance: "0.6 mi", x: 30, y: 70 },
    { id: "m2", type: "market", name: "Sunrise Organic Co-op", distance: "2.5 mi", x: 75, y: 65 },
  ];
  return items.map((p, i) => ({ ...p, x: 12 + rng(i) * 76, y: 12 + rng(i + 7) * 76 }));
}

const meta = {
  recycle: { icon: Recycle, color: "oklch(0.55 0.16 150)", label: "Recycling" },
  ev: { icon: Zap, color: "oklch(0.42 0.11 200)", label: "EV Charger" },
  market: { icon: Sprout, color: "oklch(0.72 0.13 50)", label: "Farmers Market" },
};

function MapPage() {
  const [zip, setZip] = useState("94110");
  const [active, setActive] = useState(zip);
  const pins = useMemo(() => generatePins(active), [active]);
  const [filter, setFilter] = useState<"all" | Pin["type"]>("all");
  const visible = pins.filter((p) => filter === "all" || p.type === filter);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Local Green Infrastructure</h1>
        <p className="mt-2 text-muted-foreground">
          Drop your ZIP. See the recycling, charging, and farm-to-table options around you.
        </p>
      </header>

      <div className="flex flex-col gap-3 rounded-3xl glass p-5 sm:flex-row">
        <div className="relative flex-1">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Enter ZIP" className="h-11 pl-10" />
        </div>
        <Button size="lg" onClick={() => setActive(zip)}><Search className="mr-1 size-4" /> Find</Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["all", "recycle", "ev", "market"] as const).map((k) => (
          <button key={k}
            onClick={() => setFilter(k)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filter === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground/70 hover:border-primary/40"
            }`}>
            {k === "all" ? "All" : meta[k].label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-glass)]"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.95 0.03 155), oklch(0.88 0.05 145)), repeating-linear-gradient(45deg, transparent 0 30px, oklch(0.85 0.04 145 / 0.4) 30px 31px), repeating-linear-gradient(-45deg, transparent 0 30px, oklch(0.85 0.04 145 / 0.4) 30px 31px)",
          }}>
          {/* roads */}
          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-white/70" />
          <div className="absolute bottom-0 left-1/2 top-0 w-1 -translate-x-1/2 bg-white/70" />
          <div className="absolute left-[20%] top-[15%] h-[70%] w-1 bg-white/50" />
          <div className="absolute left-[10%] right-[10%] top-[78%] h-1 bg-white/50" />

          {/* you */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-primary/40" />
            <span className="relative grid size-6 place-items-center rounded-full bg-primary ring-4 ring-white">
              <span className="size-2 rounded-full bg-white" />
            </span>
          </div>

          {visible.map((p) => {
            const Icon = meta[p.type].icon;
            return (
              <div key={p.id} style={{ left: `${p.x}%`, top: `${p.y}%` }} className="absolute -translate-x-1/2 -translate-y-1/2">
                <div className="group relative">
                  <span className="grid size-10 place-items-center rounded-full text-white shadow-lg transition-transform hover:scale-110"
                    style={{ background: meta[p.type].color }}>
                    <Icon className="size-5" />
                  </span>
                  <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground/90 px-2 py-0.5 text-[10px] font-bold text-background opacity-0 group-hover:opacity-100">
                    {p.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <ul className="space-y-3">
          {visible.map((p) => {
            const Icon = meta[p.type].icon;
            return (
              <li key={p.id} className="flex items-center gap-3 rounded-2xl glass p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl text-white" style={{ background: meta[p.type].color }}>
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{meta[p.type].label} · {p.distance}</div>
                </div>
                <Button size="sm" variant="outline">Directions</Button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
