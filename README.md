# Trova la tua pace

App React (Vite) + funzione serverless Vercel per la chat AI.

## Cosa contiene
- `src/` — l'app: Chat ("Parla"), Respirazione guidata, Diario con andamento umore.
- `api/chat.js` — funzione serverless che chiama Claude in modo sicuro (la API key resta sul server, mai nel browser).
- Il diario salva le voci nel `localStorage` del browser di chi usa il sito.

## Come pubblicarlo su trovalatuapace.com (via Vercel)

1. Collega questo repository a un nuovo progetto Vercel.
2. Imposta la variabile d'ambiente `ANTHROPIC_API_KEY` su Vercel (Project Settings → Environment Variables) per Production, Preview e Development.
3. Collega il dominio trovalatuapace.com al progetto (Project Settings → Domains).
4. Ogni push su `main` pubblica automaticamente.
