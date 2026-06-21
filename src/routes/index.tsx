import { createFileRoute, Link } from "@tanstack/react-router";
import { useFootprint } from "@/lib/footprint-store";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import {
  PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar,
  LineChart, Line, XAxis, YAxis, Tooltip, Area, AreaChart,
} from "recharts";
import { ArrowRight, TreePine, Sparkles, Flame, Trophy, TrendingDown, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SustainIQ — Your Climate Dashboard" },
      { name: "description", content: "Your live carbon footprint, eco score, virtual forest, and challenges in one place." },
    ],
  }),
  component: Dashboard,
});

const COLORS = ["oklch(0.55 0.16 150)", "oklch(0.72 0.18 90)", "oklch(0.65 0.12 60)", "oklch(0.42 0.11 200)"];

function Dashboard() {
  const { footprint, trees, challenges } = useFootprint();
  const breakdown = [
    { name: "Transport", value: Math.round(footprint.transport) },
    { name: "Home", value: Math.round(footprint.home) },
    { name: "Diet", value: Math.round(footprint.diet) },
    { name: "Shopping", value: Math.round(footprint.shopping) },
  ];
  const avgUS = 16000; // kg/year reference
  const scorePct = Math.max(0, Math.min(100, Math.round((1 - footprint.total / avgUS) * 100)));
  const totalCheckIns = challenges.reduce((a, c) => a + c.checkIns.length, 0);

  const trend = Array.from({ length: 12 }, (_, i) => ({
    month: ["J","F","M","A","M","J","J","A","S","O","N","D"][i],
    you: Math.round(footprint.total / 12 * (1 + Math.sin(i / 2) * 0.08)),
    avg: Math.round(avgUS / 12),
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl gradient-hero p-8 text-primary-foreground shadow-[var(--shadow-glass)] sm:p-12">
        <div className="absolute -right-12 -top-12 size-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 size-72 rounded-full bg-[color:var(--leaf)]/30 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="size-3.5" /> Live carbon estimate
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              Your footprint this year
            </h1>
            <p className="mt-2 max-w-md text-white/80">
              Tune your lifestyle below — your climate dashboard updates in real time.
            </p>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-6xl font-extrabold tabular-nums sm:text-7xl">
                <AnimatedCounter value={footprint.tons} decimals={2} />
              </span>
              <span className="mb-2 text-lg font-semibold text-white/80">tCO₂e / yr</span>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-white/85">
              <TrendingDown className="size-4" />
              {scorePct > 0
                ? `${scorePct}% below the average household`
                : `${Math.abs(scorePct)}% above the average — room to reduce!`}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/calculator">Refine my profile <ArrowRight className="ml-1 size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                <Link to="/offset">Plant trees <TreePine className="ml-1 size-4" /></Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Trees planted" value={trees.length} icon={<TreePine className="size-5" />} />
            <StatTile label="Check-ins" value={totalCheckIns} icon={<Flame className="size-5" />} />
            <StatTile label="Eco Score" value={scorePct} suffix="/100" icon={<Trophy className="size-5" />} />
            <StatTile label="Avg saved" value={Math.max(0, Math.round((avgUS - footprint.total) / 10) / 100)} suffix=" t" icon={<Globe2 className="size-5" />} />
          </div>
        </div>
      </section>

      {/* Breakdown + Trend */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl glass p-6 lg:col-span-2">
          <Header title="Yearly footprint vs. average" sub="Lower is greener" />
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.16 150)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.55 0.16 150)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="oklch(0.48 0.03 150)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.48 0.03 150)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "white", border: "1px solid oklch(0.90 0.02 145)",
                    borderRadius: 12, boxShadow: "var(--shadow-soft)",
                  }}
                />
                <Area type="monotone" dataKey="avg" stroke="oklch(0.65 0.12 60)" strokeDasharray="4 4" fill="transparent" />
                <Area type="monotone" dataKey="you" stroke="oklch(0.42 0.11 155)" fill="url(#g1)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl glass p-6">
          <Header title="What drives your footprint" sub="kg CO₂e / year" />
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {breakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "white", border: "1px solid oklch(0.90 0.02 145)",
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5 text-sm">
            {breakdown.map((b, i) => (
              <li key={b.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  {b.name}
                </span>
                <span className="font-semibold tabular-nums">{b.value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Virtual forest preview + actions */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl glass p-6">
          <Header title="Your virtual forest" sub={`${trees.length} trees thriving`} />
          <div className="mt-4 grid h-48 grid-cols-12 items-end gap-1 rounded-2xl bg-gradient-to-b from-[color:var(--mint)] to-white p-3">
            {Array.from({ length: 60 }).map((_, i) => {
              const planted = i < trees.length;
              return (
                <div key={i} className="flex items-end justify-center">
                  <span
                    className={`text-2xl transition-all ${planted ? "opacity-100 animate-grow" : "opacity-15 grayscale"}`}
                    style={{ transform: planted ? `scale(${0.7 + (i % 3) * 0.15})` : "scale(0.7)" }}
                  >
                    🌳
                  </span>
                </div>
              );
            })}
          </div>
          <Button asChild className="mt-4 w-full" variant="secondary">
            <Link to="/offset">Plant more trees <ArrowRight className="ml-1 size-4" /></Link>
          </Button>
        </div>

        <div className="rounded-3xl glass p-6">
          <Header title="Eco-Score" sub="Compared to average household" />
          <div className="mt-2 h-56">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "score", value: scorePct, fill: "oklch(0.55 0.16 150)" }]} startAngle={210} endAngle={-30}>
                <RadialBar background={{ fill: "oklch(0.93 0.05 155)" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="-mt-32 text-center pointer-events-none">
            <div className="text-5xl font-extrabold text-primary tabular-nums">{scorePct}</div>
            <div className="text-sm font-medium text-muted-foreground">/ 100</div>
          </div>
          <Button asChild className="mt-12 w-full">
            <Link to="/badges">View my badges <Trophy className="ml-1 size-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function Header({ title, sub }: { title: string; sub?: string }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

function StatTile({ label, value, suffix, icon }: { label: string; value: number; suffix?: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md border border-white/20">
      <div className="flex items-center gap-2 text-white/80">{icon}<span className="text-xs font-semibold uppercase tracking-wider">{label}</span></div>
      <div className="mt-2 text-2xl font-extrabold tabular-nums">
        {value}
        {suffix && <span className="text-sm font-medium text-white/70">{suffix}</span>}
      </div>
    </div>
  );
}
