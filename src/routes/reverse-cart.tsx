import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Recycle, TreePine, ShoppingBag, Sparkles } from "lucide-react";

export const Route = createFileRoute("/reverse-cart")({
  head: () => ({
    meta: [
      { title: "Reverse Cart — SustainIQ" },
      { name: "description", content: "Paste anything you're thinking of buying. See its hidden carbon footprint and a better alternative." },
    ],
  }),
  component: ReverseCart,
});

type Lookup = { keyword: string; emoji: string; co2: number; price: number; alternative: string; altCo2: number; altPrice: number };
const catalog: Lookup[] = [
  { keyword: "iphone", emoji: "📱", co2: 80, price: 999, alternative: "Refurbished iPhone (1 gen older)", altCo2: 22, altPrice: 499 },
  { keyword: "phone", emoji: "📱", co2: 75, price: 800, alternative: "Refurbished phone", altCo2: 20, altPrice: 350 },
  { keyword: "laptop", emoji: "💻", co2: 320, price: 1500, alternative: "Refurbished business laptop", altCo2: 80, altPrice: 600 },
  { keyword: "jeans", emoji: "👖", co2: 33, price: 80, alternative: "Secondhand or organic-cotton jeans", altCo2: 8, altPrice: 35 },
  { keyword: "t-shirt", emoji: "👕", co2: 7, price: 25, alternative: "Organic cotton tee from local maker", altCo2: 2.5, altPrice: 22 },
  { keyword: "shirt", emoji: "👕", co2: 8, price: 35, alternative: "Local thrift or organic shirt", altCo2: 2, altPrice: 15 },
  { keyword: "car", emoji: "🚗", co2: 9000, price: 35000, alternative: "Certified pre-owned hybrid", altCo2: 4200, altPrice: 22000 },
  { keyword: "tv", emoji: "📺", co2: 500, price: 800, alternative: "Refurbished OLED, energy-rated A++", altCo2: 180, altPrice: 450 },
  { keyword: "shoes", emoji: "👟", co2: 14, price: 120, alternative: "Recycled-material sneakers", altCo2: 6, altPrice: 90 },
  { keyword: "burger", emoji: "🍔", co2: 4, price: 12, alternative: "Plant-based burger meal", altCo2: 0.6, altPrice: 11 },
];

function lookup(q: string): Lookup | null {
  const s = q.toLowerCase().trim();
  if (!s) return null;
  return catalog.find((c) => s.includes(c.keyword)) ?? {
    keyword: q, emoji: "🛍️", co2: 35, price: 100,
    alternative: "Secondhand or refurbished version",
    altCo2: 8, altPrice: 45,
  };
}

function ReverseCart() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState<Lookup | null>(null);

  const offsetTrees = result ? Math.max(1, Math.round((result.price - result.altPrice) / 5)) : 0;

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Reverse-Cart Simulator</h1>
        <p className="mt-2 text-muted-foreground">
          Before you click "Buy", paste it here. We'll show the hidden footprint and a smarter swap.
        </p>
      </header>

      <div className="rounded-3xl glass p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setResult(lookup(q))}
              placeholder="Try: new iPhone, fast-fashion jeans, electric car..."
              className="h-12 pl-10 text-base"
            />
          </div>
          <Button size="lg" onClick={() => setResult(lookup(q))}>
            <Sparkles className="mr-1 size-4" /> Analyze
          </Button>
        </div>

        {!result && (
          <div className="mt-6 flex flex-wrap gap-2">
            {["new iPhone", "fast fashion jeans", "laptop", "tv", "burger"].map((s) => (
              <button
                key={s}
                onClick={() => { setQ(s); setResult(lookup(s)); }}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:border-primary/40 hover:text-primary"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {result && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-destructive/20 bg-gradient-to-br from-destructive/5 to-white p-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{result.emoji}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-destructive">What you're eyeing</p>
                <h3 className="text-xl font-bold capitalize">{result.keyword}</h3>
              </div>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <Row label="Manufacturing footprint" value={`${result.co2.toLocaleString()} kg CO₂e`} />
              <Row label="Sticker price" value={`$${result.price.toLocaleString()}`} />
            </dl>
          </div>

          <div className="rounded-3xl border border-primary/30 gradient-mint p-6">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <Recycle className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Sustainable swap</p>
                <h3 className="text-lg font-bold">{result.alternative}</h3>
              </div>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <Row label="Footprint" value={`${result.altCo2.toLocaleString()} kg CO₂e`} highlight />
              <Row label="Price" value={`$${result.altPrice.toLocaleString()}`} highlight />
              <Row label="You save" value={`$${(result.price - result.altPrice).toLocaleString()} & ${(result.co2 - result.altCo2).toLocaleString()} kg CO₂`} highlight />
            </dl>
          </div>

          <div className="md:col-span-2 rounded-3xl glass p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <TreePine className="size-5 text-primary" /> Or, redirect that cash to climate impact
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The ${ (result.price - result.altPrice).toLocaleString() } you'd save could plant <span className="font-bold text-primary">{offsetTrees} real trees</span> through verified reforestation partners.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from({ length: Math.min(20, offsetTrees) }).map((_, i) => (
                <span key={i} className="text-3xl animate-grow" style={{ animationDelay: `${i * 40}ms` }}>🌳</span>
              ))}
              {offsetTrees > 20 && <span className="self-center text-sm font-semibold text-primary">+{offsetTrees - 20} more</span>}
            </div>
            <Button asChild className="mt-4">
              <a href="/offset"><ShoppingBag className="mr-1 size-4" /> Plant trees instead</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`font-bold tabular-nums ${highlight ? "text-primary" : "text-foreground"}`}>{value}</dd>
    </div>
  );
}
