// src/main.tsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Providers from "./contexts/Providers";

import "./styles/main.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");

createRoot(rootEl).render(
	<BrowserRouter>
		<Providers>
			<App />
		</Providers>
	</BrowserRouter>
);
