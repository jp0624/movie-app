// src/contexts/SettingsContext.tsx
import {
	createContext,
	useContext,
	useState,
	type ReactNode,
	useMemo,
} from "react";

type CardDensity = "comfortable" | "cozy" | "compact";

interface SettingsContextValue {
	animationsEnabled: boolean;
	cardDensity: CardDensity;
	setAnimationsEnabled: (value: boolean) => void;
	setCardDensity: (value: CardDensity) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
	undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
	const [animationsEnabled, setAnimationsEnabled] = useState(true);
	const [cardDensity, setCardDensity] = useState<CardDensity>("cozy");

	const value = useMemo(
		() => ({
			animationsEnabled,
			cardDensity,
			setAnimationsEnabled,
			setCardDensity,
		}),
		[animationsEnabled, cardDensity]
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
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return ctx;
}
