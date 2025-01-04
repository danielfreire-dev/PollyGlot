import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./css/styles.css";
import App from "./App.tsx";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
