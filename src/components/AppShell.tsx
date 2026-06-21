import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Calculator,
  TrendingUp,
  ShoppingBag,
  Zap,
  TreePine,
  Target,
  Map,
  Award,
  Leaf,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/calculator", label: "Calculator", icon: Calculator },
  { to: "/roi", label: "Eco-Financial ROI", icon: TrendingUp },
  { to: "/reverse-cart", label: "Reverse Cart", icon: ShoppingBag },
  { to: "/vampire", label: "Vampire Power", icon: Zap },
  { to: "/offset", label: "Plant Trees", icon: TreePine },
  { to: "/challenges", label: "Challenges", icon: Target },
  { to: "/map", label: "Green Map", icon: Map },
  { to: "/badges", label: "Eco Badges", icon: Award },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen eco-grid-bg">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/50 bg-background/70 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Brand />
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-foreground hover:bg-secondary"
          aria-label="Toggle navigation"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-72 shrink-0 border-r border-border/50 bg-background/60 px-5 py-6 backdrop-blur-xl transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="hidden lg:block">
            <Brand />
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {nav.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "text-foreground/75 hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon className={cn("size-4 shrink-0", active ? "" : "text-primary")} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl p-4 glass">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Pro tip
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              Small, consistent actions reduce more carbon than a single big change.
            </p>
          </div>
        </aside>

        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-20 bg-foreground/30 backdrop-blur-sm lg:hidden"
          />
        )}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-10">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className="grid size-10 place-items-center rounded-2xl gradient-hero shadow-[var(--shadow-soft)]">
        <Leaf className="size-5 text-primary-foreground" />
      </div>
      <div className="leading-tight">
        <p className="font-display text-lg font-bold text-foreground">SustainIQ</p>
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Climate Co-Pilot
        </p>
      </div>
    </Link>
  );
}
