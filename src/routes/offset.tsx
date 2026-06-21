import { createFileRoute } from "@tanstack/react-router";
import { useFootprint } from "@/lib/footprint-store";
import { Button } from "@/components/ui/button";
import { TreePine, Sun, Heart, Sparkles, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/offset")({
  head: () => ({
    meta: [
      { title: "Plant Trees — SustainIQ" },
      { name: "description", content: "Convert your carbon debt into real-world trees and solar — watch your forest grow." },
    ],
  }),
  component: OffsetPage,
});

const packs = [
  { id: "starter", trees: 5, price: 5, label: "Starter sapling" },
  { id: "grove", trees: 25, price: 20, label: "Mini-grove" },
  { id: "forest", trees: 100, price: 75, label: "Forest pledge" },
  { id: "guardian", trees: 500, price: 350, label: "Forest guardian" },
];

function OffsetPage() {
  const { trees, plantTrees, footprint } = useFootprint();
  const [selected, setSelected] = useState<string>("grove");
  const [project, setProject] = useState<"reforest" | "solar">("reforest");

  const pack = packs.find((p) => p.id === selected)!;
  const co2Offset = pack.trees * 22; // kg/year per tree

  const handlePlant = () => {
    plantTrees(pack.trees);
    toast.success(`${pack.trees} trees planted! 🌳`, {
      description: `${co2Offset.toLocaleString()} kg CO₂ will be sequestered every year.`,
    });
  };

  const tonsToNeutral = Math.max(0, footprint.tons);
  const treesNeeded = Math.ceil((tonsToNeutral * 1000) / 22);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Micro-Offset Market</h1>
        <p className="mt-2 text-muted-foreground">
          Turn your carbon footprint into real trees. Verified partners. Trackable impact.
        </p>
      </header>

      {/* Virtual forest */}
      <div className="rounded-3xl glass p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Your virtual forest</h2>
            <p className="text-sm text-muted-foreground">{trees.length.toLocaleString()} trees · grows as you give</p>
          </div>
          <div className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
            {treesNeeded.toLocaleString()} trees = carbon neutral
          </div>
        </div>
        <div className="relative mt-4 h-56 overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 via-[color:var(--mint)] to-[color:var(--earth)]/30">
          <div className="absolute inset-x-0 bottom-0 grid grid-cols-20 items-end px-2 pb-2"
            style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }}>
            {Array.from({ length: 120 }).map((_, i) => {
              const planted = i < trees.length;
              const size = 1 + ((i * 31) % 7) / 10;
              return (
                <span key={i}
                  className={cn("text-center leading-none transition-all", planted ? "opacity-100" : "opacity-10")}
                  style={{ fontSize: `${size}rem`, animation: planted ? "grow 0.6s both" : undefined }}>
                  🌲
                </span>
              );
            })}
          </div>
          <div className="absolute right-3 top-3 rounded-xl bg-white/80 px-3 py-2 text-xs font-bold text-primary backdrop-blur">
            🐦 +{Math.floor(trees.length / 5)} birds nesting
          </div>
        </div>
      </div>

      {/* Project picker */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => setProject("reforest")}
          className={cn(
            "flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all",
            project === "reforest" ? "border-primary bg-secondary shadow-[var(--shadow-soft)]" : "border-border bg-card hover:border-primary/40",
          )}
        >
          <div className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><TreePine className="size-6" /></div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold">Eden Reforestation</h3>
              {project === "reforest" && <Check className="size-4 text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground">Plant native trees in Madagascar, Kenya, and Nepal. ~$1 = 1 tree.</p>
          </div>
        </button>
        <button
          onClick={() => setProject("solar")}
          className={cn(
            "flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all",
            project === "solar" ? "border-primary bg-secondary shadow-[var(--shadow-soft)]" : "border-border bg-card hover:border-primary/40",
          )}
        >
          <div className="grid size-12 place-items-center rounded-2xl bg-[color:var(--sun)] text-foreground"><Sun className="size-6" /></div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold">Community Solar Fund</h3>
              {project === "solar" && <Check className="size-4 text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground">Fund rooftop solar in under-resourced neighborhoods.</p>
          </div>
        </button>
      </div>

      {/* Packs */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {packs.map((p) => (
          <button key={p.id} onClick={() => setSelected(p.id)}
            className={cn(
              "rounded-2xl border-2 p-5 text-left transition-all",
              selected === p.id ? "border-primary bg-secondary shadow-[var(--shadow-soft)]" : "border-border bg-card hover:border-primary/40",
            )}>
            <div className="text-3xl">🌳</div>
            <div className="mt-2 font-bold">{p.label}</div>
            <div className="text-sm text-muted-foreground">{p.trees} trees</div>
            <div className="mt-3 text-2xl font-extrabold tabular-nums text-primary">${p.price}</div>
          </button>
        ))}
      </div>

      {/* Checkout */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-3xl gradient-hero p-6 text-primary-foreground sm:flex-row">
        <div className="flex items-center gap-3">
          <Sparkles className="size-6" />
          <div>
            <p className="text-sm text-white/80">Your commitment</p>
            <p className="text-lg font-bold">{pack.trees} trees · offsets ~{co2Offset.toLocaleString()} kg CO₂ / yr</p>
          </div>
        </div>
        <Button size="lg" onClick={handlePlant} className="bg-white text-primary hover:bg-white/90">
          <Heart className="mr-2 size-4" /> Plant now · ${pack.price}
        </Button>
      </div>
    </div>
  );
}
