import { createFileRoute } from "@tanstack/react-router";
import { useFootprint } from "@/lib/footprint-store";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Car, Home, Utensils, ShoppingBag, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Carbon Calculator — SustainIQ" },
      { name: "description", content: "Multi-step carbon footprint calculator with interactive sliders and a live counter." },
    ],
  }),
  component: CalculatorPage,
});

const steps = [
  { key: "transport", label: "Transport", icon: Car },
  { key: "home", label: "Home", icon: Home },
  { key: "diet", label: "Diet", icon: Utensils },
  { key: "shopping", label: "Shopping", icon: ShoppingBag },
] as const;

function CalculatorPage() {
  const { inputs, setInput, footprint, resetInputs } = useFootprint();
  const [step, setStep] = useState(0);
  const Active = steps[step];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Carbon Calculator</h1>
        <p className="mt-2 text-muted-foreground">
          Drag the sliders. Watch your footprint move in real time.
        </p>
      </header>

      {/* Live counter */}
      <div className="mb-8 grid gap-4 rounded-3xl gradient-hero p-6 text-primary-foreground sm:grid-cols-[1.4fr_1fr] sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/75">Live estimate</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-6xl font-extrabold tabular-nums">
              <AnimatedCounter value={footprint.tons} decimals={2} />
            </span>
            <span className="mb-2 text-base font-semibold text-white/75">tCO₂e / yr</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            ["Transport", footprint.transport],
            ["Home", footprint.home],
            ["Diet", footprint.diet],
            ["Shopping", footprint.shopping],
          ].map(([k, v]) => (
            <div key={k as string} className="rounded-xl bg-white/15 p-3">
              <div className="text-xs text-white/70">{k}</div>
              <div className="font-bold tabular-nums">{Math.round(v as number).toLocaleString()} kg</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-6 grid grid-cols-4 gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const active = i === step;
          const done = i < step;
          return (
            <button
              key={s.key}
              onClick={() => setStep(i)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-semibold transition-all sm:flex-row sm:text-sm",
                active ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                  : done ? "border-accent/50 bg-secondary text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30",
              )}
            >
              {done ? <Check className="size-4" /> : <Icon className="size-4" />}
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl glass p-6 sm:p-8">
        <h2 className="text-xl font-bold">{Active.label}</h2>

        {step === 0 && (
          <div className="mt-6 space-y-6">
            <SliderRow label="Car driving" unit="km / week" min={0} max={1000} step={10}
              value={inputs.carKmPerWeek} onChange={(v) => setInput("carKmPerWeek", v)} />
            <SliderRow label="Flights" unit="per year" min={0} max={20} step={1}
              value={inputs.flightsPerYear} onChange={(v) => setInput("flightsPerYear", v)} />
            <SliderRow label="Public transit" unit="km / week" min={0} max={500} step={10}
              value={inputs.transitKmPerWeek} onChange={(v) => setInput("transitKmPerWeek", v)} />
          </div>
        )}
        {step === 1 && (
          <div className="mt-6 space-y-6">
            <SliderRow label="Electricity" unit="kWh / month" min={0} max={3000} step={50}
              value={inputs.electricityKwh} onChange={(v) => setInput("electricityKwh", v)} />
            <SliderRow label="Natural gas" unit="therms / month" min={0} max={200} step={5}
              value={inputs.gasTherm} onChange={(v) => setInput("gasTherm", v)} />
            <SliderRow label="Renewable mix" unit="% green energy" min={0} max={100} step={5}
              value={inputs.renewablePct} onChange={(v) => setInput("renewablePct", v)} />
          </div>
        )}
        {step === 2 && (
          <div className="mt-6 space-y-6">
            <SliderRow label="Meat meals" unit="per week" min={0} max={21} step={1}
              value={inputs.meatMealsPerWeek} onChange={(v) => setInput("meatMealsPerWeek", v)} />
            <SliderRow label="Dairy servings" unit="per day" min={0} max={8} step={1}
              value={inputs.dairyServingsPerDay} onChange={(v) => setInput("dairyServingsPerDay", v)} />
            <SliderRow label="Local & seasonal food" unit="% of diet" min={0} max={100} step={5}
              value={inputs.localFoodPct} onChange={(v) => setInput("localFoodPct", v)} />
          </div>
        )}
        {step === 3 && (
          <div className="mt-6 space-y-6">
            <SliderRow label="General shopping" unit="$ / month" min={0} max={3000} step={50}
              value={inputs.shoppingSpend} onChange={(v) => setInput("shoppingSpend", v)} />
            <SliderRow label="Fast-fashion items" unit="per month" min={0} max={20} step={1}
              value={inputs.fastFashionItems} onChange={(v) => setInput("fastFashionItems", v)} />
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" onClick={resetInputs}>Reset</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <ChevronLeft className="mr-1 size-4" /> Back
            </Button>
            <Button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}>
              Next <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label, unit, value, onChange, min, max, step,
}: { label: string; unit: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-sm font-semibold">{label}</label>
        <div className="text-right">
          <span className="text-2xl font-extrabold tabular-nums text-primary">{value}</span>
          <span className="ml-1 text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}
