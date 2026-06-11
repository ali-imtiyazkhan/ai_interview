import "./index.css";

import { Form } from "./components/Form";
import { Result } from "./components/Result";
import { Interview } from "./components/Interview";
import { Layout } from "./components/Layout";
import { Toaster } from "sonner";
import { Navigate, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/interview/:id" element={<Interview />} />
        <Route path="/result" element={<Result />} />
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
