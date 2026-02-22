# Kaiseki OS (MVP)

A lightweight "Measurement OS" designed for high-speed tracking and simple decision-making, built with Next.js App Router, Tailwind CSS, and Prisma.

## 🌟 Key Features

1. **🔥 Easy Mode (やさしいモード)**
   - A globally toggleable UI mode that instantly translates complex marketing terminology (e.g., CVR, Bounce Rate, Sessions) into plain, easy-to-understand language.
   - Built with a React Context provider for zero-reload switching.

2. **Simple Ingestion (1-Snippet SDK)**
   - Drop the `<script src="/sdk.js" data-project="...">` into your site and automatically track session metrics, scroll depths, and `data-track` clicks.
   - SPA History hook tracking out of the box.

3. **No-code Conversions**
   - Track URL or Click based conversions directly from the server engine avoiding messy frontend code.
   - Managed easily via the Admin UI.

4. **Live Events Dashboard**
   - Server-Sent Events (SSE) broadcast directly to your dashboard in real-time as users browse your site.

## 🚀 Getting Started

Read the documentation to get set up:

- 🛠️ [Local Setup](docs/setup.md)
- ☁️ [Deploy to Vercel](docs/deploy-vercel.md)
- 📦 [SDK Installation](docs/install-sdk.md)
- 🎯 [No-code Conversions](docs/conversions.md)
- 📊 [Metrics & Calculations](docs/metrics.md)

## 📁 Repository Structure

- `public/sdk.js` - The browser tracking snippet
- `src/app/api/track` - The ingestion endpoint
- `src/app/api/live` - SSE broadcasting endpoint
- `src/app/(dashboard)` - The admin interface
- `src/lib/terminology.tsx` - The Easy Mode dictionary engine
- `prisma/` - Database schema

---

*Kaiseki OS translates "Data" into "Decisions".*
