// src/components/layout/SettingsPanel.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../../contexts/SettingsContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function SettingsPanel() {
	const {
		isOpen,
		closeSettings,
		preferredMediaMode,
		setPreferredMediaMode,
		reduceMotion,
		setReduceMotion,
	} = useSettings();

	const { theme, setTheme } = useTheme();

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 12, scale: 0.96 }}
						transition={{ duration: 0.25, ease: "easeOut" }}
						className="w-full max-w-md rounded-2xl border border-token bg-surface p-5 shadow-card"
					>
						<div className="mb-4 flex items-center justify-between">
							<div>
								<h2 className="text-base font-semibold text-foreground">
									Settings
								</h2>
								<p className="text-xs text-muted">
									Personalize your CineScope experience.
								</p>
							</div>
							<button
								type="button"
								onClick={closeSettings}
								className="rounded-full px-2 py-1 text-sm text-muted hover:bg-surface-alt"
							>
								✕
							</button>
						</div>

						<div className="space-y-5 text-sm text-muted">
							{/* Theme */}
							<div>
								<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-soft">
									Theme
								</p>
								<div className="inline-flex rounded-full border border-token bg-surface-alt p-1 text-xs">
									<button
										type="button"
										onClick={() => setTheme("light")}
										className={`rounded-full px-3 py-1 ${
											theme === "light"
												? "bg-accent text-white"
												: "text-muted hover:text-foreground"
										}`}
									>
										Light
									</button>
									<button
										type="button"
										onClick={() => setTheme("dark")}
										className={`rounded-full px-3 py-1 ${
											theme === "dark"
												? "bg-accent text-white"
												: "text-muted hover:text-foreground"
										}`}
									>
										Dark
									</button>
								</div>
							</div>

							{/* Default media mode */}
							<div>
								<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-soft">
									Default Discover Mode
								</p>
								<div className="inline-flex rounded-full border border-token bg-surface-alt p-1 text-xs">
									<button
										type="button"
										onClick={() => setPreferredMediaMode("movie")}
										className={`rounded-full px-3 py-1 ${
											preferredMediaMode === "movie"
												? "bg-accent text-white"
												: "text-muted hover:text-foreground"
										}`}
									>
										Movies
									</button>
									<button
										type="button"
										onClick={() => setPreferredMediaMode("tv")}
										className={`rounded-full px-3 py-1 ${
											preferredMediaMode === "tv"
												? "bg-accent text-white"
												: "text-muted hover:text-foreground"
										}`}
									>
										TV Shows
									</button>
								</div>
							</div>

							{/* Motion */}
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs font-semibold uppercase tracking-wide text-soft">
										Reduce Motion
									</p>
									<p className="text-xs text-muted">
										Simplify animations for smoother performance.
									</p>
								</div>
								<button
									type="button"
									onClick={() => setReduceMotion(!reduceMotion)}
									className={`relative h-6 w-11 rounded-full border border-token transition-colors ${
										reduceMotion ? "bg-accent" : "bg-surface-alt"
									}`}
								>
									<span
										className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow-card transition-transform ${
											reduceMotion ? "translate-x-[18px]" : "translate-x-[2px]"
										}`}
									/>
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
