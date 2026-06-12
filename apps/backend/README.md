# backend

Express 5 API server for the AI Mock Interview Platform.

## Setup

```bash
cp .env.example .env
# Edit .env with your Gemini API key and database URL
bun install
bunx prisma migrate dev
```

## Development

```bash
bun run dev
```

Runs on `http://localhost:3001`.
