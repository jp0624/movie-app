// src/contexts/ThemeContext.tsx
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): Theme {
	if (typeof window === "undefined") return "dark";

	const stored = window.localStorage.getItem("theme");
	if (stored === "light" || stored === "dark") return stored;

	const prefersDark = window.matchMedia?.(
		"(prefers-color-scheme: dark)"
	).matches;

	return prefersDark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		const root = document.documentElement;
		root.dataset.theme = theme;
		window.localStorage.setItem("theme", theme);
	}, [theme]);

	const setTheme = (value: Theme) => {
		setThemeState(value);
	};

	const toggleTheme = () => {
		setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
	};

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return ctx;
}
