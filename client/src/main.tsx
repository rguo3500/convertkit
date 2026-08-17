/* Signal Workshop: optional analytics is loaded inside App only after explicit cookie consent. */
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
