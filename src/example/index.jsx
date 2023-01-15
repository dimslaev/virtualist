import { createRoot } from "react-dom/client";
import Example from "./Example";

const container = document.getElementById("app");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Example />);
