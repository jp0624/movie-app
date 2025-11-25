// src/contexts/ThemeContext.tsx
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";

type Theme = "light" | "dark" | "cinematic";

interface ThemeContextValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void; // cycles: light → dark → cinematic → light
	isDarkLike: boolean; // dark or cinematic
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "cinescope-theme";

function getInitialTheme(): Theme {
	if (typeof window === "undefined") return "cinematic";

	// 1) From localStorage
	const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
	if (stored === "light" || stored === "dark" || stored === "cinematic") {
		return stored;
	}

	// 2) From OS preference
	if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
		return "cinematic"; // lean into the cinematic preset
	}

	return "light";
}

function applyThemeToDOM(theme: Theme) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.setAttribute("data-theme", theme);
}

interface Props {
	children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
	const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

	useEffect(() => {
		applyThemeToDOM(theme);
		if (typeof window !== "undefined") {
			window.localStorage.setItem(THEME_STORAGE_KEY, theme);
		}
	}, [theme]);

	const setTheme = useCallback((next: Theme) => {
		setThemeState(next);
	}, []);

	const toggleTheme = useCallback(() => {
		setThemeState((prev) => {
			if (prev === "light") return "dark";
			if (prev === "dark") return "cinematic";
			return "light";
		});
	}, []);

	const value = useMemo<ThemeContextValue>(
		() => ({
			theme,
			setTheme,
			toggleTheme,
			isDarkLike: theme === "dark" || theme === "cinematic",
		}),
		[theme, setTheme, toggleTheme]
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return ctx;
}
