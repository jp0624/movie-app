// src/contexts/SettingsContext.tsx
import { createContext, useContext, useState } from "react";

interface Settings {
	autoplayHero: boolean;
	blurBackgrounds: boolean;
}

const SettingsContext = createContext<any>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState<Settings>({
		autoplayHero: true,
		blurBackgrounds: true,
	});

	function update(partial: Partial<Settings>) {
		setSettings((s) => ({ ...s, ...partial }));
	}

	return (
		<SettingsContext.Provider value={{ settings, update }}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	const ctx = useContext(SettingsContext);
	if (!ctx) throw new Error("useSettings must be inside <SettingsProvider>");
	return ctx;
}
