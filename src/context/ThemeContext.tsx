import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "auto";

interface ThemeContextValue {
	theme: ThemeMode;
	setTheme: (theme: ThemeMode) => void;
	resolvedTheme: "light" | "dark";
}

const STORAGE_KEY = "pollyglot-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getStoredTheme(): ThemeMode {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "light" || stored === "dark" || stored === "auto") {
			return stored;
		}
	} catch {
		// localStorage unavailable (private browsing, etc.)
	}
	return "auto";
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
	if (mode === "auto") {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}
	return mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<ThemeMode>(getStoredTheme);
	const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => resolveTheme(getStoredTheme()));

	// Apply data-theme attribute to <html>
	const applyTheme = useCallback((mode: ThemeMode) => {
		document.documentElement.setAttribute("data-theme", mode);
		setResolvedTheme(resolveTheme(mode));
	}, []);

	// Set theme with persistence
	const setTheme = useCallback(
		(mode: ThemeMode) => {
			setThemeState(mode);
			try {
				localStorage.setItem(STORAGE_KEY, mode);
			} catch {
				// silently fail
			}
			applyTheme(mode);
		},
		[applyTheme],
	);

	// On mount: apply the stored theme
	useEffect(() => {
		applyTheme(theme);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Listen for OS color-scheme changes when in "auto" mode
	useEffect(() => {
		const mql = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = () => {
			if (theme === "auto") {
				setResolvedTheme(mql.matches ? "dark" : "light");
			}
		};

		mql.addEventListener("change", handleChange);
		return () => mql.removeEventListener("change", handleChange);
	}, [theme]);

	return <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error("useTheme must be used within a <ThemeProvider>");
	}
	return ctx;
}
