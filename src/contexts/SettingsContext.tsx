// src/contexts/SettingsContext.tsx
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { useTheme } from "./ThemeContext";

type PreferredMediaMode = "movie" | "tv";

interface SettingsContextValue {
	isOpen: boolean;
	openSettings: () => void;
	closeSettings: () => void;
	preferredMediaMode: PreferredMediaMode;
	setPreferredMediaMode: (mode: PreferredMediaMode) => void;
	reduceMotion: boolean;
	setReduceMotion: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
	undefined
);

const STORAGE_KEY = "cinescope_settings";

interface StoredSettings {
	preferredMediaMode: PreferredMediaMode;
	reduceMotion: boolean;
	theme: "light" | "dark";
}

export function SettingsProvider({ children }: { children: ReactNode }) {
	const { theme, setTheme } = useTheme();
	const [isOpen, setIsOpen] = useState(false);
	const [preferredMediaMode, setPreferredMediaMode] =
		useState<PreferredMediaMode>("movie");
	const [reduceMotion, setReduceMotionState] = useState(false);

	// Load from localStorage
	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw) as StoredSettings;
			if (
				parsed.preferredMediaMode === "movie" ||
				parsed.preferredMediaMode === "tv"
			) {
				setPreferredMediaMode(parsed.preferredMediaMode);
			}
			if (typeof parsed.reduceMotion === "boolean") {
				setReduceMotionState(parsed.reduceMotion);
			}
			if (parsed.theme === "light" || parsed.theme === "dark") {
				setTheme(parsed.theme);
			}
		} catch {
			// ignore
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Persist to localStorage
	useEffect(() => {
		if (typeof window === "undefined") return;
		const payload: StoredSettings = {
			preferredMediaMode,
			reduceMotion,
			theme,
		};
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	}, [preferredMediaMode, reduceMotion, theme]);

	const setReduceMotion = (value: boolean) => {
		setReduceMotionState(value);
	};

	const value = useMemo(
		() => ({
			isOpen,
			openSettings: () => setIsOpen(true),
			closeSettings: () => setIsOpen(false),
			preferredMediaMode,
			setPreferredMediaMode,
			reduceMotion,
			setReduceMotion,
		}),
		[isOpen, preferredMediaMode, reduceMotion]
	);

	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings(): SettingsContextValue {
	const ctx = useContext(SettingsContext);
	if (!ctx) {
		throw new Error("useSettings must be used inside SettingsProvider");
	}
	return ctx;
}
