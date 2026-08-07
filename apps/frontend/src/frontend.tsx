/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/design/theme";
import { App } from "./App";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: {
              background: "oklch(0.13 0 0)",
              border: "1px solid oklch(0.25 0 0 / 0.5)",
              color: "oklch(0.95 0 0)",
            },
            classNames: {
              toast: "rounded-xl border border-white/10 bg-background/60 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.35)]",
              description: "text-sm text-foreground/80",
            },
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
(import.meta.hot.data.root ??= createRoot(elem)).render(app);