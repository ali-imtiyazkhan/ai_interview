import "./index.css";

import { Form } from "./components/Form";
import { useState } from "react";
import { Result } from "./components/Result";
import { Interview } from "./components/Interview";
import { Toaster } from "sonner";
export function App() {

  const [page, setPage] = useState<"from" | "result" | "interview">("from");
  return (
    <div>
      {page === "from" && <Form />}
      {page === "result" && <Result />}
      {page === "interview" && <Interview />}

      <Toaster position="bottom-left" />
    </div>
  );
}
