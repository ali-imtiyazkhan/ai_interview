import "./index.css";

import { Form } from "./components/Form";
import { Result } from "./components/Result";
import { Interview } from "./components/Interview";
import { Toaster } from "sonner";
import { Navigate, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/result" element={<Result />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="bottom-left" />
    </div>
  );
}
