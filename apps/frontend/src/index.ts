import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve static assets from public/ before the SPA catch-all
    "/assets/*": async req => {
      const url = new URL(req.url);
      const file = Bun.file(`public${url.pathname}`);
      if (await file.exists()) return new Response(file);
      return new Response("Not Found", { status: 404 });
    },

    // API routes
    "/api/hello": {
      async GET(req) {
        return Response.json({ message: "Hello, world!", method: "GET" });
      },
      async PUT(req) {
        return Response.json({ message: "Hello, world!", method: "PUT" });
      },
    },

    "/api/hello/:name": async req => {
      return Response.json({ message: `Hello, ${req.params.name}!` });
    },

    // SPA fallback — handles HTML imports with automatic TSX compilation
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
