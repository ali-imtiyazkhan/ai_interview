import "./index.css";

import { useLocation } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { SetupPage } from "./pages/SetupPage";
import { InterviewPage } from "./pages/InterviewPage";
import { ResultPage } from "./pages/ResultPage";
import { Layout } from "./components/Layout";
import { Toaster } from "sonner";
import { Navigate, Route, Routes } from "react-router-dom";

export function App() {
  const location = useLocation();
  const isLanding = location.pathname === "/" || location.pathname === "/setup";

  if (isLanding) {
    return location.pathname === "/" ? <LandingPage /> : <SetupPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/interview/:id" element={<InterviewPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: "oklch(0.13 0 0)",
            border: "1px solid oklch(0.25 0 0 / 0.5)",
            color: "oklch(0.95 0 0)",
          },
        }}
      />
    </Layout>
  );
}
