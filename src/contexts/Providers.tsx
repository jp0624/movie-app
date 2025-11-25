// src/contexts/Providers.tsx
import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";
import { SettingsProvider } from "./SettingsContext";
import { MovieProvider } from "./MovieContext";
import ErrorBoundary from "../components/system/ErrorBoundary";
import SuspenseBoundary from "../components/system/SuspenseBoundary";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<SettingsProvider>
				<MovieProvider>
					<ErrorBoundary>
						<SuspenseBoundary>{children}</SuspenseBoundary>
					</ErrorBoundary>
				</MovieProvider>
			</SettingsProvider>
		</ThemeProvider>
	);
}
