# AI Mock Interview Platform

An AI-powered mock interview platform that generates personalized interview questions based on a candidate's real GitHub and LinkedIn profile data.

## How It Works

1. **Candidate submits profiles** — Enters their GitHub and LinkedIn profile URLs
2. **Data ingestion** — The platform fetches:
   - **GitHub**: Repositories, READMEs, languages, topics
   - **LinkedIn**: Profile, work experience, education, skills
3. **Vector embedding** — All fetched data is chunked and embedded into a PostgreSQL vector database (pgvector)
4. **AI question generation** — Google Gemini generates contextual interview questions based on the candidate's actual work. For example:
   - *"In this project you use Socket.IO — why not raw WebSockets?"*
   - *"What are the ICE candidates in WebRTC that you implemented?"*
5. **Interview session** — Questions are presented one by one; answers are recorded (text or audio)
6. **AI evaluation** — Each answer is scored and given detailed feedback by the LLM
7. **Results** — Final scores, strengths, weaknesses, and improvement suggestions

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | [Bun](https://bun.sh) 1.3.14 |
| **Monorepo** | [Turborepo](https://turborepo.dev) 2.x |
| **Backend** | Express 5 (TypeScript) |
| **Frontend** | React 19, React Router 7, Tailwind CSS 4, shadcn/ui |
| **Database** | PostgreSQL + pgvector |
| **ORM** | Prisma 7 |
| **LLM** | Google Gemini — embeddings: `gemini-embedding-001`, LLM: `gemini-2.0-flash` |
| **Validation** | Zod 4 |
| **Styling** | Tailwind CSS 4, OKLCH dark theme, custom animations |

## Architecture

```
interview_promo/
  apps/
    backend/          # Express 5 API server
      src/
        routes/       # API route definitions
        controllers/  # Request handlers
        services/     # GitHub API, LinkedIn scraping, embeddings, LLM
        middleware/    # Zod validation, error handling
        schemas/      # Zod validation schemas
        config/       # DB client, env config
      prisma/         # Schema + migrations
    frontend/         # React SPA
      src/
        components/   # Page components + UI primitives
        styles/       # Tailwind globals + animations
        lib/          # Config, utils
  packages/
    ui/               # Shared UI components (stub)
    eslint-config/    # ESLint presets
    typescript-config/# Shared tsconfigs
```

## Prerequisites

- [Bun](https://bun.sh) >= 1.3.14
- [Google Gemini API key](https://aistudio.google.com/apikey)
- PostgreSQL with pgvector extension

## Getting Started

### 1. Database

Start a local PostgreSQL with pgvector using Docker:

```bash
docker compose up -d
```

Or point `DATABASE_URL` in `.env` to an existing instance.

### 2. Backend

```bash
# Set up environment
cp apps/backend/.env.example apps/backend/.env
# Edit .env with your Gemini API key

# Install dependencies & run migrations
bun install
cd apps/backend && bunx prisma migrate dev
```

### 3. Start both apps

```bash
cd ../..
bun run dev
```

The backend runs on `http://localhost:3001` and the frontend on `http://localhost:3000`.

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/pre-interview` | Submit GitHub + LinkedIn URLs, create interview |
| POST | `/api/v1/pre-interview/embed-github` | Embed GitHub data (repos, READMEs, languages) |
| POST | `/api/v1/pre-interview/embed-linkedin` | Embed LinkedIn data (profile, experience, education) |
| POST | `/api/v1/interview/:id/start` | Generate AI questions and start interview |
| POST | `/api/v1/interview/:id/answer` | Submit answer for evaluation |
| GET | `/api/v1/interview/:id/result` | Get interview results with scores and feedback |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Backend server port |
| `DATABASE_URL` | — | PostgreSQL connection string |
| `GITHUB_TOKEN` | — | GitHub personal access token (optional, raises rate limit) |
| `GEMINI_API_KEY` | — | Google Gemini API key |
| `GEMINI_LLM_MODEL` | `gemini-2.0-flash` | Model for question generation and evaluation |
| `GEMINI_EMBEDDING_MODEL` | `gemini-embedding-001` | Model for embeddings |
