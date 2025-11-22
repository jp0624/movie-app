// src/components/layout/SettingsPanel.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useSettings } from "../../contexts/SettingsContext";
import Surface from "../ui/Surface";
import Button from "../ui/Button";

export default function SettingsPanel() {
	const [open, setOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const {
		animationsEnabled,
		cardDensity,
		setAnimationsEnabled,
		setCardDensity,
	} = useSettings();

	return (
		<div className="fixed bottom-4 right-4 z-40">
			{/* Toggle FAB */}
			<motion.button
				type="button"
				onClick={() => setOpen((o) => !o)}
				whileTap={{ scale: 0.95 }}
				className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-background shadow-lg shadow-black/40"
				aria-label="Open settings"
			>
				{/* simple gear icon */}
				<span className="text-xl">⚙️</span>
			</motion.button>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 12 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="mt-3 w-72 max-w-[90vw]"
					>
						<Surface className="border-token bg-surface-alt p-4">
							<div className="mb-3 flex items-center justify-between">
								<h2 className="text-sm font-semibold text-foreground">
									Experience settings
								</h2>
								<button
									type="button"
									onClick={() => setOpen(false)}
									className="text-xs text-muted hover:text-foreground"
								>
									Close
								</button>
							</div>

							<div className="space-y-4 text-sm text-muted">
								{/* Theme */}
								<div>
									<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
										Theme
									</p>
									<div className="inline-flex rounded-full bg-surface border border-token p-1">
										<button
											type="button"
											onClick={() => setTheme("dark")}
											className={`px-3 py-1 text-xs rounded-full transition-colors ${
												theme === "dark"
													? "bg-accent text-background"
													: "text-muted hover:text-foreground"
											}`}
										>
											Dark
										</button>
										<button
											type="button"
											onClick={() => setTheme("light")}
											className={`px-3 py-1 text-xs rounded-full transition-colors ${
												theme === "light"
													? "bg-accent text-background"
													: "text-muted hover:text-foreground"
											}`}
										>
											Light
										</button>
									</div>
								</div>

								{/* Animations */}
								<div>
									<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
										Animations
									</p>
									<div className="flex items-center justify-between">
										<span>
											<span className="font-medium text-foreground">
												Marvel mode
											</span>
											<span className="ml-1 text-xs text-muted">
												(subtle motion on cards)
											</span>
										</span>
										<Button
											size="xs"
											variant={animationsEnabled ? "primary" : "outline"}
											onClick={() => setAnimationsEnabled(!animationsEnabled)}
										>
											{animationsEnabled ? "On" : "Off"}
										</Button>
									</div>
								</div>

								{/* Card density */}
								<div>
									<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
										Card density
									</p>
									<div className="flex gap-2">
										{(["comfortable", "cozy", "compact"] as const).map((d) => (
											<Button
												key={d}
												size="xs"
												variant={cardDensity === d ? "primary" : "outline"}
												onClick={() => setCardDensity(d)}
											>
												{d}
											</Button>
										))}
									</div>
								</div>
							</div>
						</Surface>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
