# CV Adjuster

Upload your CV PDF, render it in a clean Harvard-style React template, paste a job offer, and let AI rewrite your CV to match the offer - truthfully, without inventing experience. Export the result as a proper PDF.

Everything runs **in your browser**. There is no backend. The app talks to [Vercel AI Gateway](https://vercel.com/ai-gateway), which routes to OpenAI / Anthropic / Google / etc. behind a single endpoint and key.

> **Scope: local / single-user only.** This project is intentionally built as a BYO-key, backend-less tool - see the [Security model](#security-model) section before deploying it anywhere public.

## Stack

- Vite + React 18 + TypeScript
- TailwindCSS + shadcn-style UI primitives (Radix under the hood)
- [Vercel AI SDK](https://sdk.vercel.ai) v6 (`ai` + `@ai-sdk/gateway`) with Zod-backed structured output via `generateObject`
- `pdfjs-dist` for PDF text extraction
- `@react-pdf/renderer` for the downloaded PDF
- `zustand` for state (persists CV + job offer to localStorage)

## Setup

```bash
pnpm install
cp .env.example .env.local     # then paste your Gateway key
pnpm dev
```

Create a key (and set a spending limit on it) at [vercel.com/dashboard/ai-gateway/api-keys](https://vercel.com/dashboard/ai-gateway/api-keys).

The app picks up a key from two places, in this order:

1. `VITE_AI_GATEWAY_API_KEY` in `.env.local` - the recommended path for local use. No dialog, key stays out of `localStorage`.
2. A key pasted into the in-app dialog - stored in `localStorage`. Useful if you're running a pre-built version.

## Why Vercel AI Gateway

- **One key, many models.** Swap between `openai/gpt-4o-mini`, `openai/gpt-4o`, `anthropic/claude-sonnet-4`, etc. by changing a single string in [src/lib/storage.ts](src/lib/storage.ts) - no new SDK, no new key.
- **Per-key spend limits.** The Gateway dashboard lets you cap how much any one key can burn. That's your practical mitigation against a leaked key.
- **No token markup.** Tokens cost the same as going direct to the provider.
- **Built-in usage dashboard.** See exactly what every parse / adjust call cost.

Defaults live in [src/lib/storage.ts](src/lib/storage.ts):

- Parse model: `openai/gpt-4o-mini`
- Adjust model: `openai/gpt-4o`

## How it works

```
upload PDF  ->  pdfjs extracts text  ->  gpt-4o-mini parses to typed JSON
                                         (Zod schema in src/lib/schema.ts)
                                             |
                                             v
                                 Harvard-style React preview  <-->  form editor
                                             |
                                             v
          paste job offer  ->  gpt-4o rewrites the CV in the same JSON shape
                                             |
                                             v
                           @react-pdf/renderer downloads polished PDF
```

## Cost expectations

- **Parsing** a CV: one call to `openai/gpt-4o-mini` with ~1-2k tokens. Roughly **$0.0005 per CV**.
- **Adjusting** the CV to an offer: one call to `openai/gpt-4o` with ~2-3k tokens. Roughly **$0.01-0.03 per run**.

Gateway adds no markup. You can downgrade the adjust model to `openai/gpt-4o-mini` (or try a cheaper Gemini model) in [src/lib/storage.ts](src/lib/storage.ts) to cut cost.

## Truthfulness guardrails

The `adjustCv` system prompt ([src/lib/ai.ts](src/lib/ai.ts)) explicitly forbids inventing experience, dates, companies, metrics, schools, or projects. It only rewords existing content, reorders entries by relevance, and tightens the summary. If you spot any hallucinations in practice, tighten the prompt there.

## Scripts

- `pnpm dev` - start the Vite dev server
- `pnpm build` - type-check and produce a production build in `dist/`
- `pnpm preview` - preview the built app

## Project layout

```
src/
  App.tsx                     main layout + routing between upload/edit
  main.tsx
  index.css                   Tailwind + EB Garamond import + print styles
  lib/
    schema.ts                 Zod CV schema (single source of truth)
    pdf-extract.ts            pdfjs-dist text extraction
    ai.ts                     parseCv() + adjustCv() via AI Gateway + generateObject
    storage.ts                Gateway key + model persistence, env-var fallback
    seed.ts                   Tomasz's CV JSON for the "Load demo CV" button
    utils.ts                  cn() helper
  store/
    cvStore.ts                zustand: cv, originalCv, jobOffer, status
  components/
    ApiKeyDialog.tsx          paste Gateway key (or see env-var status)
    UploadStep.tsx            PDF dropzone + demo seed
    CvPreview.tsx             Harvard-style on-screen render
    CvEditor.tsx              form bound to the store
    JobOfferPanel.tsx         textarea + "Adjust" + revert
    PdfDocument.tsx           @react-pdf/renderer <Document> + downloadCvPdf()
    ui/                       Button, Input, Textarea, Dialog, Tabs, Card, Label
```

## Security model

This app is designed for **local, single-user use** - i.e. running on `localhost` (or inside a trusted intranet) as a personal tool. It is **not** intended to be deployed to a public domain as-is.

### Why

The Gateway key is held by the client (either via `VITE_AI_GATEWAY_API_KEY`, which Vite inlines into the browser bundle, or via `localStorage`), and the browser calls `ai-gateway.vercel.sh` directly. That design eliminates the need for a backend and keeps the app one-file-deploy simple, but it relies on the origin being trusted. On a public origin the key is reachable by:

- any XSS vector (a single unescaped render, a vulnerable dependency, etc.);
- a compromised npm dependency shipped in a future build (supply-chain attacks have hit popular packages);
- malicious browser extensions with host permissions for the site;
- anyone who opens devtools and reads the bundle, in the env-var case.

None of those are specific to this app - they're a general property of client-side secret storage. `httpOnly` cookies are not an option here either, because the browser needs the key in JS to make the Gateway request.

Using AI Gateway narrows the blast radius compared to shipping a raw OpenAI key:

- Set a **spending limit** on the key in the Vercel dashboard. If it leaks, loss is capped.
- **Rotate or revoke** the key instantly; issue a new one without touching any provider accounts.
- **See exactly when and how** a leaked key was used in the Gateway usage dashboard.

Treat those as damage control, not security.

### If you want to host this publicly

Swap the two calls in [src/lib/ai.ts](src/lib/ai.ts) for `fetch('/api/parse-cv', ...)` and `fetch('/api/adjust-cv', ...)` against a thin backend (a Vercel/Cloudflare serverless function, a Next.js route handler, or a small Node server) that holds the Gateway key in a server-side env var - or, on Vercel, uses the [OIDC token flow](https://vercel.com/docs/ai-gateway/authentication-and-byok/authentication) so no long-lived key exists at all. Add rate limiting and auth in front of it. Everything else in the app - schema, store, preview, PDF export - stays unchanged because the AI layer is isolated behind those two functions.

Until then, treat this repo as a local utility: run `pnpm dev`, do your CV work, close the tab.
