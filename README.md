# SustainIQ - Your Green Impact Hub 🌍

SustainIQ is an eco-centric web application designed to help individuals track, analyze, and optimize their daily carbon footprint while gamifying sustainable living. Built during a fast-paced hackathon sprint, the app features dynamic metrics tracking, interactive data visualization, and an extensive repository of environmental impact calculators.

---

## 🛠️ Tech Stack & Architecture

SustainIQ is built as a modern, full-stack hybrid web application using cutting-edge framework primitives:

* **Framework Architecture:** [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (Full-Stack React Framework powered by [Vinxi](https://github.com/ntext/vinxi))
* **Routing & State:** TanStack Router with dynamic type-safe routes.
* **Frontend Library:** React 19 (Strict Mode enabled)
* **Styling & UI Components:** Tailwind CSS (v4) with Radix UI primitives for fluid, accessible animations.
* **Data Visualization:** Recharts for real-time sustainability graphs.
* **Build Runtime & Package Manager:** Bun (v1.3.12) & Vite compilation layers.

---

## ✨ Features

* **Carbon Footprint Dashboard:** Interactive graphs tracking monthly energy, water, and waste trends.
* **Eco-Calculators:** Type-safe input validation patterns powered by `Zod` and `React Hook Form` to measure carbon footprints on demand.
* **Gamified Daily Challenges:** Local reactive states ensuring snappy, instant user check-ins.
* **Responsive Desktop & Mobile Interfacing:** Built for absolute usability via mobile responsive grid structures.

---

## 🚀 Local Installation & Review (For Hackathon Judges)

Because full-stack framework routers (`Vinxi` + `TanStack Start`) rely on native node server processes, hosting the hybrid environment on basic static serverless hobby layers can hit pipeline initialization delays. 

To review the complete application implementation, local state hooks, and backend architecture, spin up the server environment locally using these steps:

### 1. Clone the Repository
```bash
git clone [https://github.com/harmannmahna/sustainiq-your-green-impact-hub.git](https://github.com/harmannmahna/sustainiq-your-green-impact-hub.git)
cd sustainiq-your-green-impact-hub
