import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type FootprintInputs = {
  carKmPerWeek: number;
  flightsPerYear: number;
  transitKmPerWeek: number;
  electricityKwh: number; // monthly
  gasTherm: number; // monthly
  renewablePct: number; // 0-100
  meatMealsPerWeek: number;
  dairyServingsPerDay: number;
  localFoodPct: number;
  shoppingSpend: number; // monthly USD
  fastFashionItems: number; // per month
};

const defaults: FootprintInputs = {
  carKmPerWeek: 150,
  flightsPerYear: 2,
  transitKmPerWeek: 20,
  electricityKwh: 600,
  gasTherm: 40,
  renewablePct: 20,
  meatMealsPerWeek: 8,
  dairyServingsPerDay: 2,
  localFoodPct: 25,
  shoppingSpend: 350,
  fastFashionItems: 2,
};

// Conversion factors (kg CO2e per unit per year-ish; tuned to feel realistic)
export function calcFootprint(i: FootprintInputs) {
  const transport =
    i.carKmPerWeek * 52 * 0.18 +
    i.flightsPerYear * 250 +
    i.transitKmPerWeek * 52 * 0.05;
  const home =
    i.electricityKwh * 12 * 0.4 * (1 - i.renewablePct / 100) +
    i.gasTherm * 12 * 5.3;
  const diet =
    i.meatMealsPerWeek * 52 * 3.5 +
    i.dairyServingsPerDay * 365 * 0.9 -
    i.localFoodPct * 1.2;
  const shopping = i.shoppingSpend * 12 * 0.4 + i.fastFashionItems * 12 * 25;
  const total = Math.max(0, transport + home + diet + shopping);
  return {
    transport: Math.max(0, transport),
    home: Math.max(0, home),
    diet: Math.max(0, diet),
    shopping: Math.max(0, shopping),
    total,
    tons: total / 1000,
  };
}

export type Tree = { id: string; type: "oak" | "pine" | "maple"; plantedAt: number };
export type Challenge = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  checkIns: number[]; // timestamps
  joined: boolean;
};

type Store = {
  inputs: FootprintInputs;
  setInput: <K extends keyof FootprintInputs>(k: K, v: FootprintInputs[K]) => void;
  resetInputs: () => void;
  footprint: ReturnType<typeof calcFootprint>;
  trees: Tree[];
  plantTrees: (n: number, type?: Tree["type"]) => void;
  challenges: Challenge[];
  toggleJoin: (id: string) => void;
  checkIn: (id: string) => void;
};

const Ctx = createContext<Store | null>(null);

const initialChallenges: Challenge[] = [
  { id: "meatless", title: "Meatless Weekdays", emoji: "🥗", description: "Skip meat Mon–Fri for 21 days.", checkIns: [], joined: true },
  { id: "bike", title: "Commute by Bike", emoji: "🚴", description: "Bike or walk to work 3x/week.", checkIns: [], joined: false },
  { id: "unplug", title: "Unplug Vampires", emoji: "🔌", description: "Unplug standby devices nightly.", checkIns: [], joined: false },
  { id: "reusable", title: "Zero Single-Use", emoji: "♻️", description: "No single-use plastics for 21 days.", checkIns: [], joined: false },
];

export function FootprintProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<FootprintInputs>(defaults);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);

  const footprint = useMemo(() => calcFootprint(inputs), [inputs]);

  const value: Store = {
    inputs,
    setInput: (k, v) => setInputs((p) => ({ ...p, [k]: v })),
    resetInputs: () => setInputs(defaults),
    footprint,
    trees,
    plantTrees: (n, type = "oak") =>
      setTrees((p) => [
        ...p,
        ...Array.from({ length: n }, (_, i) => ({
          id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          type,
          plantedAt: Date.now(),
        })),
      ]),
    challenges,
    toggleJoin: (id) =>
      setChallenges((p) => p.map((c) => (c.id === id ? { ...c, joined: !c.joined } : c))),
    checkIn: (id) =>
      setChallenges((p) =>
        p.map((c) =>
          c.id === id && !c.checkIns.some((t) => Date.now() - t < 1000 * 60 * 60 * 12)
            ? { ...c, checkIns: [...c.checkIns, Date.now()] }
            : c,
        ),
      ),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFootprint() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFootprint must be used within FootprintProvider");
  return ctx;
}
