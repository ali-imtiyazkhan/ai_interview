import { serve } from "bun";

const PORT = parseInt(process.env["PORT"] || "3000");

const server = serve({
  port: PORT,
  routes: {
    "/assets/*": async req => {
      const url = new URL(req.url);
      const distFile = Bun.file(`dist${url.pathname}`);
      if (await distFile.exists()) return new Response(distFile);
      const publicFile = Bun.file(`public${url.pathname}`);
      if (await publicFile.exists()) return new Response(publicFile);
      return new Response("Not Found", { status: 404 });
    },

    "/*": new Response(Bun.file("dist/index.html")),
  },
});

console.log(`🚀 Production server running at ${server.url}`);
